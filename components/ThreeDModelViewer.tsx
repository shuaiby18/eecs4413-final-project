import React, { Suspense, useEffect, useState, useRef, forwardRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, useProgress} from '@react-three/drei';
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

function Model({ path, setBackgroundColor, onModelLoad }: { path: string, setBackgroundColor: (color: string) => void, onModelLoad: () => void }, ref: React.Ref<THREE.Group>) {
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

export default function ThreeDModelViewer({ modelPath, isHovered, onModelLoad }: { modelPath: string, isHovered: boolean, onModelLoad: () => void }) {
  const [backgroundColor, setBackgroundColor] = useState('#e0e0e0'); // Default background color

  const { progress, active } = useProgress();
  const [smoothProgress, setSmoothProgress] = useState(0); // Smooth progress state
  const [isLoading, setIsLoading] = useState(false); // Manual loading state for controlling the bar
  const [isBarVisible, setIsBarVisible] = useState(true); // State to control the visibility of the bar


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
      setIsBarVisible(true); // Ensure bar is visible again on hover
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
    setSmoothProgress(100); // Ensure progress bar reaches 100%
    setIsLoading(false);  // Model is loaded, stop showing the loading bar
    setTimeout(() => {
      setIsBarVisible(false); // Fade out the loading bar after a brief delay
    }, 300);  // Adjust this timeout for the duration of the fade-out
    onModelLoad();  // Trigger the callback to indicate the model is loaded
  };
  

  return (
    <div style={{height: '100%', zIndex: 2 }}>
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
        <ForwardedModel path={modelPath} setBackgroundColor={setBackgroundColor} onModelLoad={handleModelLoad} />
        </Suspense>

        <OrbitControls />
      </Canvas>

      {(isLoading || (progress < 100 && active)) && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '5px', backgroundColor: '#ccc', zIndex: 10, opacity: isBarVisible ? 1 : 0, transition: 'opacity 0.3s ease' }}>
          <div style={{ width: `${smoothProgress}%`, height: '100%', backgroundColor: '#e81a0c', transition: 'width 0.1s ease' }} />
        </div>
      )}

    </div>
  );
}
