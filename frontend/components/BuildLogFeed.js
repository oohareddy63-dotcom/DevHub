'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBuildLogs, createBuildLog } from '../store/slices/buildLogSlice';
import { Plus, Filter, Code } from 'lucide-react';
import BuildLogCard from './BuildLogCard';

export default function BuildLogFeed() {
  const dispatch = useDispatch();
  const { buildLogs, isLoading, error } = useSelector((state) => state.buildLogs);
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
          {buildLogs.map((log) => (
            <BuildLogCard key={log._id} log={log} />
          ))}
        </div>
      )}
    </div>
  );
}
