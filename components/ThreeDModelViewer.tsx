import React, { Suspense, useEffect, useRef, forwardRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function Model({ path }: { path: string }, ref: React.Ref<THREE.Group>) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);
  const { camera } = useThree();

  useEffect(() => {
    // Calculate the bounding box of the model
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center the model
    scene.position.sub(center);

    // Calculate the distance the camera needs to be to fit the model
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180); // Convert FOV to radians
    const dist = maxDim / (2 * Math.tan(fov / 2));

    // Position the camera
    camera.position.set(0, 0, dist * 1.3);
    camera.lookAt(center);

    // Adjust the near and far planes of the camera
    camera.near = dist / 100;
    camera.far = dist * 100;
    camera.updateProjectionMatrix();

    // Play the first animation if available
    if (actions && animations.length > 0) {
      const firstAction = actions[Object.keys(actions)[0]];
      if (firstAction) {
        firstAction.play();
      }
    }

  }, [scene, camera, actions, animations]);

  return <primitive ref={ref} object={scene} />;
}

const ForwardedModel = forwardRef(Model);

export default function ThreeDModelViewer({ modelPath }: { modelPath: string }) {
  return (
    <Canvas style={{ height: '100%', width: '100%' }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 5, 2]} intensity={1.5} castShadow />
      <directionalLight position={[-2, -5, -2]} intensity={0.8} />
      <pointLight intensity={0.5} position={[0, 0, 0]} distance={100} />

      <Suspense fallback={null}>
        <ForwardedModel path={modelPath} />
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
}
