'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Performance {
    id: number;
    rating: number;
    notes: string;
    created_at: string;
    player: {
        id: number;
        user: { name: string; }
    };
    coach: {
        name: string;
    };
}

export default function PerformancePage() {
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [players, setPlayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form
    const [formData, setFormData] = useState({
        player_id: '',
        rating: 5,
        notes: ''
    });

    useEffect(() => {
        fetchData();
        fetchPlayers();
    }, []);

    const fetchData = () => {
        api.get('/performances').then(res => {
            setPerformances(res.data);
            setLoading(false);
        });
    };

    const fetchPlayers = () => {
        api.get('/players').then(res => setPlayers(res.data));
    };

    const handleDelete = async (id: number) => {
        if(confirm('Delete this record?')) {
            await api.delete(`/performances/${id}`);
            fetchData();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/performances', formData);
            setIsCreateOpen(false);
            setFormData({ player_id: '', rating: 5, notes: '' });
            fetchData();
        } catch (e) {
            alert('Failed to save');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Player Performance Records</h1>
                <button 
                    onClick={() => setIsCreateOpen(!isCreateOpen)}
                    className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                >
                    {isCreateOpen ? 'Cancel' : '+ Add Record'}
                </button>
            </div>

            {/* Quick Add Form */}
            {isCreateOpen && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 animate-fade-in-down">
                    <h3 className="font-bold mb-4">New Performance Review</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Select Player</label>
                            <select 
                                required
                                className="w-full border p-2 rounded"
                                value={formData.player_id}
                                onChange={e => setFormData({...formData, player_id: e.target.value})}
                            >
                                <option value="">-- Choose Player --</option>
                                {players.map(p => (
                                    <option key={p.id} value={p.id}>{p.user.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Rating (1-10): {formData.rating}</label>
                            <input 
                                type="range" min="1" max="10" 
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                value={formData.rating}
                                onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Coach Notes</label>
                            <textarea 
                                required
                                className="w-full border p-2 rounded h-20"
                                placeholder="Feedback on today's session..."
                                value={formData.notes}
                                onChange={e => setFormData({...formData, notes: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-2 text-right">
                            <button className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700">
                                Save Record
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Player</th>
                            <th className="px-6 py-3">Rating</th>
                            <th className="px-6 py-3">Notes</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {performances.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{new Date(p.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium">{p.player?.user?.name || 'Unknown'}</td>
                                <td className="px-6 py-4">
                                    <span className={`font-bold px-2 py-1 rounded ${p.rating >= 8 ? 'bg-green-100 text-green-800' : p.rating >= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        {p.rating}/10
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 italic max-w-xs">{p.notes}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {performances.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
