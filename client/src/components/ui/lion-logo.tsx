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
        className={`${sizeClass} flex items-center justify-center rounded-full border-2 border-primary overflow-hidden relative`}
        style={{
          background: '#2b271fff',
          boxShadow: '0 0 12px 3px #D4AF3788, 0 0 24px 6px #B8860B33', // brillo ligeramente reducido
        }}
      >
        <span
          className="text-primary font-semibold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontWeight: 600,
            fontSize:
              size === 'sm' ? '0.9rem' :
                size === 'md' ? '1.5rem' :
                  size === 'lg' ? '2.4rem' : '3.8rem',
            letterSpacing: '0.05em',
            textShadow: '0 1px 8px rgba(212,175,55,0.25)',
          }}
        >
          LH
        </span>
      </div>

      {withText && (
        <div className="ml-2">
          <h2 className="text-lg font-bold leading-tight tracking-tight text-primary" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>LION HEART CAPITAL</h2>
        </div>
      )}
    </div>
  );
}