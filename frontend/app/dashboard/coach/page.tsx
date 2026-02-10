'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import StatCard from '../../../components/dashboard/StatCard';

export default function CoachDashboard() {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/coach/dashboard')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch dashboard data", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading dashboard...</div>;
    if (!data) return <div>Dashboard unavailable.</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Coach Dashboard</h1>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Players" 
                    value={data.overview.total_players} 
                />
                <StatCard 
                    title="All Time Sessions" 
                    value={data.overview.total_trainings} 
                />
                <StatCard 
                    title="Sessions Today" 
                    value={data.overview.today_sessions} 
                    trend={data.overview.today_sessions > 0 ? 'up' : 'neutral'}
                />
            </div>

            {/* Today's Schedule */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-4">Today's Training Schedule</h3>
                {data.today_trainings && data.today_trainings.length > 0 ? (
                    <div className="space-y-3">
                        {data.today_trainings.map((session: any) => (
                            <div key={session.id} className="p-3 bg-blue-50 rounded border border-blue-100 flex justify-between">
                                <div>
                                    <p className="font-medium text-blue-900">{session.topics || 'Training Session'}</p>
                                    <p className="text-sm text-blue-700">Time: {session.time}</p>
                                </div>
                                <button className="text-sm bg-white border border-blue-200 px-3 py-1 rounded text-blue-600 hover:bg-blue-100">
                                    Manage
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No training sessions scheduled for today.</p>
                )}
            </div>
            
            {/* Recent Players */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-4">New Players</h3>
                 {data.recent_players && data.recent_players.length > 0 ? (
                    <table className="min-w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recent_players.map((user: any) => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 capitalize">{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500 text-sm">No recent players found.</p>
                )}
            </div>
        </div>
    );
}
