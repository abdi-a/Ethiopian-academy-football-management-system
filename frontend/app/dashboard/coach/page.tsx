'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';

export default function CoachDashboard() {
  const { user, logout } = useAuth();
  const [trainings, setTrainings] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  
  // Forms
  const [newTraining, setNewTraining] = useState({ title: '', date: '', description: '' });
  const [performance, setPerformance] = useState({ player_id: '', rating: 5, notes: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.get('/trainings').then(res => setTrainings(res.data));
    api.get('/players').then(res => setPlayers(res.data));
  }

  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/trainings', newTraining);
    setNewTraining({ title: '', date: '', description: '' });
    fetchData();
  };

  const handleAddPerformance = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!performance.player_id) return alert("Select a player");
    await api.post('/performances', performance);
    setPerformance({ player_id: '', rating: 5, notes: '' });
    alert("Performance recorded!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Coach Dashboard - {user?.name}</h1>
        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Training Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Schedule Training</h2>
          <form onSubmit={handleCreateTraining} className="space-y-3 mb-6">
            <input placeholder="Title" className="border p-2 w-full rounded" value={newTraining.title} onChange={e => setNewTraining({...newTraining, title: e.target.value})} required />
            <input type="datetime-local" className="border p-2 w-full rounded" value={newTraining.date} onChange={e => setNewTraining({...newTraining, date: e.target.value})} required />
            <textarea placeholder="Description" className="border p-2 w-full rounded" value={newTraining.description} onChange={e => setNewTraining({...newTraining, description: e.target.value})} required />
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Add Session</button>
          </form>

          <h3 className="font-bold border-b pb-2 mb-2">Upcoming Sessions</h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
             {trainings.map(t => (
                 <li key={t.id} className="text-sm border p-2 rounded">
                     <strong>{t.title}</strong> - {new Date(t.date).toLocaleString()}
                 </li>
             ))}
          </ul>
        </div>

        {/* Performance Management */}
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Record Performance</h2>
            <form onSubmit={handleAddPerformance} className="space-y-3">
                <select className="border p-2 w-full rounded" value={performance.player_id} onChange={e => setPerformance({...performance, player_id: e.target.value})} required>
                    <option value="">Select Player</option>
                    {players.map(p => (
                        <option key={p.id} value={p.id}>{p.user.name} ({p.position || 'No Pos'})</option>
                    ))}
                </select>
                <div>
                    <label>Rating (1-10): {performance.rating}</label>
                    <input type="range" min="1" max="10" className="w-full" value={performance.rating} onChange={e => setPerformance({...performance, rating: parseInt(e.target.value)})} />
                </div>
                <textarea placeholder="Performance Notes" className="border p-2 w-full rounded" value={performance.notes} onChange={e => setPerformance({...performance, notes: e.target.value})} />
                <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Save Record</button>
            </form>
        </div>

      </div>
    </div>
  );
}
