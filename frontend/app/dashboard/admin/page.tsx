'use client';

import { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import StatCard from '../../../components/dashboard/StatCard';

export default function AdminDashboard() {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/dashboard')
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
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Users" 
                    value={data.overview.total_users} 
                />
                <StatCard 
                    title="Active Players" 
                    value={data.overview.total_players} 
                />
                <StatCard 
                    title="Coaches" 
                    value={data.overview.total_coaches} 
                />
                <StatCard 
                    title="Managers" 
                    value={data.overview.total_managers} 
                />
            </div>

            {/* System Health Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-4">System Status</h3>
                <div className="flex items-center gap-4">
                     <div className="p-4 bg-green-50 rounded border border-green-200 flex-1">
                        <div className="flex items-center gap-2">
                             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                             <p className="text-green-800 font-medium">System Operational</p>
                        </div>
                        <p className="text-xs text-green-600 mt-1">Database connected, API responding.</p>
                     </div>
                     <div className="p-4 bg-blue-50 rounded border border-blue-200 flex-1">
                        <p className="text-blue-800 font-medium">Role Distribution</p>
                         <div className="flex gap-2 text-xs mt-2">
                            <span className="bg-blue-100 px-2 py-1 rounded">Players: {data.role_distribution.player || 0}</span>
                            <span className="bg-blue-100 px-2 py-1 rounded">Coaches: {data.role_distribution.coach || 0}</span>
                         </div>
                     </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                <div className="flex gap-4">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Manage Users</button>
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition">Review Registrations</button>
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition">System Settings</button>
                </div>
            </div>
        </div>
    );
}
