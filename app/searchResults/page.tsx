"use client";

import { trpc } from "@/server/client";
import { useState, useEffect } from "react";
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
  description: string;
};

function Filters({sortImp, priceFilter} : { sortImp: (value: string) => void, priceFilter: (range: number[]) => void}) {
  const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black"];

  const handleColorClick = (selectedColor: string) => {
    console.log("Selected color:", selectedColor);
  };

  const handlepriceFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    priceFilter([0, value]);
  };

  const handleSortImp = (event: React.ChangeEvent<HTMLSelectElement>) => {
    sortImp(event.target.value);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 w-48 fixed" style={{ top: '9rem' }}>
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/*Sorting Option*/}
      <div className="mb-4">
        <h3 className="text-md font-semibold">Sort By</h3>
        <select className="w-full" onChange={handleSortImp}>
          <option value="">None</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z </option>
          <option value="name-desc">Name: Z to A </option>
        </select>
      </div>
      {/* Price Range */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">Price Range</h3>
        <input type="range" min="0" max="1000" className="w-full" onChange={handlepriceFilter} />
      </div>

      {/* File Size */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">File Size (MB)</h3>
        <input type="range" min="0" max="500" className="w-full" />
      </div>

      {/* Polygon Count */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">Polygon Count</h3>
        <input type="range" min="0" max="50000" className="w-full" />
      </div>

      {/* Color */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">Color</h3>
        <div className="grid grid-cols-3 gap-2">
          {colors.map((color) => (
            <div
              key={color}
              className="w-8 h-8 cursor-pointer"
              style={{
                backgroundColor: color,
                border: "2px solid #e2e8f0", // light gray border
                transition: "border-color 0.3s ease",
              }}
              onClick={() => handleColorClick(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


export default function Home() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const query = searchParams.get('query'); // Get the search query from the URL

  const [models, setModels] = useState<Model[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>(''); // Define state for sort option
  const [priceFiltrate, setPriceFiltrate] = useState<number[]>([0, 1000]); // Define state for price filter
  const router = useRouter();

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('/api/models');
        const data = await res.json();
        setModels(data); // Set the data to the models state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching models:', error);
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

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

  // Filter models based on category and search query
  const filteredModels = models.filter((model) => {
    const matchesCategory = category ? model.category.name.toLowerCase() === category.toLowerCase() : true;
    const matchesQuery = query ? model.name.toLowerCase().includes(query.toLowerCase()) : true;
    return matchesCategory && matchesQuery;
  });

  // Sort filtered models before rendering
  const sortedAndFilteredModels = sortModels(filteredModels);

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
    console.log(`Adding model with ID: ${model.id.toString()}`);
    await addItem(model.id);
    alert(`${model.name} has been added to your cart!`);
  };

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
                <Link href={`/productViewer/${encodeURIComponent(model.name.toLowerCase().replace(/\s/g, '%20').replace(/-/g, '_'))}`}>
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
