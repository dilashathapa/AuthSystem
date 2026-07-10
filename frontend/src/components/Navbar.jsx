import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem("user");
  
  if (!userStr) return null;
  
  let user = { username: "User", role: "CUSTOMER", fullName: "User" };
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    console.error("Failed to parse user storage in Navbar", e);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  // Get Initials for Avatar
  const getInitials = () => {
    const name = user.fullName || user.username || "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Badge style based on role
  const getRoleBadgeClass = () => {
    switch (user.role) {
      case "ADMIN":
        return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
      case "STAFF":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "CUSTOMER":
      default:
        return "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20";
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-md shadow-indigo-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <Link
              to={user.role === "ADMIN" ? "/admin" : user.role === "STAFF" ? "/staff" : "/customer"}
              className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
            >
              AuthPortal
            </Link>
          </div>

          {/* User & Nav Actions */}
          <div className="flex items-center gap-6">
            {/* Context Navigation links for Admins */}
            {user.role === "ADMIN" && (
              <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-500">
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === "/admin"
                      ? "text-indigo-600 bg-indigo-50/50"
                      : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Admin Panel
                </Link>
                <Link
                  to="/staff"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === "/staff"
                      ? "text-indigo-600 bg-indigo-50/50"
                      : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Staff View
                </Link>
                <Link
                  to="/customer"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === "/customer"
                      ? "text-indigo-600 bg-indigo-50/50"
                      : "hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Customer View
                </Link>
              </div>
            )}

            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              {/* Profile Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 ring-2 ring-slate-200/50">
                {getInitials()}
              </div>
              
              {/* User Info & Badge */}
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-sm font-semibold text-slate-800">
                  {user.fullName || user.username}
                </span>
                <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getRoleBadgeClass()}`}>
                  {user.role}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="ml-2 flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all duration-200 cursor-pointer"
                title="Log Out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
