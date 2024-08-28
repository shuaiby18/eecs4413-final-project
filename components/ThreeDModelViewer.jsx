import React, { Suspense, useEffect, useState, useRef, forwardRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, useProgress } from '@react-three/drei';
import * as THREE from 'three';

// Generate a multi-stop gradient with color interpolation
function createMultiStopGradient(dominantColor) {
  const colorArray = dominantColor.match(/\d+/g).map(Number);

  // Generate complementary and analogous colors for a more dynamic gradient
  const lighterColor = `rgba(${Math.min(colorArray[0] + 50, 255)}, ${Math.min(colorArray[1] + 50, 255)}, ${Math.min(colorArray[2] + 50, 255)}, 0.8)`;
  const darkerColor = `rgba(${Math.max(colorArray[0] - 50, 0)}, ${Math.max(colorArray[1] - 50, 0)}, ${Math.max(colorArray[2] - 50, 0)}, 0.8)`;

  // Create a more dynamic multi-stop gradient
  return `linear-gradient(135deg, ${lighterColor} 0%, ${dominantColor} 50%, ${darkerColor} 100%)`;
}

// Extract the dominant color from the texture
function getDominantColor(texture) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = texture.image;

  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the texture to the canvas
  ctx.drawImage(img, 0, 0);

  // Get pixel data
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  let r = 0, g = 0, b = 0;
  let total = 0;

  // Average the color of all pixels
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    total++;
  }

  // Calculate the average color
  r = Math.floor(r / total);
  g = Math.floor(g / total);
  b = Math.floor(b / total);

  return `rgb(${r}, ${g}, ${b})`;
}

function Model({ path, setBackgroundColor, onModelLoad }, ref) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);
  const { camera } = useThree();

  useEffect(() => {
    // Apply the rotation first
    scene.rotation.y = THREE.MathUtils.degToRad(-30);
    scene.rotation.x = THREE.MathUtils.degToRad(10);

    // Now compute the bounding box after the rotation
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Re-center the scene
    scene.position.sub(center);

    // Calculate the new camera position
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const dist = maxDim / (2 * Math.tan(fov / 2));

    camera.position.set(0, 0, dist * 1.3);
    camera.lookAt(center);

    // Adjust the camera's near and far clipping planes
    camera.near = dist / 100;
    camera.far = dist * 100;
    camera.updateProjectionMatrix();

    // Play the first animation if it exists
    if (actions && animations.length > 0) {
      const firstAction = actions[Object.keys(actions)[0]];
      if (firstAction) {
        firstAction.play();
      }
    }
    if (onModelLoad) {
      onModelLoad();
    }
  }, [scene, camera, actions, animations, onModelLoad]);

  // Ensure all meshes in the model cast and receive shadows
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Check if the mesh has a texture, and calculate the dominant color if it does
        if (child.material && child.material.map) {
          const dominantColor = getDominantColor(child.material.map);
          const gradient = createMultiStopGradient(dominantColor);
          setBackgroundColor(gradient);
        }
      }
    });
  }, [scene, setBackgroundColor]);

  return <primitive ref={ref} object={scene} />;
}

const ForwardedModel = forwardRef(Model);

//This is the component that will render the 3d model, utilizing features such as dynamic background color and such
export default function ThreeDModelViewer({ modelPath, isHovered, onModelLoad }) {
  //Background color is initalized to a default grey as its neutral, else will use a customer gradient background if the model has a texture
  const [backgroundColor, setBackgroundColor] = useState('#e0e0e0'); 

  //This is responsible for getting the models loading progress
  const { progress, active } = useProgress();

  //This will smooth out the loading bar progress state so that it doesnt look jarring 
  const [smoothProgress, setSmoothProgress] = useState(0); 

  //Used to control visibility of the loading bar
  const [isLoading, setIsLoading] = useState(false); 


  //Effect to animate the background
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Slightly adjust the background color so that it takes five seconds, simply move the degree of the gradient
      setBackgroundColor(prev => prev.includes('deg') ? prev : prev + 'deg'); 
    }, 5000); 

    //Clean up the interval timing for the animation
    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  // Reset  loading state every time the model is hovered on (this will ensure swapping out between thumbnail and model)
  useEffect(() => {
    //When a model is hovered, show the loading bar
    if (isHovered) {
      setIsLoading(true);  
    }
  }, [isHovered]);

  //This code will smoth out the loading bar animation
  useEffect(() => {
    let rafId;
    const animateProgress = () => {
      setSmoothProgress((prev) => {
        const diff = progress - prev;
        //Difference will be accounted for 10% of changes, so the loading bar doesnt snap its progress but goes more gradually
        return prev + diff * 0.1;
      });
      rafId = requestAnimationFrame(animateProgress);
    };
    animateProgress();

    //After animation is loaded, then you can cancel out the animation
    return () => cancelAnimationFrame(rafId); 
  }, [progress]);

  // Hide loading bar when model is fully loaded
  const handleModelLoad = () => {
    setIsLoading(false);  
    //execute the onModelLoad function call
    onModelLoad();  
  };

  return (
    //Create a container for the 3d model so that it displays with full height, as well as a z-index
    <div style={{ height: '100%', zIndex: 2 }}>
      {/* create canvas component */}
      <Canvas
      // enable shadow rendering
        shadows 
        style={{
          //Allow the height and width of the container convas to be full
          height: '100%', 
          width: '100%',
          //Set the background based on the backgroundColor
          //background: backgroundColor, 
          //Simple background transition effect 
          transition: 'background 2s ease-in-out',
        }}
      >
        {/* This will create an ambient light in the setting so that everything is lit by itself  */}
        <ambientLight color={0xffffff} intensity={0.6} />

        {/* SpotLight for strong shadow casting on the scene, not visible to the user */}
        <spotLight
          color={0xffffff}
          intensity={6} // Stronger spotlight for sharper shadows
          position={[10, 15, 10]} // Positioned at an angle to cast visible shadows based on all models in the website
          angle={Math.PI / 6} //This will create a cone shape for the spotlight making it more like sunlight
          penumbra={0.3} // Reduced penumbra of the shadows for sharper shadows, less distrbuted
          castShadow //enabes this light source to cast shadows
          shadow-bias={-0.001} //reduce the artificats that the shadows will cause
          shadow-camera-near={8} //this will make the shadows not clip when the camera is near
          shadow-camera-far={50} //this will make the shadows not clip when the camera is far
          shadow-mapSize-width={4096} //Because models are only singular, make the shadows 4k 
          shadow-mapSize-height={4096} 
        />

        {/* Directional Light similar to how sunlight works on a model */}
        <directionalLight
          color={0xffffff}
          intensity={5} // Stronger directional light to make shadows even more visible
          position={[-10, 20, 10]} //Positioned from another angle to cast different shadows
          castShadow //allow this light source to cast shadows
          shadow-bias={-0.001} //reduce the artificats that the shadows will cause
          shadow-camera-near={1} //shadow clipping for when camera is near
          shadow-camera-far={50} //shadow clippping for when camera is far
          shadow-camera-right={10} //shadow clipping for when the camera is more towards the right
          shadow-camera-left={-10} //shadow clipping for when the camera is more towards the left
          shadow-camera-top={10} //shadow clipping for whe nthe camera is on the top
          shadow-camera-bottom={-10} //shadow clipping for when the camera is on the bottom
          shadow-mapSize-width={4096} //Because models are only singular, make the shadows 4k 
          shadow-mapSize-height={4096}
        />

        {/* use suspense when loading the model to allow for progress bar (some models on website are heavy on computation) */}
        <Suspense fallback={null}>
          <ForwardedModel 
          //get path of the model
          path={modelPath} 
          //set its background color
          setBackgroundColor={setBackgroundColor} 
          //call the onModelLoaded function 
          onModelLoad={onModelLoad} /> 
        </Suspense>
        
        {/* allow for orbital controls on the model itself to allow the user to interact with the models */}
        <OrbitControls />
      </Canvas>

      {/* display the loading bar when the user hovers over a model or when the model is loading, progress is measured from zero to 100 */}
      {(isLoading || (progress < 100 && active)) && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '5px', backgroundColor: '#ccc', zIndex: 10 }}>
          {/* //Apply animation to loading bar */}
          <div style={{ width: `${smoothProgress}%`, height: '100%', backgroundColor: '#e81a0c', transition: 'width 0.1s ease' }} />
        </div>
      )}
    </div>
  );
}
