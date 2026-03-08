import React, { useRef } from 'react';
import Spline from '@splinetool/react-spline';

export default function InteractiveScene() {
  const splineAppRef = useRef<any>(null);

  // Triggered when the Spline scene is fully loaded
  const handleLoad = (splineApp: any) => {
    // Save the app instance for later use
    splineAppRef.current = splineApp;
    
    // You can also access objects immediately
    const obj = splineApp.findObjectByName('MyObjectName');
    if (obj) {
      console.log('Object found:', obj);
    }
  };

  // Triggered when a specific object in Spline is clicked
  const handleMouseDown = (e: any) => {
    if (e.target.name === 'Button') {
      console.log('Button clicked in 3D scene!');
      // Example: trigger a custom animation or change React state
    }
  };

  // Triggered when an object is hovered
  const handleHover = (e: any) => {
    if (e.target.name === 'InteractiveCube') {
      console.log('Hovering over InteractiveCube');
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Spline 
        scene="https://prod.spline.design/your-scene-id/scene.splinecode"
        onLoad={handleLoad}
        onMouseDown={handleMouseDown}
        onMouseHover={handleHover}
      />
    </div>
  );
}
