"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from "@/server/client";

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

  const handleSignInClick = () => {
    router.push('/login');
  };

  const banners = ["/banners/banner_5.mp4"];
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prevBanner) => (prevBanner + 1) % banners.length);
    }, 15000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const { data: models, refetch, isError, isFetched } = trpc.models.getAllModels.useQuery()

  if (!isFetched) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <Navbar />
        <h1 className="text-4xl">Loading...</h1>
      </main>
    );
  }

  if (isError || !models) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <Navbar />
        <h1 className="text-4xl">An error occurred while fetching the models.</h1>
      </main>
    );
  }

  const getModel = (index: number) => models[index - 1]; // Adjust for zero-based array index

  const generateProductUrl = (model: Model) => {
    return `/productViewer/${encodeURIComponent(model.name.toLowerCase().replace(/\s/g, '%20').replace(/-/g, '_'))}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Banner at the Top */}
      <div className="w-full mt-32">
        <video
          src={banners[currentBanner]}
          className="w-full object-cover h-70 fade-out"
          autoPlay
          loop
          muted
        />
      </div>


      {/* Padding added below Navbar */}
      <div className="mt-4 w-full"></div>

      {/* First Row */}
      <div className="grid grid-cols-3 gap-4 mb-4 w-full px-4">
        {/* On Sale Right Now Section */}
        <div className="col-span-1 bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">On Sale Right Now</h2>
          <div className="grid grid-cols-2 gap-2 mt-2">
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
                  alt="Kevin (ケビン)"
                  className="object-cover h-32 w-32 rounded-full"
                />
                <p className="mt-2 text-center font-semibold">Kenchoo</p>
              </div>
            </div>
          </div>

          {/* New Section for "Have you logged in?" */}
          <div className="col-span-1 bg-gray-100 mt-4 p-4" style={{ width: "100%", height: "170px" }}>
            <h2 className="text-center font-semibold text-lg text-gray-800">Make sure to log-in to get the complete experience!</h2>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSignInClick}
                className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition transform hover:-translate-y-1 hover:bg-blue-600"
              >
                Sign-In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row */}
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

      {/* Your Most Viewed Items (Horizontal Scroll) */}
      <div className="w-full px-4 mb-4">
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Your Most Viewed Items</h2>
          <div className="flex justify-center overflow-x-auto space-x-8 mt-4 h-50">
            {models.slice(9, 14).map((model, index) => (
              <Link href={generateProductUrl(model)} key={index}>
                <img
                  src={model.thumbnail}
                  alt={model.name}
                  className="object-cover h-40 w-auto cursor-pointer"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Items */}
      <div className="w-full px-4 mb-4">
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Recommended Items</h2>
          <div className="flex justify-center overflow-x-auto space-x-8 mt-4 h-50">
            {models.slice(14, 19).map((model, index) => (
              <Link href={generateProductUrl(model)} key={index}>
                <img
                  src={model.thumbnail}
                  alt={model.name}
                  className="object-cover h-40 w-auto cursor-pointer"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}
