const variantClasses = {
  primary:
    'bg-gradient-primary text-white shadow-glow hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
  secondary:
    'bg-transparent text-text-secondary border border-border hover:border-border-hover hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed',
  danger:
    'bg-gradient-expense text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed',
  ghost:
    'bg-bg-hover text-text-secondary hover:text-text-primary hover:bg-white/[0.08] disabled:opacity-40 disabled:cursor-not-allowed',
};

const sizeClasses = {
  small:  'px-3 py-1.5 text-xs rounded-md gap-1.5',
  medium: 'px-4 py-2 text-sm rounded-md gap-2',
  large:  'px-6 py-3 text-sm rounded-lg gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center font-semibold transition-all duration-150 ease-smooth cursor-pointer select-none',
        variantClasses[variant] ?? variantClasses.primary,
        sizeClasses[size] ?? sizeClasses.medium,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
