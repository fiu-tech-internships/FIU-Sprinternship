import React, { useEffect, useState } from 'react';
import FloatingBubble from '../components/FloatingBubble';
import { useNavigate } from 'react-router-dom';

type BubbleProject = {
  id: number;
  name: string;
  url?: string;
  path?: string;
  gradient: string;
  color?: string;
  x?: number;
  y?: number;
};

const FIU = {
  blue: '#081E3F',
  blueShade1: '#0A254E',
  blueShade2: '#0C2B5A',
  gold: '#B6862C',
  brightGold: '#FFCC00',
  magenta: '#CC0066',
  cyan: '#00FFFF',
  white: '#FFFFFF',
};

const BUBBLE_GRADIENTS = [
  `linear-gradient(135deg, ${FIU.brightGold}, ${FIU.magenta})`,
  `linear-gradient(135deg, ${FIU.brightGold}, ${FIU.cyan})`,
  `linear-gradient(135deg, ${FIU.magenta}, ${FIU.brightGold})`,
  `linear-gradient(135deg, ${FIU.cyan}, ${FIU.magenta})`,
  `linear-gradient(135deg, ${FIU.brightGold}, #FF3399)`,
  `linear-gradient(135deg, #FFDD44, ${FIU.magenta})`,
  `linear-gradient(135deg, ${FIU.cyan}, ${FIU.brightGold})`,
  `linear-gradient(135deg, ${FIU.magenta}, ${FIU.cyan})`,
  `linear-gradient(135deg, ${FIU.brightGold}, ${FIU.magenta})`,
];

const Index = () => {
  const navigate = useNavigate();
  const [bubbles, setBubbles] = useState<BubbleProject[]>([]);

  // Vite-safe public asset paths (works with GitHub Pages base URL)
  const fiuLogo = `${import.meta.env.BASE_URL}fiu-kfscis-logo2.png`;
  const heroOverlay1 = `${import.meta.env.BASE_URL}fiu-panther.png`;

  const projects: BubbleProject[] = [
    {
      id: 1,
      name: 'Sprinternship™',
      url: 'https://webs.cs.fiu.edu/sprinternship/',
      gradient: BUBBLE_GRADIENTS[0],
    },
    {
      id: 2,
      name: 'Partners',
      url: 'https://webs.cs.fiu.edu/sprinternship/sprinternship-industry/',
      gradient: BUBBLE_GRADIENTS[1],
    },
    {
      id: 3,
      name: 'Upskilling Workshops',
      url: 'https://webs.cs.fiu.edu/sprinternship/sistas/',
      gradient: BUBBLE_GRADIENTS[2],
    },
    {
      id: 4,
      name: 'Career Roadmap',
      url: 'https://webs.cs.fiu.edu/sprinternship/roadmap/',
      gradient: BUBBLE_GRADIENTS[3],
    },
    {
      id: 5,
      name: 'Research',
      url: 'https://webs.cs.fiu.edu/sprinternship/research/',
      gradient: BUBBLE_GRADIENTS[4],
    },
  ];

  useEffect(() => {
    // Keep bubbles only in the upper/middle area
    const newBubbles = projects.map((project) => ({
      ...project,
      color: project.gradient,
      x: 10 + Math.random() * 80, 
      y: 15 + Math.random() * 70,
    }));

    setBubbles(newBubbles);
  }, []);

  const handleBubbleClick = (project: BubbleProject) => {
    if (project.url) {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    } else if (project.path) {
      navigate(project.path);
    }
  };

  return (
    <div
      className="min-h-screen overflow-hidden relative"
      style={{
        background: `
          radial-gradient(ellipse at 20% 30%, ${FIU.blueShade2} 0%, transparent 55%),
          radial-gradient(ellipse at 80% 70%, #0D1F3C 0%, transparent 55%),
          ${FIU.blue}
        `,
      }}
    >
      {/* Subtle geometric texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(182,134,44,0.04) 60px, rgba(182,134,44,0.04) 61px),
            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(182,134,44,0.04) 60px, rgba(182,134,44,0.04) 61px)
          `,
        }}
      />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const colors = [FIU.brightGold, FIU.magenta, FIU.cyan, FIU.white];
          return (
            <div
              key={i}
              className="absolute rounded-full animate-ping"
              style={{
                width: 4, height: 4,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: colors[i % colors.length],
                opacity: 0.25,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          );
        })}
      </div>

      {/* Hero panther/logo overlay */}
      <img
  src={heroOverlay1}
  alt="FIU panther logo centered"
  className="absolute w-full max-w-[500px] object-contain pointer-events-none"
  style={{
    top: '53%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(0.7)',
    opacity: 0.95,
    zIndex: 10,
  }}
/>

      {/* Orbiting accent dots around the panther */}
      {/* Yellow */}
      <div
        className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full animate-orbit-1"
        style={{
          backgroundColor: FIU.brightGold,
          boxShadow: 'rgb(255, 204, 0) 0px 0px 8px',
          zIndex: 15,
        }}
      />

      {/* Magenta (larger, slower, different start) */}
      <div
        className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full animate-orbit-2"
        style={{
          backgroundColor: FIU.magenta,
          boxShadow: 'rgb(204, 0, 102) 0px 0px 8px',
          zIndex: 15,
        }}
      />

      {/* Cyan (smaller radius, faster) */}
      <div
        className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full animate-orbit-3"
        style={{
          backgroundColor: FIU.cyan,
          boxShadow: 'rgb(0, 255, 255) 0px 0px 8px',
          zIndex: 15,
        }}
      />

      {/* Gold (medium radius, different speed) */}
      <div
        className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full animate-orbit-4"
        style={{
          backgroundColor: FIU.brightGold,
          boxShadow: 'rgb(182, 134, 44) 0px 0px 8px',
          zIndex: 15,
        }}
      />

      {/* Subtle gradient over hero area */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `
            radial-gradient(circle at 50% 55%, transparent 0%, transparent 70%, rgba(8, 30, 63, 0.1) 95%, rgba(8, 30, 63, 0.15) 100%)
          `,
        }}
      />

      {/* Top centered brand */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-[92vw] max-w-5xl px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-3 bg-transparent border-none cursor-pointer p-0 text-center"
            aria-label="Go to homepage"
          >
            <img
  src={fiuLogo}
  alt="FIU KFSCIS logo"
  className="h-36 sm:h-40 md:h-48 lg:h-56 w-auto object-contain"
  style={{ filter: `drop-shadow(0 0 22px ${FIU.brightGold}66)` }}
/>

            <div
              className="mt-2"
              style={{
                height: 3,
                borderRadius: 2,
                background: `linear-gradient(90deg, transparent, ${FIU.brightGold}, ${FIU.magenta}, transparent)`,
                width: '70%',
              }}
            />

            <div className="flex flex-col items-center">
              <p
                className="text-sm sm:text-base md:text-xl font-semibold uppercase text-center"
                style={{
                  color: FIU.brightGold,
                  opacity: 0.92,
                  letterSpacing: '0.12em',
                  textShadow: '0 3px 12px rgba(0,0,0,0.45)',
                }}
              >
                Sprinternship™ — Our Partnership With Break Through Tech
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Floating project bubbles – clustered around upper/middle */}
      <div className="absolute inset-0 z-45">
        {bubbles.map((bubble) => (
          <FloatingBubble
            key={`${bubble.id}-${bubble.x}-${bubble.y}`}
            project={bubble}
            onClick={() => handleBubbleClick(bubble)}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {[...Array(20)].map((_, i) => {
          const colors = [FIU.brightGold, FIU.magenta, FIU.cyan, FIU.white];

          return (
            <div
              key={i}
              className="absolute rounded-full animate-ping"
              style={{
                width: 4,
                height: 4,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: colors[i % colors.length],
                opacity: 0.25,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          );
        })}
      </div>

      {/* Bottom FIU wordmark bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-2 px-4 pointer-events-none z-50"
        style={{
          borderTop: `1px solid ${FIU.gold}33`,
          background: `linear-gradient(0deg, ${FIU.blue}CC, transparent)`,
        }}
      >
        <span
          className="text-xs sm:text-sm text-center"
          style={{
            fontFamily: "'Georgia', serif",
            color: FIU.gold,
            letterSpacing: '0.2em',
            opacity: 0.8,
            textTransform: 'uppercase',
          }}
        >
          Florida International University
        </span>
      </div>
    </div>
  );
};

export default Index;