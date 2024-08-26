"use client";

import { useParams } from 'next/navigation';
import Navbar from "@/components/ui/Navbar";
import ThreeDModelViewer from "@/components/ThreeDModelViewer";
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { trpc } from "@/server/client"; // Import trpc for cart operations

function HoverableModelCard({ model }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsModelLoaded(false);
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
      {isHovered && (
        <div className="absolute inset-0 w-full h-full">
          <ThreeDModelViewer
            modelPath={model.path}
            isHovered={isHovered}
            onModelLoad={() => setIsModelLoaded(true)}
          />
        </div>
      )}
      <img
        src={model.thumbnail}
        alt={model.name + " thumbnail"}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          zIndex: 1,
          pointerEvents: isModelLoaded ? 'none' : 'auto',
          opacity: !isModelLoaded || !isHovered ? 1 : 0,
          filter: isHovered && !isModelLoaded ? "brightness(70%)" : "brightness(100%)",
          transition: "opacity 0.5s ease, filter 0.3s ease",
        }}
      />
    </div>
  );
}

export default function ProductViewer() {
  const { name } = useParams();
  const renderRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [suggestedModels, setSuggestedModels] = useState([]);
  const [loading, setLoading] = useState(true);

  const addItemMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      alert(`${selectedModel.name} has been added to your cart!`);
    },
    onError: (error) => {
      console.error("Failed to add item", error);
    },
  });

  const handleAddToCart = async (modelId: number) => {
    try {
      await addItemMutation.mutateAsync({ productId: modelId });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const normalizedRouteName = decodeURIComponent(name)
    .replace(/_/g, '-')
    .replace(/%20/g, ' ');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch(`/api/models`);
        const models = await res.json();

        const matchedModel = models.find(
          (model) => model.name.toLowerCase() === normalizedRouteName.toLowerCase()
        );
        setSelectedModel(matchedModel);

        const relatedModels = models
          .filter(
            (model) =>
              model.category.name === matchedModel?.category.name &&
              model.name !== matchedModel?.name
          )
          .slice(0, 3);
        setSuggestedModels(relatedModels);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching models:', error);
        setLoading(false);
      }
    };

    fetchModels();
  }, [normalizedRouteName]);

  const toggleFullScreen = () => {
    if (renderRef.current) {
      if (renderRef.current.requestFullscreen) {
        renderRef.current.requestFullscreen();
      } else if (renderRef.current.webkitRequestFullscreen) {
        renderRef.current.webkitRequestFullscreen();
      } else if (renderRef.current.msRequestFullscreen) {
        renderRef.current.msRequestFullscreen();
      }
    }
  };

  if (loading) {
    return null;
  }

  if (!selectedModel) {
    return <div>Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto py-10 flex" style={{ paddingTop: "150px" }}>
        <main className="w-full">
          <div className="grid grid-cols-2 gap-8">
            <div ref={renderRef} style={{ position: "relative", width: "100%", height: "360px" }}>
              <FontAwesomeIcon
                icon={faExpand}
                onClick={() => toggleFullScreen(renderRef)}
                className="absolute top-2 right-2 text-gray-700 hover:text-black cursor-pointer"
                style={{
                  fontSize: '24px',
                  width: '24px',
                  height: '24px',
                  transition: 'none',
                  zIndex: 10,
                }}
              />
              <ThreeDModelViewer modelPath={selectedModel.path} style={{ width: "100%", height: "100%" }} />
              <p className="text-md text-gray-500 mt-2">Model Created By: {selectedModel.author}</p>
            </div>

            <div className="flex flex-col justify-between h-full">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">{selectedModel.name}</h2>
                <p className="text-2xl font-semibold text-green-600">${selectedModel.price}</p>
                <p className="text-md text-gray-700">{selectedModel.description}</p>
              </div>

              <div className="mt-auto space-x-4">
                <button className="bg-green-600 text-white px-6 py-3 rounded shadow">
                  Buy Now
                </button>
                <button
                  className="bg-blue-500 text-white px-6 py-3 rounded shadow"
                  onClick={() => handleAddToCart(selectedModel.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

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
                    <button
                      className="bg-blue-500 mt-4 px-4 py-2 rounded w-full"
                      onClick={() => handleAddToCart(model.id)}
                    >
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
