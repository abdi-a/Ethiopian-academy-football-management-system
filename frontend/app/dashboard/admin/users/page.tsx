'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'player'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        api.get('/users').then(res => {
            setUsers(res.data);
            setLoading(false);
        });
    };

    const handleDelete = async (id: number) => {
        if(confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            await api.delete(`/users/${id}`);
            fetchUsers();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Update
                const data: any = { ...formData };
                if (!data.password) delete data.password;
                
                await api.put(`/users/${editingUser.id}`, data);
            } else {
                // Create
                await api.post('/users', formData);
            }
            setIsFormOpen(false);
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'player' });
            fetchUsers();
        } catch (error) {
            alert('Operation failed. Check inputs.');
        }
    };

    const openEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // Leave blank to keep current
            role: user.role
        });
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                <button 
                    onClick={() => {
                        setEditingUser(null);
                        setFormData({ name: '', email: '', password: '', role: 'player' });
                        setIsFormOpen(!isFormOpen);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                    {isFormOpen ? 'Close Form' : '+ Add New User'}
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100 animate-fade-in-down">
                    <h3 className="font-bold mb-4">{editingUser ? 'Edit User' : 'Create New User'}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input 
                                required
                                type="text"
                                className="w-full border p-2 rounded"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email Address</label>
                            <input 
                                required
                                type="email"
                                className="w-full border p-2 rounded"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Role</label>
                            <select 
                                className="w-full border p-2 rounded"
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="player">Player</option>
                                <option value="coach">Coach</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Password {editingUser && <span className="text-gray-400 font-normal">(Leave blank to keep)</span>}
                            </label>
                            <input 
                                type="password"
                                className="w-full border p-2 rounded"
                                placeholder={editingUser ? "********" : "Required for new users"}
                                required={!editingUser}
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-2 text-right">
                            <button className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">
                                {editingUser ? 'Update User' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-800 text-white uppercase">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Joined</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{u.name}</div>
                                    <div className="text-gray-500">{u.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs uppercase font-semibold 
                                        ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                          u.role === 'manager' ? 'bg-indigo-100 text-indigo-800' : 
                                          u.role === 'coach' ? 'bg-green-100 text-green-800' : 
                                          'bg-blue-100 text-blue-800'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => openEdit(u)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
