import Button from './Button';

export default function EmptyState({ icon = '📭', title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-bg-tertiary/60 border border-border flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        <p className="text-sm text-text-muted max-w-xs">{message}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
