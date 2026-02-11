'use client';
import { Search, Home, Users, Briefcase, MessageSquare, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Notifications from './Notifications';

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
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-18">

                    {/* Left: Logo & Search */}
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74C0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3V-9h2.9v1.3A3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                                </svg>
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">DevHub</span>
                        </Link>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search skills, projects, people..."
                                className="bg-gray-100 border border-gray-200 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 text-sm text-gray-900 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Right: Nav Icons */}
                    <ul className="flex items-center gap-2 text-gray-600">
                        <NavItem icon={<Home className="h-5 w-5" />} label="Home" href="/dashboard" />
                        <NavItem icon={<Users className="h-5 w-5" />} label="Network" href="/network" />
                        <NavItem icon={<Briefcase className="h-5 w-5" />} label="Jobs" href="/jobs" />
                        <NavItem icon={<MessageSquare className="h-5 w-5" />} label="Messages" href="/messaging" />
                        <Notifications user={user} />

                        <li className="flex flex-col items-center cursor-pointer relative group border-l pl-4 border-gray-300" onClick={() => router.push(`/profile/${user?._id || user?.id}`)}>
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-md" />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 border-2 border-white shadow-md flex items-center justify-center">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                            )}
                            <span className="text-xs hidden md:block mt-1 font-medium">Profile</span>
                            <div className="absolute top-14 right-0 w-48 bg-white border border-gray-200 shadow-xl rounded-xl p-2 hidden group-hover:block z-50">
                                <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                    Logout
                                </button>
                            </div>
                        </li>
                    </ul>

                </div>
            </div>
        </nav>
    );
}

function NavItem({ icon, label, href, active }) {
    return (
        <Link href={href} className={`flex flex-col items-center cursor-pointer hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 ${active ? 'text-blue-600 bg-blue-50' : ''}`}>
            {icon}
            <span className="text-xs hidden md:block mt-1">{label}</span>
        </Link>
    );
}
