import { Link } from '@tanstack/react-router';

interface NavbarProps {
  isLoggedin: boolean;
}

export default function Navbar({ isLoggedin }: NavbarProps) {
  return (
    <nav className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Document_Maker</a>
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
          <></>
        )}
      </div>
    </nav>
  );
}
