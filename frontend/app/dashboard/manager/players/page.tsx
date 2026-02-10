'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Player {
    id: number;
    position: string;
    status: string;
    user: {
        name: string;
        email: string;
        birth_date: string;
    };
}

export default function ManagerPlayersPage() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        api.get('/players').then(res => {
            setPlayers(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const filteredPlayers = players.filter(p => 
        p.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-4">Loading roster...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Academy Player Roster</h1>
                <div className="bg-white p-2 rounded shadow flex items-center">
                    <span className="text-gray-400 mr-2">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search players..." 
                        className="outline-none text-sm w-48"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-800 text-white uppercase">
                        <tr>
                            <th className="px-6 py-3">Player Name</th>
                            <th className="px-6 py-3">Position</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Age</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredPlayers.map(p => {
                            const age = p.user.birth_date 
                                ? new Date().getFullYear() - new Date(p.user.birth_date).getFullYear() 
                                : 'N/A';
                            
                            return (
                                <tr key={p.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-800">{p.user.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs uppercase font-semibold">
                                            {p.position}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs uppercase font-semibold ${p.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{p.user.email}</td>
                                    <td className="px-6 py-4 text-gray-500">{age}</td>
                                </tr>
                            );
                        })}
                        {filteredPlayers.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No players found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="text-right text-sm text-gray-500">
                Total Players: {filteredPlayers.length}
            </div>
        </div>
    );
}
