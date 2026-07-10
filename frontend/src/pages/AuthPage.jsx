import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // State for login form fields
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // State for registration form fields 
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else if (user.role === "STAFF") {
          navigate("/staff", { replace: true });
        } else if (user.role === "CUSTOMER") {
          navigate("/customer", { replace: true });
        }
      } catch (e) {
        console.error("Failed to parse user role on load", e);
      }
    }
  }, [navigate]);

  // Validation function for registration
  const validateRegistration = () => {
    const { email, password, confirmPassword } = registerData;
    
    // Check if email contains @ and .
    if (!email.includes("@") || !email.includes(".")) {
      showToast("Please enter a valid email address.", "error");
      return false;
    }
    
    // Check password length
    if (password.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return false;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return false;
    }
    
    return true;
  };

  // Handle login form submission
  const handleLoginSubmit = async (e) => {  
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginUser(loginData.email, loginData.password);
      
      // Save token and user info
      const { accessToken, user } = response;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      
      showToast(response.message || "Login Successful");
      
      // Redirect based on role
      setTimeout(() => {
        const role = user.role;
        if (role === "ADMIN") {
          navigate("/admin");
        } else if (role === "STAFF") {
          navigate("/staff");
        } else if (role === "CUSTOMER") {
          navigate("/customer");
        } else {
          navigate("/"); 
        }
      }, 500);
      
    } catch (error) {
      console.log(error);
      showToast(
        error.response?.data?.message || "Login Failed. Please check your credentials.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration form submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRegistration()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await registerUser(
        registerData.username,
        registerData.email,
        registerData.password,
        registerData.confirmPassword
      );

      showToast(response.message || "Registration successful! You can now login.", "success");
      
      // Switch to login form
      setTimeout(() => {
        setIsLogin(true);
        // Clear registration form fields
        setRegisterData({
          email: "",
          password: "",
          confirmPassword: "",
        });
      }, 1000);
      
    } catch (error) {
  console.log("Error Response:", error.response);
  console.log("Error Data:", error.response?.data);
  console.log("Request Data:", registerData);

  showToast(
    error.response?.data?.message || "Registration Failed. Please try again.",
    "error"
  );
} finally {
  setIsLoading(false);
}
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Lights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-violet-500/10 blur-[120px]"></div>

      {/* Floating Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg bg-white animate-slide-in max-w-sm transition-all duration-300">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            toast.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}>
            {toast.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
              </svg>
            )}
          </div>
          <div className="text-sm font-semibold text-slate-700">
            {toast.message}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 z-10">
        
        {/* Brand Icon & Subtext */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-200 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6 text-white animate-bounce-slow"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-center text-slate-900 tracking-tight">
            {isLogin ? "Welcome Back" : "Register Profile"}
          </h2>
          <p className="text-slate-400 text-sm text-center mt-1">
            {isLogin ? "Sign in to access your dashboard" : "Create a customer account to begin"}
          </p>
        </div>
        
        {isLogin ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-400 transition"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-400 transition"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-3 rounded-xl font-bold transition shadow-lg cursor-pointer ${
                isLoading 
                  ? "bg-indigo-400 cursor-not-allowed shadow-indigo-100" 
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 hover:shadow-indigo-200"
              }`}
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>
        ) : (
          
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-5">

            {/* Username Field */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75a17.933 17.933 0 0 1-7.5-1.632Z"
                    />
                  </svg>
                </div>

                <input
                  type="text"
                  placeholder="Enter username"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-400 transition"
                  value={registerData.username}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      username: e.target.value,
                    })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </div>

                <input
                  type="email"
                  placeholder="name@email.com"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-400 transition"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      email: e.target.value,
                    })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                Must be a valid email containing '@' and '.'
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </div>

                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-400 transition"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                Password must contain at least 6 characters
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </div>

                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder-slate-400 transition"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-3 rounded-xl font-bold transition shadow-lg cursor-pointer ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed shadow-indigo-100"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 hover:shadow-indigo-200"
              }`}
            >
              {isLoading ? "Registering account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* Footer Toggle Switch */}
        <div className="mt-6 text-center text-sm font-medium text-slate-500">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-indigo-600 font-bold hover:underline ml-1 cursor-pointer"
                disabled={isLoading}
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-indigo-600 font-bold hover:underline ml-1 cursor-pointer"
                disabled={isLoading}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;