"use client"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUserCircle, faList } from '@fortawesome/free-solid-svg-icons';
import { useRouter, usePathname } from 'next/navigation';  
import { useSession, signOut } from "next-auth/react";  
import { useState, useEffect } from "react";  
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 

  useEffect(() => {
    console.log("Session data:", session);
  }, [session]);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      router.push(`/searchResults?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/searchResults`);
    }
  };

  const handleSignIn = () => {
    if (!session) {
      const callbackUrl = pathname;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    router.refresh();
  };

  const handleViewAllProducts = () => {
    router.push('/searchResults');
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/searchResults?category=${category}`);
  };

  const handleOrdersClick = () => {
    router.push('/orders');
  }

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="flex justify-between items-center p-2 pl-4">
        <div className="flex items-center space-x-10 flex-grow">
          <div className="text-xl font-semibold cursor-pointer" onClick={() => router.push('/')}>
            EECS 4413 PROJECT
          </div>
          <div className="flex-grow flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search for your product"
              className="p-2 border border-gray-300 rounded w-3/4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(); 
              }}
            />
            <button className="p-2 rounded" onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} className="text-gray-500 h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <button className="p-2 rounded" onClick={handleOrdersClick}>
              <FontAwesomeIcon icon={faList} className="text-gray-500 h-7 w-7" />
            </button>
            <span className="text-xs text-gray-600">Orders</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="p-2 rounded" onClick={handleCartClick}>
              <FontAwesomeIcon icon={faShoppingCart} className="text-gray-500 h-7 w-7" />
            </button>
            <span className="text-xs text-gray-600">Cart</span>
          </div>
          <div className="flex flex-col items-center relative">
            <button className="p-2 rounded" onClick={handleSignIn}>
              <FontAwesomeIcon icon={faUserCircle} className="text-gray-500 h-7 w-7" />
            </button>
            <span className="text-xs text-gray-600 cursor-pointer">
              {session ? "My Account" : "Sign-In"}
            </span>
            {session && isMenuOpen && (
              <div className="absolute right-0 mt-8 bg-white shadow-lg rounded-lg p-2 w-48"> {/* Increased width to 12rem (w-48) */}
                <button
                  onClick={() => router.push('/orders')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                >
                  Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center space-x-8 bg-gray-100 p-2 pl-4">
        <button className="text-gray-600 hover:text-gray-900" onClick={handleViewAllProducts}>View All Products</button>
        <button className="text-gray-600 hover:text-gray-900" onClick={() => handleCategoryClick('animals')}>Animals</button>
        <button className="text-gray-600 hover:text-gray-900" onClick={() => handleCategoryClick('cars')}>Cars</button>
        <button className="text-gray-600 hover:text-gray-900" onClick={() => handleCategoryClick('characters')}>Characters</button>
        <button className="text-gray-600 hover:text-gray-900" onClick={() => handleCategoryClick('environments')}>Environments</button>
        <button className="text-gray-600 hover:text-gray-900" onClick={() => handleCategoryClick('planes')}>Planes</button>
        <div className='flex-1'></div>
        {session?.user?.role === "ADMIN" && <Link className="text-gray-600 hover:text-gray-900" href={"/admin"} >Admin</Link>}
      </div>
    </nav>
  );
}
