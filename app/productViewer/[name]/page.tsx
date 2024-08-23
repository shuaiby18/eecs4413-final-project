"use client";

import { useParams } from 'next/navigation';
import Navbar from "@/components/ui/Navbar";
import ThreeDModelViewer from "@/components/ThreeDModelViewer"; // Import your 3D model viewer component
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState, useEffect } from 'react'; // Import useRef
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

function HoverableModelCard({ model }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsModelLoaded(false); // Reset model load state on hover
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="relative"
      style={{ height: "250px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Render 3D Model when hovered */}
      {isHovered && (
        <div className="absolute inset-0 w-full h-full">
          <ThreeDModelViewer
            modelPath={model.path}
            isHovered={isHovered}
            onModelLoad={() => setIsModelLoaded(true)} // Set model as loaded
          />
        </div>
      )}

      {/* Always render the thumbnail */}
      <img
        src={model.thumbnail}
        alt={model.name + " thumbnail"}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          zIndex: 1,
          pointerEvents: isModelLoaded ? 'none' : 'auto', // Disable pointer events when the model is loaded to allow interaction
          opacity: !isModelLoaded || !isHovered ? 1 : 0, // Hide thumbnail when model is loaded and hovered
          filter: isHovered && !isModelLoaded ? "brightness(70%)" : "brightness(100%)", // Darken thumbnail on hover until model loads
          transition: "opacity 0.5s ease, filter 0.3s ease", // Smooth fade-out and darkening
        }}
      />
    </div>
  );
}

export default function ProductViewer() {
  const { name } = useParams(); // Access the dynamic route parameter 'name'
  const renderRef = useRef(null); // Reference for the render container
  const [selectedModel, setSelectedModel] = useState(null);
  const [suggestedModels, setSuggestedModels] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Normalize the name from the URL
  const normalizedRouteName = decodeURIComponent(name)
    .replace(/_/g, '-')  // Convert underscores back to dashes
    .replace(/%20/g, ' ');  // Convert '%20' back to spaces

  // Fetch the selected model and suggested models from the API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch(`/api/models`);
        const models = await res.json();
        
        // Find the model that matches the selected product
        const matchedModel = models.find((model) => model.name.toLowerCase() === normalizedRouteName.toLowerCase());
        setSelectedModel(matchedModel);

        // Get suggested models (same category but different name)
        const relatedModels = models
          .filter(model => model.category.name === matchedModel?.category.name && model.name !== matchedModel?.name)
          .slice(0, 3); // Limit to 3 models
        setSuggestedModels(relatedModels);

        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching models:', error);
        setLoading(false); // Stop loading even if there is an error
      }
    };

    fetchModels();
  }, [normalizedRouteName]);

  const toggleFullScreen = () => {
    if (renderRef.current) {
      if (renderRef.current.requestFullscreen) {
        renderRef.current.requestFullscreen();
      } else if (renderRef.current.webkitRequestFullscreen) { /* Safari */
        renderRef.current.webkitRequestFullscreen();
      } else if (renderRef.current.msRequestFullscreen) { /* IE11 */
        renderRef.current.msRequestFullscreen();
      }
    }
  };

  // While loading, show nothing or a loader (you can customize this)
  if (loading) {
    return null; // or return a loading spinner if desired
  }

  // If selectedModel is still null after loading, return the "Product not found" message
  if (!selectedModel) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area with padding to prevent overlap */}
      <div className="container mx-auto py-10 flex" style={{ paddingTop: "150px" }}>
        {/* Product Viewer */}
        <main className="w-full">
          <div className="grid grid-cols-2 gap-8">
            {/* Product Image / 3D Render */}
            <div ref={renderRef} style={{ position: "relative", width: "100%", height: "360px" }}>
              {/* Full Screen Icon */}
              <FontAwesomeIcon
                icon={faExpand}
                onClick={() => toggleFullScreen(renderRef)}
                className="absolute top-2 right-2 text-gray-700 hover:text-black cursor-pointer"
                style={{
                  fontSize: '24px', // Explicitly set the icon size
                  width: '24px', // Define width and height explicitly
                  height: '24px',
                  transition: 'none', // Prevent any transition during load
                  zIndex: 10, // Ensure it's on top
                }}
              />
              <ThreeDModelViewer modelPath={selectedModel.path} style={{ width: "100%", height: "100%" }} />

              {/* Author */}
              <p className="text-md text-gray-500 mt-2">Model Created By: {selectedModel.author}</p>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">{selectedModel.name}</h2>
                <p className="text-2xl font-semibold text-green-600">${selectedModel.price}</p>
                <p className="text-md text-gray-700">{selectedModel.description}</p>
              </div>

              {/* Buttons aligned at the bottom */}
              <div className="mt-auto space-x-4">
                <button className="bg-green-600 text-white px-6 py-3 rounded shadow">
                  Buy Now
                </button>
                <button className="bg-blue-500 px-6 py-3 rounded shadow">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Suggested Items Section */}
          <section className="mt-12">
            <h3 className="text-2xl font-semibold mb-6">Suggested Items</h3>
            <div className="grid grid-cols-3 gap-6">
              {suggestedModels.map((model, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <HoverableModelCard model={model} />
                  <div className="p-4">
                    <h4 className="text-lg font-semibold">
                      <Link href={`/productViewer/${encodeURIComponent(model.name.toLowerCase().replace(/\s/g, '%20').replace(/-/g, '_'))}`}>
                        {model.name}
                      </Link>
                    </h4>
                    <p className="text-green-600">${model.price}</p>
                    <button className="bg-blue-500 mt-4 px-4 py-2 rounded w-full">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
