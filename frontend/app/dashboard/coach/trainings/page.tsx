'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface Training {
    id: number;
    title: string;
    date: string;
    description: string;
    coach?: {
        name: string;
    }
}

export default function TrainingsPage() {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTraining, setEditingTraining] = useState<Training | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        description: '',
    });

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = () => {
        api.get('/trainings')
            .then(res => {
                setTrainings(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch trainings", err);
                setLoading(false);
            });
    };

    const openCreateModal = () => {
        setEditingTraining(null);
        setFormData({ title: '', date: '', description: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (training: Training) => {
        setEditingTraining(training);
        setFormData({
            title: training.title,
            date: training.date.slice(0, 16), // Format for datetime-local input
            description: training.description || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this session?')) {
            try {
                await api.delete(`/trainings/${id}`);
                fetchTrainings();
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Failed to delete training session.");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTraining) {
                await api.put(`/trainings/${editingTraining.id}`, formData);
            } else {
                await api.post('/trainings', formData);
            }
            setIsModalOpen(false);
            fetchTrainings();
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save training session.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Training Management</h1>
                <button 
                    onClick={openCreateModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                    + Schedule Session
                </button>
            </div>

            {loading ? (
                <div>Loading sessions...</div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-3">Date & Time</th>
                                <th className="px-6 py-3">Session Title</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {trainings.length > 0 ? (
                                trainings.map(t => (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(t.date).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{t.title}</td>
                                        <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{t.description}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button 
                                                onClick={() => openEditModal(t)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(t.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No training sessions found. Schedule one above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">
                            {editingTraining ? 'Edit Training Session' : 'New Training Session'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title / Topic</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full border p-2 rounded"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Dribbling Drills"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Date & Time</label>
                                <input 
                                    type="datetime-local" 
                                    required 
                                    className="w-full border p-2 rounded"
                                    value={formData.date}
                                    onChange={e => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description / Notes</label>
                                <textarea 
                                    className="w-full border p-2 rounded h-24"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    placeholder="Details about the session..."
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editingTraining ? 'Update Session' : 'Schedule Session'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
