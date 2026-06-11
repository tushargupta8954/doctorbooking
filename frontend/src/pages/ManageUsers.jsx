import React from 'react';
import { FiUsers, FiTrash2, FiEdit } from 'react-icons/fi';

const ManageUsers = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold">Manage Users</h1>
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="py-4">John Doe</td>
                <td className="py-4">john@example.com</td>
                <td className="py-4">Patient</td>
                <td className="py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    Active
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex space-x-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <FiEdit className="text-blue-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <FiTrash2 className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;