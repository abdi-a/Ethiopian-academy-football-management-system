'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Team {
    id: number;
    name: string;
    category: string;
    coach?: {
        name: string;
    };
    description: string;
    players_count?: number;
    players?: any[];
}

interface Coach {
    id: number;
    name: string;
}

export default function ManagerTeamsPage() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        category: 'U17',
        coach_id: '',
        description: ''
    });

    useEffect(() => {
        fetchData();
        fetchCoaches();
    }, []);

    const fetchData = () => {
        api.get('/teams').then(res => {
            setTeams(res.data);
            setLoading(false);
        });
    };

    const fetchCoaches = () => {
        api.get('/users').then(res => {
            const allUsers = res.data; // Ideally, backend filters this, but filtering here for now
            setCoaches(allUsers.filter((u: any) => u.role === 'coach'));
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/teams', formData);
            setIsCreateOpen(false);
            setFormData({ name: '', category: 'U17', coach_id: '', description: '' });
            fetchData();
        } catch (e) {
            alert('Failed to create team');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this team?')) {
            await api.delete(`/teams/${id}`);
            fetchData();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Team Management</h1>
                <button 
                    onClick={() => setIsCreateOpen(!isCreateOpen)}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                    {isCreateOpen ? 'Cancel' : '+ Create New Team'}
                </button>
            </div>

            {isCreateOpen && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100 animate-fade-in-down">
                    <h3 className="font-bold mb-4">Create Team</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Team Name</label>
                            <input 
                                required
                                className="w-full border p-2 rounded"
                                placeholder="e.g. Eagles U17"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select 
                                className="w-full border p-2 rounded"
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="U15">U15 (Under 15)</option>
                                <option value="U17">U17 (Under 17)</option>
                                <option value="U20">U20 (Under 20)</option>
                                <option value="Sen">Senior Team</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Head Coach</label>
                            <select 
                                className="w-full border p-2 rounded"
                                value={formData.coach_id}
                                onChange={e => setFormData({...formData, coach_id: e.target.value})}
                            >
                                <option value="">-- Assign Coach --</option>
                                {coaches.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <input 
                                className="w-full border p-2 rounded"
                                placeholder="Brief description..."
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-2 text-right">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">
                                Save Team
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                    <div key={team.id} className="bg-white p-6 rounded-lg shadow border-t-4 border-indigo-500">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
                            <button onClick={() => handleDelete(team.id)} className="text-red-400 hover:text-red-600">×</button>
                        </div>
                        
                        <div className="mt-2 space-y-2 text-sm text-gray-600">
                            <div><span className="font-semibold">Category:</span> {team.category}</div>
                            <div><span className="font-semibold">Head Coach:</span> {team.coach?.name || 'Unassigned'}</div>
                            <div><span className="font-semibold">Roster:</span> {team.players?.length || 0} players</div>
                        </div>

                        <div className="mt-4 pt-4 border-t flex justify-end">
                            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Manage Roster →</button>
                        </div>
                    </div>
                ))}
            </div>

            {teams.length === 0 && !loading && (
                <p className="text-center text-gray-500 py-8">No teams created yet.</p>
            )}
        </div>
    );
}
