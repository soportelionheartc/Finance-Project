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
      <div
        className={`${sizeClass} flex items-center justify-center rounded-full overflow-hidden relative`}
      >
        {/* ← AQUI metemos tu imagen */}
        <img
          src="/data/ZupiFintechLogo.png"
          alt="Zupi Fintech Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {withText && (
        <div className="ml-2">
          <h2
            className="text-lg font-bold leading-tight tracking-tight text-primary"
            style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}
          >
          
          </h2>
        </div>
      )}
    </div>
  );
}
