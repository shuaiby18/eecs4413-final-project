import React, { Suspense, useEffect, useRef, forwardRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function Model({ path }: { path: string }, ref: React.Ref<THREE.Group>) {
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
      }
    });
  }, [scene]);

  return <primitive ref={ref} object={scene} />;
}

const ForwardedModel = forwardRef(Model);

export default function ThreeDModelViewer({ modelPath }: { modelPath: string }) {
  return (
    <Canvas
      shadows
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#e0e0e0', // Neutral light gray background color
      }}
    >
      {/* Ambient Light for subtle overall illumination */}
      <ambientLight color={0xffffff} intensity={0.8} />

      {/* SpotLight for strong shadow casting */}
      <spotLight
        color={0xffffff}
        intensity={4} // Stronger spotlight
        position={[10, 15, 10]} // Positioned at an angle to cast visible shadows
        angle={Math.PI / 6}
        penumbra={0.5} // Softer edges for the shadows
        castShadow
        shadow-bias={-0.001} // Small bias to prevent shadow acne
        shadow-camera-near={8}
        shadow-camera-far={50}
        shadow-mapSize-width={2048} // Higher resolution for sharper shadows
        shadow-mapSize-height={2048}
      />

      {/* Directional Light for broader shadow casting */}
      <directionalLight
        color={0xffffff}
        intensity={4} // Stronger directional light to cast more visible shadows
        position={[-10, 15, 10]} // Positioned from another angle
        castShadow
        shadow-bias={-0.001} // Small bias to prevent shadow artifacts
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-right={10}
        shadow-camera-left={-10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-mapSize-width={2048} // Higher resolution shadows
        shadow-mapSize-height={2048}
      />

      <Suspense fallback={null}>
        <ForwardedModel path={modelPath} />
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
}
