'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { UserPlus, UserCheck, X } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { fetchConnectionRequests, acceptConnectionRequest, rejectConnectionRequest } from '../../store/slices/connectionSlice';

export default function ConnectionRequestsPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { connectionRequests, isLoading } = useSelector((state) => state.connections);
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        dispatch(fetchConnectionRequests());
    }, [isAuthenticated, dispatch, router]);

    const handleAccept = async (userId) => {
        const result = await dispatch(acceptConnectionRequest(userId));
        if (result.meta.requestStatus === 'fulfilled') {
            // Request automatically removed from list by Redux
        }
    };

    const handleReject = async (userId) => {
        const result = await dispatch(rejectConnectionRequest(userId));
        if (result.meta.requestStatus === 'fulfilled') {
            // Request automatically removed from list by Redux
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F3F2EF]">
            <Navbar />

            <main className="max-w-7xl mx-auto pt-6 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Left Sidebar */}
                    <div className="hidden md:block col-span-1 bg-white rounded-lg shadow border border-gray-200 p-4 h-fit">
                        <h2 className="font-semibold text-gray-600 mb-4">Manage my network</h2>
                        <ul className="space-y-4 text-gray-500">
                            <li className="flex justify-between cursor-pointer hover:bg-gray-100 p-2 rounded">
                                <span>Connections</span>
                                <span className="text-black font-semibold">0</span>
                            </li>
                            <li className="flex justify-between cursor-pointer hover:bg-gray-100 p-2 rounded bg-blue-50">
                                <span>Invitations</span>
                                <span className="text-black font-semibold">{connectionRequests.length}</span>
                            </li>
                            <li className="flex justify-between cursor-pointer hover:bg-gray-100 p-2 rounded">
                                <span>Groups</span>
                                <span className="text-black font-semibold">0</span>
                            </li>
                            <li className="flex justify-between cursor-pointer hover:bg-gray-100 p-2 rounded">
                                <span>Events</span>
                                <span className="text-black font-semibold">0</span>
                            </li>
                            <li className="flex justify-between cursor-pointer hover:bg-gray-100 p-2 rounded">
                                <span>Pages</span>
                                <span className="text-black font-semibold">0</span>
                            </li>
                        </ul>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-3">
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Invitations</h2>
                                <button className="text-gray-500 font-semibold hover:bg-gray-100 px-2 py-1 rounded">
                                    See all {connectionRequests.length}
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-500 mt-4">Loading invitations...</p>
                                </div>
                            ) : connectionRequests.length === 0 ? (
                                <div className="text-center py-8">
                                    <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending invitations</h3>
                                    <p className="text-gray-500">When people invite you to connect, you'll see their invitations here</p>
                                    <button
                                        onClick={() => router.push('/network')}
                                        className="mt-4 text-blue-600 font-semibold hover:text-blue-700"
                                    >
                                        Discover people to connect with
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {connectionRequests.map((request) => (
                                        <div key={request._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-4">
                                                {request.profilePic ? (
                                                    <img 
                                                        src={`http://localhost:4000${request.profilePic}`} 
                                                        alt={request.name} 
                                                        className="h-16 w-16 rounded-full object-cover" 
                                                    />
                                                ) : (
                                                    <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <UserPlus className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{request.name}</h3>
                                                    <p className="text-gray-500 text-sm">{request.bio || 'Software Engineer'}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {request.skills && request.skills.length > 0 
                                                            ? request.skills.slice(0, 3).join(', ') 
                                                            : 'No skills listed'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleReject(request._id)}
                                                    className="text-gray-600 font-semibold hover:bg-gray-100 px-4 py-1.5 rounded-full"
                                                >
                                                    Ignore
                                                </button>
                                                <button
                                                    onClick={() => handleAccept(request._id)}
                                                    className="border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 px-4 py-1.5 rounded-full flex items-center gap-1"
                                                >
                                                    <UserCheck className="h-4 w-4" />
                                                    Accept
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Suggestions */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">People you may know</h2>
                                <button 
                                    onClick={() => router.push('/network')}
                                    className="text-gray-500 font-semibold hover:bg-gray-100 px-2 py-1 rounded"
                                >
                                    See all
                                </button>
                            </div>
                            <div className="text-center py-8">
                                <p className="text-gray-500">Discover more people to connect with</p>
                                <button
                                    onClick={() => router.push('/network')}
                                    className="mt-4 text-blue-600 font-semibold hover:text-blue-700"
                                >
                                    Explore Network
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
