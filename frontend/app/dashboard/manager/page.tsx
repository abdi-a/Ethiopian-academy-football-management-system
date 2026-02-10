'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import StatCard from '../../../components/dashboard/StatCard';

export default function ManagerDashboard() {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/manager/dashboard')
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
            <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Players" 
                    value={data.overview.players} 
                />
                <StatCard 
                    title="Total Coaches" 
                    value={data.overview.coaches} 
                />
                <StatCard 
                    title="Active Trainings" 
                    value={data.overview.trainings} 
                />
                <StatCard 
                    title="Pending Approvals" 
                    value={data.overview.pending_approvals}
                    trend={data.overview.pending_approvals > 0 ? 'down' : 'neutral'} 
                    description={data.overview.pending_approvals > 0 ? 'Action Needed' : 'Up to date'}
                />
            </div>

            {/* Recent Activity / Users */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg">Recent Users</h3>
                    <button className="text-sm text-blue-600 hover:underline">View All Users</button>
                </div>
                
                 {data.recent_users && data.recent_users.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Date Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recent_users.map((user: any) => (
                                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">#{user.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold capitalize
                                                ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                                  user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                                                  user.role === 'coach' ? 'bg-orange-100 text-orange-800' :
                                                  'bg-green-100 text-green-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No users found.</p>
                )}
            </div>
        </div>
    );
}
