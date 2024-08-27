"use client";

import { trpc } from "@/server/client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from "@/components/ui/Navbar";
import ThreeDModelViewer from "@/components/ThreeDModelViewer";
import Link from 'next/link';
import { Slider, TextField } from '@mui/material'; // Import MUI Slider and TextField
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

// Define the type for a model
type Model = {
  id: number;
  name: string;
  path: string;
  thumbnail: string;
  price: number;
  author: string;
  category: {
    name: string;
  };
  description: string | null;
};

function Filters({ sortImp, priceFilter }: { sortImp: (value: string) => void, priceFilter: (range: number[]) => void }) {
  const [priceRange, setPriceRange] = useState([0, 50]); // Set initial state between 0 and 50
  const [selectedSort, setSelectedSort] = useState(''); // Track selected sort option

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value, 10);
    if (!isNaN(newMin)) {
      setPriceRange([newMin, priceRange[1]]);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value, 10);
    if (!isNaN(newMax)) {
      setPriceRange([priceRange[0], newMax]);
    }
  };

  const applyPriceFilter = () => {
    priceFilter(priceRange); // Apply the selected price range
  };

  const handleSortImp = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setSelectedSort(value); // Update selected sort option
    sortImp(value);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 w-52 fixed" style={{ top: '9rem' }}>
<h2 className="text-center font-semibold text-lg mb-1">FILTERS</h2>

      {/* Sorting Option */}
      <div className="mb-4">
        <FormControl component="fieldset">
          <h3 className="text-md font-semibold mb-1">Price Range</h3> {/* Added margin-bottom for spacing */}
          <RadioGroup
  aria-label="sort"
  name="sort"
  value={selectedSort}
  onChange={handleSortImp}
  className="space-y-0" // Ensure no extra space between items
>
  <FormControlLabel 
    value="" 
    control={<Radio />} 
    label={<span className="text-sm">Default</span>} 
    className="mb-0 p-0" // Remove bottom margin and padding
  />
  <FormControlLabel 
    value="price-asc" 
    control={<Radio />} 
    label={<span className="text-sm">Price: Low to High</span>} 
    className="mb-0 p-0" // Remove bottom margin and padding
  />
  <FormControlLabel 
    value="price-desc" 
    control={<Radio />} 
    label={<span className="text-sm">Price: High to Low</span>} 
    className="mb-0 p-0" // Remove bottom margin and padding
  />
  <FormControlLabel 
    value="name-asc" 
    control={<Radio />} 
    label={<span className="text-sm">Name: A to Z</span>} 
    className="mb-0 p-0" // Remove bottom margin and padding
  />
  <FormControlLabel 
    value="name-desc" 
    control={<Radio />} 
    label={<span className="text-sm">Name: Z to A</span>} 
    className="mb-0 p-0" // Remove bottom margin and padding
  />
</RadioGroup>


        </FormControl>
      </div>

      {/* Price Range Filter */}
      <div className="mb-2">
        <h3 className="text-md font-semibold mb-2">Price Range</h3> {/* Added margin-bottom for spacing */}
        <div className="flex flex-col items-center">
          <div className="flex gap-4 mb-2">
            <TextField
              label="Min"
              type="number"
              value={priceRange[0]}
              onChange={handleMinPriceChange}
              InputProps={{
                inputProps: { min: 0, max: priceRange[1] },
                sx: { height: 25 }, // Adjusted height for the text fields
              }}
            />
            <TextField
              label="Max"
              type="number"
              value={priceRange[1]}
              onChange={handleMaxPriceChange}
              InputProps={{
                inputProps: { min: priceRange[0], max: 50 },
                sx: { height: 25 }, // Adjusted height for the text fields
              }}
            />
          </div>
          <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={50} // Limit the maximum price to 50
            step={1}
          />
          <button onClick={applyPriceFilter} className="bg-blue-500 text-white py-2 px-3 rounded mt-2">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function HoverableModelCard({ model }: { model: Model }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsModelLoaded(false);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="relative"
      style={{ height: "250px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered && (
        <div className="absolute inset-0 w-full h-full">
          <ThreeDModelViewer
            modelPath={model.path}
            isHovered={isHovered}
            onModelLoad={() => setIsModelLoaded(true)}
          />
        </div>
      )}
      <img
        src={model.thumbnail}
        alt={model.name + " thumbnail"}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          zIndex: 1,
          pointerEvents: isModelLoaded ? 'none' : 'auto',
          opacity: !isModelLoaded || !isHovered ? 1 : 0,
          filter: isHovered && !isModelLoaded ? "brightness(70%)" : "brightness(100%)",
          transition: "opacity 0.5s ease, filter 0.3s ease",
        }}
      />
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const query = searchParams.get('query');

  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>('');
  const [priceFiltrate, setPriceFiltrate] = useState<number[]>([0, 200]);
  const router = useRouter();

  const addItemMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      console.log("Item added successfully");
    },
    onError: (error) => {
      console.error("Failed to add item", error);
    }
  });

  const addItem = async (productId: number) => {
    console.log(`Adding item with ID: ${productId}`);
    await addItemMutation.mutateAsync({ productId });
  };

  const handleAddToCart = async (model: Model) => {
    try {
      await addItem(model.id);
      alert(`${model.name} has been added to your cart!`);
    } catch (error) {
      console.error("Failed to add item to cart", error);
    }
  };

  const { data: models, refetch, isError, isFetched } = trpc.models.getAllModels.useQuery();

  if (isError || !models) {
    return (
      <main className="flex min-h-screen flex-col w-full items-center">
        <Navbar />
        <h1 className="text-4xl">An error occurred while fetching your orders</h1>
      </main>
    );
  }

  const filteredModels = models?.filter((model) => {
    const matchesCategory = category ? model.category.name.toLowerCase() === category.toLowerCase() : true;
    const matchesQuery = query ? model.name.toLowerCase().includes(query.toLowerCase()) : true;
    const matchesPrice = model.price >= priceFiltrate[0] && model.price <= priceFiltrate[1];
    return matchesCategory && matchesQuery && matchesPrice;
  });

  const sortModels = (modelsToSort: Model[]) => {
    return modelsToSort.sort((a, b) => {
      if (sortOption === 'price-asc') {
        return a.price - b.price;
      } else if (sortOption === 'price-desc') {
        return b.price - a.price;
      } else if (sortOption === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  };

  const sortedAndFilteredModels = sortModels(filteredModels);

  return (
    <main className="flex min-h-screen pt-32">
      <Navbar />
      <aside className="p-4" style={{ paddingTop: "0" }}>
        <Filters
          sortImp={(value) => setSortOption(value)}
          priceFilter={(range) => setPriceFiltrate(range)}
        />
      </aside>
      <div className="grid grid-cols-3 gap-6 p-4 flex-grow" style={{ marginLeft: "14rem" }}>
        {sortedAndFilteredModels.map((model, index) => (
          <div key={index} className="bg-white shadow rounded-lg flex flex-col justify-between h-full overflow-hidden">
            <HoverableModelCard model={model} />
            <div className="p-2 flex-grow">
              <h3 className="text-lg font-semibold">
                <Link href={`/productViewer/${model.id}`}>
                  {model.name}
                </Link>
              </h3>
              <p className="text-gray-500">By {model.author}</p>
              <p className="text-lg font-bold mb-1">${model.price.toFixed(2)}</p>
            </div>
            <div className="p-2">
              <button className="bg-blue-500 text-white py-2 px-3 rounded w-full" onClick={() => handleAddToCart(model)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}