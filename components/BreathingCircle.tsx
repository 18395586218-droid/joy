
import React, { useEffect, useState } from 'react';

export const BreathingCircle: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [instruction, setInstruction] = useState("吸气");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const cycle = setInterval(() => {
      setInstruction("吸气"); // Inhale
      setTimeout(() => setInstruction("屏息"), 4000); // Hold
      setTimeout(() => setInstruction("呼气"), 6000); // Exhale
    }, 10000); // Slower, deeper 10s cycle

    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="relative flex items-center justify-center w-72 h-72 mb-10">
        {/* Outer atmospheric glow */}
        <div className="absolute w-full h-full rounded-full bg-amber-glow/5 animate-breathe blur-3xl"></div>
        
        {/* The Light Source */}
        <div className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-amber-100/20 to-amber-glow/5 border border-amber-glow/20 shadow-[0_0_40px_rgba(255,202,40,0.15)] flex items-center justify-center animate-breathe z-10 backdrop-blur-md">
            <span className="text-amber-100 text-lg font-serif tracking-[0.2em] pl-1">{instruction}</span>
        </div>
        
        {/* Orbiting particle */}
        <div className="absolute w-full h-full animate-spin duration-[20s] opacity-30">
          <div className="w-2 h-2 bg-amber-200 rounded-full shadow-[0_0_10px_white] mx-auto mt-2"></div>
        </div>
      </div>
      
      <p className="text-mist-200 font-serif mb-2 tracking-widest text-sm opacity-70">感受当下的安宁</p>
      <div className="h-1 w-32 bg-moss-800 rounded-full overflow-hidden mt-4">
         <div className="h-full bg-amber-900/50 transition-all duration-1000" style={{ width: `${(timeLeft / 30) * 100}%` }}></div>
      </div>
    </div>
  );
};
