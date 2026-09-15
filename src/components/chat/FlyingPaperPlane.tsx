import React, { useEffect, useState } from 'react';

interface FlyingPaperPlaneProps {
  triggerKey: number;
}

export const FlyingPaperPlane: React.FC<FlyingPaperPlaneProps> = ({ triggerKey }) => {
  const [activeFlight, setActiveFlight] = useState<number | null>(null);

  useEffect(() => {
    if (triggerKey > 0) {
      setActiveFlight(triggerKey);
      const timer = setTimeout(() => {
        setActiveFlight(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [triggerKey]);

  if (!activeFlight) return null;

  return (
    <div
      key={activeFlight}
      className="absolute bottom-3 right-3 pointer-events-none z-30 animate-paper-plane"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FFB800"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 drop-shadow-[0_0_8px_rgba(255,184,0,0.6)]"
      >
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
      </svg>
    </div>
  );
};
