import React, { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

export interface SplineWrapperProps {
  sceneUrl: string;
  className?: string;
  onLoad?: (splineApp: any) => void;
  fallback?: React.ReactNode;
}

export default function SplineWrapper({ 
  sceneUrl, 
  className = '', 
  onLoad,
  fallback = <div className="spline-loading">Loading 3D Scene...</div>
}: SplineWrapperProps) {
  return (
    <div className={`spline-container ${className}`} style={{ width: '100%', height: '100%' }}>
      <Suspense fallback={fallback}>
        <Spline 
          scene={sceneUrl} 
          onLoad={onLoad}
        />
      </Suspense>
    </div>
  );
}
