import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const isDashboardPage = router.pathname === "/dashboard";

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center space-x-4 px-4 py-2">
          <Link href="/" className="text-xl font-bold">
            EventEase
          </Link>
        </div>
        <div>
          {isLoggedIn && (
            <Link href="/create-event">
              <span className="px-4 py-2 mr-5 bg-yellow-500 text-white rounded">
                Create Event
              </span>
            </Link>
          )}
          {isLoggedIn && !isDashboardPage && (
            <Link href="/dashboard">
              <span className="px-4 py-2 bg-yellow-500 text-white rounded">
                Dashboard
              </span>
            </Link>
          )}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login">
                <span className="px-4 py-2 bg-yellow-500 text-white rounded">
                  Login
                </span>
              </Link>
              <Link href="/register">
                <span className="px-4 py-2 ml-4 bg-yellow-500 text-white rounded">
                  Register
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
