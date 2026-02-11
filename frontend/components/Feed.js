'use client';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Image as ImageIcon, Send, ThumbsUp, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { createPost, likePost, deletePost } from '../store/slices/postSlice';

export default function Feed({ user, posts, onPostCreated }) {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.posts);
    const [newPost, setNewPost] = useState('');

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        const result = await dispatch(createPost({ text: newPost }));
        if (result.meta.requestStatus === 'fulfilled') {
            setNewPost('');
            onPostCreated();
        }
    };

    const handleLikePost = (postId) => {
        dispatch(likePost(postId));
    };

    const handleDeletePost = (postId) => {
        dispatch(deletePost(postId));
    };

    return (
        <div className="space-y-4 pb-20">

            {/* Create Post Widget */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                <div className="flex gap-4">
                    {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                    )}
                    <button className="flex-grow text-left pl-4 border border-gray-300 rounded-full bg-white text-gray-500 hover:bg-gray-100 font-semibold text-sm h-12">
                        Start a post
                    </button>
                </div>

                {/* Expanded Input (Visible when 'Start a post' is clicked - Simplified here for now using direct input) 
            For now, I'll make the input always visible to ensure functionality first, then styling.
        */}
                <form onSubmit={handleCreatePost} className='mt-4'>
                    <textarea
                        className="w-full p-2 border-none focus:ring-0 text-black resize-none"
                        placeholder="What do you want to talk about?"
                        rows={2}
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex gap-4 text-gray-500">
                            <button type="button" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded">
                                <ImageIcon className="h-5 w-5 text-blue-500" />
                                <span className="text-sm font-semibold text-gray-600">Media</span>
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={!newPost.trim() || isLoading}
                            className={`px-4 py-1.5 rounded-full font-semibold text-white ${!newPost.trim() || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isLoading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Posts */}
            {posts.map((post) => (
                <PostCard key={post._id} post={post} onLikePost={handleLikePost} onDeletePost={handleDeletePost} />
            ))}

            {posts.length === 0 && (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No posts to show yet. Follow more people or start a conversation!</p>
                </div>
            )}

        </div>
    );
}

function PostCard({ post, onLikePost, onDeletePost }) {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState(post.comments || []);

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        // For now, we'll keep the comment functionality simple
        // This would need to be updated to use Redux comment actions
        setComments([...comments, {
            _id: Date.now().toString(),
            userId: { name: 'Current User' },
            text: newComment,
            createdAt: new Date()
        }]);
        setNewComment('');
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200">
            {/* Header */}
            <div className="flex items-center gap-3 p-4">
                {post.userId?.profilePic ? (
                    <img src={post.userId.profilePic} alt="Avatar" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                )}
                <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900">{post.userId?.name || 'DevHub User'}</h3>
                    <p className="text-xs text-gray-500">Software Engineer</p>
                    <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()} • <span className="text-gray-500">Global</span></p>
                </div>
                <button className="text-gray-500">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-2">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{post.text}</p>
            </div>
            {/* Media would go here */}

            {/* Stats */}
            <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100 flex justify-between">
                <span>{post.likes?.length || 0} likes</span>
                <span>{comments.length} comments</span>
            </div>

            {/* Action Buttons */}
            <div className="px-2 py-1 flex justify-between">
                <button 
                    onClick={() => onLikePost && onLikePost(post._id)}
                    className="flex items-center justify-center gap-2 p-3 hover:bg-gray-100 rounded-md flex-1 text-gray-600 transition-colors"
                >
                    <ThumbsUp className="h-5 w-5" />
                    <span className="text-sm font-semibold">Like</span>
                </button>
                <button 
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center justify-center gap-2 p-3 hover:bg-gray-100 rounded-md flex-1 text-gray-600 transition-colors"
                >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold">Comment</span>
                </button>
                <ActionButton icon={<Share2 className="h-5 w-5" />} label="Share" />
                <ActionButton icon={<Send className="h-5 w-5" />} label="Send" />
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="border-t border-gray-100">
                    {/* Add Comment */}
                    <div className="p-4">
                        <form onSubmit={handleComment} className="flex gap-3">
                            <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                            <input
                                type="text"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-1 px-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Post
                            </button>
                        </form>
                    </div>

                    {/* Display Comments */}
                    {comments.length > 0 && (
                        <div className="px-4 pb-4 space-y-3">
                            {comments.map((comment) => (
                                <div key={comment._id} className="flex gap-3">
                                    {comment.userId?.profilePic ? (
                                        <img src={comment.userId.profilePic} alt="" className="h-8 w-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                    )}
                                    <div className="flex-1">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="font-semibold text-sm text-gray-900">{comment.userId?.name || 'User'}</p>
                                            <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function ActionButton({ icon, label }) {
    return (
        <button className="flex items-center justify-center gap-2 p-3 hover:bg-gray-100 rounded-md flex-1 text-gray-600 transition-colors">
            {icon}
            <span className="text-sm font-semibold">{label}</span>
        </button>
    )
}
