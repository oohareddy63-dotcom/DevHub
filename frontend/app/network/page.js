'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../../components/Navbar';
import { UserPlus, UserCheck } from 'lucide-react';
import { discoverUsers, sendConnectionRequest, fetchConnectionRequests } from '../../store/slices/connectionSlice';

export default function Network() {
    const dispatch = useDispatch();
    const { discoverUsersList, connectionRequests, isLoading } = useSelector((state) => state.connections);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(discoverUsers());
        dispatch(fetchConnectionRequests());
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(discoverUsers(searchQuery));
    };

    const handleConnect = async (userId) => {
        const result = await dispatch(sendConnectionRequest(userId));
        if (result.meta.requestStatus === 'fulfilled') {
            // User removed from discover list automatically by Redux
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F2EF] font-sans pb-10">
            <Navbar />

            <main className="max-w-7xl mx-auto pt-6 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Left Sidebar */}
                    <div className="hidden md:block col-span-1 bg-white rounded-lg shadow border border-gray-200 p-4 h-fit">
                        <h2 className="font-semibold text-gray-600 mb-4">Manage my network</h2>
                        <ul className="space-y-4 text-gray-500">
                            <li className="flex justify-between cursor-pointer hover:bg-gray-100 p-2 rounded"><span>Connections</span> <span className="text-black font-semibold">1,203</span></li>
                            <li className="flex justify-between cursor-pointer hover:bg-gray-100 p-2 rounded"><span>Contacts</span> <span className="text-black font-semibold">440</span></li>
                            <li className="flex justify-between cursor-pointer hover:bg-gray-100 p-2 rounded"><span>Groups</span> <span className="text-black font-semibold">12</span></li>
                            <li className="flex justify-between cursor-pointer hover:bg-gray-100 p-2 rounded"><span>Events</span> <span className="text-black font-semibold">3</span></li>
                            <li className="flex justify-between cursor-pointer hover:bg-gray-100 p-2 rounded"><span>Pages</span> <span className="text-black font-semibold">56</span></li>
                        </ul>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-3">
                        {/* Invitations (Mock) */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Invitations</h2>
                                <button className="text-gray-500 font-semibold hover:bg-gray-100 px-2 py-1 rounded">See all 2</button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Jane Doe</h3>
                                            <p className="text-gray-500 text-sm">Product Manager at Tech Corp</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-gray-600 font-semibold hover:bg-gray-100 px-4 py-1.5 rounded-full">Ignore</button>
                                        <button className="border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 px-4 py-1.5 rounded-full">Accept</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">People you may know</h2>
                                <form onSubmit={handleSearch} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    <button type="submit" className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-2 py-1 rounded">
                                        Search
                                    </button>
                                </form>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Loading users...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {discoverUsersList.map(user => (
                                        <div key={user._id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col items-center pb-4 relative">
                                            <div className="h-16 bg-gray-200 w-full mb-8 relative">
                                                <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                                                    {user.profilePic ? (
                                                        <img src={user.profilePic} className="h-20 w-20 rounded-full border-2 border-white object-cover" />
                                                    ) : (
                                                        <div className="h-20 w-20 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center">
                                                            <UserPlus className="h-10 w-10 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-center px-2 mt-4 flex-grow">
                                                <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                                                <p className="text-xs text-gray-500 line-clamp-2">{user.bio || "Member at DevHub"}</p>
                                                <p className="text-xs text-gray-400 mt-2">12 mutual connections</p>
                                            </div>

                                            <button
                                                onClick={() => handleConnect(user._id)}
                                                className="mt-4 border border-blue-600 text-blue-600 font-semibold px-6 py-1 rounded-full hover:bg-blue-50 flex items-center gap-1"
                                            >
                                                <UserPlus className="h-4 w-4" /> Connect
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!isLoading && discoverUsersList.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No users found. Try adjusting your search.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
