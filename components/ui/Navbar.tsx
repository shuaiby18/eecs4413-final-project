"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';  // Import useRouter

// Navigation Bar Component
export default function Navbar() {
  const router = useRouter();

  const handleSearch = () => {
    router.push('/searchResults');  // Navigate to the search results page
  };

  const handleSignIn = () => {
    router.push('/login');  // Navigate to the login page
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="flex justify-between items-center p-2 pl-4">
        <div className="flex items-center space-x-10 flex-grow">
          <div className="text-xl font-semibold">EECS 4413 PROJECT</div>
          <div className="flex-grow flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search for your product"
              className="p-2 border border-gray-300 rounded w-3/4"
            />
            <button className="p-2 rounded" onClick={handleSearch}>
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
            <button className="p-2 rounded" onClick={handleSignIn}>
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
