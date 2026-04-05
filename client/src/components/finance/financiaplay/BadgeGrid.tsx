import { BADGES } from "@/data/financiaplayData";
import { Lock } from "lucide-react";

interface BadgeGridProps {
  earnedBadges: string[];
  className?: string;
}

export default function BadgeGrid({
  earnedBadges,
  className = "",
}: BadgeGridProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 ${className}`}
    >
      {BADGES.map((badge) => {
        const earned = earnedBadges.includes(badge.id);
        return (
          <div
            key={badge.id}
            title={`${badge.title}\n${badge.criteria}`}
            className={`relative flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors ${
              earned
                ? "border-[#FFC107]/40 bg-[#FFC107]/5"
                : "border-muted opacity-50 grayscale"
            }`}
          >
            {!earned && (
              <Lock className="text-muted-foreground absolute top-2 right-2 h-3.5 w-3.5" />
            )}
            <span className="text-2xl">{badge.title.split(" ").pop()}</span>
            <span className="text-xs leading-tight font-medium">
              {badge.title.replace(/\s\S+$/, "")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
