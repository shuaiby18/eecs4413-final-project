"use client";

import { trpc } from "@/server/client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from "@/components/ui/Navbar";
import ThreeDModelViewer from "@/components/ThreeDModelViewer";
import Link from 'next/link';

// Define the type for a model
type Model = {
  id: number;
  name: string;
  path: string;
  thumbnail: string;
  price: number;
  author: string; // Updated to match string type
  category: {
    name: string;
  };
  description: string | null;
};

function Filters({ sortImp, priceFilter }: { sortImp: (value: string) => void, priceFilter: (range: number[]) => void }) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);

  const handlePriceRangeChange = () => {
    priceFilter([minPrice, maxPrice]);
  };

  const handleSortImp = (value: string) => {
    sortImp(value);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 w-48 fixed" style={{ top: '9rem' }}>
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Sorting Option */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">Sort By</h3>
        {/* Sorting Links */}
      {/* Hyperlinks for sorting */}
      <div className="flex flex-wrap gap-2">
        <a href="#" className="text-blue-500 hover:underline" onClick={() => handleSortImp('')}>
          Default
        </a>
        <a href="#" className="text-blue-500 hover:underline" onClick={() => handleSortImp('price-asc')}>
          Price: Low to High
        </a>
        <a href="#" className="text-blue-500 hover:underline" onClick={() => handleSortImp('price-desc')}>
          Price: High to Low
        </a>
        <a href="#" className="text-blue-500 hover:underline" onClick={() => handleSortImp('name-asc')}>
          Name: A to Z
        </a>
        <a href="#" className="text-blue-500 hover:underline" onClick={() => handleSortImp('name-desc')}>
          Name: Z to A
        </a>
      </div>
            </div>
      {/* Price Range Filter */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">Price Range</h3>
        <div className="flex flex-col">
          <label htmlFor="min-price">Min Price: ${minPrice}</label>
          <input
            type="range"
            id="min-price"
            min="0"
            max="500"
            value={minPrice}
            onChange={(e) => setMinPrice(parseInt(e.target.value, 10))}
          />
          <label htmlFor="max-price">Max Price: ${maxPrice}</label>
          <input
            type="range"
            id="max-price"
            min="0"
            max="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
          />
          <button onClick={handlePriceRangeChange} className="bg-blue-500 text-white py-2 px-3 rounded mt-2">
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
    setIsModelLoaded(false); // Reset model load state on hover
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
      {/* Render 3D Model when hovered */}
      {isHovered && (
        <div className="absolute inset-0 w-full h-full">
          <ThreeDModelViewer
            modelPath={model.path}
            isHovered={isHovered}
            onModelLoad={() => setIsModelLoaded(true)} // Set model as loaded
          />
        </div>
      )}

      {/* Always render the thumbnail */}
      <img
        src={model.thumbnail}
        alt={model.name + " thumbnail"}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          zIndex: 1,
          pointerEvents: isModelLoaded ? 'none' : 'auto', // Disable pointer events when the model is loaded to allow interaction
          opacity: !isModelLoaded || !isHovered ? 1 : 0, // Hide thumbnail when model is loaded and hovered
          filter: isHovered && !isModelLoaded ? "brightness(70%)" : "brightness(100%)", // Darken thumbnail on hover until model loads
          transition: "opacity 0.5s ease, filter 0.3s ease", // Smooth fade-out and darkening
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
  const query = searchParams.get('query'); // Get the search query from the URL

  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>(''); // Define state for sort option
  const [priceFiltrate, setPriceFiltrate] = useState<number[]>([0, 200]); // Define state for price filter
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
    console.log(`Attempting to add model with ID: ${model.id.toString()}`);
    try {
      await addItem(model.id);
      console.log("Item successfully added to cart");
      alert(`${model.name} has been added to your cart!`);
    } catch (error) {
      console.error("Failed to add item to cart", error);
    }
  };

  const { data: models, refetch, isError, isFetched } = trpc.models.getAllModels.useQuery()

  if (isError || !models) {
    return (
      <main className="flex min-h-screen flex-col w-full items-center">
        <Navbar />
        <h1 className="text-4xl">An error occurred while fetching your orders</h1>
      </main>
    )
  }

// Filter models based on category, search query, and price range
const filteredModels = models?.filter((model) => {
  const matchesCategory = category ? model.category.name.toLowerCase() === category.toLowerCase() : true;
  const matchesQuery = query ? model.name.toLowerCase().includes(query.toLowerCase()) : true;
  const matchesPrice = model.price >= priceFiltrate[0] && model.price <= priceFiltrate[1];
  return matchesCategory && matchesQuery && matchesPrice;
});

  // Sort function
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
      return 0; // Default: no sorting
    });
  };

  // Sort filtered models before rendering
  const sortedAndFilteredModels = sortModels(filteredModels);

  return (
    <main className="flex min-h-screen pt-32">
      {/* Navigation Bar */}
      <Navbar />

      {/* Left Sidebar for Filters */}
      <aside className="p-4" style={{ paddingTop: "0" }}>
        <Filters
          sortImp={(value) => setSortOption(value)}
          priceFilter={(range) => setPriceFiltrate(range)}
        />
      </aside>

      {/* Products Grid */}
      <div className="grid grid-cols-3 gap-6 p-4 flex-grow" style={{ marginLeft: "14rem" }}>
        {sortedAndFilteredModels.map((model, index) => (
          <div key={index} className="bg-white shadow rounded-lg flex flex-col justify-between h-full overflow-hidden">
            {/* Hoverable Model Card */}
            <HoverableModelCard model={model} />

            {/* Product Information */}
            <div className="p-2 flex-grow">
              {/* Make product name a link */}
              <h3 className="text-lg font-semibold">
                <Link href={`/productViewer/${model.id}`}>
                  {model.name}
                </Link>
              </h3>
              <p className="text-gray-500">By {model.author}</p>
              <p className="text-lg font-bold mb-1">${model.price.toFixed(2)}</p>
            </div>

            {/* Add to Cart Button */}
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