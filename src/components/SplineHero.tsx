import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, ChevronDown } from 'lucide-react';

const SplineScene = React.lazy(() => import('@splinetool/react-spline'));

const SPLINE_SCENE_URL = 'https://draft.spline.design/pCvvbDOV0BauBYRH/scene.splinecode';

const LoadingFallback = () => (
  <div className="spline-hero__loader">
    <div className="spline-hero__spinner" role="status" aria-label="Loading 3D scene">
      <div className="spline-hero__spinner-ring" />
    </div>
    <p className="spline-hero__loader-text">Loading Experience…</p>
  </div>
);

export default function SplineHero() {
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false);

  // Defer Spline loading so the rest of the page renders first
  useEffect(() => {
    // Use requestIdleCallback if available, otherwise a small timeout
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setShouldLoadSpline(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    } else {
      const timer = setTimeout(() => setShouldLoadSpline(true), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <section className="spline-hero" aria-label="Hero">
      {/* Spline 3D Scene — fills the entire viewport */}
      <div className="spline-hero__canvas">
        {shouldLoadSpline ? (
          <Suspense fallback={<LoadingFallback />}>
            {!sceneLoaded && <LoadingFallback />}
            <SplineScene
              scene={SPLINE_SCENE_URL}
              onLoad={() => setSceneLoaded(true)}
              style={{ width: '100%', height: '100%' }}
            />
          </Suspense>
        ) : (
          <LoadingFallback />
        )}
      </div>

      {/* Overlay content at the bottom */}
      <AnimatePresence>
        {sceneLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="spline-hero__overlay"
          >
            <div className="spline-hero__info-card">
              <p className="spline-hero__tagline">
                The ultimate campus trade fair by Pentecost University Comm.&nbsp;Studies.
              </p>
            </div>

            <div className="spline-hero__details-card">
              <div className="spline-hero__detail-row">
                <div className="spline-hero__detail-icon">
                  <MapPin size={18} />
                </div>
                <span className="spline-hero__detail-label">Pentecost University</span>
              </div>
              <div className="spline-hero__detail-row">
                <div className="spline-hero__detail-icon">
                  <Calendar size={18} />
                </div>
                <span className="spline-hero__detail-label">April 15-17, 2026</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <AnimatePresence>
        {sceneLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="spline-hero__scroll-hint"
            aria-hidden="true"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
