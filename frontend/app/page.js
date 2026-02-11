'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Code, BookOpen, Users, MessageSquare, ArrowRight, TrendingUp, Award, Zap } from 'lucide-react';

export default function LandingPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/network?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl font-bold text-blue-600">DevHub</h1>
                            </div>
                            <div className="hidden md:block ml-10">
                                <div className="flex items-baseline space-x-4">
                                    <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                                    <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">How it Works</a>
                                    <a href="#community" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Community</a>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                                Sign In
                            </Link>
                            <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Build Skills, <span className="text-blue-600">Track Progress</span>, Grow Together
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            DevHub is a skill-driven collaboration platform where developers document their learning journey, 
                            share build logs, and grow their expertise through community support.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link 
                                href="/register" 
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                            >
                                Start Your Journey
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link 
                                href="/login" 
                                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50"
                            >
                                Sign In
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search skills, build logs, or developers..."
                                    className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Transform Your Learning Experience
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Move beyond traditional networking. Build a comprehensive skill portfolio and track your real progress.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Skill Graph</h3>
                            <p className="text-gray-600">
                                Visual representation of your skills with endorsements and real project proofs. 
                                See your expertise grow over time.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Code className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Build Logs</h3>
                            <p className="text-gray-600">
                                Document your learning journey day by day. Track progress, get help, 
                                and share your development process.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Collaboration</h3>
                            <p className="text-gray-600">
                                Connect with mentors, peers, and collaborators. Get help on specific problems 
                                and contribute to others' learning.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div id="how-it-works" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            How DevHub Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Start building your skills and reputation in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Document Your Journey</h3>
                            <p className="text-gray-600">
                                Create build logs as you learn. Track your progress through different phases 
                                from learning to deployment.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Build Your Skill Graph</h3>
                            <p className="text-gray-600">
                                Add skills, get endorsements, and showcase real projects as proof of your expertise.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Collaborate & Grow</h3>
                            <p className="text-gray-600">
                                Connect with the community, help others, and build your reputation as a skilled developer.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-12">
                            Join a Community of Learners
                        </h2>
                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">1000+</div>
                                <div className="text-blue-100">Active Developers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">5000+</div>
                                <div className="text-blue-100">Build Logs Created</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">200+</div>
                                <div className="text-blue-100">Skills Tracked</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-2">50+</div>
                                <div className="text-blue-100">Projects Completed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Transform Your Learning Journey?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of developers who are building skills, tracking progress, and growing together.
                    </p>
                    <Link 
                        href="/register" 
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 inline-flex items-center gap-2"
                    >
                        Get Started Now
                        <Zap className="h-5 w-5" />
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold text-blue-400 mb-4">DevHub</h3>
                            <p className="text-gray-400">
                                Skill-driven collaboration and growth platform for developers.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-white">Features</a></li>
                                <li><a href="#how-it-works" className="hover:text-white">How it Works</a></li>
                                <li><a href="#" className="hover:text-white">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Community</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-white">Forum</a></li>
                                <li><a href="#" className="hover:text-white">Events</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">About</a></li>
                                <li><a href="#" className="hover:text-white">Contact</a></li>
                                <li><a href="#" className="hover:text-white">Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 DevHub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
