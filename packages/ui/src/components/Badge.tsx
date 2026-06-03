import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-gold/20 text-brand-charcoal",
        success: "bg-zo-success-light text-zo-success",
        warning: "bg-zo-warning-light text-zo-warning",
        error: "bg-zo-error-light text-zo-error",
        info: "bg-zo-info-light text-zo-info",
        muted: "bg-zo-bg-light text-zo-muted",
        gold: "bg-brand-gold text-brand-charcoal",
        charcoal: "bg-brand-charcoal text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
