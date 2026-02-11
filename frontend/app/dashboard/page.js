'use client';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getMe } from '../../store/slices/authSlice';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import BuildLogFeed from '../../components/BuildLogFeed';
import Widgets from '../../components/Widgets';
import Notifications from '../../components/Notifications';
import JobBoard from '../../components/JobBoard';
import MentorshipMatching from '../../components/MentorshipMatching';
import AchievementBadges from '../../components/AchievementBadges';
import LearningPaths from '../../components/LearningPaths';
import CodePlayground from '../../components/CodePlayground';

export default function Dashboard() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
    const [isClient, setIsClient] = useState(false);
    const [activeTab, setActiveTab] = useState('feed');

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

    const tabs = [
        { id: 'feed', label: 'Feed', icon: '📝' },
        { id: 'jobs', label: 'Jobs', icon: '💼' },
        { id: 'mentorship', label: 'Mentorship', icon: '👥' },
        { id: 'achievements', label: 'Achievements', icon: '🏆' },
        { id: 'learning', label: 'Learning', icon: '📚' },
        { id: 'playground', label: 'Code', icon: '💻' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar />
            <div className="max-w-7xl mx-auto pt-8 px-6 pb-12">
                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="flex gap-1 p-1 bg-white rounded-xl shadow-lg border border-gray-200">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-3 font-semibold text-sm rounded-lg transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transform scale-105'
                                        : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
                                }`}
                            >
                                <span className="mr-2 text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="dashboard-layout">
                    {/* Left Section - Main Content */}
                    <div className="left-section">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                            <Sidebar user={user} />
                        </div>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                            <Notifications user={user} />
                        </div>
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 min-h-[600px]">
                            {activeTab === 'feed' && <BuildLogFeed />}
                            {activeTab === 'jobs' && <JobBoard />}
                            {activeTab === 'mentorship' && <MentorshipMatching />}
                            {activeTab === 'achievements' && <AchievementBadges userAchievements={[]} userStats={{}} />}
                            {activeTab === 'learning' && <LearningPaths />}
                            {activeTab === 'playground' && <CodePlayground />}
                        </div>
                    </div>
                    
                    {/* Right Section - Widgets */}
                    <div className="right-section">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                            <Widgets />
                        </div>
                        {activeTab === 'feed' && (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <AchievementBadges userAchievements={[]} userStats={{}} compact={true} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
