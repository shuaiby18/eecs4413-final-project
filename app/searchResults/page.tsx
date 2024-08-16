"use client";

import { useState, Suspense } from "react"; // Added Suspense to the import
import { useSearchParams } from 'next/navigation';
import Navbar from "@/components/ui/Navbar";
import ThreeDModelViewer from "@/components/ThreeDModelViewer"; // Import your 3D model viewer component

function Filters() {
  return (
    <div className="bg-white shadow rounded-lg p-4 w-48 fixed top-32 left-4">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      <div className="mb-4">
        <h3 className="text-md font-semibold">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Large
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Small
          </label>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-md font-semibold">Brand</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Nike
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Adidas
          </label>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-md font-semibold">Price Range</h3>
        <input type="range" min="0" max="1000" className="w-full" />
      </div>
    </div>
  );
}

export default function Home() {
  const models = [
  
  
    { name: "Plane 1", path: "/models/planes/planes-model1.glb", thumbnail: "/models/planes/planes-model1-thumbnail.png", price: 'N/A', user: { displayName: 'User1' } },
    { name: "Plane 2", path: "/models/planes/planes-model2.glb", thumbnail: "/models/planes/planes-model2-thumbnail.png", price: 'N/A', user: { displayName: 'User2' } },
    { name: "Plane 3", path: "/models/planes/planes-model3.glb", thumbnail: "/models/planes/planes-model3-thumbnail.png", price: 'N/A', user: { displayName: 'User3' } },
    { name: "Plane 4", path: "/models/planes/planes-model4.glb", thumbnail: "/models/planes/planes-model4-thumbnail.png", price: 'N/A', user: { displayName: 'User4' } },
    { name: "Plane 5", path: "/models/planes/planes-model5.glb", thumbnail: "/models/planes/planes-model5-thumbnail.png", price: 'N/A', user: { displayName: 'User5' } },
    { name: "Plane 6", path: "/models/planes/planes-model6.glb", thumbnail: "/models/planes/planes-model6-thumbnail.png", price: 'N/A', user: { displayName: 'User6' } },
    { name: "Plane 7", path: "/models/planes/planes-model7.glb", thumbnail: "/models/planes/planes-model7-thumbnail.png", price: 'N/A', user: { displayName: 'User7' } },
    { name: "Plane 8", path: "/models/planes/planes-model8.glb", thumbnail: "/models/planes/planes-model8-thumbnail.png", price: 'N/A', user: { displayName: 'User8' } },
    { name: "Plane 9", path: "/models/planes/planes-model9.glb", thumbnail: "/models/planes/planes-model9-thumbnail.png", price: 'N/A', user: { displayName: 'User8' } },

    { name: "Environment 1", path: "/models/environments/environment-model1.glb", thumbnail: "/models/environments/environment-model1-thumbnail.png", price: 'N/A', user: { displayName: 'User1' } },
    { name: "Environment 2", path: "/models/environments/environment-model2.glb", thumbnail: "/models/environments/environment-model2-thumbnail.png", price: 'N/A', user: { displayName: 'User2' } },
    { name: "Environment 3", path: "/models/environments/environment-model3.glb", thumbnail: "/models/environments/environment-model3-thumbnail.png", price: 'N/A', user: { displayName: 'User3' } },
    { name: "Environment 4", path: "/models/environments/environment-model4.glb", thumbnail: "/models/environments/environment-model4-thumbnail.png", price: 'N/A', user: { displayName: 'User4' } },
    { name: "Environment 5", path: "/models/environments/environment-model5.glb", thumbnail: "/models/environments/environment-model5-thumbnail.png", price: 'N/A', user: { displayName: 'User5' } },
    { name: "Environment 6", path: "/models/environments/environment-model6.glb", thumbnail: "/models/environments/environment-model6-thumbnail.png", price: 'N/A', user: { displayName: 'User6' } },
    { name: "Environment 7", path: "/models/environments/environment-model7.glb", thumbnail: "/models/environments/environment-model7-thumbnail.png", price: 'N/A', user: { displayName: 'User7' } },
    { name: "Environment 8", path: "/models/environments/environment-model8.glb", thumbnail: "/models/environments/environment-model8-thumbnail.png", price: 'N/A', user: { displayName: 'User8' } },
    { name: "Environment 9", path: "/models/environments/environment-model9.glb", thumbnail: "/models/environments/environment-model9-thumbnail.png", price: 'N/A', user: { displayName: 'User9' } },

    { name: "Car 1", path: "/models/cars/cars-model1.glb", thumbnail: "/models/cars/cars-model1-thumbnail.png", price: 'N/A', user: { displayName: 'User1' } },
    { name: "Car 2", path: "/models/cars/cars-model2.glb", thumbnail: "/models/cars/cars-model2-thumbnail.png", price: 'N/A', user: { displayName: 'User2' } },
    { name: "Car 3", path: "/models/cars/cars-model3.glb", thumbnail: "/models/cars/cars-model3-thumbnail.png", price: 'N/A', user: { displayName: 'User3' } },
    { name: "Car 4", path: "/models/cars/cars-model4.glb", thumbnail: "/models/cars/cars-model4-thumbnail.png", price: 'N/A', user: { displayName: 'User4' } },
    { name: "Car 5", path: "/models/cars/cars-model5.glb", thumbnail: "/models/cars/cars-model5-thumbnail.png", price: 'N/A', user: { displayName: 'User5' } },
    { name: "Car 6", path: "/models/cars/cars-model6.glb", thumbnail: "/models/cars/cars-model6-thumbnail.png", price: 'N/A', user: { displayName: 'User6' } },
    { name: "Car 7", path: "/models/cars/cars-model7.glb", thumbnail: "/models/cars/cars-model7-thumbnail.png", price: 'N/A', user: { displayName: 'User7' } },
    { name: "Car 8", path: "/models/cars/cars-model8.glb", thumbnail: "/models/cars/cars-model8-thumbnail.png", price: 'N/A', user: { displayName: 'User8' } },
    { name: "Car 9", path: "/models/cars/cars-model9.glb", thumbnail: "/models/cars/cars-model9-thumbnail.png", price: 'N/A', user: { displayName: 'User9' } },
    { name: "Car 10", path: "/models/cars/cars-model10.glb", thumbnail: "/models/cars/cars-model10-thumbnail.png", price: 'N/A', user: { displayName: 'User10' } },

    { name: "Animal 1", path: "/models/animals/animals-model1.glb", thumbnail: "/models/animals/animals-model1-thumbnail.png", price: 'N/A', user: { displayName: 'User1' } },
    { name: "Animal 2", path: "/models/animals/animals-model2.glb", thumbnail: "/models/animals/animals-model2-thumbnail.png", price: 'N/A', user: { displayName: 'User2' } },
    { name: "Animal 3", path: "/models/animals/animals-model3.glb", thumbnail: "/models/animals/animals-model3-thumbnail.png", price: 'N/A', user: { displayName: 'User3' } },
    { name: "Animal 4", path: "/models/animals/animals-model4.glb", thumbnail: "/models/animals/animals-model4-thumbnail.png", price: 'N/A', user: { displayName: 'User4' } },
    { name: "Animal 5", path: "/models/animals/animals-model5.glb", thumbnail: "/models/animals/animals-model5-thumbnail.png", price: 'N/A', user: { displayName: 'User5' } },
    { name: "Animal 6", path: "/models/animals/animals-model6.glb", thumbnail: "/models/animals/animals-model6-thumbnail.png", price: 'N/A', user: { displayName: 'User6' } },
    { name: "Animal 7", path: "/models/animals/animals-model7.glb", thumbnail: "/models/animals/animals-model7-thumbnail.png", price: 'N/A', user: { displayName: 'User7' } },
    { name: "Animal 8", path: "/models/animals/animals-model8.glb", thumbnail: "/models/animals/animals-model8-thumbnail.png", price: 'N/A', user: { displayName: 'User8' } },
    { name: "Animal 9", path: "/models/animals/animals-model9.glb", thumbnail: "/models/animals/animals-model9-thumbnail.png", price: 'N/A', user: { displayName: 'User9' } },

    { name: "Character 1", path: "/models/characters/character-model1.glb", thumbnail: "/models/characters/character-model1-thumbnail.png", price: 'N/A', user: { displayName: 'User1' } },
    { name: "Character 2", path: "/models/characters/character-model2.glb", thumbnail: "/models/characters/character-model2-thumbnail.png", price: 'N/A', user: { displayName: 'User2' } },
    { name: "Character 3", path: "/models/characters/character-model3.glb", thumbnail: "/models/characters/character-model3-thumbnail.png", price: 'N/A', user: { displayName: 'User3' } },
    { name: "Character 4", path: "/models/characters/character-model4.glb", thumbnail: "/models/characters/character-model4-thumbnail.png", price: 'N/A', user: { displayName: 'User4' } },
    { name: "Character 5", path: "/models/characters/character-model5.glb", thumbnail: "/models/characters/character-model5-thumbnail.png", price: 'N/A', user: { displayName: 'User5' } },
    { name: "Character 6", path: "/models/characters/character-model6.glb", thumbnail: "/models/characters/character-model6-thumbnail.png", price: 'N/A', user: { displayName: 'User6' } },
    { name: "Character 7", path: "/models/characters/character-model7.glb", thumbnail: "/models/characters/character-model7-thumbnail.png", price: 'N/A', user: { displayName: 'User7' } },
    { name: "Character 8", path: "/models/characters/character-model8.glb", thumbnail: "/models/characters/character-model8-thumbnail.png", price: 'N/A', user: { displayName: 'User8' } },
    { name: "Character 9", path: "/models/characters/character-model9.glb", thumbnail: "/models/characters/character-model9-thumbnail.png", price: 'N/A', user: { displayName: 'User9' } },
  ];

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
        {models.map((model, index) => (
          <div key={index} className="bg-white shadow rounded-lg flex flex-col overflow-hidden">
            {/* Hoverable Model Card */}
            <HoverableModelCard model={model} />
            
            {/* Product Information */}
            <div className="p-2"> {/* Reduced padding */}
              <h3 className="text-lg font-semibold">{model.name}</h3>
              <p className="text-gray-500">By {model.user.displayName}</p>
              <p className="text-lg font-bold text-blue-500 mb-1">${model.price}</p> {/* Reduced margin bottom */}
            </div>

            {/* Add to Cart Button */}
            <div className="p-2"> {/* Reduced padding */}
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

  return (
    <div
      className="relative"
      style={{ height: "250px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
        <Suspense fallback={<div>Loading 3D Model...</div>}>
          <ThreeDModelViewer modelPath={model.path} />
        </Suspense>
      ) : (
        <img
          src={model.thumbnail}
          alt={model.name + " thumbnail"}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
