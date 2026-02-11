'use client';
import Navbar from '../../components/Navbar';
import { Briefcase } from 'lucide-react';

export default function Jobs() {
    return (
        <div className="min-h-screen bg-[#F3F2EF] font-sans">
            <Navbar />
            <main className="max-w-7xl mx-auto pt-6 px-4 flex justify-center">
                <div className="bg-white rounded-lg shadow p-8 text-center max-w-lg w-full mt-10">
                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Jobs coming soon</h1>
                    <p className="text-gray-500">We are building the ultimate job search experience for you.</p>
                </div>
            </main>
        </div>
    );
}
