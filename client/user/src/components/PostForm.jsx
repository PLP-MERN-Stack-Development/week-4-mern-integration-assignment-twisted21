import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({ title: "", content: "", category: "", author: "" });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((res) => {
        if (res.data.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch((err) => {
        console.error("Failed to load categories:", err);
        setError("Failed to load categories");
      });
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/posts/${id}`)
        .then((res) => {
          const p = res.data.post;
          setPost({
            title: p.title,
            content: p.content,
            category: p.category?._id || "",
            author: p.author || ""
          });
        })
        .catch((err) => {
          console.error("Failed to fetch post:", err);
          setError("Failed to load post");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const url = id ? `/api/posts/${id}` : "/api/posts";
    const method = id ? axios.put : axios.post;

    method(url, post)
      .then(() => {
        setSuccess(`Post ${id ? "updated" : "created"} successfully!`);
        setTimeout(() => navigate(id ? `/posts/${id}` : "/"), 1000);
      })
      .catch((err) => {
        console.error("Submission error:", err.response?.data || err.message, err);
        setError(`Failed to ${id ? "update" : "create"} post`);
      });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      axios
        .delete(`/api/posts/${id}`)
        .then(() => {
          setSuccess("Post deleted successfully!");
          setTimeout(() => navigate("/"), 1000);
        })
        .catch((err) => {
          console.error("Delete error:", err);
          setError("Failed to delete post");
        });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error && !success) return <div className="text-red-500">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{id ? "Edit Post" : "Create Post"}</h1>

      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Content</label>
        <textarea
          name="content"
          value={post.content}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="5"
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Category</label>
        <select
          name="category"
          value={post.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Author ID</label>
        <input
          type="text"
          name="author"
          value={post.author}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          placeholder="Enter Author MongoDB ID"
        />
      </div>

      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {id ? "Update Post" : "Create Post"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>

        {id && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
