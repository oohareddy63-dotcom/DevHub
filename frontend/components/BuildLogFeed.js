'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchBuildLogs, 
  createBuildLog, 
  likeBuildLog, 
  addComment, 
  requestHelp 
} from '../store/slices/buildLogSlice';
import { 
  BookOpen, 
  Code, 
  TestTube, 
  Rocket, 
  AlertTriangle, 
  Heart, 
  MessageCircle, 
  HelpCircle,
  Plus,
  Filter
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

export default function BuildLogFeed() {
  const dispatch = useDispatch();
  const { buildLogs, isLoading, error, pagination } = useSelector((state) => state.buildLogs);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLog, setNewLog] = useState({
    title: '',
    description: '',
    day: 1,
    phase: 'learning',
    progress: 0,
    tags: [],
    isPublic: true
  });
  const [filterPhase, setFilterPhase] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    dispatch(fetchBuildLogs({ phase: filterPhase }));
  }, [dispatch, filterPhase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newLog.title.trim() || !newLog.description.trim()) return;

    const result = await dispatch(createBuildLog(newLog));
    if (result.meta.requestStatus === 'fulfilled') {
      setNewLog({
        title: '',
        description: '',
        day: 1,
        phase: 'learning',
        progress: 0,
        tags: [],
        isPublic: true
      });
      setShowCreateForm(false);
    }
  };

  const handleLike = async (logId) => {
    dispatch(likeBuildLog(logId));
  };

  const handleComment = async (logId, text) => {
    if (!text.trim()) return;
    dispatch(addComment({ logId, text }));
  };

  const handleHelpRequest = async (logId, message) => {
    if (!message.trim()) return;
    dispatch(requestHelp({ logId, message }));
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!newLog.tags.includes(tagInput.trim())) {
        setNewLog({ ...newLog, tags: [...newLog.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNewLog({ 
      ...newLog, 
      tags: newLog.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Please login to view build logs</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Build Log Button */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium text-gray-700">Create New Build Log</span>
        </button>
      </div>

      {/* Create Build Log Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Create Build Log</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newLog.title}
                onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="What are you working on?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newLog.description}
                onChange={(e) => setNewLog({ ...newLog, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows={3}
                placeholder="Describe your progress..."
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <input
                  type="number"
                  value={newLog.day}
                  onChange={(e) => setNewLog({ ...newLog, day: parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phase</label>
                <select
                  value={newLog.phase}
                  onChange={(e) => setNewLog({ ...newLog, phase: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="learning">Learning</option>
                  <option value="building">Building</option>
                  <option value="testing">Testing</option>
                  <option value="deployment">Deployment</option>
                  <option value="troubleshooting">Troubleshooting</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                <input
                  type="number"
                  value={newLog.progress || 0}
                  onChange={(e) => setNewLog({ ...newLog, progress: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  min="0"
                  max="100"
                  placeholder="Enter progress percentage (0-100)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Add tags (press Enter)"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {newLog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={newLog.isPublic}
                onChange={(e) => setNewLog({ ...newLog, isPublic: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Make this build log public
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Build Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={filterPhase}
            onChange={(e) => setFilterPhase(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">All Phases</option>
            <option value="learning">Learning</option>
            <option value="building">Building</option>
            <option value="testing">Testing</option>
            <option value="deployment">Deployment</option>
            <option value="troubleshooting">Troubleshooting</option>
          </select>
        </div>
      </div>

      {/* Build Logs Feed */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading build logs...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      ) : buildLogs.length === 0 ? (
        <div className="text-center py-8">
          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No build logs yet</h3>
          <p className="text-gray-500">Start your learning journey by creating your first build log!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {buildLogs.map((log) => {
            const PhaseIcon = phaseIcons[log.phase];
            return (
              <div key={log._id} className="bg-white rounded-lg shadow-md p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {log.userId?.profilePic ? (
                      <img
                        src={`http://localhost:4000${log.userId.profilePic}`}
                        alt={log.userId.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {log.userId?.name?.[0] || 'U'}
                        </span>
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
                  <div className="text-sm text-gray-500">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{log.title}</h3>
                  <p className="text-gray-700 mb-3">{log.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{log.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${log.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tags */}
                  {log.tags && log.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {log.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t">
                  <button
                    onClick={() => handleLike(log._id)}
                    className={`flex items-center gap-2 text-sm ${log.isLiked ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 transition-colors`}
                  >
                    <Heart className={`h-4 w-4 ${log.isLiked ? 'fill-current' : ''}`} />
                    <span>{log.likesCount || 0}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>{log.comments?.length || 0}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                    <HelpCircle className="h-4 w-4" />
                    <span>{log.helpRequests?.length || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
