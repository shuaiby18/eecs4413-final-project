"use client";

import { useState, Suspense } from "react"; // Added Suspense to the import
import { useSearchParams } from 'next/navigation';
import Navbar from "@/components/ui/Navbar";
import ThreeDModelViewer from "@/components/ThreeDModelViewer"; // Import your 3D model viewer component
import Link from 'next/link'; // Import Link from Next.js

// Define the type for a model
type Model = {
  name: string;
  path: string;
  thumbnail: string;
  price: string;
  author: {
    displayName: string;
  };
  category: string; // Include category as part of the type
};

function Filters() {
  const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black"];
  
  return (
    <div className="bg-white shadow rounded-lg p-4 w-48 fixed" style={{ top: '9rem' }}>
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Price Range */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">Price Range</h3>
        <input type="range" min="0" max="1000" className="w-full" />
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
              onClick={() => handleColorClick(color)} // Define function to handle color selection
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function handleColorClick(selectedColor) {
  // Add logic to handle color selection here
  console.log("Selected color:", selectedColor);
}



export default function Home() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const query = searchParams.get('query'); // Get the search query from the URL

  const models = [
    { name: "Plane 1", path: "/models/planes/planes-model1.glb", thumbnail: "/models/planes/planes-model1-thumbnail.png", price: 'N/A', author: { displayName: 'author1' }, category: "planes" },
    { name: "Plane 2", path: "/models/planes/planes-model2.glb", thumbnail: "/models/planes/planes-model2-thumbnail.png", price: 'N/A', author: { displayName: 'author2' }, category: "planes" },
    { name: "Plane 3", path: "/models/planes/planes-model3.glb", thumbnail: "/models/planes/planes-model3-thumbnail.png", price: 'N/A', author: { displayName: 'author3' }, category: "planes"  },
    { name: "Plane 4", path: "/models/planes/planes-model4.glb", thumbnail: "/models/planes/planes-model4-thumbnail.png", price: 'N/A', author: { displayName: 'author4' }, category: "planes" },
    { name: "Plane 5", path: "/models/planes/planes-model5.glb", thumbnail: "/models/planes/planes-model5-thumbnail.png", price: 'N/A', author: { displayName: 'author5' }, category: "planes" },
    { name: "Plane 6", path: "/models/planes/planes-model6.glb", thumbnail: "/models/planes/planes-model6-thumbnail.png", price: 'N/A', author: { displayName: 'author6' }, category: "planes" },
    { name: "Plane 7", path: "/models/planes/planes-model7.glb", thumbnail: "/models/planes/planes-model7-thumbnail.png", price: 'N/A', author: { displayName: 'author7' }, category: "planes" },
    { name: "Plane 8", path: "/models/planes/planes-model8.glb", thumbnail: "/models/planes/planes-model8-thumbnail.png", price: 'N/A', author: { displayName: 'author8' }, category: "planes" },
    { name: "Plane 9", path: "/models/planes/planes-model9.glb", thumbnail: "/models/planes/planes-model9-thumbnail.png", price: 'N/A', author: { displayName: 'author8' }, category: "planes" },

    { name: "Environment 1", path: "/models/environments/environment-model1.glb", thumbnail: "/models/environments/environment-model1-thumbnail.png", price: 'N/A', author: { displayName: 'author1' }, category: "environments"},
    { name: "Environment 2", path: "/models/environments/environment-model2.glb", thumbnail: "/models/environments/environment-model2-thumbnail.png", price: 'N/A', author: { displayName: 'author2' }, category: "environments"},
    { name: "Environment 3", path: "/models/environments/environment-model3.glb", thumbnail: "/models/environments/environment-model3-thumbnail.png", price: 'N/A', author: { displayName: 'author3' }, category: "environments"},
    { name: "Environment 4", path: "/models/environments/environment-model4.glb", thumbnail: "/models/environments/environment-model4-thumbnail.png", price: 'N/A', author: { displayName: 'author4' }, category: "environments"},
    { name: "Environment 5", path: "/models/environments/environment-model5.glb", thumbnail: "/models/environments/environment-model5-thumbnail.png", price: 'N/A', author: { displayName: 'author5' }, category: "environments"},
    { name: "Environment 6", path: "/models/environments/environment-model6.glb", thumbnail: "/models/environments/environment-model6-thumbnail.png", price: 'N/A', author: { displayName: 'author6' }, category: "environments"},
    { name: "Environment 7", path: "/models/environments/environment-model7.glb", thumbnail: "/models/environments/environment-model7-thumbnail.png", price: 'N/A', author: { displayName: 'author7' }, category: "environments"},
    { name: "Environment 8", path: "/models/environments/environment-model8.glb", thumbnail: "/models/environments/environment-model8-thumbnail.png", price: 'N/A', author: { displayName: 'author8' }, category: "environments"},
    { name: "Environment 9", path: "/models/environments/environment-model9.glb", thumbnail: "/models/environments/environment-model9-thumbnail.png", price: 'N/A', author: { displayName: 'author9' }, category: "environments"},

    { name: "Car 1", path: "/models/cars/cars-model1.glb", thumbnail: "/models/cars/cars-model1-thumbnail.png", price: 'N/A', author: { displayName: 'author1' }, category: "cars"},
    { name: "Car 2", path: "/models/cars/cars-model2.glb", thumbnail: "/models/cars/cars-model2-thumbnail.png", price: 'N/A', author: { displayName: 'author2' }, category: "cars"},
    { name: "Car 3", path: "/models/cars/cars-model3.glb", thumbnail: "/models/cars/cars-model3-thumbnail.png", price: 'N/A', author: { displayName: 'author3' }, category: "cars" },
    { name: "Car 4", path: "/models/cars/cars-model4.glb", thumbnail: "/models/cars/cars-model4-thumbnail.png", price: 'N/A', author: { displayName: 'author4' }, category: "cars" },
    { name: "Car 5", path: "/models/cars/cars-model5.glb", thumbnail: "/models/cars/cars-model5-thumbnail.png", price: 'N/A', author: { displayName: 'author5' }, category: "cars" },
    { name: "Car 6", path: "/models/cars/cars-model6.glb", thumbnail: "/models/cars/cars-model6-thumbnail.png", price: 'N/A', author: { displayName: 'author6' }, category: "cars" },
    { name: "Car 7", path: "/models/cars/cars-model7.glb", thumbnail: "/models/cars/cars-model7-thumbnail.png", price: 'N/A', author: { displayName: 'author7' }, category: "cars" },
    { name: "Car 8", path: "/models/cars/cars-model8.glb", thumbnail: "/models/cars/cars-model8-thumbnail.png", price: 'N/A', author: { displayName: 'author8' }, category: "cars" },
    { name: "Car 9", path: "/models/cars/cars-model9.glb", thumbnail: "/models/cars/cars-model9-thumbnail.png", price: 'N/A', author: { displayName: 'author9' }, category: "cars" },
    { name: "Car 10", path: "/models/cars/cars-model10.glb", thumbnail: "/models/cars/cars-model10-thumbnail.png", price: 'N/A', author: { displayName: 'author10' }, category: "cars" },

    { name: "Animal 1", path: "/models/animals/animals-model1.glb", thumbnail: "/models/animals/animals-model1-thumbnail.png", price: 'N/A', author: { displayName: 'author1' }, category: "animals"},
    { name: "Animal 2", path: "/models/animals/animals-model2.glb", thumbnail: "/models/animals/animals-model2-thumbnail.png", price: 'N/A', author: { displayName: 'author2' }, category: "animals"},
    { name: "Animal 3", path: "/models/animals/animals-model3.glb", thumbnail: "/models/animals/animals-model3-thumbnail.png", price: 'N/A', author: { displayName: 'author3' }, category: "animals"},
    { name: "Animal 4", path: "/models/animals/animals-model4.glb", thumbnail: "/models/animals/animals-model4-thumbnail.png", price: 'N/A', author: { displayName: 'author4' }, category: "animals"},
    { name: "Animal 5", path: "/models/animals/animals-model5.glb", thumbnail: "/models/animals/animals-model5-thumbnail.png", price: 'N/A', author: { displayName: 'author5' }, category: "animals"},
    { name: "Animal 6", path: "/models/animals/animals-model6.glb", thumbnail: "/models/animals/animals-model6-thumbnail.png", price: 'N/A', author: { displayName: 'author6' }, category: "animals"},
    { name: "Animal 7", path: "/models/animals/animals-model7.glb", thumbnail: "/models/animals/animals-model7-thumbnail.png", price: 'N/A', author: { displayName: 'author7' }, category: "animals"},
    { name: "Animal 8", path: "/models/animals/animals-model8.glb", thumbnail: "/models/animals/animals-model8-thumbnail.png", price: 'N/A', author: { displayName: 'author8' }, category: "animals"},
    { name: "Animal 9", path: "/models/animals/animals-model9.glb", thumbnail: "/models/animals/animals-model9-thumbnail.png", price: 'N/A', author: { displayName: 'author9' }, category: "animals"},

    { name: "Character 1", path: "/models/characters/character-model1.glb", thumbnail: "/models/characters/character-model1-thumbnail.png", price: 'N/A', author: { displayName: 'author1' }, category: "characters"},
    { name: "Character 2", path: "/models/characters/character-model2.glb", thumbnail: "/models/characters/character-model2-thumbnail.png", price: 'N/A', author: { displayName: 'author2' }, category: "characters"},
    { name: "Character 3", path: "/models/characters/character-model3.glb", thumbnail: "/models/characters/character-model3-thumbnail.png", price: 'N/A', author: { displayName: 'author3' }, category: "characters"},
    { name: "Character 4", path: "/models/characters/character-model4.glb", thumbnail: "/models/characters/character-model4-thumbnail.png", price: 'N/A', author: { displayName: 'author4' }, category: "characters"},
    { name: "Character 5", path: "/models/characters/character-model5.glb", thumbnail: "/models/characters/character-model5-thumbnail.png", price: 'N/A', author: { displayName: 'author5' }, category: "characters"},
    { name: "Character 6", path: "/models/characters/character-model6.glb", thumbnail: "/models/characters/character-model6-thumbnail.png", price: 'N/A', author: { displayName: 'author6' }, category: "characters"},
    { name: "Character 7", path: "/models/characters/character-model7.glb", thumbnail: "/models/characters/character-model7-thumbnail.png", price: 'N/A', author: { displayName: 'author7' }, category: "characters"},
    { name: "Character 8", path: "/models/characters/character-model8.glb", thumbnail: "/models/characters/character-model8-thumbnail.png", price: 'N/A', author: { displayName: 'author8' }, category: "characters"},
    { name: "Character 9", path: "/models/characters/character-model9.glb", thumbnail: "/models/characters/character-model9-thumbnail.png", price: 'N/A', author: { displayName: 'author9' }, category: "characters"},
  ];

  // Filter models based on category and search query
  const filteredModels = models.filter((model) => {
    const matchesCategory = category ? model.category?.toLowerCase() === category?.toLowerCase() : true;
    const matchesQuery = query ? model.name.toLowerCase().includes(query.toLowerCase()) : true;
    return matchesCategory && matchesQuery;
  });

  return (
    <main className="flex min-h-screen pt-32">
      {/* Navigation Bar */}
      <Navbar />

      {/* Left Sidebar for Filters */}
      <aside className="p-4" style={{ paddingTop: "0" }}>
        <Filters />
      </aside>

      {/* Products Grid */}
      <div className="grid grid-cols-3 gap-6 p-4 flex-grow" style={{ marginLeft: "14rem" }}>
        {filteredModels.map((model, index) => (
          <div key={index} className="bg-white shadow rounded-lg flex flex-col overflow-hidden">
            {/* Hoverable Model Card */}
            <HoverableModelCard model={model} />
            
            {/* Product Information */}
            <div className="p-2">
              {/* Make product name a link */}
              <h3 className="text-lg font-semibold">
                <Link href={`/productViewer/${encodeURIComponent(model.name.toLowerCase().replace(/\s+/g, '-'))}`}>
                  {model.name}
                </Link>
              </h3>
              <p className="text-gray-500">By {model.author.displayName}</p>
              <p className="text-lg font-bold mb-1">${model.price}</p>
            </div>

            {/* Add to Cart Button */}
            <div className="p-2">
              <button className="bg-blue-500 text-white py-2 px-3 rounded w-full">
                Add to Cart 
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function HoverableModelCard({ model }) {
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
