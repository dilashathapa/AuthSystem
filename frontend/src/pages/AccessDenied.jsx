import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");

  const handleReturn = () => {
    if (!userStr) {
      navigate("/", { replace: true });
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      switch (user.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "STAFF":
          navigate("/staff");
          break;
        case "CUSTOMER":
        default:
          navigate("/customer");
          break;
      }
    } catch (e) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 flex flex-col items-center">
        {/* Lock Shield Icon */}
        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-rose-50 border-4 border-rose-100 mb-6 text-rose-500 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
          Access Denied
        </h1>
        <span className="text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-3 py-1 rounded-full mb-6">
          Error 403: Forbidden
        </span>

        {/* Description */}
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          You do not have the required permissions to access this page. Please return to your designated dashboard area.
        </p>

        {/* Action Button */}
        <button
          onClick={handleReturn}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-md shadow-slate-200 cursor-pointer"
        >
          Return to Safety
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
