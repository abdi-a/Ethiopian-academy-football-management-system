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

export default function PlayerTrainingsPage() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/trainings').then(res => {
            setTrainings(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const upcoming = trainings.filter(t => new Date(t.date) >= new Date());
    const past = trainings.filter(t => new Date(t.date) < new Date());

    if (loading) return <div className="p-4">Loading schedule...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Trainings</h1>
                {upcoming.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcoming.map(t => (
                            <div key={t.id} className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{t.title}</h3>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                        {new Date(t.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{t.description}</p>
                                <div className="text-sm text-gray-500 font-medium">
                                    Coach: {t.coach?.name}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No upcoming trainings scheduled.</p>
                )}
            </div>

            <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Past Sessions</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Coach</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {past.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50 opacity-75">
                                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium">{t.title}</td>
                                    <td className="px-6 py-4 text-gray-500">{t.coach?.name}</td>
                                </tr>
                            ))}
                            {past.length === 0 && (
                                <tr><td colSpan={3} className="text-center py-4 text-gray-500">No past trainings.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
