'use client';
import { useEffect, useState } from 'react';

export default function ApiTest() {
    const [info, setInfo] = useState({});

    useEffect(() => {
        setInfo({
            nextPublicApiUrl: process.env.NEXT_PUBLIC_API_URL,
            nodeEnv: process.env.NODE_ENV,
            hostname: window.location.hostname,
            href: window.location.href,
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-3xl font-bold mb-6">API Configuration Test</h1>
                
                <div className="space-y-4">
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="font-mono text-sm">
                                <strong>NEXT_PUBLIC_API_URL:</strong> {info.nextPublicApiUrl || 'NOT SET'}
                            </p>
                            <p className="font-mono text-sm mt-2">
                                <strong>NODE_ENV:</strong> {info.nodeEnv || 'NOT SET'}
                            </p>
                        </div>
                    </div>

                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold mb-2">Current Location</h2>
                        <div className="bg-gray-50 p-4 rounded">
                            <p className="font-mono text-sm">
                                <strong>Hostname:</strong> {info.hostname}
                            </p>
                            <p className="font-mono text-sm mt-2">
                                <strong>Full URL:</strong> {info.href}
                            </p>
                        </div>
                    </div>

                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold mb-2">Expected API URL</h2>
                        <div className="bg-green-50 p-4 rounded border border-green-200">
                            <p className="font-mono text-sm text-green-800">
                                https://devhub-7.onrender.com/api
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
                        <div className="bg-blue-50 p-4 rounded border border-blue-200">
                            <p className="text-sm text-blue-800">
                                If NEXT_PUBLIC_API_URL is NOT SET or incorrect, you need to:
                            </p>
                            <ol className="list-decimal list-inside mt-2 space-y-1 text-sm text-blue-800">
                                <li>Go to Render Dashboard</li>
                                <li>Click on your frontend service</li>
                                <li>Go to Environment tab</li>
                                <li>Add: NEXT_PUBLIC_API_URL = https://devhub-7.onrender.com/api</li>
                                <li>Save and redeploy</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
