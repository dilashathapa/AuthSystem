import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getStaffProfile } from "../services/authService";

const StaffDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getStaffProfile();
        setProfile(response.data);
      } catch (err) {
        console.error("Failed to load staff profile", err);
        setError(err.response?.data?.message || "Failed to load staff profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Staff Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Welcome to the internal system administration workspace. Here is your profile information.
          </p>
        </div>

        {/* Profile Card Block */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
              <span className="text-xs font-semibold text-slate-500">Retrieving profile...</span>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-6 text-center text-rose-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mx-auto h-8 w-8 text-rose-500 mb-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <p className="font-semibold">{error}</p>
          </div>
        ) : (
          <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            {/* Profile Intro Card */}
            <div className="flex items-center gap-6 border-b border-slate-100 pb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl font-bold text-indigo-600">
                {(profile.fullName || profile.username || "S").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {profile.fullName || "Unnamed Staff Member"}
                </h2>
                <div className="mt-1.5 flex flex-wrap gap-2 items-center">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 border border-indigo-150 px-2.5 py-0.5 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    {profile.role}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border uppercase tracking-wider ${
                      profile.enabled
                        ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {profile.enabled ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Detail Fields */}
            <div className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Account ID
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  #{profile.id}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Username
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {profile.username}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email Address
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {profile.email}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  System Role
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {profile.role}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Account Registered Since
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDate(profile.createdAt)}
                </dd>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffDashboard;
