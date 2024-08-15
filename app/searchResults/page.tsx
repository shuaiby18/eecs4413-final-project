"use client";

import { useState } from "react";
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
    { name: "Plane 8", path: "/models/model11.glb", price: 'N/A', user: { displayName: 'User8' } },
    { name: "plane 1", path: "/models/model1.glb", price: 'N/A', user: { displayName: 'User1' } },
    { name: "plane 2", path: "/models/model2.glb", price: 'N/A', user: { displayName: 'User2' } },
    { name: "Plane 3", path: "/models/model3.glb", price: 'N/A', user: { displayName: 'User3' } },
    { name: "Plane 4", path: "/models/model9.glb", price: 'N/A', user: { displayName: 'User4' } },
    { name: "Plane 5", path: "/models/model8.glb", price: 'N/A', user: { displayName: 'User5' } },
    { name: "Plane 6", path: "/models/model7.glb", price: 'N/A', user: { displayName: 'User6' } },
    { name: "Plane 7", path: "/models/model10.glb", price: 'N/A', user: { displayName: 'User7' } },


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
            {/* 3D Model Render */}
            <div className="flex-grow relative" style={{ height: '250px' }}>
              <ThreeDModelViewer modelPath={model.path} />
            </div>

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