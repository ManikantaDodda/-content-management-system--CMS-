"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@/components/Editor";
import { useParams, useRouter } from "next/navigation";

const CreatePost = () => {
  const params = useParams();
  const router = useRouter();
  
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchCurrentPost = async (id) => {
    try {
      const res = await axios.get(`${apiUrl}api/posts/${id}`);
      const data = res.data;
      setEditingPost(data);
      setTitle(data.title || "");
      setContent(data.content || "");
    } catch (error) {
      console.error("Error fetching the post:", error);
    }
  };

  useEffect(() => {
    if (params['id']) {
      fetchCurrentPost(params['id']);
    }
  }, [params]);

  const handleSave = async () => {
    try {
      const payload = { title, content };
      if (editingPost) {
        await axios.put(`${apiUrl}api/posts/${editingPost._id}`, payload);
        alert("Post updated successfully!");
      } else {
        await axios.post(`${apiUrl}api/posts`, payload);
        alert("Post created successfully!");
      }
      setTitle("");
      setContent("");
      setEditingPost(null);
      router.push("/"); // Navigate back to the home page or posts list
    } catch (error) {
      console.error("Error saving the post:", error);
      alert("Failed to save the post.");
    }
  };

  return (
    <div className="w-full h-full px-4 py-6 md:px-16 md:py-10 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {editingPost ? "Edit Post" : "Create a New Post"}
        </h2>
        <input
          type="text"
          placeholder="Enter Title"
          className="w-full p-3 mb-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        {/* WYSIWYG editor */}
        <div className="mb-6">
          <Editor value={content} onChange={setContent} />
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-600 transition"
        >
          {editingPost ? "Update Post" : "Create Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
