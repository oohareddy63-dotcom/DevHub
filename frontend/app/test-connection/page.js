'use client';

import { useState, useEffect } from 'react';

export default function TestConnection() {
    const [backendStatus, setBackendStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        testConnection();
    }, []);

    const testConnection = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('http://localhost:4000/api/health');
            const data = await response.json();
            setBackendStatus(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: '#333', marginBottom: '30px' }}>DevHub Connection Test</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={testConnection}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    Test Connection
                </button>
            </div>

            {loading && (
                <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                    <p>Testing connection...</p>
                </div>
            )}

            {error && (
                <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px', border: '1px solid #f44336' }}>
                    <h3 style={{ color: '#d32f2f', marginTop: 0 }}>❌ Connection Failed</h3>
                    <p style={{ color: '#c62828' }}>{error}</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                        Make sure the backend server is running on http://localhost:4000
                    </p>
                </div>
            )}

            {backendStatus && !loading && (
                <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', border: '1px solid #4caf50' }}>
                    <h3 style={{ color: '#2e7d32', marginTop: 0 }}>✅ Backend Connection Successful</h3>
                    <div style={{ marginTop: '15px' }}>
                        <p><strong>Status:</strong> {backendStatus.status}</p>
                        <p><strong>Message:</strong> {backendStatus.message}</p>
                        <p>
                            <strong>MongoDB:</strong> 
                            <span style={{ 
                                color: backendStatus.mongodb === 'connected' ? '#2e7d32' : '#d32f2f',
                                fontWeight: 'bold',
                                marginLeft: '10px'
                            }}>
                                {backendStatus.mongodb === 'connected' ? '✅ Connected' : '❌ Disconnected'}
                            </span>
                        </p>
                        <p><strong>Timestamp:</strong> {new Date(backendStatus.timestamp).toLocaleString()}</p>
                    </div>
                </div>
            )}

            {backendStatus && backendStatus.mongodb !== 'connected' && (
                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px', border: '1px solid #ff9800' }}>
                    <h3 style={{ color: '#e65100', marginTop: 0 }}>⚠️ MongoDB Not Connected</h3>
                    <p>The backend server is running, but MongoDB is not connected.</p>
                    <p style={{ fontSize: '14px' }}>
                        Please follow the instructions in <code>MONGODB-FIX.md</code> to fix the MongoDB connection.
                    </p>
                    <ul style={{ fontSize: '14px', lineHeight: '1.6' }}>
                        <li>Check if your MongoDB Atlas cluster is running (not paused)</li>
                        <li>Verify your IP address is whitelisted in MongoDB Atlas</li>
                        <li>Confirm database credentials are correct</li>
                    </ul>
                </div>
            )}

            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0 }}>Connection Details</h3>
                <p><strong>Frontend URL:</strong> http://localhost:3000</p>
                <p><strong>Backend URL:</strong> http://localhost:4000</p>
                <p><strong>API Base URL:</strong> http://localhost:4000/api</p>
            </div>
        </div>
    );
}
