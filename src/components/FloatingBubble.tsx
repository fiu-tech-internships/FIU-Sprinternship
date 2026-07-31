import React from 'react';
import { usePhysics } from '../hooks/usePhysics';

interface FloatingBubbleProps {
  project: {
    id: number;
    name: string;
    icon?: string;
    img?: string;
    color: string;
    x: number;
    y: number;
    animationDelay?: number;
    animationDuration?: number;
  };
  onClick: () => void;
  resetTrigger?: number;
}

const FloatingBubble: React.FC<FloatingBubbleProps> = ({
  project,
  onClick,
  resetTrigger,
}) => {
  const position = usePhysics(project.x, project.y, 0.3, resetTrigger);

  // Detect whether color is already a gradient string or a plain hex/named color
  const isGradient = project.color.includes('gradient');
  const bubbleBackground = isGradient
    ? project.color
    : `linear-gradient(135deg, ${project.color}dd, ${project.color}aa)`;

  // For the ping glow, extract a base color to use as a solid
  const glowColor = isGradient
    ? (project.color.match(/#[0-9a-fA-F]{6}/)?.[0] ?? '#FFCC00')
    : project.color;

  return (
    <div
      className="absolute cursor-pointer z-30"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animationDelay: `${project.animationDelay ?? 0}s`,
        animationDuration: `${project.animationDuration ?? 3}s`,
      }}
      onClick={onClick}
    >
      {/* Bigger bubbles */}
      <div
        className="w-24 h-24 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center shadow-2xl animate-float hover:animate-pulse"
        style={{ background: bubbleBackground }}
      >
        <div className="mb-1 flex items-center justify-center">
          {project.img ? (
            <img
              src={project.img}
              alt={project.name}
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
          ) : (
            <span className="text-base md:text-lg">{project.icon}</span>
          )}
        </div>

        {/* Label text in black */}
        <div className="text-white text-s md:text-sm font-bold text-center px-2 drop-shadow-none">
          {project.name}
        </div>
      </div>

      {/* Glowing ping effect using extracted base color */}
      <div
        className="absolute inset-0 rounded-full opacity-30 animate-ping"
        style={{ backgroundColor: glowColor }}
      />
    </div>
  );
};

export default FloatingBubble;