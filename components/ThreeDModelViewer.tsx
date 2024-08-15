import React, { Suspense, useEffect, useRef, forwardRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function Model({ path }: { path: string }, ref: React.Ref<THREE.Group>) {
  const { scene, animations } = useGLTF(path);
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Center the model
    scene.position.sub(center);

    if (actions && animations.length > 0) {
      const firstAction = actions[Object.keys(actions)[0]];
      if (firstAction) {
        firstAction.play();
      }
    }
  }, [scene, actions, animations]);

  return <primitive ref={ref} object={scene} />;
}

const ForwardedModel = forwardRef(Model);

export default function ThreeDModelViewer({ modelPath }: { modelPath: string }) {
  const modelRef = useRef<THREE.Group>(null);

  return (
    <Canvas style={{ height: '100%', width: '100%' }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 5, 2]} intensity={1.5} castShadow />
      <directionalLight position={[-2, -5, -2]} intensity={0.8} />
      <pointLight intensity={0.5} position={[0, 0, 0]} distance={100} />

      <Suspense fallback={null}>
        <ForwardedModel path={modelPath} ref={modelRef} />
      </Suspense>

      <OrbitControls 
        maxDistance={20}  // Set dynamically based on model size
        minDistance={1}   // Allow zooming in close
        enableDamping
        dampingFactor={0.1}
      />
    </Canvas>
  );
}
