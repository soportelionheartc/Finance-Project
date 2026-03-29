import { motion } from "framer-motion";

interface XpBarProps {
  currentXp: number;
  className?: string;
}

export default function XpBar({ currentXp, className = "" }: XpBarProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-lg">⭐</span>
      <motion.span
        key={currentXp}
        initial={{ scale: 1.3, color: "#FFD54F" }}
        animate={{ scale: 1, color: "#FFC107" }}
        transition={{ duration: 0.4 }}
        className="font-bold text-[#FFC107] tabular-nums"
      >
        {currentXp}
      </motion.span>
      <span className="text-sm text-muted-foreground">XP</span>
    </div>
  );
}
