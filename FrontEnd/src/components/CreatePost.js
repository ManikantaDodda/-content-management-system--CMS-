"use client";
import { useEffect, useState } from "react";
import Editor from "@/components/Editor";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/config";
const CreatePostComponent = ({ params }) => {
  const router = useRouter();
  const [editingPost, setEditingPost] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (params?._id) {
      setEditingPost(params);
      setTitle(params.title || "");
      setContent(params.content || "");
    }
  }, [params]);

  const handleSave = async () => {
    try {
      const payload = { title, content };
      if (editingPost) {
        await axiosInstance.put(`api/posts/${editingPost._id}`, payload);
      } else {
        await axiosInstance.post(`api/posts`, payload);
      }
      setTitle("");
      setContent("");
      setEditingPost(null);
      alert("Post saved successfully!");
      router.push("/")
    } catch (error) {
      console.error("Error saving the post:", error);
      alert("Failed to save the post.");
    }
  };

  useEffect(()=>{
      document.getElementById("previewshow").innerHTML = content;
  },[content]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-8">
      <div className="w-full md:w-1/2 bg-white p-4 border border-gray-300 rounded-md shadow">
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
        <Editor value={content} onChange={setContent} />
        <button
          onClick={handleSave}
          className="mt-6 w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-600 transition"
        >
          {editingPost ? "Update Post" : "Create Post"}
        </button>
      </div>
      <div className="w-full md:w-1/2 bg-gray-50 p-4 border border-gray-300 rounded-md shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Preview</h3>
        <div
          className="prose max-w-none" id="previewshow"
        />
      </div>
    </div>
  
  );
};

export default CreatePostComponent;
