//To be used by the client side
"use client";
//Import trpc, router for navigation, navbar component, and 3d render that was created
import { trpc } from "@/server/client";
import Navbar from "@/components/ui/Navbar";
import ThreeDModelViewer from "@/components/ThreeDModelViewer"; 
import { useRef } from 'react'; // Import useRef
import { useRouter } from 'next/navigation'; // Import useRouter

export default function ProductViewer({ params }: { params: { id: string } }) {
  // Thisis a reference for 3D render container
  const renderRef = useRef<HTMLDivElement | null>(null); 

  //create router for navigattion
  const router = useRouter(); 

  //fetch the models by their id number
  const { data: model, refetch, isError, isLoading } = trpc.models.getModelById.useQuery({
    id: parseInt(params.id)
  });

  //mutation call to add item to cart
  const addItemMutation = trpc.cart.addItem.useMutation({
    //show success on success
    onSuccess: () => {
      console.log("Item added successfully");
    },
    //show error on error
    onError: (error) => {
      console.error("Failed to add item", error);
    }
  });

  // Function to handle adding the item to the cart
  const handleAddToCart = async () => {
    //If the model is not loaded then just return
    if (!model) return; 

    try {
      //use the model to try adding
      console.log(`Attempting to add model with ID: ${model.id}`);
      //wait for the mutation call
      await addItemMutation.mutateAsync({ productId: model.id });
      console.log("Item successfully added to cart");
      //notify user an item has been added
      alert(`${model.name} has been added to your cart!`);
    } catch (error) {
      //display error if item could not be added
      console.error("Failed to add item to cart", error);
    }
  };

  //function call for buying an item directly that will route you to the cartt pagee
  const handleBuyNow = async () => {
    // If model is not loaded then just return
    if (!model) return; 

    try {
      console.log(`Attempting to add model with ID: ${model.id}`);
      //mutation call to add model
      await addItemMutation.mutateAsync({ productId: model.id });
      console.log("Item successfully added to cart");
      alert(`${model.name} has been added to your cart!`);
      // Move toe shopping cart
      router.push("/cart"); 
    } catch (error) {
      console.error("Failed to add item to cart", error);
    }
  };

  //display loading if in loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  //display error if in error state
  if (isError || !model) {
    return <div>Error fetching model</div>;
  }

  //html render for product viewer
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Display navigation bar at the top */}
      <Navbar />

      <div className="container mx-auto py-10 flex" style={{ paddingTop: "150px" }}>
        {/* Product Viewer */}
        <main className="w-full">
          <div className="grid grid-cols-2 gap-8">
            {/*Create a reference to the render view and its size*/}
            <div ref={renderRef} style={{ position: "relative", width: "100%", height: "360px" }}>
              {/* Call the ThreeDModelViewer using the model pathway and the onModelLoad function call */}
              <ThreeDModelViewer modelPath={model.path} isHovered={false} onModelLoad={() => { }} />

              {/*Author */}
              <p className="text-md text-gray-500 mt-2">Model Created By: {model.author}</p>
            </div>

            {/*Product Details */}
            <div className="flex flex-col justify-between h-full">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">{model.name}</h2>
                <p className="text-2xl font-semibold text-green-600">${model.price}</p>
                <p className="text-md text-gray-700">{model.description}</p>
              </div>

              {/*Buttons Section */}
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
