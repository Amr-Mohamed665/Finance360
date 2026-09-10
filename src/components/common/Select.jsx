export default function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error,
  required = false,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}
          {required && <span className="text-expense ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={[
            'w-full appearance-none rounded-md border bg-bg-tertiary/60 px-3 py-2.5 pr-9 text-sm text-text-primary outline-none transition-all duration-150 cursor-pointer backdrop-blur-sm',
            error
              ? 'border-expense/60 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
              : 'border-border focus:border-accent-primary/50 focus:shadow-[0_0_12px_rgba(99,102,241,0.15)]',
          ].join(' ')}
          {...props}
        >
          <option value="" className="bg-bg-secondary text-text-muted">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-bg-secondary text-text-primary">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">
          <i className="fa-solid fa-chevron-down" />
        </span>
      </div>

      {error && (
        <span className="text-xs text-expense flex items-center gap-1">
          <i className="fa-solid fa-circle-exclamation text-[10px]" />
          {error}
        </span>
      )}
    </div>
  );
}
