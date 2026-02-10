'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">All Users</h2>
          <table className="min-w-full text-left">
              <thead>
                  <tr className="border-b">
                      <th className="p-2">Name</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Joined</th>
                  </tr>
              </thead>
              <tbody>
                  {users.map(u => (
                      <tr key={u.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{u.name}</td>
                          <td className="p-2">{u.email}</td>
                          <td className="p-2 capitalize"><span className={`px-2 py-1 rounded text-xs ${u.role === 'admin' ? 'bg-red-100' : 'bg-blue-100'}`}>{u.role}</span></td>
                          <td className="p-2 text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
}
