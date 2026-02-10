'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface Player {
    id: number;
    team_id: number | null;
    position: string;
    user: {
        name: string;
        email: string;
    };
}

interface Team {
    id: number;
    name: string;
    category: string;
    description: string;
    players: Player[];
}

export default function TeamRosterPage({ params }: { params: { teamId: string } }) {
    const router = useRouter();
    const [team, setTeam] = useState<Team | null>(null);
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [teamRes, playersRes] = await Promise.all([
                api.get(`/teams/${params.teamId}`),
                api.get('/players')
            ]);
            setTeam(teamRes.data);
            
            // Filter players who don't have a team yet (team_id is null)
            const allPlayers = playersRes.data;
            setAvailablePlayers(allPlayers.filter((p: Player) => p.team_id === null));
        } catch (error) {
            alert('Error loading team details');
            router.push('/dashboard/manager/teams');
        } finally {
            setLoading(false);
        }
    };

    const addToTeam = async (playerId: number) => {
        try {
            await api.put(`/players/${playerId}`, { team_id: params.teamId });
            fetchData(); // Refresh both lists
        } catch (e) {
            alert('Failed to add player');
        }
    };

    const removeFromTeam = async (playerId: number) => {
        if(confirm('Remove player from this team?')) {
            try {
                await api.put(`/players/${playerId}`, { team_id: null });
                fetchData();
            } catch (e) {
                alert('Failed to remove player');
            }
        }
    };

    if (loading || !team) return <div className="p-4">Loading roster...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <button 
                        onClick={() => router.back()} 
                        className="text-gray-500 hover:text-gray-800 text-sm mb-2"
                    >
                        ← Back to Teams
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">{team.name} <span className="text-gray-400 font-normal">({team.category})</span></h1>
                    <p className="text-gray-500">{team.description}</p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold">
                    Total Players: {team.players.length}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Available Players Column */}
                <div className="bg-white p-6 rounded-lg shadow h-[600px] overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4 text-gray-700 border-b pb-2">Available Players (Free Agents)</h2>
                    <div className="space-y-2">
                        {availablePlayers.map(p => (
                            <div key={p.id} className="flex justify-between items-center p-3 hover:bg-gray-50 border rounded transition">
                                <div>
                                    <div className="font-bold text-gray-800">{p.user.name}</div>
                                    <div className="text-xs text-gray-500">{p.position} • {p.user.email}</div>
                                </div>
                                <button 
                                    onClick={() => addToTeam(p.id)}
                                    className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold hover:bg-green-200"
                                >
                                    + Add
                                </button>
                            </div>
                        ))}
                        {availablePlayers.length === 0 && <p className="text-gray-400 italic text-center text-sm mt-4">No unassigned players found.</p>}
                    </div>
                </div>

                {/* Current Roster Column */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner border h-[600px] overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4 text-green-800 border-b pb-2">Current Roster</h2>
                    <div className="space-y-2">
                        {team.players.map(p => (
                            <div key={p.id} className="flex justify-between items-center p-3 bg-white shadow-sm border rounded">
                                <div>
                                    <div className="font-bold text-gray-800">{p.user.name}</div>
                                    <div className="text-xs text-gray-500">{p.position}</div>
                                </div>
                                <button 
                                    onClick={() => removeFromTeam(p.id)}
                                    className="text-red-400 hover:text-red-600 text-sm font-medium px-2"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        {team.players.length === 0 && <p className="text-gray-400 italic text-center text-sm mt-4">This team has no players yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
