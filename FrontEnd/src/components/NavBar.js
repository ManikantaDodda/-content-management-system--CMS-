"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NavBar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadUser = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token)
  }
  useEffect(() => {
    const handleAuthChange = () => loadUser();
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear();
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="bg-blue-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/">CMS</Link>
        </div>
        <ul className="flex space-x-6 items-center">
          <li>
            <Link href="/" className="hover:underline">
              All Posts
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link href="/create_post" className="hover:underline">
                  Create New Post
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:underline">
                  Your Posts
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:underline">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
