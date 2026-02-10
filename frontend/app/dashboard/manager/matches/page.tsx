'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Team {
    id: number;
    name: string;
}

interface Game {
    id: number;
    team_home_id: number;
    team_away_id?: number;
    opponent_name?: string;
    match_date: string;
    location: string;
    score_home?: number;
    score_away?: number;
    status: string;
    home_team: Team;
    away_team?: Team;
}

export default function ManagerMatchesPage() {
    const [matches, setMatches] = useState<Game[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [formData, setFormData] = useState({
        team_home_id: '',
        team_away_id: '',
        opponent_name: '',
        match_date: '',
        location: 'Main Stadium',
        is_internal: true
    });

    useEffect(() => {
        fetchMatches();
        fetchTeams();
    }, []);

    const fetchMatches = () => {
        api.get('/games').then(res => {
            setMatches(res.data);
            setLoading(false);
        });
    };

    const fetchTeams = () => {
        api.get('/teams').then(res => setTeams(res.data));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: any = {
                team_home_id: formData.team_home_id,
                match_date: formData.match_date,
                location: formData.location,
            };

            if (formData.is_internal) {
                payload.team_away_id = formData.team_away_id;
            } else {
                payload.opponent_name = formData.opponent_name;
            }

            await api.post('/games', payload);
            setIsCreateOpen(false);
            fetchMatches();
        } catch (e) {
            alert('Failed to schedule match');
        }
    };

    const handleDelete = async (id: number) => {
        if(confirm('Cancel this match?')) {
            await api.delete(`/games/${id}`);
            fetchMatches();
        }
    };

    const handleScoreUpdate = async (game: Game) => {
        const scoreHome = prompt("Home Score:", game.score_home?.toString() || "0");
        const scoreAway = prompt("Away Score:", game.score_away?.toString() || "0");
        
        if (scoreHome !== null && scoreAway !== null) {
            await api.put(`/games/${game.id}`, {
                score_home: parseInt(scoreHome),
                score_away: parseInt(scoreAway),
                status: 'Completed'
            });
            fetchMatches();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Match Schedules</h1>
                <button 
                    onClick={() => setIsCreateOpen(!isCreateOpen)}
                    className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
                >
                    {isCreateOpen ? 'Cancel' : '+ Schedule Match'}
                </button>
            </div>

            {isCreateOpen && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-green-100 animate-fade-in-down">
                    <h3 className="font-bold mb-4">Schedule New Match</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Home Team (Our Team)</label>
                            <select 
                                required
                                className="w-full border p-2 rounded"
                                value={formData.team_home_id}
                                onChange={e => setFormData({...formData, team_home_id: e.target.value})}
                            >
                                <option value="">-- Select Team --</option>
                                {teams.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Date & Time</label>
                            <input 
                                required
                                type="datetime-local"
                                className="w-full border p-2 rounded"
                                value={formData.match_date}
                                onChange={e => setFormData({...formData, match_date: e.target.value})}
                            />
                        </div>

                        <div className="md:col-span-2">
                             <div className="flex items-center mb-2">
                                <input 
                                    type="checkbox" 
                                    id="isInternal"
                                    checked={formData.is_internal}
                                    onChange={e => setFormData({...formData, is_internal: e.target.checked})}
                                    className="mr-2"
                                />
                                <label htmlFor="isInternal" className="text-sm">Academy Internal Match? (Team vs Team)</label>
                            </div>
                        </div>

                        {formData.is_internal ? (
                             <div>
                                <label className="block text-sm font-medium mb-1">Away Team (Opponent)</label>
                                <select 
                                    required
                                    className="w-full border p-2 rounded"
                                    value={formData.team_away_id}
                                    onChange={e => setFormData({...formData, team_away_id: e.target.value})}
                                >
                                    <option value="">-- Select Opponent --</option>
                                    {teams.filter(t => t.id.toString() !== formData.team_home_id).map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium mb-1">External Opponent Name</label>
                                <input 
                                    required
                                    className="w-full border p-2 rounded"
                                    placeholder="e.g. St. George FC U17"
                                    value={formData.opponent_name}
                                    onChange={e => setFormData({...formData, opponent_name: e.target.value})}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input 
                                className="w-full border p-2 rounded"
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                            />
                        </div>

                        <div className="md:col-span-2 text-right">
                            <button className="bg-green-600 text-white px-6 py-2 rounded font-medium hover:bg-green-700">
                                Save Schedule
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Fixture</th>
                            <th className="px-6 py-3">Location</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {matches.map(m => {
                            const date = new Date(m.match_date);
                            const opponent = m.away_team ? m.away_team.name : m.opponent_name;
                            
                            return (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800">{date.toLocaleDateString()}</div>
                                        <div className="text-xs text-gray-500">{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-blue-800">{m.home_team?.name}</span>
                                            <span className="text-gray-400 font-bold">VS</span>
                                            <span className="font-bold text-red-800">{opponent}</span>
                                        </div> 
                                        {m.status === 'Completed' && (
                                            <div className="text-sm font-mono mt-1 bg-gray-100 inline-block px-2 rounded">
                                                {m.score_home} - {m.score_away}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{m.location}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs uppercase font-semibold ${m.status === 'Completed' ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                                            {m.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleScoreUpdate(m)} className="text-blue-600 hover:text-blue-800 font-medium text-xs">Update Score</button>
                                        <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-600 font-medium text-xs">Cancel</button>
                                    </td>
                                </tr>
                            );
                        })}
                        {matches.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No matches scheduled.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
