'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import StatCard from '../../../components/dashboard/StatCard';

interface DashboardData {
    overview: {
        status: string;
        average_rating: number;
        trainings_count: number;
    };
    upcoming_trainings: any[];
    recent_performance: any[];
}

export default function PlayerDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/player/dashboard')
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
            <h1 className="text-2xl font-bold text-gray-800">Player Dashboard</h1>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Account Status" 
                    value={data.overview.status.toUpperCase()} 
                    trend="neutral"
                />
                <StatCard 
                    title="Avg Rating" 
                    value={data.overview.average_rating} 
                    description="/ 10.0"
                />
                <StatCard 
                    title="Total Sessions" 
                    value={data.overview.trainings_count} 
                />
            </div>

            {/* Upcoming Trainings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-4">Upcoming Trainings</h3>
                    {data.upcoming_trainings.length > 0 ? (
                        <div className="space-y-3">
                            {data.upcoming_trainings.map((session: any) => (
                                <div key={session.id} className="p-3 bg-gray-50 rounded border flex justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">{session.topics || 'Training Session'}</p>
                                        <p className="text-sm text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                         <span className="text-sm font-medium text-blue-600">{session.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No upcoming training sessions assigned.</p>
                    )}
                </div>

                {/* Recent Performance */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-lg mb-4">Recent Performance</h3>
                    {data.recent_performance.length > 0 ? (
                        <div className="space-y-3">
                            {data.recent_performance.map((perf: any) => (
                                <div key={perf.id} className="p-3 bg-gray-50 rounded border flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-800">Match/Session Rating</p>
                                        <p className="text-xs text-gray-500">{new Date(perf.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                                        {perf.rating}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No performance reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
