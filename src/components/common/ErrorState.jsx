import Button from './Button';
import './ErrorState.css';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="error-state">
      <span className="error-state__icon">⚠️</span>
      <h3 className="error-state__title">Oops!</h3>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
