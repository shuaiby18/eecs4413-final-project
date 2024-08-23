"use client";

import { useState, Suspense } from "react"; // Added Suspense to the import
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from "@/components/ui/Navbar";
import ThreeDModelViewer from "@/components/ThreeDModelViewer"; // Import your 3D model viewer component

// Define the type for a model
type Model = {
  name: string;
  path: string;
  thumbnail: string;
  price: string;
  user: {
    displayName: string;
  };
  category: string; // Include category as part of the type
};

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
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const query = searchParams.get('query'); // Get the search query from the URL
  const router = useRouter();

  const [cartItems, setCartItems] = useState<Model[]>([]);

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

  // Filter models based on category and search query
  const filteredModels = models.filter((model) => {
    const matchesCategory = category ? model.category?.toLowerCase() === category?.toLowerCase() : true;
    const matchesQuery = query ? model.name.toLowerCase().includes(query.toLowerCase()) : true;
    return matchesCategory && matchesQuery;
  });

  const handleAddToCart = (model: Model) => {
    setCartItems((prevItem) => [...prevItem, model]);
    router.push("/cart");
  };

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
              <h3 className="text-lg font-semibold">{model.name}</h3>
              <p className="text-gray-500">By {model.user.displayName}</p>
              <p className="text-lg font-bold text-blue-500 mb-1">${model.price}</p>
            </div>


            {/* Add to Cart Button */}
            <div className="p-2">
              <button className="bg-blue-500 text-white py-2 px-3 rounded w-full"
               onClick = {() => handleAddToCart(model)} >
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