import './TransactionSearch.css';

export default function TransactionSearch({ value, onChange }) {
  return (
    <div className="tx-search">
      <span className="tx-search__icon"><i className="fa-solid fa-magnifying-glass"></i></span>
      <input
        type="text"
        className="tx-search__input"
        placeholder="Search by description or category..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="tx-search__clear" onClick={() => onChange('')}>
          ✕
        </button>
      )}
    </div>
  );
}
