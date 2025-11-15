
import React, { useMemo } from 'react';

const Particles: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => {
      const size = Math.random() * 5 + 2;
      const style = {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 15 + 10}s`,
        animationDelay: `${Math.random() * -20}s`,
        boxShadow: `0 0 10px #6366f1, 0 0 20px #8b5cf6`,
      };
      return <div key={i} className="absolute rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 particle" style={style} />;
    });
  }, []);

  return <div className="absolute top-0 left-0 w-full h-full z-0">{particles}</div>;
};

export default Particles;
   