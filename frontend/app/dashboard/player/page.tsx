'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';

export default function PlayerDashboard() {
  const { user, logout } = useAuth();
  const [trainings, setTrainings] = useState<any[]>([]);
  const [performances, setPerformances] = useState<any[]>([]);

  useEffect(() => {
    api.get('/trainings').then(res => setTrainings(res.data));
    api.get('/performances').then(res => setPerformances(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-green-700">My Training Schedule</h2>
          {trainings.length === 0 ? <p>No scheduled trainings.</p> : (
            <ul className="space-y-3">
              {trainings.map((t) => (
                <li key={t.id} className="border-b pb-2">
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-sm text-gray-500">{new Date(t.date).toLocaleString()}</div>
                  <div className="text-sm">{t.description}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-green-700">Performance History</h2>
          {performances.length === 0 ? <p>No records found.</p> : (
            <ul className="space-y-3">
              {performances.map((p) => (
                <li key={p.id} className="border-b pb-2">
                  <div className="font-semibold">Rating: {p.rating}/10</div>
                  <div className="text-sm text-gray-600">Coach: {p.coach?.name}</div>
                  <div className="text-sm italic">"{p.notes}"</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
