import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getStaffProfile } from "../services/authService";

const StaffDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await getStaffProfile();
        setProfile(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to load staff profile:", err);
        setError(err.response?.data?.message || "Failed to load staff profile details");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Staff Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Welcome to the internal system administration workspace. Here is your profile information.
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
              <span className="text-xs font-semibold text-slate-500">Loading profile...</span>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span className="font-semibold">{error}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
            >
              Retry
            </button>
          </div>
        ) : profile ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Profile Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-semibold text-slate-500">Full Name</span>
                  <span className="text-sm font-bold text-slate-800">{profile.fullName || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-semibold text-slate-500">Username</span>
                  <span className="text-sm font-bold text-slate-800">{profile.username || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-semibold text-slate-500">Email</span>
                  <span className="text-sm font-bold text-slate-800">{profile.email || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-semibold text-slate-500">Role</span>
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                    {profile.role || "STAFF"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-slate-500">Account Status</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    profile.enabled ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {profile.enabled ? "Active" : "Disabled"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-slate-500">Joined</span>
                  <span className="text-sm font-bold text-slate-800">
                    {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }) : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition text-left flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </span>
                  View My Profile
                </button>
                <button className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition text-left flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h3.992v-.001M2.985 19.644v-4.828m2.086 2.086a4.5 4.5 0 01-2.086-.086M7.5 6.75v3.75M6 12h3m-3 0v3m3-3h3m-3 0v3m3-3h3m-3 0v3m3-3h3m-3 0v3" />
                    </svg>
                  </span>
                  Update Settings
                </button>
                <button className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition text-left flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                  </span>
                  View Tasks
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

// Only ONE export default statement
export default StaffDashboard;