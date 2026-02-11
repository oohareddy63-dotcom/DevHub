'use client';
import { User } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar({ user }) {
    if (!user) return <div className="animate-pulse bg-white h-64 rounded-lg"></div>;

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden sticky top-20">
            {/* Banner */}
            <div className="h-16 bg-gradient-to-r from-blue-300 to-blue-500 relative">
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    {user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="h-16 w-16 rounded-full border-2 border-white object-cover" />
                    ) : (
                        <div className="h-16 w-16 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center">
                            <User className="h-8 w-8 text-white" />
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="pt-10 pb-4 px-4 text-center">
                <Link href={`/profile/${user._id}`} className="font-semibold text-gray-900 hover:underline hover:text-blue-600 block truncate">
                    {user.name}
                </Link>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{user.bio || "Add a bio to introduce yourself"}</p>
            </div>

            <hr className="border-gray-100" />

            {/* Stats */}
            <div className="py-3 px-4 text-xs font-semibold text-gray-500">
                <div className="flex justify-between items-center hover:bg-gray-100 p-1 rounded cursor-pointer">
                    <span>Who's viewed your profile</span>
                    <span className="text-blue-600">32</span>
                </div>
                <div className="flex justify-between items-center hover:bg-gray-100 p-1 rounded cursor-pointer">
                    <Link href="/network" className='flex-1'>Connections</Link>
                    <span className="text-blue-600">{user.connections?.length || 0}</span>
                </div>
            </div>

            <hr className="border-gray-100" />

            <div className="py-3 px-4 text-xs font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-600">
                    <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a23.425 23.425 0 010 3.82L4.018 7.379a.75.75 0 00-1.06 1.06l12.19 12.191c2.636 2.636 1.896 6.13-.37 6.13H5.25a3 3 0 01-3-3v-4.318c0-.66.25-1.28.69-1.76l9.58-9.581a3 3 0 014.242 0l1.758 1.758a3 3 0 010 4.242l-9.581 9.581a2.5 2.5 0 01-1.767.732H5.25z" clipRule="evenodd" />
                </svg>
                <span>Try Premium for $0</span>
            </div>

            <hr className="border-gray-100" />

            <div className="py-3 px-4 text-xs font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                <span className='text-gray-900'>My Items</span>
            </div>

        </div>
    );
}
