'use client';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '../../store/slices/authSlice';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
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
        const result = await dispatch(registerUser(formData));
        if (result.meta.requestStatus === 'fulfilled') {
            router.push('/login');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 font-sans">
            <h1 className="text-3xl font-bold text-blue-600 mb-8">DevHub</h1>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-light text-black">Make the most of your professional life</h2>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Full Name</label>
                        <input type="text" name="name" onChange={handleChange} className="p-2 border border-black rounded focus:outline-none text-black" required />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Email</label>
                        <input type="email" name="email" onChange={handleChange} className="p-2 border border-black rounded focus:outline-none text-black" required />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Password (6+ characters)</label>
                        <input type="password" name="password" onChange={handleChange} className="p-2 border border-black rounded focus:outline-none text-black" required />
                    </div>

                    <p className="text-xs text-gray-500 text-center my-2">By clicking Agree & Join, you agree to the DevHub User Agreement, Privacy Policy, and Cookie Policy.</p>

                    <button type="submit" disabled={isLoading} className="p-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                        {isLoading ? 'Registering...' : 'Agree & Join'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">Already on DevHub? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}
