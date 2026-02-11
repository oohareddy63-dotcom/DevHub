'use client';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '../../store/slices/authSlice';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const router = useRouter();
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser(formData));
        if (result.meta.requestStatus === 'fulfilled') {
            router.push('/dashboard');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 font-sans">
            <h1 className="text-3xl font-bold text-blue-600 mb-8">DevHub</h1>

            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm border border-gray-200">
                <h2 className="text-2xl font-semibold mb-2 text-black">Sign in</h2>
                <p className="text-sm text-gray-600 mb-6">Stay updated on your professional world</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email or Phone"
                        onChange={handleChange}
                        className="p-3 border border-gray-400 rounded hover:bg-gray-50 focus:border-blue-600 focus:outline-none text-black transition-colors"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="p-3 border border-gray-400 rounded hover:bg-gray-50 focus:border-blue-600 focus:outline-none text-black transition-colors"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="p-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors mt-2 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">New to DevHub? <Link href="/register" className="text-blue-600 font-semibold hover:underline">Join now</Link></p>
                </div>
            </div>
        </div>
    );
}
