"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/cn";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-[95vw]",
};

function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  size = "md",
  showClose = true,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
            "w-full rounded-2xl bg-white shadow-modal",
            "data-[state=open]:animate-slide-up",
            "focus:outline-none",
            "max-h-[90vh] overflow-y-auto",
            sizeClasses[size],
            className
          )}
          aria-describedby={description ? "modal-description" : undefined}
        >
          {(title ?? showClose) && (
            <div className="flex items-center justify-between border-b border-zo-border px-6 py-4">
              {title && (
                <Dialog.Title className="text-lg font-semibold text-brand-charcoal">
                  {title}
                </Dialog.Title>
              )}
              {showClose && (
                <Dialog.Close
                  className="ml-auto rounded-lg p-1.5 text-zo-muted hover:bg-zo-bg-light hover:text-brand-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Dialog.Close>
              )}
            </div>
          )}
          {description && (
            <Dialog.Description id="modal-description" className="sr-only">
              {description}
            </Dialog.Description>
          )}
          <div className="p-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { Modal };
export type { ModalProps };
