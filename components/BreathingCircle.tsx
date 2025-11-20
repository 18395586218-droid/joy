import React, { useEffect, useState } from 'react';

export const BreathingCircle: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [instruction, setInstruction] = useState("Inhale...");

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
    // Simple cycle for text update based on animation timing (8s total cycle)
    const cycle = setInterval(() => {
      setInstruction("Inhale...");
      setTimeout(() => setInstruction("Hold..."), 3000);
      setTimeout(() => setInstruction("Exhale..."), 4000);
    }, 8000);

    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="relative flex items-center justify-center w-64 h-64 mb-8">
        {/* Outer glow */}
        <div className="absolute w-full h-full rounded-full bg-amber-glow/10 animate-breathe blur-xl"></div>
        {/* Inner circle */}
        <div className="absolute w-32 h-32 rounded-full bg-gradient-to-b from-stone-700 to-stone-800 border border-stone-600 shadow-inner flex items-center justify-center animate-breathe z-10">
            <span className="text-stone-400 text-sm font-serif tracking-widest">{instruction}</span>
        </div>
      </div>
      
      <p className="text-stone-400 font-serif mb-2">Reconnecting to the present</p>
      <p className="text-stone-500 text-sm font-mono">{timeLeft}s remaining</p>
    </div>
  );
};
