import React, { useState, useEffect, useCallback } from 'react';
import { 
  MessageSquare, 
  User, 
  Paperclip, 
  ThumbsUp, 
  ThumbsDown,
  MessageCircle,
  MoreHorizontal, 
  Trash2,
  Reply,
  Loader2,
  Search,
  RefreshCw
} from 'lucide-react';
import ImageThumbnail from './ImageThumbnail';
import Toast from './Toast';
import FileSizeErrorModal from './FileSizeErrorModal';
import ImagePreviewModal from './ImagePreviewModal';

const CommentSection = ({ pageId, pageType = 'company' }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  
  // New state for backend integration
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState(null);
  const [fileSizeError, setFileSizeError] = useState(null);
  const [modalImages, setModalImages] = useState([]);

  const API_BASE_URL = '/api';

  // Fetch comments from backend
  const fetchComments = useCallback(async (page = 1, search = '') => {
    if (!pageId) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        pageId,
        pageType,
        page: page.toString(),
        limit: '10'
      });

      if (search) {
        params.append('query', search);
      }

      const response = await fetch(`${API_BASE_URL}/comments/page/${pageId}?${params}`);
      const data = await response.json();

      if (data.success) {
        if (page === 1) {
          setComments(data.data);
        } else {
          setComments(prev => [...prev, ...data.data]);
        }
        setCurrentPage(data.pagination.currentPage);
        setHasNextPage(data.pagination.hasNextPage);
        setHasPrevPage(data.pagination.hasPrevPage);
        setTotalComments(data.pagination.totalComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }, [pageId, pageType]);

  // Fetch comment statistics
  const fetchStats = useCallback(async () => {
    if (!pageId) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/comments/stats/${pageId}?pageType=${pageType}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [pageId, pageType]);

  // Load comments on component mount
  useEffect(() => {
    fetchComments();
    fetchStats();
  }, [fetchComments, fetchStats]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      processImageFile(file);
    });
  };

  const processImageFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'error');
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setFileSizeError({
        fileName: file.name,
        fileSize: file.size,
        maxSize: 5
      });
      return;
    }
    
    // Check if we already have 2 images (limit)
    if (selectedImages.length >= 2) {
      showToast('You can only upload up to 2 images at once.', 'error');
      return;
    }
    
    // Create a preview URL for the selected image
    const imageUrl = URL.createObjectURL(file);
    const newImage = { file, url: imageUrl, id: Date.now() + Math.random() };
    setSelectedImages(prev => [...prev, newImage]);
    console.log('Image selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      processImageFile(file);
    });
  };

  const handlePostComment = async () => {
    if (!commentText.trim() || !userName.trim()) {
      showToast('Please enter both your name and comment.', 'error');
      return;
    }

    setPosting(true);
    try {
      const formData = new FormData();
      formData.append('userName', userName.trim());
      formData.append('content', commentText.trim());
      formData.append('pageId', pageId);
      formData.append('pageType', pageType);

      // Add images if any
      selectedImages.forEach((image, index) => {
        formData.append('images', image.file);
      });

      const response = await fetch(`${API_BASE_URL}/comments/create`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Reset form
        setCommentText('');
        setUserName('');
        setSelectedImages([]);
        
        // Refresh comments
        fetchComments(1);
        fetchStats();
        
        showToast('Comment posted successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to post comment', 'error');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      showToast('Failed to post comment. Please try again.', 'error');
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        fetchStats();
        setOpenDropdown(null);
        showToast('Comment deleted successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to delete comment', 'error');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      showToast('Failed to delete comment. Please try again.', 'error');
    }
  };

  const handleReaction = async (commentId, type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/reaction`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type })
      });

      const data = await response.json();

      if (data.success) {
        setComments(prev => prev.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              likes: data.data.likes,
              dislikes: data.data.dislikes
            };
          }
          return comment;
        }));
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyText.trim() || !userName.trim()) {
      showToast('Please enter both your name and reply.', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: userName.trim(),
          content: replyText.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setComments(prev => prev.map(comment => {
          if (comment._id === commentId) {
            return data.data;
          }
          return comment;
        }));
        
        setReplyText('');
        setReplyingTo(null);
        showToast('Reply added successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to add reply', 'error');
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      showToast('Failed to add reply. Please try again.', 'error');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchComments(1);
      return;
    }

    setSearching(true);
    try {
      const params = new URLSearchParams({
        pageId,
        pageType,
        query: searchQuery.trim(),
        page: '1',
        limit: '10'
      });

      const response = await fetch(`${API_BASE_URL}/comments/search/${pageId}?${params}`);
      const data = await response.json();

      if (data.success) {
        setComments(data.data);
        setCurrentPage(data.pagination.currentPage);
        setHasNextPage(data.pagination.hasNextPage);
        setHasPrevPage(data.pagination.hasPrevPage);
        setTotalComments(data.pagination.totalComments);
      }
    } catch (error) {
      console.error('Error searching comments:', error);
    } finally {
      setSearching(false);
    }
  };

  const loadMoreComments = () => {
    if (hasNextPage) {
      fetchComments(currentPage + 1, searchQuery);
    }
  };

  const removeImage = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleDeleteReply = async (commentId, replyIndex) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;

    try {
      // Try the standard endpoint first
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}/reply/${replyIndex}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        // If that fails, try updating the comment with the reply removed
        const comment = comments.find(c => c._id === commentId);
        if (comment && comment.replies) {
          const updatedReplies = comment.replies.filter((_, index) => index !== replyIndex);
          
          const updateResponse = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              replies: updatedReplies
            })
          });

          const updateData = await updateResponse.json();

          if (updateData.success) {
            setComments(prev => prev.map(comment => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  replies: updatedReplies
                };
              }
              return comment;
            }));
            fetchStats();
            showToast('Reply deleted successfully!', 'success');
            return;
          }
        }
        
        // If backend doesn't support reply deletion, just remove from UI
        console.warn('Backend does not support reply deletion, removing from UI only');
        setComments(prev => prev.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              replies: comment.replies.filter((_, index) => index !== replyIndex)
            };
          }
          return comment;
        }));
        showToast('Reply removed from view (backend deletion not supported)', 'warning');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setComments(prev => prev.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              replies: comment.replies.filter((_, index) => index !== replyIndex)
            };
          }
          return comment;
        }));
        fetchStats();
        showToast('Reply deleted successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to delete reply', 'error');
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      
      // Fallback: remove from UI even if backend fails
      setComments(prev => prev.map(comment => {
        if (comment._id === commentId) {
          return {
            ...comment,
            replies: comment.replies.filter((_, index) => index !== replyIndex)
          };
        }
        return comment;
      }));
      showToast('Reply removed from view (backend error)', 'warning');
    }
  };

  // Keyboard navigation for modal
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showImageModal || selectedImages.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        setModalImageIndex(prev => prev === 0 ? selectedImages.length - 1 : prev - 1);
      } else if (e.key === 'ArrowRight') {
        setModalImageIndex(prev => prev === selectedImages.length - 1 ? 0 : prev + 1);
      } else if (e.key === 'Escape') {
        setShowImageModal(false);
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showImageModal, selectedImages.length]);

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    // If more than 24 hours, show date in proper format
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <MessageSquare className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">Comments & Feedback</h3>
          <p className="text-sm text-gray-600">Share your experience or ask questions</p>
          {stats && (
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>{stats.totalComments} comments</span>
              <span>{stats.totalLikes} likes</span>
              <span>{stats.totalReplies} replies</span>
              {stats.commentsWithImages > 0 && (
                <span>{stats.commentsWithImages} with images</span>
              )}
            </div>
          )}
        </div>
        <button 
          onClick={() => fetchComments(1)}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
          title="Refresh comments"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Comment Form */}
      <div className="mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="mb-3">
            <input
              type="text"
              placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-blue-50/30 text-gray-800 placeholder-gray-400 shadow-sm"
                maxLength={50}
            />
          </div>
            <textarea
              placeholder="Share your thoughts, ask questions, or provide feedback..."
              className={`w-full p-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all bg-blue-50/30 text-gray-800 placeholder-gray-400 resize-none shadow-sm ${
                isDragOver ? 'border-blue-400 bg-blue-50' : ''
              }`}
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
            {isDragOver && (
              <div className="text-center text-blue-600 font-medium mt-2">
                Drop your image here to attach it
              </div>
            )}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 cursor-pointer border border-dashed border-gray-300 hover:border-blue-400 transition-all duration-200">
                  <Paperclip className="h-4 w-4" />
                  <span>Attach Images</span>
                  <span className="text-xs text-gray-400">(Max 2 images, 5MB each)</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {selectedImages.length > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-green-700 font-medium">
                        {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} attached
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {selectedImages.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <img 
                            src={image.url} 
                            alt="Image preview" 
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              setModalImages(selectedImages);
                              setModalImageIndex(index);
                              setShowImageModal(true);
                            }}
                            title="Click to view larger"
                          />
                          <button
                            onClick={() => removeImage(image.id)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Total size: {(selectedImages.reduce((total, img) => total + img.file.size, 0) / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                )}
              </div>
            <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePostComment}
                disabled={posting || !commentText.trim() || !userName.trim()}
              >
                {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post Comment'}
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {loading && comments.length === 0 ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="text-gray-600 mt-2">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
            <p className="text-gray-600 mt-2">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-blue-700">
                    {getInitials(comment.userName)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{comment.userName}</span>
                      <span className="text-xs text-gray-400">(Not Verified)</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <div className="relative">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => setOpenDropdown(openDropdown === comment._id ? null : comment._id)}
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </button>
                      {openDropdown === comment._id && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                          <button 
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  
                  {/* Comment Images */}
                  {comment.images && comment.images.length > 0 && (
                    <div className="mb-3 flex gap-2">
                      {comment.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image.url} 
                            alt="Comment image"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              setModalImages(comment.images);
                              setModalImageIndex(index);
                              setShowImageModal(true);
                            }}
                            title="Click to view larger"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <button 
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={() => handleReaction(comment._id, 'like')}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes}</span>
                    </button>
                    <button 
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                      onClick={() => handleReaction(comment._id, 'dislike')}
                    >
                      <ThumbsDown className="h-4 w-4" />
                      <span>{comment.dislikes}</span>
                    </button>
                    <button 
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Reply</span>
                    </button>
                  </div>
                  
                  {/* Reply Form */}
                  {replyingTo === comment._id && (
                    <div className="mt-4 ml-4 pl-4 border-l-2 border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          <Reply className="h-4 w-4 text-blue-700" />
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                            <span className="text-sm font-semibold text-blue-700">
                              {getInitials(userName || 'U')}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <textarea
                            placeholder="Write your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all resize-none"
                            rows="2"
                          />
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleAddReply(comment._id)}
                              disabled={!replyText.trim() || !userName.trim()}
                              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                !replyText.trim() || !userName.trim()
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText('');
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                          {(!replyText.trim() || !userName.trim()) && (
                            <div className="text-xs text-red-500 mt-1">
                              {!userName.trim() ? 'Please enter your name in the main form above.' : 'Please enter your reply.'}
                      </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {comment.replies.map((reply, index) => (
                        <div key={index} className="ml-4 pl-4 border-l-2 border-gray-200">
                          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                            <div className="flex items-start gap-3">
                              <div className="flex items-center gap-2">
                                <Reply className="h-4 w-4 text-blue-700" />
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 border border-blue-200">
                                  <span className="text-sm font-semibold text-blue-700">
                                    {getInitials(reply.userName)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">{reply.userName}</span>
                                    <span className="text-xs text-gray-400">(Not Verified)</span>
                                    <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                                    {reply.isOfficial && (
                                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                        Official
                                      </span>
                                    )}
                                  </div>
                                  <div className="relative">
                                    <button 
                                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                      onClick={() => setOpenDropdown(openDropdown === `reply-${comment._id}-${index}` ? null : `reply-${comment._id}-${index}`)}
                                    >
                                      <MoreHorizontal className="h-3 w-3 text-gray-500" />
                                    </button>
                                    {openDropdown === `reply-${comment._id}-${index}` && (
                                      <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[100px]">
                                        <button 
                                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                          onClick={() => handleDeleteReply(comment._id, index)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <p className="text-gray-700 mb-3 leading-relaxed">{reply.content}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                </div>
              </div>
            ))
          )}

        {/* Load More Comments */}
        {hasNextPage && (
          <div className="text-center pt-4">
            <button 
              onClick={loadMoreComments}
              disabled={loading}
              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Load more comments'}
            </button>
        </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && selectedImages.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-gray-300 transition-colors z-10"
            >
              ×
            </button>
            
            {/* Navigation arrows for multiple images */}
            {selectedImages.length > 1 && (
              <>
                <button
                  onClick={() => setModalImageIndex(prev => prev === 0 ? selectedImages.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
                >
                  ←
                </button>
                <button
                  onClick={() => setModalImageIndex(prev => prev === selectedImages.length - 1 ? 0 : prev + 1)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
                >
                  →
                </button>
              </>
            )}
            
            <img 
              src={selectedImages[modalImageIndex].url} 
              alt="Full size preview" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
              {selectedImages[modalImageIndex].file.name} ({(selectedImages[modalImageIndex].file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
            
            {/* Image counter */}
            {selectedImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                {modalImageIndex + 1} / {selectedImages.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* File Size Error Modal */}
      <FileSizeErrorModal
        isOpen={!!fileSizeError}
        onClose={() => setFileSizeError(null)}
        fileName={fileSizeError?.fileName}
        fileSize={fileSizeError?.fileSize}
        maxSize={fileSizeError?.maxSize}
      />

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        images={modalImages}
        currentIndex={modalImageIndex}
        onIndexChange={setModalImageIndex}
      />
    </div>
  );
};

export default CommentSection;