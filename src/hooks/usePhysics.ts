
import { useState, useEffect, useRef } from 'react';

const getViewportBounds = (radiusPx: number) => {
  const viewportWidth = Math.max(window.innerWidth, radiusPx * 2);
  const viewportHeight = Math.max(window.innerHeight, radiusPx * 2);

  const radiusX = Math.min(50, (radiusPx / viewportWidth) * 100);
  const radiusY = Math.min(50, (radiusPx / viewportHeight) * 100);

  return {
    minX: radiusX,
    maxX: 100 - radiusX,
    minY: radiusY,
    maxY: 100 - radiusY,
  };
};

export const usePhysics = (
  initialX: number,
  initialY: number,
  speed: number = 0.5,
  resetTrigger: number = 0,
  radiusPx: number = 0,
) => {
  const [position, setPosition] = useState(() => {
    const bounds = getViewportBounds(radiusPx);

    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, initialX)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, initialY)),
    };
  });
  const velocityRef = useRef({ 
    vx: (Math.random() - 0.5) * speed, 
    vy: (Math.random() - 0.5) * speed 
  });
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    // Reset velocities whenever resetTrigger changes
    velocityRef.current = { 
      vx: (Math.random() - 0.5) * speed, 
      vy: (Math.random() - 0.5) * speed 
    };
    lastTimeRef.current = 0;

    const animate = (currentTime: number) => {
      if (currentTime - lastTimeRef.current < 16) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = currentTime;

      setPosition(prev => {
        const bounds = getViewportBounds(radiusPx);
        let newX = prev.x + velocityRef.current.vx;
        let newY = prev.y + velocityRef.current.vy;

        if (newX <= bounds.minX) {
          newX = bounds.minX;
          velocityRef.current.vx = Math.abs(velocityRef.current.vx);
        } else if (newX >= bounds.maxX) {
          newX = bounds.maxX;
          velocityRef.current.vx = -Math.abs(velocityRef.current.vx);
        }

        if (newY <= bounds.minY) {
          newY = bounds.minY;
          velocityRef.current.vy = Math.abs(velocityRef.current.vy);
        } else if (newY >= bounds.maxY) {
          newY = bounds.maxY;
          velocityRef.current.vy = -Math.abs(velocityRef.current.vy);
        }

        return { x: newX, y: newY };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
  }, [speed, resetTrigger, radiusPx]);

  return position;
};

