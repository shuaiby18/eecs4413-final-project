"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import Navbar from "@/components/ui/Navbar";

const SKETCHFAB_API_KEY = 'd62c2255fb634903a23bf3f5ee59d321'; // Your actual API key

// Filter Component
function Filters() {
  return (
    <div className="bg-white shadow rounded-lg p-4 w-48 fixed top-32 left-4"> {/* Reduced width from w-64 to w-48 */}
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
  const [models, setModels] = useState([]);
  const [hoveredModel, setHoveredModel] = useState(null); // State to track the hovered model
  const [iframeLoaded, setIframeLoaded] = useState({}); // Track iframe load status per model
  const searchParams = useSearchParams(); // Get the search params
  const query = searchParams.get('query'); // Get the 'query' parameter

  useEffect(() => {
    const fetchModels = async () => {
      const response = await fetch(`https://api.sketchfab.com/v3/search?type=models&q=${query}`, {
        headers: {
          Authorization: `Bearer ${SKETCHFAB_API_KEY}`,
        },
      });
      const data = await response.json();
      setModels(data.results || []);
    };

    fetchModels();
  }, [query]);

  const handleMouseEnter = (uid) => {
    setHoveredModel(uid);
    if (!iframeLoaded[uid]) {
      setIframeLoaded(prevState => ({ ...prevState, [uid]: false }));
    }
  };

  const handleIframeLoad = (uid) => {
    setIframeLoaded(prevState => ({ ...prevState, [uid]: true }));
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
      <div className="grid grid-cols-3 gap-6 p-4 flex-grow" style={{ marginLeft: "14rem" }}> {/* Adjusted grid margin to accommodate smaller filter width */}
        {models.map((model, index) => (
          <div 
            key={index} 
            className="bg-white shadow rounded-lg flex flex-col overflow-hidden"
            onMouseEnter={() => handleMouseEnter(model.uid)}  // Set the hovered model UID
            onMouseLeave={() => setHoveredModel(null)}  // Clear the hovered model UID
          >
            {/* Render Container (Top Part) */}
            <div className="flex-grow relative">
              {/* Thumbnail visible when not hovered or iframe not yet loaded */}
              {hoveredModel !== model.uid || !iframeLoaded[model.uid] ? (
                <img
                  src={model.thumbnails.images[0].url}  // Display the thumbnail while loading
                  alt={model.name}
                  className="w-full h-64 object-cover" // Full width and height for the render container
                />
              ) : null}
              
              {/* Iframe visible when hovered and iframe has loaded */}
              {hoveredModel === model.uid && (
                <iframe
                  title={model.name}
                  src={`https://sketchfab.com/models/${model.uid}/embed?autostart=1&scrollwheel=0&ui_controls=0&ui_infos=0&ui_stop=0`} // Modified URL for better interaction
                  className={`w-full h-64 ${iframeLoaded[model.uid] ? 'block' : 'hidden'}`} // Show iframe only when it's loaded
                  frameBorder="0"
                  allow="autoplay; fullscreen; vr"
                  mozallowfullscreen="true"
                  webkitallowfullscreen="true"
                  onLoad={() => handleIframeLoad(model.uid)} // Handle iframe load event
                ></iframe>
              )}
            </div>

            {/* Information Container (Bottom Part) */}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{model.name}</h3>
              <p className="text-gray-500">By {model.user.displayName}</p>
              <p className="text-lg font-bold text-blue-500 mb-2">${model.price || 'N/A'}</p> {/* Display the price */}
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
