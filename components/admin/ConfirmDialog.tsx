"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const VARIANT_STYLES = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    confirmBtn: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    confirmBtn: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  info: {
    icon: AlertTriangle,
    iconBg: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
    confirmBtn: "bg-sky-600 hover:bg-sky-700 text-white",
  },
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = loading || internalLoading;
  const style = VARIANT_STYLES[variant];
  const Icon = style.icon;

  if (!open) return null;

  const handleConfirm = async () => {
    setInternalLoading(true);
    try {
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-[var(--color-background)] shadow-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="p-6">
          {/* Icon */}
          <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${style.iconBg}`}>
            <Icon className="h-6 w-6" />
          </div>

          {/* Content */}
          <h3 className="text-center text-lg font-semibold text-[var(--color-foreground)]">
            {title}
          </h3>
          <p className="mt-2 text-center text-sm text-[var(--color-muted)]">
            {description}
          </p>

          {/* Actions */}
          <div className="mt-6 flex gap-3 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className={`min-w-[100px] ${style.confirmBtn}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute right-3 top-3 rounded-full p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-surface)] transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
