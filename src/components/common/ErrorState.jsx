import Button from './Button';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-expense/10 border border-expense/20 flex items-center justify-center">
        <i className="fa-solid fa-triangle-exclamation text-expense text-2xl" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-text-primary">Something went wrong</h3>
        <p className="text-sm text-text-muted max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <i className="fa-solid fa-rotate-right" /> Try Again
        </Button>
      )}
    </div>
  );
}
