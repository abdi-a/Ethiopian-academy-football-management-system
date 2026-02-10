'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Player {
    id: number;
    status: string;
    position: string;
    user: {
        name: string;
        email: string;
    };
}

export default function AdminApprovalsPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = () => {
        api.get('/players').then(res => {
            setPlayers(res.data);
            setLoading(false);
        });
    };

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            await api.put(`/players/${id}`, { status: newStatus });
            // Optimistic update
            setPlayers(players.map(p => p.id === id ? { ...p, status: newStatus } : p));
        } catch (e) {
            alert('Status update failed');
        }
    };

    if (loading) return <div className="p-4">Loading players...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Player Status Management</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-800 text-white uppercase">
                        <tr>
                            <th className="px-6 py-3">Player</th>
                            <th className="px-6 py-3">Current Status</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {players.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{p.user?.name || 'Unknown'}</div>
                                    <div className="text-gray-500 text-xs">{p.user?.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs uppercase font-semibold 
                                        ${p.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                          p.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-red-100 text-red-800'}`}>
                                        {p.status || 'Unknown'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <button 
                                        onClick={() => updateStatus(p.id, 'Active')}
                                        className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition text-xs font-bold"
                                        disabled={p.status === 'Active'}
                                    >
                                        Approve / Activate
                                    </button>
                                    <button 
                                        onClick={() => updateStatus(p.id, 'Suspended')}
                                        className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition text-xs font-bold"
                                        disabled={p.status === 'Suspended'}
                                    >
                                        Suspend
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {players.length === 0 && (
                            <tr><td colSpan={3} className="text-center py-8 text-gray-500">No registered players found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
