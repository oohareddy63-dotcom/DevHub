'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getMe } from '../../store/slices/authSlice';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BuildLogFeed from '../../components/BuildLogFeed';
import Widgets from '../../components/Widgets';

export default function Dashboard() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            router.push('/login');
            return;
        }

        if (isAuthenticated && !user) {
            dispatch(getMe());
        }
    }, [isAuthenticated, isLoading, user, dispatch, router]);

    if (isLoading || !isClient) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F3F2EF]">
            <Navbar />
            <div className="max-w-7xl mx-auto pt-6 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <Sidebar />
                    </div>
                    <div className="md:col-span-2">
                        <BuildLogFeed />
                    </div>
                    <div className="md:col-span-1">
                        <Widgets />
                    </div>
                </div>
            </div>
        </div>
    );
}
