'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
    const pathname = usePathname();

    const links = {
        player: [
            { href: '/dashboard/player', label: 'Dashboard' },
            { href: '/dashboard/player/profile', label: 'My Profile' },
            { href: '/dashboard/player/trainings', label: 'Trainings' },
            { href: '/dashboard/player/matches', label: 'Matches' },
            { href: '/dashboard/player/performance', label: 'Performance' },
        ],
        coach: [
            { href: '/dashboard/coach', label: 'Dashboard' },
            { href: '/dashboard/coach/players', label: 'My Players' },
            { href: '/dashboard/coach/trainings', label: 'Training Sessions' },
            { href: '/dashboard/coach/performance', label: 'Performances' },
        ],
        manager: [
            { href: '/dashboard/manager', label: 'Dashboard' },
            { href: '/dashboard/manager/players', label: 'All Players' },
            { href: '/dashboard/manager/trainings', label: 'Training Monitor' },
            { href: '/dashboard/manager/reports', label: 'Reports' },
        ],
        admin: [
            { href: '/dashboard/admin', label: 'Dashboard' },
            { href: '/dashboard/admin/users', label: 'User Management' },
            { href: '/dashboard/admin/approvals', label: 'Registration Approvals' },
            { href: '/dashboard/admin/reports', label: 'System Reports' },
            { href: '/dashboard/admin/settings', label: 'Settings' },
        ],
    };

    const roleLinks = links[role as keyof typeof links] || [];

    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
            <div className="mb-8 p-4">
                <h2 className="text-xl font-bold tracking-wider">EAFMS</h2>
                <p className="text-xs text-gray-400 mt-1 uppercase">{role} Portal</p>
            </div>
            <nav className="space-y-2">
                {roleLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link 
                            key={link.href} 
                            href={link.href}
                            className={`block px-4 py-2.5 rounded-md transition duration-200 ${
                                isActive 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
