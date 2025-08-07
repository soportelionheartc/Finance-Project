export const LionLogo = ({ className }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Círculo exterior dorado */}
      <circle cx="50" cy="50" r="48" fill="#000000" stroke="#B8860B" strokeWidth="3" />
      
      {/* Letras LH */}
      <text 
        x="50" 
        y="62" 
        fontFamily="Arial, sans-serif" 
        fontSize="40" 
        fontWeight="bold" 
        fill="#D4AF37" 
        textAnchor="middle" 
        dominantBaseline="middle"
      >
        LH
      </text>
    </svg>
  );
};
