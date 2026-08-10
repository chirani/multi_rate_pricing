import { authClient } from '#/lib/auth-client';
import { Link } from '@tanstack/react-router';

export default function Navbar() {
  const { useSession } = authClient;
  const { data } = useSession();
  const userId = data?.user.id;

  return (
    <nav className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Document_Maker</a>
      </div>

      <div className="navbar-end gap-3">
        {!userId ? (
          <>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Signup
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
}
