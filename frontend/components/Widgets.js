import { useState } from 'react';
import { Info, TrendingUp, Briefcase, Users, Calendar, MessageSquare, ThumbsUp, Eye } from 'lucide-react';

export default function Widgets() {
    const [activeTab, setActiveTab] = useState('topics');

    const trendingTopics = [
        { name: "React 19", posts: "2.3k", trend: "up" },
        { name: "AI Development", posts: "5.1k", trend: "up" },
        { name: "Remote Work", posts: "1.8k", trend: "down" },
        { name: "DevOps", posts: "3.2k", trend: "up" },
        { name: "Cybersecurity", posts: "2.7k", trend: "up" }
    ];

    const upcomingEvents = [
        { title: "React Conference 2024", date: "Mar 15", attendees: "500+" },
        { title: "AI Summit", date: "Mar 20", attendees: "1000+" },
        { title: "DevOps Workshop", date: "Mar 25", attendees: "200+" },
        { title: "JavaScript Meetup", date: "Apr 1", attendees: "150+" }
    ];

    const suggestedConnections = [
        { name: "Alex Chen", title: "Senior Developer", mutual: 12, avatar: "👨‍💻" },
        { name: "Sarah Williams", title: "UX Designer", mutual: 8, avatar: "👩‍🎨" },
        { name: "Mike Johnson", title: "Product Manager", mutual: 5, avatar: "👨‍💼" },
        { name: "Emily Davis", title: "Data Scientist", mutual: 15, avatar: "👩‍🔬" }
    ];

    return (
        <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-2">
                <div className="flex gap-1">
                    {[
                        { id: 'topics', label: 'Topics', icon: MessageSquare },
                        { id: 'events', label: 'Events', icon: Calendar },
                        { id: 'connections', label: 'Network', icon: Users }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <tab.icon className="h-3 w-3" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'topics' && (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-4 max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-sm text-gray-900">Trending Topics</h2>
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                    </div>

                    <ul className="space-y-3">
                        {trendingTopics.map((topic, index) => (
                            <li key={index} className="cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{topic.name}</p>
                                        <p className="text-xs text-gray-500">{topic.posts} posts</p>
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs ${topic.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {topic.trend === 'up' ? '↑' : '↓'}
                                        <span>{Math.floor(Math.random() * 50 + 10)}%</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'events' && (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-4 max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-sm text-gray-900">Upcoming Events</h2>
                        <Calendar className="h-4 w-4 text-gray-500" />
                    </div>

                    <ul className="space-y-3">
                        {upcomingEvents.map((event, index) => (
                            <li key={index} className="cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <div className="flex items-start gap-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                            <span>{event.date}</span>
                                            <span>•</span>
                                            <span>{event.attendees} attending</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'connections' && (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-4 max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-sm text-gray-900">Suggested Connections</h2>
                        <Users className="h-4 w-4 text-gray-500" />
                    </div>

                    <ul className="space-y-3">
                        {suggestedConnections.map((person, index) => (
                            <li key={index} className="cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <div className="flex items-center gap-2">
                                    <div className="text-2xl">{person.avatar}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{person.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{person.title}</p>
                                        <p className="text-xs text-blue-600 mt-1 truncate">{person.mutual} mutual connections</p>
                                    </div>
                                    <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 flex-shrink-0">
                                        Connect
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Additional Widget - Quick Stats */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Your Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">127</div>
                        <div className="text-xs text-gray-500">Profile Views</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-green-600">23</div>
                        <div className="text-xs text-gray-500">Connections</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">8</div>
                        <div className="text-xs text-gray-500">Skills</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">15</div>
                        <div className="text-xs text-gray-500">Endorsements</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Widget */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                <h3 className="font-semibold text-sm text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded">
                        📝 Create Post
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded">
                        💼 Update Status
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded">
                        🎯 Set Goal
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded">
                        📊 View Analytics
                    </button>
                </div>
            </div>
        </div>
    );
}
