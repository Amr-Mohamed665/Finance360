import { useState } from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  icon,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {label}
          {required && <span className="text-expense ml-1">*</span>}
        </label>
      )}

      <div
        className={[
          'relative flex items-center rounded-md border bg-bg-tertiary/60 backdrop-blur-sm transition-all duration-150',
          error
            ? 'border-expense/60 shadow-[0_0_12px_rgba(244,63,94,0.15)]'
            : 'border-border focus-within:border-accent-primary/50 focus-within:shadow-[0_0_12px_rgba(99,102,241,0.15)]',
        ].join(' ')}
      >
        {icon && (
          <span className="px-3 text-text-muted text-sm flex-shrink-0">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={[
            'w-full bg-transparent py-2.5 text-sm text-text-primary placeholder-text-muted outline-none',
            icon ? 'pl-2.5 pr-10' : 'pl-3 pr-10',
          ].join(' ')}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 text-text-muted hover:text-text-primary focus:outline-none transition-colors p-1 flex items-center justify-center"
            title={showPassword ? "Hide password" : "Show password"}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <i className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-sm`} />
          </button>
        )}
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

