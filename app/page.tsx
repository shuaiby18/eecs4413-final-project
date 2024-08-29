"use client";

// Import necessary hooks, components, and libraries
import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from "@/server/client";
import { useSession } from "next-auth/react";

// Establish the Model interface
interface Model {
  path: string;
  name: string;
  id: number;
  description: string | null;
  category: {
    name: string;
    id: number;
  };
  price: number;
  author: string;
  categoryId: number;
  thumbnail: string;
}

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // Router for home page sign in (separate from navbar sign in)
  const handleSignInClick = () => {
    router.push('/login');
  };

  // Array of banner URLs
  const banners = ["/banners/banner_6.mp4"];
  const [currentBanner, setCurrentBanner] = useState(0);

  // Cycle through different banners every 15 seconds or so
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prevBanner) => (prevBanner + 1) % banners.length);
    }, 15000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Fetch all models utilizing TRPC queries
  const { data: models, refetch, isError, isFetched } = trpc.models.getAllModels.useQuery()

  // Display loading when fetching data
  if (!isFetched) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <Navbar />
        <h1 className="text-4xl">Loading...</h1>
      </main>
    );
  }

  // Display error message if fetching failed
  if (isError || !models) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <Navbar />
        <h1 className="text-4xl">An error occurred while fetching the models.</h1>
      </main>
    );
  }

  // Retrieve model based on index 
  const getModel = (index: number) => models[index - 1]; 

  // Generate product URL based on the model ID
  const generateProductUrl = (model: Model) => {
    return `/productViewer/${model.id}`;
  };

  // Render HTML for home page
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Banner section at top of home page */}
      <div className="w-full mt-28">
        <video
          src={banners[currentBanner]}
          className="w-full object-cover h-70 fade-out"
          autoPlay
          loop
          muted
        />
      </div>

      <div className="mt-4 w-full"></div>

      {/* First Row will contain the sales items, new arrivals, and featured artists  */}
      <div className="grid grid-cols-3 gap-4 mb-4 w-full px-4">
        {/* On Sale Right Now Section */}
        <div className="col-span-1 bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">On Sale Right Now</h2>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {/* Sale section will display model 1, 4, 32, and 16 */}
            {getModel(1) && (
              <Link href={generateProductUrl(getModel(1))}>
                <img
                  src={getModel(1).thumbnail}
                  alt={getModel(1).name}
                  className="object-cover h-40 w-full cursor-pointer"
                />
              </Link>
            )}
            {getModel(4) && (
              <Link href={generateProductUrl(getModel(4))}>
                <img
                  src={getModel(4).thumbnail}
                  alt={getModel(4).name}
                  className="object-cover h-40 w-full cursor-pointer"
                />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {getModel(32) && (
              <Link href={generateProductUrl(getModel(32))}>
                <img
                  src={getModel(32).thumbnail}
                  alt={getModel(32).name}
                  className="object-cover h-40 w-full cursor-pointer"
                />
              </Link>
            )}
            {getModel(16) && (
              <Link href={generateProductUrl(getModel(16))}>
                <img
                  src={getModel(16).thumbnail}
                  alt={getModel(16).name}
                  className="object-cover h-40 w-full cursor-pointer"
                />
              </Link>
            )}
          </div>
        </div>

        {/* New Arrivals Section */}
        <div className="col-span-1 bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">New Arrivals This Week</h2>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {/* New arrivals section will display model 25 and 4 */}
            {getModel(25) && (
              <Link href={generateProductUrl(getModel(25))}>
                <img
                  src={getModel(25).thumbnail}
                  alt={getModel(25).name}
                  className="object-cover h-40 w-full cursor-pointer"
                />
              </Link>
            )}
            {getModel(4) && (
              <Link href={generateProductUrl(getModel(4))}>
                <img
                  src={getModel(4).thumbnail}
                  alt={getModel(4).name}
                  className="object-cover h-40 w-full cursor-pointer"
                />
              </Link>
            )}
          </div>
        </div>

        {/* Featured Artists Section */}
        <div>
          {/* This section will display the artists that have the most models deployed on the site */}
          <div className="col-span-1 bg-gray-100 p-4" style={{ height: "210px" }}>
            <h2 className="text-lg font-semibold">Featured Artists</h2>
            <div className="grid grid-cols-2 gap-4 mt-2 items-start">
              {/* Author 1: Kevin (ケビン) */}
              <div className="flex flex-col items-center">
                <img
                  src="/profile-pictures/author-1.png"
                  alt="Kevin (ケビン)"
                  className="object-cover h-32 w-32 rounded-full"
                />
                <p className="mt-2 text-center font-semibold">Kevin (ケビン)</p>
              </div>

              {/* Author 2: Kenchoo */}
              <div className="flex flex-col items-center">
                <img
                  src="/profile-pictures/author-2.jpg"
                  alt="Kenchoo"
                  className="object-cover h-32 w-32 rounded-full"
                />
                <p className="mt-2 text-center font-semibold">Kenchoo</p>
              </div>
            </div>
          </div>

          {/* Dynamic have you logged in section to greet user by role*/}
          <div className="col-span-1 bg-gray-100 mt-4 p-4" style={{ width: "100%", height: "170px" }}>
            {session ? (
              <div className="text-center">
                <h2 className="font-semibold text-lg text-gray-800">Welcome, {session.user?.name}!</h2>
                <p className="mt-2 text-gray-600">Make sure to check out our catalogue or your order history!</p>
                {session.user?.role === "ADMIN" && (
                  <p className="mt-2 text-gray-600">As an admin, check out the admin panel to see order history of all users and modify their roles.</p>
                )}
              </div>
            ) : (
              <div className="text-center">
                <h2 className="font-semibold text-lg text-gray-800">Make sure to log-in to get the complete experience!</h2>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleSignInClick}
                    className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition transform hover:-translate-y-1 hover:bg-blue-600"
                  >
                    Sign-In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row will contain models of the week, month, and all time based on the number of purchases made */}
      <div className="grid grid-cols-3 gap-4 mb-4 w-full px-4">
        {/* Model of the Week */}
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Model of the Week</h2>
          {getModel(22) && (
            <Link href={generateProductUrl(getModel(22))}>
              <img
                src={getModel(22).thumbnail}
                alt={getModel(22).name}
                className="object-cover h-64 w-full cursor-pointer"
              />
            </Link>
          )}
        </div>

        {/* Model of the Month */}
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Model of the Month</h2>
          {getModel(29) && (
            <Link href={generateProductUrl(getModel(29))}>
              <img
                src={getModel(29).thumbnail}
                alt={getModel(29).name}
                className="object-cover h-64 w-full cursor-pointer"
              />
            </Link>
          )}
        </div>

        {/* Top Model of All Time */}
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Top Model of All Time</h2>
          {getModel(23) && (
            <Link href={generateProductUrl(getModel(23))}>
              <img
                src={getModel(23).thumbnail}
                alt={getModel(23).name}
                className="object-cover h-64 w-full cursor-pointer"
              />
            </Link>
          )}
        </div>
      </div>

      {/* Your Most Viewed Items (Horizontal Scroll) will be dependent on what items that user has visited the most */}
      <div className="w-full px-4 mb-4">
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Your Most Viewed Items</h2>
          <div className="flex justify-center overflow-x-auto space-x-8 mt-4 h-50">
            {models.slice(9, 14).map((model, index) => (
              <Link href={generateProductUrl(model)} key={index}>
                <img
                  src={model.thumbnail}
                  alt={model.name}
                  className="object-cover h-50 w-auto cursor-pointer"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Items will be dependent on what items that user might be interested based on categories visited */}
      <div className="w-full px-4 mb-4">
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Recommended Items</h2>
          <div className="flex justify-center overflow-x-auto space-x-8 mt-4 h-50">
            {models.slice(14, 19).map((model, index) => (
              <Link href={generateProductUrl(model)} key={index}>
                <img
                  src={model.thumbnail}
                  alt={model.name}
                  className="object-cover h-50 w-auto cursor-pointer"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}
