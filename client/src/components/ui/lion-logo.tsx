import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
}

export function LionLogo({ className = '', size = 'md', withText = false }: LogoProps) {
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  }[size];

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${sizeClass} flex items-center justify-center rounded-full bg-primary/20 border-2 border-primary overflow-hidden`}>
        <span className="text-primary font-bold" style={{ fontSize: size === 'sm' ? '1rem' : size === 'md' ? '1.5rem' : size === 'lg' ? '2.5rem' : '4rem' }}>LH</span>
      </div>
      
      {withText && (
        <div className="ml-2">
          <h2 className="text-lg font-bold leading-tight tracking-tight text-primary">LION HEART CAPITAL</h2>
          <p className="text-xs text-gray-400">CONSULTORÍA FINANCIERA Y DE INVERSIÓN</p>
        </div>
      )}
    </div>
  );
}