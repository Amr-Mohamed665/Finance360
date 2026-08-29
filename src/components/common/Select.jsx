import './Select.css';

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
    <div className="select-group">
      {label && (
        <label htmlFor={id} className="select-label">
          {label} {required && <span className="select-required">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`select-field ${error ? 'select-field--error' : ''}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="select-error">{error}</span>}
    </div>
  );
}
