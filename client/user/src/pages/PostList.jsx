import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/posts");
        const data = await res.json();
        if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else {
          console.error("Expected posts array, got:", data);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts");
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete post");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">🌟 Blog Dashboard</h1>

      <div className="text-center mb-8">
        <Link
          to="/posts/new"
          className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition-all"
        >
          ➕ Create New Post
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {posts.length === 0 ? (
        <p className="text-gray-600 text-center">No posts found.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li
              key={post._id}
              className="bg-white border border-blue-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-semibold text-indigo-800">{post.title}</h2>
                <span className="text-sm text-gray-500">
                  ⏰ {formatDistanceToNow(new Date(post.createdAt))} ago
                </span>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                {post.content.length > 180
                  ? post.content.substring(0, 180) + '...'
                  : post.content}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/posts/${post._id}`}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-1.5 rounded-md text-sm"
                >
                  👁 View
                </Link>
                <Link
                  to={`/posts/${post._id}/edit`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded-md text-sm"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm"
                >
                  🗑 Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
