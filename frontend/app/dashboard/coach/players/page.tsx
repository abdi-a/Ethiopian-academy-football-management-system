'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Player {
    id: number;
    position: string;
    status: string;
    user: {
        id: number;
        name: string;
        email: string;
        birth_date: string;
    };
    created_at: string;
}

export default function PlayersPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/players')
            .then(res => {
                setPlayers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch players", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading players...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Team Roster</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">Player Name</th>
                            <th className="px-6 py-3">Position</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Contact</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {players.length > 0 ? (
                            players.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                {p.user.name.charAt(0)}
                                            </div>
                                            {p.user.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{p.position || 'Unassigned'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs capitalize ${
                                            p.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{p.user.email}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 text-xs font-medium border border-blue-200 px-3 py-1 rounded">
                                            View Performance
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No players found in the system.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
