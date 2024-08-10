"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUserCircle } from '@fortawesome/free-solid-svg-icons';

// Navigation Bar Component
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      {/* Adjusted padding for alignment */}
      <div className="flex justify-between items-center p-2 pl-4">
        <div className="flex items-center space-x-10 flex-grow">
          <div className="text-xl font-semibold">EECS 4413 PROJECT</div>
          <div className="flex-grow flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search for your product"
              className="p-2 border border-gray-300 rounded w-3/4"
            />
            <button className="p-2 rounded">
              <FontAwesomeIcon icon={faSearch} className="text-gray-500 h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <button className="p-2 rounded">
              <FontAwesomeIcon icon={faShoppingCart} className="text-gray-500 h-7 w-7" />
            </button>
            <span className="text-xs text-gray-600">Cart</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="p-2 rounded">
              <FontAwesomeIcon icon={faUserCircle} className="text-gray-500 h-7 w-7" />
            </button>
            <span className="text-xs text-gray-600">Sign-In</span>
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center space-x-8 bg-gray-100 p-2 pl-4">
        <button className="text-gray-600 hover:text-gray-900">Category 1</button>
        <button className="text-gray-600 hover:text-gray-900">Category 2</button>
        <button className="text-gray-600 hover:text-gray-900">Category 3</button>
        <button className="text-gray-600 hover:text-gray-900">Category 4</button>
        <button className="text-gray-600 hover:text-gray-900">Category 5</button>
        <button className="text-gray-600 hover:text-gray-900">Category 6</button>
        <button className="text-gray-600 hover:text-gray-900">Category 7</button>
        <button className="text-gray-600 hover:text-gray-900">Category 8</button>
      </div>
    </nav>
  );
}

// Home Page Layout
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
