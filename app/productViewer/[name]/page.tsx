"use client";

import { useParams } from 'next/navigation';
import Navbar from "@/components/ui/Navbar";
import ThreeDModelViewer from "@/components/ThreeDModelViewer"; // Import your 3D model viewer component
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState, useEffect} from 'react'; // Import useRef
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const models = [
  { name: "Messerschmitt Bf-109 - Chicken Gun Plane", path: "/models/planes/planes-model1.glb", thumbnail: "/models/planes/planes-model1-thumbnail.png", price: '25.99', author: { displayName: 'amogusstrikesback2' }, category: "planes", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Chernovan Nemesis Plane", path: "/models/planes/planes-model2.glb", thumbnail: "/models/planes/planes-model2-thumbnail.png", price: '29.99', author: { displayName: 'Swiss_Fox'}, category: "planes", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency." },
  { name: "Cessna 172 Plane", path: "/models/planes/planes-model3.glb", thumbnail: "/models/planes/planes-model3-thumbnail.png", price: '24.99', author: { displayName: 'osmosikum' }, category: "planes", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."  },
  { name: "1932 Gee Bee Model R-2 Plane", path: "/models/planes/planes-model4.glb", thumbnail: "/models/planes/planes-model4-thumbnail.png", price: '23.99', author: { displayName: 'Ruu' }, category: "planes", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency." },
  { name: "1914 Stahltaube Pigeon Hole Plane", path: "/models/planes/planes-model5.glb", thumbnail: "/models/planes/planes-model5-thumbnail.png", price: '21.99', author: { displayName: 'Tijmen Matthys'}, category: "planes", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency." },
  { name: "Airco DH9A WW1 Plane", path: "/models/planes/planes-model6.glb", thumbnail: "/models/planes/planes-model6-thumbnail.png", price: '29.99', author: { displayName: 'Cleuza Costa' }, category: "planes", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency." },
  { name: "Sopwith Dolphin Plane", path: "/models/planes/planes-model7.glb", thumbnail: "/models/planes/planes-model7-thumbnail.png", price: '25.99', author: { displayName: 'Mathias Tossens' }, category: "planes", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency." },
  { name: "Polygonal Toy Plane", path: "/models/planes/planes-model8.glb", thumbnail: "/models/planes/planes-model8-thumbnail.png", price: '24.99', author: { displayName: 'arifaydn99' }, category: "planes", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency." },
  { name: "Aves Transporter Engine", path: "/models/planes/planes-model9.glb", thumbnail: "/models/planes/planes-model9-thumbnail.png", price: '24.99', author: { displayName: 'VertaScan' }, category: "planes", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency." },

  { name: "Medieval Fantasy Book", path: "/models/environments/environment-model1.glb", thumbnail: "/models/environments/environment-model1-thumbnail.png", price: '39.99', author: { displayName: 'Pixel' }, category: "environments", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Baba Yaga's Hut", path: "/models/environments/environment-model2.glb", thumbnail: "/models/environments/environment-model2-thumbnail.png", price: '39.99', author: { displayName: 'Inuciian' }, category: "environments", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Winter Medieval Fantasy Tavern", path: "/models/environments/environment-model3.glb", thumbnail: "/models/environments/environment-model3-thumbnail.png", price: '38.99', author: { displayName: 'Rixael' }, category: "environments", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Amusement Park Island", path: "/models/environments/environment-model4.glb", thumbnail: "/models/environments/environment-model4-thumbnail.png", price: '35.99', author: { displayName: 'Omid Saadat' }, category: "environments", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Medieval Fantasy Tavern", path: "/models/environments/environment-model5.glb", thumbnail: "/models/environments/environment-model5-thumbnail.png", price: '34.99', author: { displayName: 'Rixael' }, category: "environments", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Fantasy Town", path: "/models/environments/environment-model6.glb", thumbnail: "/models/environments/environment-model6-thumbnail.png", price: '31.99', author: { displayName: 'arturhorn' }, category: "environments", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Village Project: Watermill", path: "/models/environments/environment-model7.glb", thumbnail: "/models/environments/environment-model7-thumbnail.png", price: '38.99', author: { displayName: 'Callum Steel' }, category: "environments", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Lighthouse at Portal Crossroads", path: "/models/environments/environment-model8.glb", thumbnail: "/models/environments/environment-model8-thumbnail.png", price: '36.99', author: { displayName: 'Nortenko Dmytro' }, category: "environments", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Taksim Tunel", path: "/models/environments/environment-model9.glb", thumbnail: "/models/environments/environment-model9-thumbnail.png", price: '35.99', author: { displayName: 'Gürkan GÜRBÜZ' }, category: "environments", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},

  { name: "Lamborghini Centenario LP-770 Baby Blue SDC", path: "/models/cars/cars-model1.glb", thumbnail: "/models/cars/cars-model1-thumbnail.png", price: '29.99', author: { displayName: 'SDC PERFORMANCE' }, category: "cars", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Porsche 917 Living Legend 2013", path: "/models/cars/cars-model2.glb", thumbnail: "/models/cars/cars-model2-thumbnail.png", price: '35.99', author: { displayName: 'kevin (ケビン)' }, category: "cars", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Lotus Exige 240", path: "/models/cars/cars-model3.glb", thumbnail: "/models/cars/cars-model3-thumbnail.png", price: '34.99', author: { displayName: 'D3DARTM' }, category: "cars", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Lamborghini Aventador SVJ - SC20 EDITION", path: "/models/cars/cars-model4.glb", thumbnail: "/models/cars/cars-model4-thumbnail.png", price: '36.99', author: { displayName: 'SDC PERFORMANCE' }, category: "cars", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "McLaren Spider", path: "/models/cars/cars-model5.glb", thumbnail: "/models/cars/cars-model5-thumbnail.png", price: '34.99', author: { displayName: 'SINNIK' }, category: "cars", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "F1 2021 McLaren MCL35M", path: "/models/cars/cars-model6.glb", thumbnail: "/models/cars/cars-model6-thumbnail.png", price: '32.99', author: { displayName: 'Excalibur' }, category: "cars", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Hennessey Venom F5 2021", path: "/models/cars/cars-model7.glb", thumbnail: "/models/cars/cars-model7-thumbnail.png", price: '36.99', author: { displayName: 'kevin (ケビン)' }, category: "cars", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Porsche Mission E", path: "/models/cars/cars-model8.glb", thumbnail: "/models/cars/cars-model8-thumbnail.png", price: '39.99', author: { displayName: 'kevin (ケビン)' }, category: "cars", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Vision 1789 | 2021", path: "/models/cars/cars-model9.glb", thumbnail: "/models/cars/cars-model9-thumbnail.png", price: '35.99', author: { displayName: 'kevin (ケビン)' }, category: "cars", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Peugeot 9x8 Hypercar", path: "/models/cars/cars-model10.glb", thumbnail: "/models/cars/cars-model10-thumbnail.png", price: '39.99', author: { displayName: 'kilianhoffmann13' }, category: "cars", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency." },

  { name: "Orange Bird", path: "/models/animals/animals-model1.glb", thumbnail: "/models/animals/animals-model1-thumbnail.png", price: '19.99', author: { displayName: 'Wen Yeh' }, category: "animals", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Raccoon", path: "/models/animals/animals-model2.glb", thumbnail: "/models/animals/animals-model2-thumbnail.png", price: '14.99', author: { displayName: 'Santrez' }, category: "animals", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Duck Quick Quack", path: "/models/animals/animals-model3.glb", thumbnail: "/models/animals/animals-model3-thumbnail.png", price: '18.99', author: { displayName: 'pepetrincado' }, category: "animals", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Dancing Penguin", path: "/models/animals/animals-model4.glb", thumbnail: "/models/animals/animals-model4-thumbnail.png", price: '17.99', author: { displayName: 'twilighthall83' }, category: "animals", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Zebra", path: "/models/animals/animals-model5.glb", thumbnail: "/models/animals/animals-model5-thumbnail.png", price: '19.99', author: { displayName: 'kenchoo' }, category: "animals", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Labrador Dog", path: "/models/animals/animals-model6.glb", thumbnail: "/models/animals/animals-model6-thumbnail.png", price: '18.99', author: { displayName: 'kenchoo' }, category: "animals", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Bicolor Cat", path: "/models/animals/animals-model7.glb", thumbnail: "/models/animals/animals-model7-thumbnail.png", price: '16.99', author: { displayName: 'kenchoo' }, category: "animals", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: " Grey Rhino", path: "/models/animals/animals-model8.glb", thumbnail: "/models/animals/animals-model8-thumbnail.png", price: '21.99', author: { displayName: 'LasquetiSpice' }, category: "animals", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Giraffe", path: "/models/animals/animals-model9.glb", thumbnail: "/models/animals/animals-model9-thumbnail.png", price: '19.99', author: { displayName: 'Amx360' }, category: "animals", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},

  { name: "Son Goku - Dragon Ball Z", path: "/models/characters/character-model1.glb", thumbnail: "/models/characters/character-model1-thumbnail.png", price: '29.99', author: { displayName: 'Kari' }, category: "characters", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Monkey D. Luffy - Once Piece", path: "/models/characters/character-model2.glb", thumbnail: "/models/characters/character-model2-thumbnail.png", price: '35.99', author: { displayName: 'nitwit.friends' }, category: "characters", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Naruto Uzumaki - Naruto Shippuden", path: "/models/characters/character-model3.glb", thumbnail: "/models/characters/character-model3-thumbnail.png", price: '25.99', author: { displayName: 'ronildo.facanha' }, category: "characters", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Kakashi Hatake - Naruto Shippuden", path: "/models/characters/character-model4.glb", thumbnail: "/models/characters/character-model4-thumbnail.png", price: '39.99', author: { displayName: 'minhdoan' }, category: "characters", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Prince Vegeta", path: "/models/characters/character-model5.glb", thumbnail: "/models/characters/character-model5-thumbnail.png", price: '34.99', author: { displayName: 'schischu' }, category: "characters", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Saitama - One Punch Man", path: "/models/characters/character-model6.glb", thumbnail: "/models/characters/character-model6-thumbnail.png", price: '36.99', author: { displayName: 'MMKH' }, category: "characters", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Ash Ketchum - Pokemon", path: "/models/characters/character-model7.glb", thumbnail: "/models/characters/character-model7-thumbnail.png", price: '34.99', author: { displayName: 'Pablo Iglesias Diéguez' }, category: "characters", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Tanjiro Kamado - Demon Slayer", path: "/models/characters/character-model8.glb", thumbnail: "/models/characters/character-model8-thumbnail.png", price: '49.99', author: { displayName: 'K-' }, category: "characters", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
  { name: "Ichigo Kurosaki - Bleach", path: "/models/characters/character-model9.glb", thumbnail: "/models/characters/character-model9-thumbnail.png", price: '24.99', author: { displayName: 'mikomagallona' }, category: "characters", description: "This is a beautifully crafted 3D model. Suitable for a variety of use cases such as games, simulations, or creative projects. The model is detailed and optimized for performance, ensuring a balance between visual fidelity and runtime efficiency."},
];

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

  const { name } = useParams(); // Access the dynamic route parameter 'name'
  const renderRef = useRef(null); // Reference for the render container

  // Normalize the name from the URL
  const normalizedRouteName = decodeURIComponent(name)
    .replace(/_/g, '-')  // Convert underscores back to dashes
    .replace(/%20/g, ' ');  // Convert '%20' back to spaces
  
  // Find the model that matches the selected product
  const selectedModel = models.find((model) => model.name.toLowerCase() === normalizedRouteName.toLowerCase());
  
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
              <p className="text-md text-gray-500 mt-2">Model Created By: {selectedModel.author.displayName}</p>
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
              {/* Filter models from the same category as the selected model */}
              {models
                .filter(model => model.category === selectedModel.category && model.name !== selectedModel.name)
                .slice(0, 3) // Limit to 3 models
                .map((model, index) => (
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