import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";


export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/posts/${id}`)
      .then((res) => setPost(res.data.post)) // ✅ FIXED
      .catch((err) => {
        console.error("Error fetching post:", err);
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="mb-4">{post.content}</p>
      <Link
        to={`/posts/${post._id}/edit`}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Edit
      </Link>
      <Link to="/" className="bg-gray-500 text-white px-4 py-2 rounded">
        Back to Posts
      </Link>
    </div>
  );
}
