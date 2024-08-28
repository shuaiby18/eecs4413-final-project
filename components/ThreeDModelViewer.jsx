//Import react to use its suspense, useeffect, use state, useRef,and forward ref 
import React, { Suspense, useEffect, useState, useRef, forwardRef } from 'react';
//@react-three/fiber for rendering the 3D scenes in React
import { Canvas, useThree } from '@react-three/fiber';
//Allows for OrbitControls, parsing for GLTF files, use animations, and handle progress bars
import { OrbitControls, useGLTF, useAnimations, useProgress } from '@react-three/drei';
//Core libraries for rendering 3d objects 
import * as THREE from 'three';
import { renderToReadableStream } from 'next/dist/server/app-render/entry-base';

//This function is responsible for creating a gradient background color with multiple colors
function createMultiStopGradient(dominantColor) {
  //Determine all the dominant colors in the scene first
  const colorArray = dominantColor.match(/\d+/g).map(Number);

  //Based on the dominant color, we can simply find a color that is lighter than it
  const lighterColor = `rgba(${Math.min(colorArray[0] + 50, 255)}, ${Math.min(colorArray[1] + 50, 255)}, ${Math.min(colorArray[2] + 50, 255)}, 0.8)`;
  //Based on the dominant color, we can simply find a color that is darker than it
  const darkerColor = `rgba(${Math.max(colorArray[0] - 50, 0)}, ${Math.max(colorArray[1] - 50, 0)}, ${Math.max(colorArray[2] - 50, 0)}, 0.8)`;
  //Simply utilize the lighter color and the darker color in order to create a gradient, angle the gradient diagonally, each color will have different presentation percentage valuess
  return `linear-gradient(135deg, ${lighterColor} 0%, ${dominantColor} 50%, ${darkerColor} 100%)`;
}

//This function is responsbile for determining what is the dominant color in the model 
function getDominantColor(texture) {
  //Create a canvas element
  const canvas = document.createElement('canvas');
  //get the context of the canvas for 2d rendering
  const ctx = canvas.getContext('2d');
  //convert the texure into a 2d image
  const img = texture.image;
  //determine the width of the image
  canvas.width = img.width;
  //determine the height of the image
  canvas.height = img.height;
  //Place the image onto the canvas itself
  ctx.drawImage(img, 0, 0);

  //Retrive the pixel data based on the canvas
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  //initialize the red,green, and blue values to zero  
  let r = 0, g = 0, b = 0;
  //This total value will represent the total value of the the red green and blue values
  let total = 0;

  //Calculate the total value using a simple for loop
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    total++;
  }

  //Take the total value, and divide each individual color by the total value to see its ratio, take its floor value to avoid inconsistences
  r = Math.floor(r / total);
  g = Math.floor(g / total);
  b = Math.floor(b / total);

  //return the dominant color
  return `rgb(${r}, ${g}, ${b})`;
}

//This is the key functio nthat is responsbile for rendering the 3d model using GLTF format, all models are in GLTF for simplicity
function Model({ path, setBackgroundColor, onModelLoad }, ref) {
  //Determine the scene and the animations if they exist in the model
  const { scene, animations } = useGLTF(path);

  //Access the animations and scene by creating an action
  const { actions } = useAnimations(animations, scene);

  //Create a custom camera utilizing three JS
  const { camera } = useThree();

  useEffect(() => {
    //Crate a slightly diagonal model that is looking to the left and down by rotating it
    //Rotate the scene by the y axis by 30 degrees
    scene.rotation.y = THREE.MathUtils.degToRad(-30);
    //Rotate the scene by the x axis by 30 degrees
    scene.rotation.x = THREE.MathUtils.degToRad(10);

    //All models have their own bounding box based on their height and width,
    const box = new THREE.Box3().setFromObject(scene);
    //Determine the size of the bouding box
    const size = box.getSize(new THREE.Vector3());
    //Determine the center of the bounding box
    const center = box.getCenter(new THREE.Vector3());

    //Place the model in the center of the screen
    scene.position.sub(center);

    /*Responsible for calculating the position of the camera in relation to the model to make 
    sure all models look the same in terms of size when rendered */

    //Find the largest dimension of the bounding box size by using its x and y value
    const maxDim = Math.max(size.x, size.y, size.z);
    //This code will convert the fov to utilize radians 
    const fov = camera.fov * (Math.PI / 180);
    //Calculate the distance of the model to the camera itself utilizing the fov
    const dist = maxDim / (2 * Math.tan(fov / 2));

    //Responsible for moving the camera back from the model based on its distance by multipling it by a ratio
    camera.position.set(0, 0, dist * 1.3);
    //Move the camera so that it looks at the center of the model
    camera.lookAt(center);

    //Set the cameras near clipping plane based on its distance to the model by dividing it by a specific ratio
    camera.near = dist / 100;
    //Set the cameras far clipping plane based on its distance to the model by dividing it by a specific ratio
    camera.far = dist * 100;
    //Finally update the projection matrix of the camera based on its near and far settings as well as all the other settings above
    camera.updateProjectionMatrix();

    //If the model comes with an animation, then retrive its action and play the first animation (might make it to allow for multiple animation selections later)
    if (actions && animations.length > 0) {
      const firstAction = actions[Object.keys(actions)[0]];
      if (firstAction) {
        firstAction.play();
      }
    }
    //If the model loads successfully, then call the onModelLoad function with all the custom variables for the render
    if (onModelLoad) {
      onModelLoad();
    }
  }, [scene, camera, actions, animations, onModelLoad]);

  //This part of the code is responsible for applying shadows and updating the background of the render based on the models texture
  useEffect(() => {
    //Go through all the elements/children in the scene
    scene.traverse((child) => {
      //Make sure the mesh of the objet casts shadows in the scene and also is able to receive shadows
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        //Check if the model has a texture (models that do not have texture wont have background color (will fix later))
        if (child.material && child.material.map) {
          //Retrive the dominant color in the model
          const dominantColor = getDominantColor(child.material.map);
          //Retrieve the gradient color based on the dominant color
          const gradient = createMultiStopGradient(dominantColor);
          //Set the background color to the gradient
          setBackgroundColor(gradient);
        }
      }
    });
  }, [scene, setBackgroundColor]);
  //This will return the scene as a reference so that it can be used for rendering
  return <primitive ref={ref} object={scene} />;
}
//This is the forwarded model holding the reference
const ForwardedModel = forwardRef(Model);


export default function ThreeDModelViewer({ modelPath, isHovered, onModelLoad }) {
  const [backgroundColor, setBackgroundColor] = useState('#e0e0e0'); // Default background color

  const { progress, active } = useProgress();
  const [smoothProgress, setSmoothProgress] = useState(0); // Smooth progress state
  const [isLoading, setIsLoading] = useState(false); // Manual loading state for controlling the bar


  // Optionally, add an animation effect to the background
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Slightly adjust the background color periodically
      setBackgroundColor(prev => prev.includes('deg') ? prev : prev + 'deg'); // You can add more complex animation logic here
    }, 5000); // Adjust every 5 seconds (for example)

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  // Reset the loading state every time the model is hovered over
  useEffect(() => {
    if (isHovered) {
      setIsLoading(true);  // Show loading bar when hovered
    }
  }, [isHovered]);

  // Smooth progress animation
  useEffect(() => {
    let rafId;
    const animateProgress = () => {
      setSmoothProgress((prev) => {
        const diff = progress - prev;
        return prev + diff * 0.1; // Smooth animation by taking 10% of the difference
      });
      rafId = requestAnimationFrame(animateProgress);
    };
    animateProgress();

    return () => cancelAnimationFrame(rafId); // Clean up on unmount
  }, [progress]);

  // Hide loading bar when model is fully loaded
  const handleModelLoad = () => {
    setIsLoading(false);  // Model is loaded, stop showing the loading bar
    onModelLoad();  // Trigger the callback to indicate the model is loaded
  };

  return (
    <div style={{ height: '100%', zIndex: 2 }}>
      <Canvas
        shadows
        style={{
          height: '100%',
          width: '100%',
          background: backgroundColor, // Dynamic gradient background
          transition: 'background 2s ease-in-out', // Smooth transition effect for background changes
        }}
      >
        {/* Ambient Light for subtle overall illumination */}
        <ambientLight color={0xffffff} intensity={0.6} /> {/* Lowered slightly to make shadows more noticeable */}

        {/* SpotLight for strong shadow casting */}
        <spotLight
          color={0xffffff}
          intensity={6} // Stronger spotlight for sharper shadows
          position={[10, 15, 10]} // Positioned at an angle to cast visible shadows
          angle={Math.PI / 6}
          penumbra={0.3} // Reduced penumbra for sharper shadows
          castShadow
          shadow-bias={-0.001}
          shadow-camera-near={8}
          shadow-camera-far={50}
          shadow-mapSize-width={4096} // Higher resolution for even sharper shadows
          shadow-mapSize-height={4096}
        />

        {/* Directional Light for broader shadow casting */}
        <directionalLight
          color={0xffffff}
          intensity={5} // Stronger directional light to make shadows even more visible
          position={[-10, 20, 10]} // Positioned from another angle to cast different shadows
          castShadow
          shadow-bias={-0.001}
          shadow-camera-near={1}
          shadow-camera-far={50}
          shadow-camera-right={10}
          shadow-camera-left={-10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-mapSize-width={4096} // Higher resolution shadows for stronger definition
          shadow-mapSize-height={4096}
        />

        <Suspense fallback={null}>
          <ForwardedModel path={modelPath} setBackgroundColor={setBackgroundColor} onModelLoad={onModelLoad} />
        </Suspense>

        <OrbitControls />
      </Canvas>

      {(isLoading || (progress < 100 && active)) && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '5px', backgroundColor: '#ccc', zIndex: 10 }}>
          <div style={{ width: `${smoothProgress}%`, height: '100%', backgroundColor: '#e81a0c', transition: 'width 0.1s ease' }} />
        </div>
      )}

    </div>
  );
}
