import React, { Suspense, useEffect, useState, useRef, forwardRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

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

function Model({ path, setBackgroundColor }: { path: string, setBackgroundColor: (color: string) => void }, ref: React.Ref<THREE.Group>) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);
  const { camera } = useThree();

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    scene.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const dist = maxDim / (2 * Math.tan(fov / 2));

    camera.position.set(0, 0, dist * 1.3);
    camera.lookAt(center);

    camera.near = dist / 100;
    camera.far = dist * 100;
    camera.updateProjectionMatrix();

    scene.rotation.y = THREE.MathUtils.degToRad(-30);

    if (actions && animations.length > 0) {
      const firstAction = actions[Object.keys(actions)[0]];
      if (firstAction) {
        firstAction.play();
      }
    }
  }, [scene, camera, actions, animations]);

  // Ensure all meshes in the model cast and receive shadows
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Check if the mesh has a texture, and calculate the dominant color if it does
        if (child.material && child.material.map) {
          const dominantColor = getDominantColor(child.material.map);
          setBackgroundColor(dominantColor);
        }
      }
    });
  }, [scene, setBackgroundColor]);

  return <primitive ref={ref} object={scene} />;
}

const ForwardedModel = forwardRef(Model);

export default function ThreeDModelViewer({ modelPath }: { modelPath: string }) {
  const [backgroundColor, setBackgroundColor] = useState('#e0e0e0'); // Default background color

  return (
    <Canvas
      shadows
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: backgroundColor, // Dynamic background color
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
        <ForwardedModel path={modelPath} setBackgroundColor={setBackgroundColor} />
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
}
