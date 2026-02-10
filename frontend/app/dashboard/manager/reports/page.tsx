'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function ManagerReportsPage() {
    const [stats, setStats] = useState({
        totalPlayers: 0,
        totalCoaches: 0,
        totalTrainings: 0,
        avgRating: 0,
        recentPerformances: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, trainingsRes, perfsRes] = await Promise.all([
                    api.get('/users'),
                    api.get('/trainings'),
                    api.get('/performances')
                ]);

                const users = usersRes.data;
                const performances = perfsRes.data;

                const players = users.filter((u: any) => u.role === 'player');
                const coaches = users.filter((u: any) => u.role === 'coach');
                const avg = performances.length > 0 
                    ? performances.reduce((acc: number, curr: any) => acc + curr.rating, 0) / performances.length
                    : 0;

                setStats({
                    totalPlayers: players.length,
                    totalCoaches: coaches.length,
                    totalTrainings: trainingsRes.data.length,
                    avgRating: avg,
                    recentPerformances: performances.slice(0, 5)
                });
            } catch (e) {
                console.error("Failed to load reports data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-4">Generating reports...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">System Analytics & Reports</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500">
                    <div className="text-gray-500 text-sm">Total Players</div>
                    <div className="text-3xl font-bold">{stats.totalPlayers}</div>
                </div>
                <div className="bg-white p-6 rounded shadow border-t-4 border-green-500">
                    <div className="text-gray-500 text-sm">Active Coaches</div>
                    <div className="text-3xl font-bold">{stats.totalCoaches}</div>
                </div>
                <div className="bg-white p-6 rounded shadow border-t-4 border-purple-500">
                    <div className="text-gray-500 text-sm">Training Sessions</div>
                    <div className="text-3xl font-bold">{stats.totalTrainings}</div>
                </div>
                <div className="bg-white p-6 rounded shadow border-t-4 border-yellow-500">
                    <div className="text-gray-500 text-sm">Avg Player Rating</div>
                    <div className="text-3xl font-bold">{stats.avgRating.toFixed(1)}</div>
                </div>
            </div>

            {/* Recent Performance Log */}
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Latest Performance Reviews</h2>
                <div className="space-y-4">
                    {stats.recentPerformances.map((p: any) => (
                        <div key={p.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                            <div>
                                <span className="font-bold text-gray-800">{p.player?.user?.name || 'Unknown'}</span>
                                <span className="text-gray-500 text-sm mx-2">rated by</span>
                                <span className="text-gray-600 font-medium">{p.coach?.name}</span>
                            </div>
                            <div className="flex items-center">
                                <div className="mr-4 text-sm text-gray-500">{new Date(p.created_at).toLocaleDateString()}</div>
                                <span className={`font-bold px-2 py-1 rounded text-sm ${p.rating >= 8 ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                    {p.rating}/10
                                </span>
                            </div>
                        </div>
                    ))}
                    {stats.recentPerformances.length === 0 && <p className="text-gray-500">No data available.</p>}
                </div>
            </div>

            {/* Placeholder for future charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded shadow h-64 flex items-center justify-center bg-gray-50 border border-dashed border-gray-300">
                    <span className="text-gray-400">Attendance Chart (Coming Soon)</span>
                </div>
                <div className="bg-white p-6 rounded shadow h-64 flex items-center justify-center bg-gray-50 border border-dashed border-gray-300">
                    <span className="text-gray-400">Performance Trends (Coming Soon)</span>
                </div>
            </div>
        </div>
    );
}
