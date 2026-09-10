export default function TransactionSearch({ value, onChange }) {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-text-muted text-sm pointer-events-none">
        <i className="fa-solid fa-magnifying-glass" />
      </span>
      <input
        type="text"
        className="w-full bg-bg-tertiary/60 border border-border rounded-lg pl-9 pr-9 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition-all duration-150 focus:border-accent-primary/50 focus:shadow-[0_0_12px_rgba(99,102,241,0.15)] backdrop-blur-sm"
        placeholder="Search by description or category..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="absolute right-3 text-text-muted hover:text-text-primary transition-colors duration-150 text-sm"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      )}
    </div>
  );
}
