'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Game {
    id: number;
    match_date: string;
    location: string;
    home_team: { name: string };
    away_team?: { name: string };
    opponent_name?: string;
    score_home?: number;
    score_away?: number;
    status: string;
}

export default function MatchesPage() {
    const [matches, setMatches] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/games').then(res => {
            setMatches(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-4">Loading fixtures...</div>;

    const upcoming = matches.filter(m => m.status === 'Scheduled');
    const results = matches.filter(m => m.status === 'Completed');

    return (
        <div className="space-y-8">
            {/* Upcoming Fixtures */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Fixtures</h1>
                <div className="grid gap-4">
                    {upcoming.map(m => {
                        const date = new Date(m.match_date);
                        const opponent = m.away_team ? m.away_team.name : m.opponent_name;
                        
                        return (
                            <div key={m.id} className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500 flex justify-between items-center">
                                <div>
                                    <div className="text-sm font-bold text-blue-600 mb-1">{date.toLocaleDateString()} @ {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                    <div className="text-lg font-bold text-gray-800 flex items-center">
                                        {m.home_team?.name} <span className="text-gray-400 mx-2 text-sm">vs</span> {opponent}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">📍 {m.location}</div>
                                </div>
                                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-bold">
                                    VS
                                </div>
                            </div>
                        );
                    })}
                    {upcoming.length === 0 && <p className="text-gray-500">No upcoming matches scheduled.</p>}
                </div>
            </div>

            {/* Results */}
            <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Latest Results</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Match</th>
                                <th className="px-6 py-3">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {results.map(m => {
                                const opponent = m.away_team ? m.away_team.name : m.opponent_name;
                                return (
                                    <tr key={m.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-600">{new Date(m.match_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium">
                                            {m.home_team?.name} <span className="text-gray-400">vs</span> {opponent}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {m.score_home} - {m.score_away}
                                        </td>
                                    </tr>
                                );
                            })}
                            {results.length === 0 && <tr><td colSpan={3} className="px-6 py-4 text-gray-500">No results available yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
