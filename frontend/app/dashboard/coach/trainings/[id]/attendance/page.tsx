'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

interface Player {
    id: number;
    user: {
        name: string;
    };
    position: string;
}

interface Attendance {
    player_id: number;
    status: 'Present' | 'Absent' | 'Excused' | 'Late';
    remarks: string;
}

interface Training {
    id: number;
    title: string;
    date: string;
}

export default function AttendancePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [players, setPlayers] = useState<Player[]>([]);
    const [training, setTraining] = useState<Training | null>(null);
    const [attendanceData, setAttendanceData] = useState<Record<number, Attendance>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch Training Details (used for title/header)
                // Note: We might need a specific 'show' endpoint in TrainingController,
                // but usually the index list is cached or we can fetch list and find.
                // For now let's assume we can fetch list or just use what we have.
                // Or better, fetch existing attendance which tells us players + status.
                
                const [playersRes, attendanceRes] = await Promise.all([
                    api.get('/players'), // Ideally filter by team if training is team specific
                    api.get(`/trainings/${params.id}/attendance`)
                ]);

                setPlayers(playersRes.data);
                
                // Initialize attendance map from existing records
                const initialMap: Record<number, Attendance> = {};
                
                // Set default 'Present' for all players if no record exists
                playersRes.data.forEach((p: Player) => {
                    initialMap[p.id] = { player_id: p.id, status: 'Present', remarks: '' };
                });

                // Override with existing saved records
                attendanceRes.data.forEach((record: any) => {
                    initialMap[record.player_id] = {
                        player_id: record.player_id,
                        status: record.status,
                        remarks: record.remarks || ''
                    };
                });

                setAttendanceData(initialMap);
            } catch (e) {
                console.error("Failed to load attendance data", e);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [params.id]);

    const handleStatusChange = (playerId: number, status: any) => {
        setAttendanceData(prev => ({
            ...prev,
            [playerId]: { ...prev[playerId], status }
        }));
    };

    const handleRemarksChange = (playerId: number, remarks: string) => {
        setAttendanceData(prev => ({
            ...prev,
            [playerId]: { ...prev[playerId], remarks }
        }));
    };

    const saveAttendance = async () => {
        try {
            const payload = {
                attendances: Object.values(attendanceData)
            };
            await api.post(`/trainings/${params.id}/attendance`, payload);
            alert('Attendance saved successfully!');
            router.push('/dashboard/coach/trainings');
        } catch (e) {
            alert('Failed to save attendance.');
        }
    };

    if (loading) return <div className="p-4">Loading roster...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                   <button 
                        onClick={() => router.back()} 
                        className="text-gray-500 hover:text-gray-800 text-sm mb-2"
                    >
                        ← Back to Trainings
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Track Attendance</h1>
                    <p className="text-gray-500">Mark attendance for session ID #{params.id}</p>
                </div>
                <div className="space-x-4">
                    <button 
                         onClick={saveAttendance}
                         className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 font-bold transition"
                    >
                        Save Attendance
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">Player Name</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Remarks</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {players.map(p => {
                            const record = attendanceData[p.id] || { status: 'Present', remarks: '' };
                            return (
                                <tr key={p.id} className={`hover:bg-gray-50 ${record.status === 'Absent' ? 'bg-red-50' : ''}`}>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {p.user.name}
                                        <div className="text-xs text-gray-500">{p.position}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            {['Present', 'Absent', 'Late', 'Excused'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(p.id, status)}
                                                    className={`px-3 py-1 rounded text-xs font-bold border transition ${
                                                        record.status === status 
                                                            ? status === 'Present' ? 'bg-green-600 text-white border-green-600'
                                                            : status === 'Absent' ? 'bg-red-600 text-white border-red-600'
                                                            : status === 'Late' ? 'bg-yellow-500 text-white border-yellow-500'
                                                            : 'bg-blue-500 text-white border-blue-500'
                                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="text" 
                                            placeholder="Add note..." 
                                            className="border rounded px-2 py-1 w-full text-sm"
                                            value={record.remarks}
                                            onChange={e => handleRemarksChange(p.id, e.target.value)}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            <div className="text-center text-gray-400 text-sm mt-4">
                Tip: Status defaults to "Present" for all players. Only mark exceptions.
            </div>
        </div>
    );
}
