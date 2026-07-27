import React, { useEffect, useState } from 'react';
import fiuLogo from '/public/fiu-kfscis-logo.png';
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

  const fiuLogo = `${import.meta.env.BASE_URL}fiu-kfscis-logo.png`;
  const heroOverlay = `${import.meta.env.BASE_URL}hero-bg-image.png`;

  const projects: BubbleProject[] = [
    {
      id: 1,
      name: 'Sprinternship',
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
      name: 'Sistas',
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
    const newBubbles = projects.map((project) => ({
      ...project,
      color: project.gradient,
      x: 18 + Math.random() * 64,
      y: 34 + Math.random() * 38,
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
      className="h-dvh overflow-hidden relative"
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

      {/* Gold accent glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: 320,
            height: 320,
            top: '-80px',
            left: '-80px',
            background: `radial-gradient(circle, ${FIU.brightGold}22 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 260,
            height: 260,
            bottom: '-60px',
            right: '-60px',
            background: `radial-gradient(circle, ${FIU.magenta}1A 0%, transparent 70%)`,
            animation: 'pulse 4s ease-in-out infinite 1s',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 180,
            height: 180,
            top: '40%',
            right: '5%',
            background: `radial-gradient(circle, ${FIU.cyan}15 0%, transparent 70%)`,
            animation: 'pulse 5s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* Hero transparent PNG overlay */}
      <img
        src={heroOverlay}
        alt="Students from Break Through Tech"
        className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[860px] object-contain pointer-events-none z-10"
        style={{
          left: '50%',
          transform: 'translateX(-50%) translateY(3%)',
          opacity: 0.95,
        }}
      />

      {/* Soft lower fade for readability */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none z-20"
        style={{
          background: `linear-gradient(to top, ${FIU.blue}F0 0%, ${FIU.blue}80 35%, transparent 100%)`,
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
              className="h-16 sm:h-20 md:h-24 w-auto object-contain"
              style={{ filter: `drop-shadow(0 0 14px ${FIU.brightGold}44)` }}
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

      {/* Floating project bubbles */}
      <div className="absolute inset-0 z-40">
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
            opacity: 0.7,
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