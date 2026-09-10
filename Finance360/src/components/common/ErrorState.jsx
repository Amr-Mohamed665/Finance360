import Button from './Button';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4 animate-fade-in">
      {/* Animated Spinner */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-accent-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-primary animate-spin-slow" />
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-accent-secondary animate-spin-slow [animation-duration:0.7s]" />
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
