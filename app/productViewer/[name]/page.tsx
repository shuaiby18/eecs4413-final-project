"use client";

import { useParams } from 'next/navigation';
import Navbar from "@/components/ui/Navbar";
import ThreeDModelViewer from "@/components/ThreeDModelViewer"; // Import your 3D model viewer component

// Mock data for models (You should replace this with your actual data or fetch it)
const models = [
  { name: "Plane 1", path: "/models/planes/planes-model1.glb", thumbnail: "/models/planes/planes-model1-thumbnail.png", price: 'N/A', user: { displayName: 'User1' }, category: "planes" },
  { name: "Plane 2", path: "/models/planes/planes-model2.glb", thumbnail: "/models/planes/planes-model2-thumbnail.png", price: 'N/A', user: { displayName: 'User2' }, category: "planes" },
  { name: "Plane 3", path: "/models/planes/planes-model3.glb", thumbnail: "/models/planes/planes-model3-thumbnail.png", price: 'N/A', user: { displayName: 'User3' }, category: "planes"  },
  { name: "Plane 4", path: "/models/planes/planes-model4.glb", thumbnail: "/models/planes/planes-model4-thumbnail.png", price: 'N/A', user: { displayName: 'User4' }, category: "planes" },
  { name: "Plane 5", path: "/models/planes/planes-model5.glb", thumbnail: "/models/planes/planes-model5-thumbnail.png", price: 'N/A', user: { displayName: 'User5' }, category: "planes" },
  { name: "Plane 6", path: "/models/planes/planes-model6.glb", thumbnail: "/models/planes/planes-model6-thumbnail.png", price: 'N/A', user: { displayName: 'User6' }, category: "planes" },
  { name: "Plane 7", path: "/models/planes/planes-model7.glb", thumbnail: "/models/planes/planes-model7-thumbnail.png", price: 'N/A', user: { displayName: 'User7' }, category: "planes" },
  { name: "Plane 8", path: "/models/planes/planes-model8.glb", thumbnail: "/models/planes/planes-model8-thumbnail.png", price: 'N/A', user: { displayName: 'User8' }, category: "planes" },
  { name: "Plane 9", path: "/models/planes/planes-model9.glb", thumbnail: "/models/planes/planes-model9-thumbnail.png", price: 'N/A', user: { displayName: 'User8' }, category: "planes" },

  { name: "Environment 1", path: "/models/environments/environment-model1.glb", thumbnail: "/models/environments/environment-model1-thumbnail.png", price: 'N/A', user: { displayName: 'User1' }, category: "environments"},
  { name: "Environment 2", path: "/models/environments/environment-model2.glb", thumbnail: "/models/environments/environment-model2-thumbnail.png", price: 'N/A', user: { displayName: 'User2' }, category: "environments"},
  { name: "Environment 3", path: "/models/environments/environment-model3.glb", thumbnail: "/models/environments/environment-model3-thumbnail.png", price: 'N/A', user: { displayName: 'User3' }, category: "environments"},
  { name: "Environment 4", path: "/models/environments/environment-model4.glb", thumbnail: "/models/environments/environment-model4-thumbnail.png", price: 'N/A', user: { displayName: 'User4' }, category: "environments"},
  { name: "Environment 5", path: "/models/environments/environment-model5.glb", thumbnail: "/models/environments/environment-model5-thumbnail.png", price: 'N/A', user: { displayName: 'User5' }, category: "environments"},
  { name: "Environment 6", path: "/models/environments/environment-model6.glb", thumbnail: "/models/environments/environment-model6-thumbnail.png", price: 'N/A', user: { displayName: 'User6' }, category: "environments"},
  { name: "Environment 7", path: "/models/environments/environment-model7.glb", thumbnail: "/models/environments/environment-model7-thumbnail.png", price: 'N/A', user: { displayName: 'User7' }, category: "environments"},
  { name: "Environment 8", path: "/models/environments/environment-model8.glb", thumbnail: "/models/environments/environment-model8-thumbnail.png", price: 'N/A', user: { displayName: 'User8' }, category: "environments"},
  { name: "Environment 9", path: "/models/environments/environment-model9.glb", thumbnail: "/models/environments/environment-model9-thumbnail.png", price: 'N/A', user: { displayName: 'User9' }, category: "environments"},

  { name: "Car 1", path: "/models/cars/cars-model1.glb", thumbnail: "/models/cars/cars-model1-thumbnail.png", price: 'N/A', user: { displayName: 'User1' }, category: "cars"},
  { name: "Car 2", path: "/models/cars/cars-model2.glb", thumbnail: "/models/cars/cars-model2-thumbnail.png", price: 'N/A', user: { displayName: 'User2' }, category: "cars"},
  { name: "Car 3", path: "/models/cars/cars-model3.glb", thumbnail: "/models/cars/cars-model3-thumbnail.png", price: 'N/A', user: { displayName: 'User3' }, category: "cars" },
  { name: "Car 4", path: "/models/cars/cars-model4.glb", thumbnail: "/models/cars/cars-model4-thumbnail.png", price: 'N/A', user: { displayName: 'User4' }, category: "cars" },
  { name: "Car 5", path: "/models/cars/cars-model5.glb", thumbnail: "/models/cars/cars-model5-thumbnail.png", price: 'N/A', user: { displayName: 'User5' }, category: "cars" },
  { name: "Car 6", path: "/models/cars/cars-model6.glb", thumbnail: "/models/cars/cars-model6-thumbnail.png", price: 'N/A', user: { displayName: 'User6' }, category: "cars" },
  { name: "Car 7", path: "/models/cars/cars-model7.glb", thumbnail: "/models/cars/cars-model7-thumbnail.png", price: 'N/A', user: { displayName: 'User7' }, category: "cars" },
  { name: "Car 8", path: "/models/cars/cars-model8.glb", thumbnail: "/models/cars/cars-model8-thumbnail.png", price: 'N/A', user: { displayName: 'User8' }, category: "cars" },
  { name: "Car 9", path: "/models/cars/cars-model9.glb", thumbnail: "/models/cars/cars-model9-thumbnail.png", price: 'N/A', user: { displayName: 'User9' }, category: "cars" },
  { name: "Car 10", path: "/models/cars/cars-model10.glb", thumbnail: "/models/cars/cars-model10-thumbnail.png", price: 'N/A', user: { displayName: 'User10' }, category: "cars" },

  { name: "Animal 1", path: "/models/animals/animals-model1.glb", thumbnail: "/models/animals/animals-model1-thumbnail.png", price: 'N/A', user: { displayName: 'User1' }, category: "animals"},
  { name: "Animal 2", path: "/models/animals/animals-model2.glb", thumbnail: "/models/animals/animals-model2-thumbnail.png", price: 'N/A', user: { displayName: 'User2' }, category: "animals"},
  { name: "Animal 3", path: "/models/animals/animals-model3.glb", thumbnail: "/models/animals/animals-model3-thumbnail.png", price: 'N/A', user: { displayName: 'User3' }, category: "animals"},
  { name: "Animal 4", path: "/models/animals/animals-model4.glb", thumbnail: "/models/animals/animals-model4-thumbnail.png", price: 'N/A', user: { displayName: 'User4' }, category: "animals"},
  { name: "Animal 5", path: "/models/animals/animals-model5.glb", thumbnail: "/models/animals/animals-model5-thumbnail.png", price: 'N/A', user: { displayName: 'User5' }, category: "animals"},
  { name: "Animal 6", path: "/models/animals/animals-model6.glb", thumbnail: "/models/animals/animals-model6-thumbnail.png", price: 'N/A', user: { displayName: 'User6' }, category: "animals"},
  { name: "Animal 7", path: "/models/animals/animals-model7.glb", thumbnail: "/models/animals/animals-model7-thumbnail.png", price: 'N/A', user: { displayName: 'User7' }, category: "animals"},
  { name: "Animal 8", path: "/models/animals/animals-model8.glb", thumbnail: "/models/animals/animals-model8-thumbnail.png", price: 'N/A', user: { displayName: 'User8' }, category: "animals"},
  { name: "Animal 9", path: "/models/animals/animals-model9.glb", thumbnail: "/models/animals/animals-model9-thumbnail.png", price: 'N/A', user: { displayName: 'User9' }, category: "animals"},

  { name: "Character 1", path: "/models/characters/character-model1.glb", thumbnail: "/models/characters/character-model1-thumbnail.png", price: 'N/A', user: { displayName: 'User1' }, category: "characters"},
  { name: "Character 2", path: "/models/characters/character-model2.glb", thumbnail: "/models/characters/character-model2-thumbnail.png", price: 'N/A', user: { displayName: 'User2' }, category: "characters"},
  { name: "Character 3", path: "/models/characters/character-model3.glb", thumbnail: "/models/characters/character-model3-thumbnail.png", price: 'N/A', user: { displayName: 'User3' }, category: "characters"},
  { name: "Character 4", path: "/models/characters/character-model4.glb", thumbnail: "/models/characters/character-model4-thumbnail.png", price: 'N/A', user: { displayName: 'User4' }, category: "characters"},
  { name: "Character 5", path: "/models/characters/character-model5.glb", thumbnail: "/models/characters/character-model5-thumbnail.png", price: 'N/A', user: { displayName: 'User5' }, category: "characters"},
  { name: "Character 6", path: "/models/characters/character-model6.glb", thumbnail: "/models/characters/character-model6-thumbnail.png", price: 'N/A', user: { displayName: 'User6' }, category: "characters"},
  { name: "Character 7", path: "/models/characters/character-model7.glb", thumbnail: "/models/characters/character-model7-thumbnail.png", price: 'N/A', user: { displayName: 'User7' }, category: "characters"},
  { name: "Character 8", path: "/models/characters/character-model8.glb", thumbnail: "/models/characters/character-model8-thumbnail.png", price: 'N/A', user: { displayName: 'User8' }, category: "characters"},
  { name: "Character 9", path: "/models/characters/character-model9.glb", thumbnail: "/models/characters/character-model9-thumbnail.png", price: 'N/A', user: { displayName: 'User9' }, category: "characters"},
];

export default function ProductViewer() {
  const { name } = useParams(); // Access the dynamic route parameter 'name'

  // Normalize the name parameter from the URL (hyphenated, lowercase)
  const normalizedRouteName = name.toLowerCase().replace(/-/g, ' ');

  // Find the model that matches the selected product by converting hyphens back to spaces
  const selectedModel = models.find((model) => model.name.toLowerCase() === normalizedRouteName);

  if (!selectedModel) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area with padding to prevent overlap */}
      <div className="container mx-auto py-10 flex" style={{ paddingTop: "150px" }}>
        {/* Product Viewer */}
        <main className="w-full">
          <div className="grid grid-cols-2 gap-8">
              {/* Product Image / 3D Render */}
              <div style={{ width: "100%", height: "360px" }}>  {/* Set a specific height for the container */}
                <ThreeDModelViewer modelPath={selectedModel.path} style={{ width: "100%", height: "100%" }} />
              </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">{selectedModel.name}</h2>
              <p className="text-2xl font-semibold text-green-600">${selectedModel.price}</p>
              <p className="text-md text-gray-700">{selectedModel.description}</p>
              <div className="space-x-4">
                <button className="bg-blue-500 text-white px-6 py-3 rounded shadow">
                  Buy Now
                </button>
                <button className="bg-gray-300 px-6 py-3 rounded shadow">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Suggested Items Section */}
          <section className="mt-12">
            <h3 className="text-2xl font-semibold mb-6">Suggested Items</h3>
            <div className="grid grid-cols-3 gap-6">
              {/* Item Card */}
              <div className="bg-white shadow-lg p-4">
                <div className="h-48 bg-gray-200 flex justify-center items-center">
                  <span>Image</span>
                </div>
                <h4 className="mt-4 text-lg font-semibold">Item Name</h4>
                <p className="text-green-600">$Price</p>
                <button className="bg-gray-300 mt-4 px-4 py-2 rounded w-full">
                  Add to Cart
                </button>
              </div>

              <div className="bg-white shadow-lg p-4">
                <div className="h-48 bg-gray-200 flex justify-center items-center">
                  <span>Image</span>
                </div>
                <h4 className="mt-4 text-lg font-semibold">Item Name</h4>
                <p className="text-green-600">$Price</p>
                <button className="bg-gray-300 mt-4 px-4 py-2 rounded w-full">
                  Add to Cart
                </button>
              </div>

              <div className="bg-white shadow-lg p-4">
                <div className="h-48 bg-gray-200 flex justify-center items-center">
                  <span>Image</span>
                </div>
                <h4 className="mt-4 text-lg font-semibold">Item Name</h4>
                <p className="text-green-600">$Price</p>
                <button className="bg-gray-300 mt-4 px-4 py-2 rounded w-full">
                  Add to Cart
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
