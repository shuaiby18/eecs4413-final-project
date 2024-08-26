"use client";

import { trpc } from "@/server/client";
import Navbar from "@/components/ui/Navbar";
import ThreeDModelViewer from "@/components/ThreeDModelViewer"; // Import your 3D model viewer component
import { useRef } from 'react'; // Import useRef

export default function ProductViewer({ params }: { params: { id: string } }) {
  const renderRef = useRef<HTMLDivElement | null>(null); // Reference for the render container

  const { data: model, refetch, isError, isLoading } = trpc.models.getModelById.useQuery({
    id: parseInt(params.id)
  })

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
              <ThreeDModelViewer modelPath={model.path} isHovered={false} onModelLoad={() => {}} />

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
        </main>
      </div>
    </div>
  );
}
