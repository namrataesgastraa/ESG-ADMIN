'use client';

import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const users = [
  { id: 1, name: "John Doe", email: "john@gmail.com", role: "Admin", status: "Active" },
  { id: 2, name: "Senior Developer", email: "senior@gmail.com", role: "Manager", status: "Active" },
];

export default function UserList() {
  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-4">
          <div className="brand-line" />

          <div>
            <h1 className="text-3xl font-bold text-astraa-dark tracking-tight">
              User Management
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage team members and permissions
            </p>
          </div>
        </div>

        <Link href="/users/create">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-astraa-violet text-white rounded-lg text-sm font-semibold hover:opacity-90 transition shadow-sm">
            <Plus size={16} />
            Add User
          </button>
        </Link>

      </div>


      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

        <table className="w-full">

          {/* Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
              <th className="px-8 py-4 text-left">Name</th>
              <th className="px-8 py-4 text-left">Email</th>
              <th className="px-8 py-4 text-left">Role</th>
              <th className="px-8 py-4 text-left">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>


          {/* Body */}
          <tbody className="text-sm">

            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >

                {/* Name */}
                <td className="px-8 py-5 font-semibold text-astraa-dark">
                  {user.name}
                </td>

                {/* Email */}
                <td className="px-8 py-5 text-gray-600">
                  {user.email}
                </td>

                {/* Role */}
                <td className="px-8 py-5 text-gray-700 font-medium">
                  {user.role}
                </td>

                {/* Status */}
                <td className="px-8 py-5">

                  <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700">

                    <span className="w-1.5 h-1.5 rounded-full bg-green-600" />

                    {user.status}

                  </span>

                </td>


                {/* Actions */}
                <td className="px-8 py-5">

                  <div className="flex justify-end items-center gap-4 text-gray-500">

                    <button className="hover:text-astraa-violet transition">
                      <Pencil size={17} />
                    </button>

                    <button className="hover:text-red-500 transition">
                      <Trash2 size={17} />
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}