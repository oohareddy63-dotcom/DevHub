'use client';
import { Search, Home, Users, Briefcase, MessageSquare, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState('');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.push('/network'); // Redirect to network for "people search" simulation
        }
    };

    if (!isClient) {
        return (
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <h1 className="text-xl font-bold text-blue-600">DevHub</h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-14">

                    {/* Left: Logo & Search */}
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                            </svg>
                        </Link>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2 top-2 h-5 w-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-[#EDF3F8] pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black w-64 text-sm text-black transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Right: Nav Icons */}
                    <ul className="flex items-center gap-6 md:gap-8 text-gray-500">
                        <NavItem icon={<Home className="h-6 w-6" />} label="Home" href="/dashboard" />
                        <NavItem icon={<Users className="h-6 w-6" />} label="My Network" href="/network" />
                        <NavItem icon={<Briefcase className="h-6 w-6" />} label="Jobs" href="/jobs" />
                        <NavItem icon={<MessageSquare className="h-6 w-6" />} label="Messaging" href="/messaging" />
                        <NavItem icon={<Bell className="h-6 w-6" />} label="Notifications" href="/notifications" />

                        <li className="flex flex-col items-center cursor-pointer relative group border-l pl-6 border-gray-200" onClick={() => router.push(`/profile/${user?._id || user?.id}`)}>
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="h-6 w-6 rounded-full object-cover" />
                            ) : (
                                <User className="h-6 w-6" />
                            )}
                            <span className="text-xs hidden md:block mt-1">Me</span>
                            <div className="absolute top-10 right-0 w-32 bg-white border border-gray-200 shadow-lg rounded-lg p-2 hidden group-hover:block">
                                <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">Logout</button>
                            </div>
                        </li>
                    </ul>

                </div>
            </div>
        </nav>
    );
}

function NavItem({ icon, label, href, active }) {
    // Simple active check logic could be added here if we had access to pathname
    return (
        <Link href={href} className={`flex flex-col items-center cursor-pointer hover:text-black transition-colors relative group`}>
            {icon}
            <span className="text-xs hidden md:block mt-1">{label}</span>
            {/* Active Indicator could go here */}
        </Link>
    );
}
