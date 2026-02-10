'use client';

import { useAuth } from '../../../context/AuthContext';

export default function ManagerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manager Dashboard</h1>
        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Academy Overview</h2>
              <div className="p-4 bg-green-50 rounded border border-green-200">
                  <p className="text-green-800">System is active. Players are registering and Coaches are scheduling sessions.</p>
              </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
               <h2 className="text-xl font-bold mb-4">Reports</h2>
               <p className="text-gray-500">No reports generated yet.</p>
          </div>
      </div>
    </div>
  );
}
