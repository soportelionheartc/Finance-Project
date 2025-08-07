import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeDeltaProps = {
  deltaType: "increase" | "decrease" | "unchanged";
  className?: string;
  children: React.ReactNode;
};

export function BadgeDelta({ deltaType, className, children }: BadgeDeltaProps) {
  const variantMap = {
    increase: {
      classes: "bg-green-500/10 text-green-500 border-green-500/20",
      icon: <ArrowUp className="h-3 w-3 text-green-500" />
    },
    decrease: {
      classes: "bg-red-500/10 text-red-500 border-red-500/20",
      icon: <ArrowDown className="h-3 w-3 text-red-500" />
    },
    unchanged: {
      classes: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      icon: <ArrowRight className="h-3 w-3 text-gray-500" />
    }
  };

  const { classes, icon } = variantMap[deltaType];

  return (
    <Badge className={cn(classes, className)}>
      <div className="flex items-center gap-1">
        {children}
        {icon}
      </div>
    </Badge>
  );
}