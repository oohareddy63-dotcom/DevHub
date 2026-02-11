'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { User, MapPin, Link as LinkIcon, Briefcase, GraduationCap, Pencil, Download } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import { getUserById, updateProfile } from '../../../store/slices/userSlice';

export default function ProfilePage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();
    const { user: currentUser, isAuthenticated } = useSelector((state) => state.auth);
    const { selectedUser, isLoading } = useSelector((state) => state.user);
    
    const [isEditing, setIsEditing] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        skills: [],
        workHistory: []
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (id && isAuthenticated && isClient) {
            dispatch(getUserById(id));
        }
    }, [id, isAuthenticated, isClient, dispatch]);

    useEffect(() => {
        if (selectedUser) {
            setFormData({
                bio: selectedUser.bio || '',
                skills: selectedUser.skills || [],
                workHistory: selectedUser.workHistory || []
            });
        }
    }, [selectedUser]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data to original values
        if (selectedUser) {
            setFormData({
                bio: selectedUser.bio || '',
                skills: selectedUser.skills || [],
                workHistory: selectedUser.workHistory || []
            });
        }
    };

    const handleSave = async () => {
        const result = await dispatch(updateProfile(formData));
        if (result.meta.requestStatus === 'fulfilled') {
            setIsEditing(false);
            // Refresh user data
            dispatch(getUserById(id));
        }
    };

    const handleDownloadResume = async () => {
        try {
            // Safe localStorage access
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!token) {
                alert('Please login to download resume');
                return;
            }
            
            const response = await fetch(`http://localhost:4000/api/auth/resume/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedUser.name.replace(/\s+/g, '_')}_resume.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Failed to download resume');
            }
        } catch (error) {
            console.error('Error downloading resume:', error);
            alert('Error downloading resume');
        }
    };

    const addWorkExperience = () => {
        setFormData({
            ...formData,
            workHistory: [...formData.workHistory, {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                current: false,
                description: ''
            }]
        });
    };

    const updateWorkExperience = (index, field, value) => {
        const updatedWorkHistory = [...formData.workHistory];
        updatedWorkHistory[index][field] = value;
        setFormData({ ...formData, workHistory: updatedWorkHistory });
    };

    const removeWorkExperience = (index) => {
        const updatedWorkHistory = formData.workHistory.filter((_, i) => i !== index);
        setFormData({ ...formData, workHistory: updatedWorkHistory });
    };

    const addSkill = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            setFormData({
                ...formData,
                skills: [...formData.skills, e.target.value.trim()]
            });
            e.target.value = '';
        }
    };

    const removeSkill = (index) => {
        const updatedSkills = formData.skills.filter((_, i) => i !== index);
        setFormData({ ...formData, skills: updatedSkills });
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view profiles</h2>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading || !isClient) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
        );
    }

    if (!selectedUser) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h2>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const isOwnProfile = currentUser?._id === selectedUser._id;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            {selectedUser.profilePic ? (
                                <img 
                                    src={`http://localhost:4000${selectedUser.profilePic}`} 
                                    alt={selectedUser.name} 
                                    className="h-20 w-20 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-20 w-20 bg-gray-300 rounded-full flex items-center justify-center">
                                    <User className="h-10 w-10 text-gray-500" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h1>
                                <p className="text-gray-600">Software Engineer</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isOwnProfile && (
                                <>
                                    <button
                                        onClick={isEditing ? handleCancel : handleEdit}
                                        className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50"
                                    >
                                        {isEditing ? 'Cancel' : 'Edit Profile'}
                                    </button>
                                    <button
                                        onClick={handleDownloadResume}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        Resume
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Bio */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                            {isEditing ? (
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    rows={4}
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <p className="text-gray-700">
                                    {selectedUser.bio || 'No bio added yet'}
                                </p>
                            )}
                        </div>

                        {/* Work Experience */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
                                {isEditing && (
                                    <button
                                        onClick={addWorkExperience}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700"
                                    >
                                        Add Experience
                                    </button>
                                )}
                            </div>
                            <div className="space-y-4">
                                {formData.workHistory.map((exp, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    placeholder="Company"
                                                    value={exp.company}
                                                    onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Position"
                                                    value={exp.position}
                                                    onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input
                                                        type="date"
                                                        placeholder="Start Date"
                                                        value={exp.startDate}
                                                        onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                                                        className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                    />
                                                    {!exp.current && (
                                                        <input
                                                            type="date"
                                                            placeholder="End Date"
                                                            value={exp.endDate}
                                                            onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                                                            className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                        />
                                                    )}
                                                </div>
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={exp.current}
                                                        onChange={(e) => updateWorkExperience(index, 'current', e.target.checked)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm text-gray-700">Currently working here</span>
                                                </label>
                                                <textarea
                                                    placeholder="Description"
                                                    value={exp.description}
                                                    onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                                    rows={2}
                                                />
                                                <button
                                                    onClick={() => removeWorkExperience(index)}
                                                    className="text-red-600 text-sm font-medium hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                                <p className="text-gray-700">{exp.company}</p>
                                                <p className="text-sm text-gray-500">
                                                    {exp.startDate && new Date(exp.startDate).toLocaleDateString()} - 
                                                    {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString()}
                                                </p>
                                                {exp.description && (
                                                    <p className="text-gray-600 mt-2">{exp.description}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {formData.workHistory.length === 0 && (
                                    <p className="text-gray-500 text-center py-8">
                                        No work experience added yet
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                                {isEditing && (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Add a skill and press Enter"
                                            onKeyDown={addSkill}
                                            className="px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <div key={index} className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {skill}
                                        {isEditing && (
                                            <button
                                                onClick={() => removeSkill(index)}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {formData.skills.length === 0 && (
                                <p className="text-gray-500 text-center py-4">
                                    No skills added yet
                                </p>
                            )}
                        </div>

                        {/* Save Button */}
                        {isEditing && (
                            <div className="flex gap-4">
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-sm">Location not specified</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <LinkIcon className="h-4 w-4" />
                                    <span className="text-sm">Website not specified</span>
                                </div>
                            </div>
                        </div>

                        {/* Connections */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connections</h3>
                            <div className="text-gray-600">
                                <p className="text-sm mb-2">0 connections</p>
                                <p className="text-sm text-gray-500">Connect with professionals to grow your network</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
