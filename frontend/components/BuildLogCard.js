'use client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    likeBuildLog,
    addComment,
    requestHelp,
    addProgressUpdate,
    addBlocker,
    resolveBlocker,
    addBlockerSolution,
    voteBlockerSolution
} from '../store/slices/buildLogSlice';
import {
    BookOpen, Code, TestTube, Rocket, AlertTriangle,
    Heart, MessageCircle, HelpCircle,
    ChevronDown, ChevronUp, CheckCircle, XCircle,
    Calendar, TrendingUp, AlertOctagon, ThumbsUp, Check
} from 'lucide-react';

const phaseIcons = {
    learning: BookOpen,
    building: Code,
    testing: TestTube,
    deployment: Rocket,
    troubleshooting: AlertTriangle
};

const phaseColors = {
    learning: 'bg-blue-100 text-blue-800',
    building: 'bg-green-100 text-green-800',
    testing: 'bg-yellow-100 text-yellow-800',
    deployment: 'bg-purple-100 text-purple-800',
    troubleshooting: 'bg-red-100 text-red-800'
};

export default function BuildLogCard({ log }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const PhaseIcon = phaseIcons[log.phase];

    const [activeTab, setActiveTab] = useState('details'); // details, progress, blockers
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [showBlockerForm, setShowBlockerForm] = useState(false);

    // Form states
    const [updateData, setUpdateData] = useState({ percentage: log.progress, note: '' });
    const [blockerData, setBlockerData] = useState({ title: '', description: '' });
    const [solutionText, setSolutionText] = useState('');
    const [activeBlockerId, setActiveBlockerId] = useState(null);

    const handleLike = () => dispatch(likeBuildLog(log._id));

    const handleAddUpdate = async (e) => {
        e.preventDefault();
        await dispatch(addProgressUpdate({ logId: log._id, updateData }));
        setShowUpdateForm(false);
        setUpdateData({ percentage: log.progress, note: '' });
    };

    const handleAddBlocker = async (e) => {
        e.preventDefault();
        await dispatch(addBlocker({ logId: log._id, blockerData }));
        setShowBlockerForm(false);
        setBlockerData({ title: '', description: '' });
    };

    const handleAddSolution = async (blockerId, e) => {
        e.preventDefault();
        if (!solutionText.trim()) return;
        await dispatch(addBlockerSolution({ logId: log._id, blockerId, text: solutionText }));
        setSolutionText('');
        setActiveBlockerId(null);
    };

    const handleVoteSolution = (blockerId, solutionId) => {
        dispatch(voteBlockerSolution({ logId: log._id, blockerId, solutionId }));
    };

    const handleResolveBlocker = (blockerId, solutionId = null) => {
        dispatch(resolveBlocker({ logId: log._id, blockerId, solutionId }));
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {log.userId?.profilePic ? (
                            <img src={log.userId.profilePic} alt={log.userId.name} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-500 font-medium">{log.userId?.name?.[0] || 'U'}</span>
                            </div>
                        )}
                        <div>
                            <h4 className="font-semibold text-gray-900">{log.userId?.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>Day {log.day}</span>
                                <span>•</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${phaseColors[log.phase]}`}>
                                    <PhaseIcon className="h-3 w-3 inline mr-1" />
                                    {log.phase}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">{new Date(log.createdAt).toLocaleDateString()}</div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{log.title}</h3>

                {/* Progress Bar (Always visible) */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span className="font-medium">Progress</span>
                        <span className="font-bold">{log.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${log.progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {log.tags?.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">#{tag}</span>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Details
                </button>
                <button
                    onClick={() => setActiveTab('progress')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'progress' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    History
                </button>
                <button
                    onClick={() => setActiveTab('blockers')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors ${activeTab === 'blockers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Blockers ({log.blockers?.filter(b => b.status === 'open').length || 0})
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 pt-4 bg-gray-50 min-h-[200px]">

                {/* DETAILS TAB */}
                {activeTab === 'details' && (
                    <div>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{log.description}</p>
                        {log.attachments?.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {/* Simplified attachments for now */}
                                {log.attachments.map((att, idx) => (
                                    <div key={idx} className="text-xs bg-white p-2 border rounded text-blue-600 truncate">
                                        {att.url}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* PROGRESS HISTORY TAB */}
                {activeTab === 'progress' && (
                    <div className="space-y-4">
                        {showUpdateForm ? (
                            <form onSubmit={handleAddUpdate} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <h5 className="font-semibold text-sm mb-3">Add Progress Update</h5>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">New Percentage</label>
                                        <input
                                            type="number"
                                            min="0" max="100"
                                            value={updateData.percentage}
                                            onChange={e => setUpdateData({ ...updateData, percentage: parseInt(e.target.value) })}
                                            className="w-full p-2 text-sm border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Note</label>
                                        <textarea
                                            value={updateData.note}
                                            onChange={e => setUpdateData({ ...updateData, note: e.target.value })}
                                            className="w-full p-2 text-sm border rounded"
                                            rows="2"
                                            placeholder="What did you achieve?"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setShowUpdateForm(false)} className="text-xs px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                        <button type="submit" className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700">Save Update</button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            log.userId?._id === user?._id && (
                                <button
                                    onClick={() => setShowUpdateForm(true)}
                                    className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-600 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <TrendingUp className="h-4 w-4" /> Log Progress
                                </button>
                            )
                        )}

                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pl-6 py-2">
                            {log.progressUpdates?.slice().reverse().map((update, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[31px] bg-blue-100 border-2 border-white w-4 h-4 rounded-full"></div>
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-gray-900 text-sm">{update.percentage}%</span>
                                        <span className="text-xs text-gray-500">{new Date(update.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{update.note}</p>
                                </div>
                            ))}
                            {/* Initial Create Log Entry */}
                            <div className="relative">
                                <div className="absolute -left-[31px] bg-gray-200 border-2 border-white w-4 h-4 rounded-full"></div>
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-gray-900 text-sm">Started</span>
                                    <span className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Project initialized</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* BLOCKERS TAB */}
                {activeTab === 'blockers' && (
                    <div className="space-y-4">
                        {showBlockerForm ? (
                            <form onSubmit={handleAddBlocker} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <h5 className="font-semibold text-sm mb-3">Report a Blocker</h5>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={blockerData.title}
                                            onChange={e => setBlockerData({ ...blockerData, title: e.target.value })}
                                            className="w-full p-2 text-sm border rounded"
                                            placeholder="e.g., MongoDB Connection Refused"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={blockerData.description}
                                            onChange={e => setBlockerData({ ...blockerData, description: e.target.value })}
                                            className="w-full p-2 text-sm border rounded"
                                            rows="3"
                                            placeholder="Describe the error, logs, and what you've tried..."
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setShowBlockerForm(false)} className="text-xs px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                        <button type="submit" className="text-xs px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700">Report Blocker</button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            log.userId?._id === user?._id && (
                                <button
                                    onClick={() => setShowBlockerForm(true)}
                                    className="w-full py-2 border-2 border-dashed border-red-200 text-red-500 rounded-lg hover:border-red-400 hover:text-red-600 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <AlertOctagon className="h-4 w-4" /> Report Blocker
                                </button>
                            )
                        )}

                        <div className="space-y-3">
                            {log.blockers?.length === 0 && !showBlockerForm && (
                                <p className="text-center text-sm text-gray-500 italic py-4">No blockers reported properly! 🎉</p>
                            )}
                            {log.blockers?.slice().reverse().map((blocker) => (
                                <div key={blocker._id} className={`bg-white rounded-lg border ${blocker.status === 'resolved' ? 'border-green-200' : 'border-red-200'} p-4`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-2 items-center">
                                            {blocker.status === 'resolved' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
                                            <h4 className="font-semibold text-gray-800 text-sm">{blocker.title}</h4>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${blocker.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {blocker.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{blocker.description}</p>

                                    {/* Solutions Area */}
                                    <div className="bg-gray-50 rounded p-3 text-sm">
                                        <h6 className="font-semibold text-xs text-gray-500 mb-2 uppercase">Solutions ({blocker.solutions?.length})</h6>
                                        <div className="space-y-3">
                                            {blocker.solutions?.map((sol) => (
                                                <div key={sol._id} className={`flex gap-3 p-2 rounded ${sol.isAccepted ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-100'}`}>
                                                    <div className="flex flex-col items-center gap-1">
                                                        <button onClick={() => handleVoteSolution(blocker._id, sol._id)} className="text-gray-400 hover:text-blue-600">
                                                            <ChevronUp className="h-4 w-4" />
                                                        </button>
                                                        <span className="text-xs font-bold text-gray-600">{sol.upvotes?.length || 0}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-gray-800">{sol.text}</p>
                                                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                                            <span>{sol.userId?.name}</span>
                                                            {sol.isAccepted && (
                                                                <span className="flex items-center gap-1 text-green-600 font-bold bg-green-100 px-1.5 rounded-full">
                                                                    <Check className="h-3 w-3" /> Accepted
                                                                </span>
                                                            )}
                                                            {/* Allow author to accept */}
                                                            {log.userId?._id === user?._id && blocker.status !== 'resolved' && (
                                                                <button onClick={() => handleResolveBlocker(blocker._id, sol._id)} className="text-blue-600 hover:underline">Accept Solution</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add Solution Input */}
                                        {blocker.status !== 'resolved' && (
                                            <div className="mt-3">
                                                {activeBlockerId === blocker._id ? (
                                                    <form onSubmit={(e) => handleAddSolution(blocker._id, e)}>
                                                        <textarea
                                                            value={solutionText}
                                                            onChange={e => setSolutionText(e.target.value)}
                                                            className="w-full text-sm border rounded p-2 mb-2"
                                                            placeholder="Suggest a solution..."
                                                            rows="2"
                                                        ></textarea>
                                                        <div className="flex justify-end gap-2">
                                                            <button type="button" onClick={() => setActiveBlockerId(null)} className="text-xs text-gray-500">Cancel</button>
                                                            <button type="submit" className="text-xs bg-blue-600 text-white px-3 py-1 rounded">Post</button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <button onClick={() => setActiveBlockerId(blocker._id)} className="text-xs text-blue-600 hover:underline">Write a solution...</button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-6">
                <button onClick={handleLike} className={`flex items-center gap-2 text-sm font-medium ${log.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}>
                    <Heart className={`h-5 w-5 ${log.isLiked ? 'fill-current' : ''}`} />
                    {log.likesCount || 0} Likes
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600">
                    <MessageCircle className="h-5 w-5" />
                    {log.comments?.length || 0} Comments
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600">
                    <HelpCircle className="h-5 w-5" />
                    {log.helpRequests?.length || 0} Help Requests
                </button>
            </div>
        </div>
    );
}
