export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-5">
      {/* Spinner */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-accent-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-primary animate-spin-slow" />
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-accent-secondary animate-spin-slow [animation-duration:0.7s]" />
      </div>

      <p className="text-sm text-text-muted animate-pulse">{message}</p>
    </div>
  );
}
