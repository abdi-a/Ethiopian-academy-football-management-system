'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Performance {
    id: number;
    rating: number;
    notes: string;
    created_at: string;
    coach: {
        name: string;
    };
}

export default function PlayerPerformancePage() {
    const [performances, setPerformances] = useState<Performance[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/performances').then(res => {
            setPerformances(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-4">Loading your records...</div>;

    const averageRating = performances.length > 0
        ? (performances.reduce((acc, curr) => acc + curr.rating, 0) / performances.length).toFixed(1)
        : 'N/A';

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Performance History</h1>

            {/* Stats Card */}
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                <div className="text-gray-500 text-sm uppercasse font-bold">Average Rating</div>
                <div className="text-4xl font-bold text-gray-800 mt-2">{averageRating} <span className="text-lg text-gray-400">/ 10</span></div>
            </div>

            {/* List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Rating</th>
                            <th className="px-6 py-3">Coach Feedback</th>
                            <th className="px-6 py-3">Evaluator</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {performances.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{new Date(p.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`font-bold px-2 py-1 rounded ${p.rating >= 8 ? 'bg-green-100 text-green-800' : p.rating >= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        {p.rating}/10
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{p.notes}</td>
                                <td className="px-6 py-4 text-gray-500">{p.coach?.name || 'Coach'}</td>
                            </tr>
                        ))}
                        {performances.length === 0 && (
                            <tr><td colSpan={4} className="text-center py-8 text-gray-500">No performance reviews yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
