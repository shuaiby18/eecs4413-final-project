"use client";

import { trpc } from "@/server/client";
import Navbar from "@/components/ui/Navbar";
import ThreeDModelViewer from "@/components/ThreeDModelViewer"; // Import your 3D model viewer component
import { useRef } from 'react'; // Import useRef
import { useRouter } from 'next/navigation'; // Import useRouter

export default function ProductViewer({ params }: { params: { id: string } }) {
  const renderRef = useRef<HTMLDivElement | null>(null); // Reference for the render container
  const router = useRouter(); // Initialize the router for navigation

  const { data: model, refetch, isError, isLoading } = trpc.models.getModelById.useQuery({
    id: parseInt(params.id)
  });

  // Add to Cart mutation setup
  const addItemMutation = trpc.cart.addItem.useMutation({
    onSuccess: () => {
      console.log("Item added successfully");
    },
    onError: (error) => {
      console.error("Failed to add item", error);
    }
  });

  // Function to handle adding the item to the cart
  const handleAddToCart = async () => {
    if (!model) return; // Ensure the model is loaded

    try {
      console.log(`Attempting to add model with ID: ${model.id}`);
      await addItemMutation.mutateAsync({ productId: model.id });
      console.log("Item successfully added to cart");
      alert(`${model.name} has been added to your cart!`);
    } catch (error) {
      console.error("Failed to add item to cart", error);
    }
  };

  // Function to handle "Buy Now" functionality
  const handleBuyNow = async () => {
    if (!model) return; // Ensure the model is loaded

    try {
      console.log(`Attempting to add model with ID: ${model.id}`);
      await addItemMutation.mutateAsync({ productId: model.id });
      console.log("Item successfully added to cart");
      alert(`${model.name} has been added to your cart!`);
      router.push("/cart"); // Redirect to the shopping cart
    } catch (error) {
      console.error("Failed to add item to cart", error);
    }
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !model) {
    return <div>Error fetching model</div>;
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
              <ThreeDModelViewer modelPath={model.path} isHovered={false} onModelLoad={() => { }} />

              {/* Author */}
              <p className="text-md text-gray-500 mt-2">Model Created By: {model.author}</p>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">{model.name}</h2>
                <p className="text-2xl font-semibold text-green-600">${model.price}</p>
                <p className="text-md text-gray-700">{model.description}</p>
              </div>

              {/* Buttons Section */}
              <div className="flex space-x-4 mt-6">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600"
                  onClick={handleAddToCart}
                > 
                  Add to Cart
                </button>
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-600"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
