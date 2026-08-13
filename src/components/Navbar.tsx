import { authClient } from '#/lib/auth-client';
import { Link, useRouter } from '@tanstack/react-router';

interface NavbarProps {
  isLoggedin: boolean;
}

export default function Navbar({ isLoggedin }: NavbarProps) {
  const router = useRouter();
  const { refetch } = authClient.useSession();

  return (
    <nav className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Document_Maker
        </Link>
      </div>

      <div className="navbar-end gap-3">
        {!isLoggedin ? (
          <>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Signup
            </Link>
          </>
        ) : (
          <>
            <button
              className="btn btn-ghost"
              onMouseDown={async () => {
                await authClient.signOut();
                await refetch();
                router.invalidate();
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
