export default function Card({ title, action, children, className = '' }) {
  return (
    <div
      className={[
        'glass-panel rounded-lg p-5 flex flex-col gap-4',
        className,
      ].join(' ')}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-2">
          {title && (
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              {title}
            </h3>
          )}
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
