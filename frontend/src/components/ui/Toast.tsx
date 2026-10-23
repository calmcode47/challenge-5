import { X } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Toast as RadixToast } from "radix-ui";

/**
 * Toast notification variant tone.
 */
export type ToastVariant = "neutral" | "success" | "danger";

/**
 * Toast payload description.
 */
export interface ToastItem {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly variant?: ToastVariant;
}

interface ToastContextValue {
  readonly showToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Hook to trigger accessible notifications from any UI component.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

const variantBorders: Record<ToastVariant, string> = {
  neutral: "border-[var(--color-line)]",
  success: "border-[var(--color-success)]",
  danger: "border-[var(--color-danger)]",
};

/**
 * Provider component hosting the notification queue and Radix Toast viewport.
 *
 * @param props - { children: ReactNode }
 * @returns JSX.Element
 */
export function ToastProvider({ children }: { readonly children: ReactNode }): JSX.Element {
  const [toasts, setToasts] = useState<readonly ToastItem[]>([]);

  const showToast = (toast: Omit<ToastItem, "id">) => {
    const id = `toast-${Date.now().toString()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <RadixToast.Root
            key={t.id}
            onOpenChange={(open) => {
              if (!open) removeToast(t.id);
            }}
            className={`flex items-start justify-between gap-3 p-4 rounded-[var(--radius-control)] bg-[var(--color-surface)] ${variantBorders[t.variant ?? "neutral"]} border shadow-lg w-80 max-w-full`}
          >
            <div>
              <RadixToast.Title className="text-sm font-semibold text-[var(--color-text)]">
                {t.title}
              </RadixToast.Title>
              {t.description && (
                <RadixToast.Description className="text-xs text-[var(--color-muted)] mt-1">
                  {t.description}
                </RadixToast.Description>
              )}
            </div>
            <RadixToast.Close
              aria-label="Close notification"
              className="text-[var(--color-muted)] hover:text-[var(--color-text)] cursor-pointer p-1"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 w-auto max-w-[100vw] outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
