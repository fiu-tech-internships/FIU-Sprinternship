import React from 'react';

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

const FloatingBubble: React.FC<FloatingBubbleProps> = ({ project, onClick }) => {
  // For this hero layout, keep bubbles at their given positions
  const position = { x: project.x, y: project.y };

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
      <div
        className="w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center shadow-2xl"
        style={{ background: bubbleBackground }}
      >
        <div className="mb-1 flex items-center justify-center">
          {project.img ? (
            <img
              src={project.img}
              alt={project.name}
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
          ) : (
            <span className="text-sm md:text-base">{project.icon}</span>
          )}
        </div>
        <div className="text-white text-[0.65rem] md:text-xs font-bold text-center px-1 drop-shadow">
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