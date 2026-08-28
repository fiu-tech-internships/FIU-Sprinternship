import { useEffect, useRef, useState } from 'react';

export type BubblePosition = {
  x: number;
  y: number;
};

type BubbleSeed = BubblePosition & {
  id: number;
};

type PhysicsBody = BubbleSeed & {
  vx: number;
  vy: number;
};

type BubblePhysicsOptions = {
  radiusPx: number;
  topBoundaryPx?: number;
  bottomBoundaryPx?: number;
  speed?: number;
  resetTrigger?: number;
};

const COLLISION_RESTITUTION = 1;
const MAX_FRAME_SECONDS = 1 / 30;

const createVelocity = (speed: number) => {
  const angle = Math.random() * Math.PI * 2;
  const magnitude = speed * (0.85 + Math.random() * 0.3);

  return {
    vx: Math.cos(angle) * magnitude,
    vy: Math.sin(angle) * magnitude,
  };
};

const createBodies = (
  seeds: BubbleSeed[],
  radiusPx: number,
  topBoundaryPx: number,
  bottomBoundaryPx: number,
  speed: number,
): PhysicsBody[] => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const maxY = Math.max(
    radiusPx,
    Math.min(height - radiusPx, bottomBoundaryPx - radiusPx),
  );
  const minY = Math.min(
    maxY,
    Math.max(radiusPx, topBoundaryPx + radiusPx),
  );

  return seeds.map((seed) => ({
    id: seed.id,
    x: Math.max(radiusPx, Math.min(width - radiusPx, (seed.x / 100) * width)),
    y: Math.max(minY, Math.min(maxY, (seed.y / 100) * height)),
    ...createVelocity(speed),
  }));
};

const toPositionMap = (bodies: PhysicsBody[]) =>
  bodies.reduce<Record<number, BubblePosition>>((positions, body) => {
    positions[body.id] = { x: body.x, y: body.y };
    return positions;
  }, {});

const bounceOffViewport = (
  body: PhysicsBody,
  radiusPx: number,
  topBoundaryPx: number,
  bottomBoundaryPx: number,
) => {
  const maxX = Math.max(radiusPx, window.innerWidth - radiusPx);
  const maxY = Math.max(
    radiusPx,
    Math.min(
      window.innerHeight - radiusPx,
      bottomBoundaryPx - radiusPx,
    ),
  );
  const minY = Math.min(
    maxY,
    Math.max(radiusPx, topBoundaryPx + radiusPx),
  );

  if (body.x <= radiusPx) {
    body.x = radiusPx;
    body.vx = Math.abs(body.vx);
  } else if (body.x >= maxX) {
    body.x = maxX;
    body.vx = -Math.abs(body.vx);
  }

  if (body.y <= minY) {
    body.y = minY;
    body.vy = Math.abs(body.vy);
  } else if (body.y >= maxY) {
    body.y = maxY;
    body.vy = -Math.abs(body.vy);
  }
};

const resolveBubbleCollision = (
  first: PhysicsBody,
  second: PhysicsBody,
  minimumDistance: number,
) => {
  let dx = second.x - first.x;
  let dy = second.y - first.y;
  let distance = Math.hypot(dx, dy);

  if (distance >= minimumDistance) return;

  if (distance < 0.001) {
    dx = first.id < second.id ? 1 : -1;
    dy = 0;
    distance = 1;
  }

  const normalX = dx / distance;
  const normalY = dy / distance;
  const overlapCorrection = (minimumDistance - distance) / 2 + 0.01;

  first.x -= normalX * overlapCorrection;
  first.y -= normalY * overlapCorrection;
  second.x += normalX * overlapCorrection;
  second.y += normalY * overlapCorrection;

  const relativeNormalVelocity =
    (second.vx - first.vx) * normalX +
    (second.vy - first.vy) * normalY;

  if (relativeNormalVelocity >= 0) return;

  const impulse =
    (-((1 + COLLISION_RESTITUTION) * relativeNormalVelocity)) / 2;

  first.vx -= impulse * normalX;
  first.vy -= impulse * normalY;
  second.vx += impulse * normalX;
  second.vy += impulse * normalY;
};

export const useBubblePhysics = (
  seeds: BubbleSeed[],
  {
    radiusPx,
    topBoundaryPx = 0,
    bottomBoundaryPx = Number.POSITIVE_INFINITY,
    speed = 70,
    resetTrigger = 0,
  }: BubblePhysicsOptions,
) => {
  const bodiesRef = useRef<PhysicsBody[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const previousResetTriggerRef = useRef(resetTrigger);
  const [positions, setPositions] = useState<Record<number, BubblePosition>>(() => {
    const bodies = createBodies(
      seeds,
      radiusPx,
      topBoundaryPx,
      bottomBoundaryPx,
      speed,
    );
    bodiesRef.current = bodies;
    return toPositionMap(bodies);
  });

  useEffect(() => {
    const hasSameBodies =
      bodiesRef.current.length === seeds.length &&
      seeds.every((seed) => bodiesRef.current.some((body) => body.id === seed.id));

    if (!hasSameBodies) {
      bodiesRef.current = createBodies(
        seeds,
        radiusPx,
        topBoundaryPx,
        bottomBoundaryPx,
        speed,
      );
    } else if (previousResetTriggerRef.current !== resetTrigger) {
      bodiesRef.current.forEach((body) => {
        Object.assign(body, createVelocity(speed));
      });
    }

    previousResetTriggerRef.current = resetTrigger;
    bodiesRef.current.forEach((body) =>
      bounceOffViewport(
        body,
        radiusPx,
        topBoundaryPx,
        bottomBoundaryPx,
      ),
    );
    setPositions(toPositionMap(bodiesRef.current));
    lastTimeRef.current = 0;

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaSeconds = Math.min(
        (currentTime - lastTimeRef.current) / 1000,
        MAX_FRAME_SECONDS,
      );
      lastTimeRef.current = currentTime;

      const bodies = bodiesRef.current;
      bodies.forEach((body) => {
        body.x += body.vx * deltaSeconds;
        body.y += body.vy * deltaSeconds;
        bounceOffViewport(
          body,
          radiusPx,
          topBoundaryPx,
          bottomBoundaryPx,
        );
      });

      const minimumDistance = radiusPx * 2;
      for (let pass = 0; pass < 2; pass += 1) {
        for (let firstIndex = 0; firstIndex < bodies.length; firstIndex += 1) {
          for (
            let secondIndex = firstIndex + 1;
            secondIndex < bodies.length;
            secondIndex += 1
          ) {
            resolveBubbleCollision(
              bodies[firstIndex],
              bodies[secondIndex],
              minimumDistance,
            );
          }
        }

        bodies.forEach((body) =>
          bounceOffViewport(
            body,
            radiusPx,
            topBoundaryPx,
            bottomBoundaryPx,
          ),
        );
      }

      setPositions(toPositionMap(bodies));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    bottomBoundaryPx,
    radiusPx,
    resetTrigger,
    seeds,
    speed,
    topBoundaryPx,
  ]);

  return positions;
};
