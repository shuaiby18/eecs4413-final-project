"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";

export default function HomePage() {
  const banners = [{ type: "mp4", src: "/banners/banner_4.mp4" }];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prevBanner) => (prevBanner + 1) % banners.length);
    }, 15000); // Change banner every 15 seconds

    return () => clearInterval(interval); // Clear interval when component unmounts
  }, [banners.length]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Banner at the Top */}
      <div className="w-full mt-32">
        {banners[currentBanner].type === "gif" ? (
          <img
            src={banners[currentBanner].src}
            alt="Rotating Banner"
            className="w-full object-cover h-70"
          />
        ) : (
          <video
            src={banners[currentBanner].src}
            className="w-full object-cover h-70"
            autoPlay
            loop
            muted
          />
        )}
      </div>

      {/* Padding added below Navbar */}
      <div className="mt-4 w-full"></div>

      {/* First Row */}
      <div className="grid grid-cols-3 gap-4 mb-4 w-full px-4">
        <div className="col-span-1 bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">On Sale Right Now</h2>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {/* Item 1: Plane 4 Thumbnail */}
            <img
              src="/models/planes/planes-model4-thumbnail.png"
              alt="Plane 4 Thumbnail"
              className="object-cover h-32 w-full"
            />
            {/* Item 2: Car 9 Thumbnail */}
            <img
              src="/models/cars/cars-model9-thumbnail.png"
              alt="Car 9 Thumbnail"
              className="object-cover h-32 w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {/* Item 3: Animal 5 Thumbnail */}
            <img
              src="/models/animals/animals-model5-thumbnail.png"
              alt="Animal 5 Thumbnail"
              className="object-cover h-32 w-full"
            />
            {/* Item 4: Environment 5 Thumbnail */}
            <img
              src="/models/environments/environment-model5-thumbnail.png"
              alt="Environment 5 Thumbnail"
              className="object-cover h-32 w-full"
            />
          </div>
        </div>

        {/* New Arrivals Section */}
        <div className="col-span-1 bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">New Arrivals</h2>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {/* Item 1: Car 10 Thumbnail */}
            <img
              src="/models/cars/cars-model10-thumbnail.png"
              alt="Car 10 Thumbnail"
              className="object-cover h-32 w-full"
            />
            {/* Item 2: Grey Rhino Thumbnail */}
            <img
              src="/models/animals/animals-model8-thumbnail.png"
              alt="Grey Rhino Thumbnail"
              className="object-cover h-32 w-full"
            />
          </div>
        </div>


{/* Featured Artists Section */}
<div>
  <div className="col-span-1 bg-gray-100 p-4" style={{ height: "185px" }}>
    <h2 className="text-lg font-semibold">Featured Artists</h2>
    <div className="grid grid-cols-2 gap-4 mt-2 items-start">
      <div className="bg-white p-2 h-28">Item 1</div>
      <div className="bg-white p-2 h-28">Item 4</div>
    </div>
  </div>

  {/* New Section for "Have you logged in?" */}
  <div className="col-span-1 bg-gray-100 mt-4 p-4" style={{ width: "100%", maxWidth: "400px", height: "130px" }}>
    <h2 className="text-center font-semibold">Log-in to get the complete experience</h2>
    <div className="flex justify-center mt-2">
      <button className="bg-blue-500 text-white gap-4 py-2 px-4 rounded">
        Sign-In
      </button>
    </div>
  </div>
</div>



      </div>

      {/* Second Row */}
      <div className="grid grid-cols-3 gap-4 mb-4 w-full px-4">
        {/* Model of the Week: Car 4 Thumbnail */}
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Model of the Week</h2>
          <img
            src="/models/cars/cars-model4-thumbnail.png"
            alt="Car 4 Thumbnail"
            className="object-cover h-48 w-full"
          />
        </div>

        {/* Model of the Month: Animal 1 Thumbnail */}
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Model of the Month</h2>
          <img
            src="/models/animals/animals-model1-thumbnail.png"
            alt="Animal 1 Thumbnail"
            className="object-cover h-48 w-full"
          />
        </div>

        {/* Top Model of All Time: Car 5 Thumbnail */}
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Top Model of All Time</h2>
          <img
            src="/models/cars/cars-model5-thumbnail.png"
            alt="Car 5 Thumbnail"
            className="object-cover h-48 w-full"
          />
        </div>
      </div>

      {/* Your Most Viewed Items (Horizontal Scroll) */}
      <div className="w-full px-4 mb-4">
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Your Most Viewed Items</h2>
          <div className="flex overflow-x-auto space-x-8 mt-4 h-50">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="bg-white p-4 h-40 min-w-[180px]">
                Item {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full px-4 mb-4">
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-semibold">Recommended Items</h2>
          <div className="flex overflow-x-auto space-x-8 mt-4 h-50">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="bg-white p-4 h-40 min-w-[180px]">
                Item {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
