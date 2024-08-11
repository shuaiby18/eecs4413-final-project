"use client"

import { trpc } from "@/server/client";
import { useMemo, useState } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  SortingFn
} from "@tanstack/react-table";

import Navbar from "@/components/ui/Navbar";  // Import the reusable Navbar component

// Custom sorting function for numeric values
const numericSort: SortingFn<any> = (rowA, rowB, columnId) => {
  const valueA = parseFloat(rowA.getValue(columnId));
  const valueB = parseFloat(rowB.getValue(columnId));
  let result;

  if (valueA > valueB) {
    result = 1;
  } else if (valueA < valueB) {
    result = -1;
  } else {
    result = 0;
  }

  return result;
};

// Filter Component
function Filters() {
  return (
    <div className="bg-white shadow rounded-lg p-4 w-64">
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
  // get all products
  let { data: dataAll } = trpc.product.getAll.useQuery();

  return (
    <main className="flex min-h-screen pt-32">
      {/* Navigation Bar */}
      <Navbar />

      {/* Left Sidebar for Filters */}
      <aside className="p-4">
        <Filters />
      </aside>

      {/* Products Grid */}
      <div className="grid grid-cols-4 gap-6 p-4 flex-grow">
        {dataAll?.map((product, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-4">
            <img
              src={product.image}
              alt={product.description}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-500">${product.price}</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
