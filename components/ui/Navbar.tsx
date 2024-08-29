//This is a navbar component that will always be rendered at the top of pages, sperate component as some pages wll not access this
"use client"

//import fontawesome icons to keep all icons the same style
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//implement specfic icons from the font awesome library
import { faSearch, faShoppingCart, faUserCircle, faList } from '@fortawesome/free-solid-svg-icons';
//import use router for navigation
import { useRouter, usePathname } from 'next/navigation';  
//import use session as well as signout to be used with next-auth
import { useSession, signOut } from "next-auth/react";  
//imort use state
import { useState, useEffect } from "react";  
//import links for routing
import Link from 'next/link';

//This will render the nav bar
export default function Navbar() {
  //Create the router for navigation
  const router = useRouter();
  //Retrieve the current path that we are on
  const pathname = usePathname();
  //Retrive session data
  const { data: session } = useSession();
  //state for drop down menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Add state for search query
  const [searchQuery, setSearchQuery] = useState(""); 

  //Manage log in session outputs/can ignore this only for debugging
  useEffect(() => {
    console.log("Session data:", session);
  }, [session]);

  //function responsbile for when user makes a search
  const handleSearch = () => {
    //determine if query is not empty, if not then go to the searchresults to filter model based on query, other just go to search results
    if (searchQuery.trim() !== "") {
      router.push(`/searchResults?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/searchResults`);
    }
  };

  //This funtion will be responsible for signing in works like a toggle
  const handleSignIn = () => {
    console.log("handleSignIn Session data:", session);
    if (!session) {
      console.log("handleSignIn 1 Session data:", session);
      const callbackUrl = pathname;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } else {
      console.log("handleSignIn 2 Session data:", session);
      setIsMenuOpen(!isMenuOpen);
    }
  };

  //This funtion will be responsible for signing out, works like a toggle
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    router.refresh();
  };

  //If the view all products button is pressed, then go to the searchResults page
  const handleViewAllProducts = () => {
    router.push('/searchResults');
  };

  //if a specific category is selected, then route to the search results page utilizing that category
  const handleCategoryClick = (category: string) => {
    router.push(`/searchResults?category=${category}`);
  };

  //function call for going to orders  
  const handleOrdersClick = () => {
    router.push('/orders');
  }

  //function call for going to cart
  const handleCartClick = () => {
    router.push('/cart');
  };

  //html render for the navigation bar
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="flex justify-between items-center p-2 pl-4">
        <div className="flex items-center space-x-10 flex-grow">
          <div className="text-xl font-semibold cursor-pointer" onClick={() => router.push('/')}>
            EECS 4413 PROJECT
          </div>
          {/* This code is responsbile for the searchBar and its interactions */}
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
        {/* display all the other options for cart orders and profile */}
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
            {/* Dropdown menu for signing in and signing out, including the profile section */}
            {session && isMenuOpen && (
            <div className="absolute right-0 mt-8 bg-white shadow-lg rounded-lg p-2 w-48">
              <Link
                href="/user_settings"
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 w-full text-center"
              >
                User Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 w-full text-center"
              >
                Sign Out
              </button>
            </div>
          )}

          </div>
        </div>
      </div>
      {/* this section will be responsible for determining category was selected so that when routing to the searchresults page, it can use this */}
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