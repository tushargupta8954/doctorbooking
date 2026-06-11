import React from 'react';
import { FiUsers, FiCheck, FiX } from 'react-icons/fi';

const ManageDoctors = () => {
  const doctors = [
    { id: 1, name: 'Dr. Smith', specialization: 'Cardiology', status: 'verified' },
    { id: 2, name: 'Dr. Johnson', specialization: 'Neurology', status: 'pending' },
    // Add more dummy data
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold">Manage Doctors</h1>
      
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b dark:border-gray-700">
                <th className="pb-3 font-semibold">Doctor</th>
                <th className="pb-3 font-semibold">Specialization</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="border-b dark:border-gray-700">
                  <td className="py-4">{doctor.name}</td>
                  <td className="py-4">{doctor.specialization}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      doctor.status === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doctor.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <FiCheck />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <FiX />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;