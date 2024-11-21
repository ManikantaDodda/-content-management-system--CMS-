"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Editor from "../components/Editor";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await axios.get(`${apiUrl}api/posts`);
    setPosts(data);
  };

  const handleSave = async () => {
    const payload = { title, content };
    if (editingPost) {
      await axios.put(`${apiUrl}api/posts/${editingPost._id}`, payload);
    } else {
      await axios.post(`${apiUrl}api/posts`, payload);
    }
    setTitle("");
    setContent("");
    setEditingPost(null);
    fetchPosts();
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingPost(post);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${apiUrl}/api/posts/${id}`);
    fetchPosts();
  };

  return (
    <div className="h-screen bg-gray-100 w-100 py-10 px-5">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">CMS Dashboard</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">{editingPost ? "Edit Post" : "Create a Post"}</h2>
          <input
            type="text"
            placeholder="Enter Title"
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Editor value={content} onChange={setContent} />
          <button
            onClick={handleSave}
            className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            {editingPost ? "Update Post" : "Create Post"}
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts available. Start by creating one!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                  <div
                    className="text-gray-700 text-sm mb-4"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
