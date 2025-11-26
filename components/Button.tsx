
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = "px-8 py-3 rounded-full font-serif tracking-wider transition-all duration-500 ease-out transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border";
  
  const variants = {
    // Glowing light style
    primary: "bg-amber-glow/10 border-amber-glow/30 text-amber-100 shadow-[0_0_20px_rgba(255,202,40,0.1)] hover:bg-amber-glow/20 hover:shadow-[0_0_30px_rgba(255,202,40,0.2)] hover:border-amber-glow/50",
    // Wood/Dark style
    secondary: "bg-bark-800/40 border-bark-600/50 text-mist-200 hover:bg-bark-600/40 hover:border-bark-400/50",
    // Invisible style
    ghost: "bg-transparent border-transparent text-moss-600 hover:text-mist-100",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
