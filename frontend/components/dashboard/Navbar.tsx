'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
            <h2 className="text-xl font-semibold text-gray-800">
                Football Management System
            </h2>
            <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 text-sm font-medium transition"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
