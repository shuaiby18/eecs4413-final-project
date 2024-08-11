"use client"

import { trpc } from "@/server/client";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import Navbar from "@/components/ui/Navbar";

// Custom sorting function for numeric values
const numericSort = (rowA, rowB, columnId) => {
  const valueA = parseFloat(rowA.getValue(columnId));
  const valueB = parseFloat(rowB.getValue(columnId));
  return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
};

// Filter Component
function Filters() {
  return (
    <div className="bg-white shadow rounded-lg p-4 w-64 fixed top-32 left-4">
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
  const searchParams = useSearchParams(); // Get the search params
  const query = searchParams.get('query'); // Get the 'query' parameter
  let { data: dataAll } = trpc.product.getAll.useQuery();

  // Filter products based on the search query
  const filteredProducts = useMemo(() => {
    if (!query) return dataAll;
    return dataAll?.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, dataAll]);

  return (
    <main className="flex min-h-screen pt-32">
      {/* Navigation Bar */}
      <Navbar />

      {/* Left Sidebar for Filters */}
      <aside className="p-4" style={{ paddingTop: "0" }}>
        <Filters />
      </aside>

      {/* Products Grid */}
      <div className="grid grid-cols-4 gap-6 p-4 flex-grow" style={{ marginLeft: "16rem" }}>
        {filteredProducts?.map((product, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-4 flex flex-col justify-between h-full">
            <div>
              <img
                src={product.image}
                alt={product.description}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-500">${product.price}</p>
            </div>
            <button className="mt-auto bg-blue-500 text-white py-2 px-3 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
