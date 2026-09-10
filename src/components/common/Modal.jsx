import { useEffect } from "react";
import { createPortal } from "react-dom";

const sizeClasses = {
  small: "max-w-sm",
  medium: "max-w-lg",
  large: "max-w-2xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Fullscreen Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-md bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Centering Wrapper */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Panel */}
        <div
          className={[
            "relative z-10 w-full text-left animate-slide-up my-6",
            "glass-panel rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh]",
            sizeClasses[size] ?? sizeClasses.medium,
          ].join(" ")}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
            <h2 className="text-base font-bold text-text-primary">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all duration-150"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
