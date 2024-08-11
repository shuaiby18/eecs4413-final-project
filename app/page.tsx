"use client"

import Navbar from "@/components/ui/Navbar";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-32">
      {/* Navigation Bar */}
      <Navbar />

      {/* Padding added below Navbar */}
      <div className="mt-4 w-full"></div> {/* Adds margin-top of 1rem (4 * 0.25rem) */}

      {/* First Row */}
      <div className="grid grid-cols-3 gap-4 mb-4 w-full px-4">
        <div className="col-span-1 bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Deal 1</h2>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-white p-2 h-32">Item 1</div>
            <div className="bg-white p-2 h-32">Item 2</div>
          </div>
        </div>
        <div className="col-span-1 bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Category 1</h2>
          <div className="grid grid-cols-1 gap-2 mt-2">
            <div className="bg-white p-2 h-16">Subcategory 1</div>
            <div className="bg-white p-2 h-16">Subcategory 2</div>
          </div>
        </div>
        <div className="col-span-1 bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Category 2</h2>
          <div className="bg-white p-2 h-48">Content 1</div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-3 gap-4 mb-4 w-full px-4">
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Category 3</h2>
          <div className="bg-white p-2 h-32">Content 2</div>
        </div>
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Category 4</h2>
          <div className="bg-white p-2 h-32">Content 3</div>
        </div>
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Category 5</h2>
          <div className="bg-white p-2 h-32">Content 4</div>
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-3 gap-4 w-full px-4">
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Category 6</h2>
          <div className="bg-white p-2 h-32">Content 5</div>
        </div>
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Category 7</h2>
          <div className="bg-white p-2 h-32">Content 6</div>
        </div>
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Category 8</h2>
          <div className="bg-white p-2 h-32">Content 7</div>
        </div>
      </div>
    </main>
  );
}
