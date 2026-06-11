'use client';

import { UserPlus } from 'lucide-react';

export default function CreateUser() {
  return (
    <div className="max-w-5xl space-y-10 pb-20">

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="brand-line" />

        <div>
          <h1 className="text-3xl font-bold text-astraa-dark tracking-tight">
            Onboard New User
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Add a new member to your organization
          </p>
        </div>
      </div>


      {/* Form Container */}
      <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200">

        <form className="space-y-10">

          {/* Identity */}
          <div className="space-y-6">

            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Identity Information
            </h2>

            <div className="grid grid-cols-2 gap-8">

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  First Name
                </label>

                <input
                  type="text"
                  placeholder="John"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-astraa-violet focus:ring-2 focus:ring-astraa-violet/20 outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Last Name
                </label>

                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-astraa-violet focus:ring-2 focus:ring-astraa-violet/20 outline-none transition"
                />
              </div>

            </div>

          </div>


          {/* Credentials */}
          <div className="space-y-6">

            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Account Credentials
            </h2>

            <div className="grid grid-cols-2 gap-8">

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-astraa-violet focus:ring-2 focus:ring-astraa-violet/20 outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Initial Password
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-astraa-violet focus:ring-2 focus:ring-astraa-violet/20 outline-none transition"
                />
              </div>

            </div>

          </div>


          {/* Configuration */}
          <div className="space-y-6">

            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              User Configuration
            </h2>

            <div className="grid grid-cols-2 gap-8">

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  User Role
                </label>

                <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-astraa-violet focus:ring-2 focus:ring-astraa-violet/20 outline-none">
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Viewer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Account Status
                </label>

                <select className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-astraa-violet focus:ring-2 focus:ring-astraa-violet/20 outline-none">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

            </div>

          </div>


          {/* Actions */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-100">

            <button
              type="button"
              className="text-sm text-gray-500 font-medium hover:text-astraa-dark transition"
            >
              Cancel
            </button>

            <button
              className="flex items-center gap-2 px-6 py-3 bg-astraa-violet text-white rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-sm"
            >
              <UserPlus size={16} />
              Create Account
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}