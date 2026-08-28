import React from 'react';
import type { BubblePosition } from '../hooks/usePhysics';

interface FloatingBubbleProps {
  project: {
    id: number;
    name: string;
    icon?: string;
    img?: string;
    color: string;
    textColor?: string;
    animationDelay?: number;
    animationDuration?: number;
  };
  position: BubblePosition;
  bubbleRadius: number;
  onClick: () => void;
}

const FloatingBubble: React.FC<FloatingBubbleProps> = ({
  project,
  position,
  bubbleRadius,
  onClick,
}) => {
  const isGradient = project.color.includes('gradient');
  const bubbleBackground = isGradient
    ? project.color
    : `linear-gradient(135deg, ${project.color}dd, ${project.color}aa)`;

  const glowColor = isGradient
    ? (project.color.match(/#[0-9a-fA-F]{6}/)?.[0] ?? '#FFCC00')
    : project.color;

  const textColor = project.textColor ?? '#FFFFFF';
  const textShadow = project.textColor
    ? '0 1px 2px rgba(255, 255, 255, 0.55)'
    : '0 2px 5px rgba(8, 30, 63, 0.95), 0 0 2px rgba(8, 30, 63, 0.9)';
  const keepTrademarkOnSameLine = project.name.endsWith('™');

  return (
    <div
      data-bubble-body={project.id}
      className="absolute z-30 cursor-pointer"
      style={{
        left: `${position.x - bubbleRadius}px`,
        top: `${position.y - bubbleRadius}px`,
        animationDelay: `${project.animationDelay ?? 0}s`,
        animationDuration: `${project.animationDuration ?? 3}s`,
      }}
      onClick={onClick}
    >
      {/* Bigger bubble container */}
      <div
        data-bubble
        className="w-32 h-32 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center shadow-2xl hover:animate-pulse"
        style={{ background: bubbleBackground }}
      >
        <div className="mb-1 flex items-center justify-center">
          {project.img ? (
            <img
              src={project.img}
              alt={project.name}
              className="w-12 h-12 md:w-14 md:h-14 object-contain"
            />
          ) : (
            <span className="text-2xl md:text-3xl">{project.icon}</span>
          )}
        </div>

        {/* High-contrast text sized to remain inside the bubble on narrow screens */}
        <div
          data-bubble-label
          className={`relative z-10 w-[calc(100%-1rem)] text-[13px] sm:text-sm md:text-base font-extrabold leading-tight tracking-[-0.025em] text-center ${
            keepTrademarkOnSameLine ? 'whitespace-nowrap' : '[overflow-wrap:anywhere]'
          }`}
          style={{ color: textColor, textShadow }}
        >
          {project.name}
        </div>
      </div>

      {/* Glowing ping effect using extracted base color */}
      <div
        className="absolute inset-0 rounded-full opacity-30 animate-ping pointer-events-none"
        style={{ backgroundColor: glowColor }}
      />
    </div>
  );
};

export default FloatingBubble;
