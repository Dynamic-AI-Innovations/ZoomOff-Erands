import * as React from "react";
import { cn } from "../lib/cn";

export type RunnerTier = "standard" | "verified" | "elite";

const TIER_STYLES: Record<RunnerTier, string> = {
  standard: "bg-gray-400 text-white",
  verified: "bg-zo-info text-white",
  elite: "bg-brand-gold text-brand-charcoal",
};

const TIER_LABELS: Record<RunnerTier, string> = {
  standard: "S",
  verified: "V",
  elite: "E",
};

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  tier?: RunnerTier;
  className?: string;
}

const SIZE_CLASSES = {
  xs: "h-6 w-6 text-2xs",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const BADGE_SIZES = {
  xs: "h-2.5 w-2.5 text-[6px]",
  sm: "h-3 w-3 text-[7px]",
  md: "h-4 w-4 text-[8px]",
  lg: "h-5 w-5 text-[9px]",
  xl: "h-6 w-6 text-xs",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function Avatar({ src, name, size = "md", tier, className }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold overflow-hidden",
          "bg-brand-charcoal text-white select-none",
          SIZE_CLASSES[size]
        )}
        aria-hidden="true"
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          getInitials(name)
        )}
      </div>
      {tier && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full font-bold ring-2 ring-white",
            BADGE_SIZES[size],
            TIER_STYLES[tier]
          )}
          aria-label={`${tier} tier`}
        >
          {TIER_LABELS[tier]}
        </span>
      )}
    </div>
  );
}

export { Avatar };
export type { AvatarProps };
