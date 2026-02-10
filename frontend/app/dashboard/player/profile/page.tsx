'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';

export default function ProfilePage() {
    const { user, login } = useAuth(); // assuming login/reloadUser updates context
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birth_date: '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
                birth_date: user.birth_date ? user.birth_date.split('T')[0] : '',
            }));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const dataToSubmit: any = {
                name: formData.name,
                email: formData.email,
                birth_date: formData.birth_date,
            };

            if (formData.new_password) {
                dataToSubmit.current_password = formData.current_password;
                dataToSubmit.new_password = formData.new_password;
                dataToSubmit.new_password_confirmation = formData.new_password_confirmation;
            }

            await api.put('/profile', dataToSubmit);
            // Ideally reload user context here
            setStatus({ type: 'success', message: 'Profile updated successfully.' });
            setFormData(prev => ({ ...prev, current_password: '', new_password: '', new_password_confirmation: '' }));
        } catch (error: any) {
             const msg = error.response?.data?.message || 'Update failed.';
             setStatus({ type: 'error', message: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h1>

            {status && (
                <div className={`p-4 mb-6 rounded ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={formData.birth_date}
                            onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Change Password</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                value={formData.new_password}
                                onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                            />
                        </div>
                        {formData.new_password && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.new_password_confirmation}
                                        onChange={(e) => setFormData({...formData, new_password_confirmation: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password (Required for changes)</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.current_password}
                                        onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Saving Changes...' : 'Save Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
}

