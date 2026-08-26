import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="empty-page">
      <h1>404</h1>
      <p>We couldn&apos;t find that page.</p>
      <Link to="/" className="btn-build-garden">Back to home</Link>
    </div>
  );
}

export default NotFound;
