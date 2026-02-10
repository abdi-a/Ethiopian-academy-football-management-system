'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Training {
    id: number;
    title: string;
    description: string;
    date: string;
    coach: {
        name: string;
    };
}

export default function ManagerTrainingsPage() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/trainings').then(res => {
            setTrainings(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    // Sort by date (newest first)
    const sortedTrainings = [...trainings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (loading) return <div className="p-4">Loading schedule...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Training Schedule Oversight</h1>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">Date & Time</th>
                            <th className="px-6 py-3">Training Session</th>
                            <th className="px-6 py-3">Assigned Coach</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedTrainings.map(t => {
                            const date = new Date(t.date);
                            const isFuture = date >= new Date();
                            
                            return (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800">{date.toLocaleDateString()}</div>
                                        <div className="text-xs text-gray-500">{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{t.title}</div>
                                        <div className="text-gray-500 text-xs truncate max-w-xs">{t.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs mr-2">
                                                {t.coach?.name.charAt(0)}
                                            </div>
                                            {t.coach?.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {isFuture ? (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Scheduled</span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Completed</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {sortedTrainings.length === 0 && (
                            <tr><td colSpan={4} className="text-center py-8 text-gray-500">No trainings recorded.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
