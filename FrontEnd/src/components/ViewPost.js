"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const ViewPost = ({ params }) => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (params?.id) {
      fetchPost(params.id);
    }
  }, [params]);

  const fetchPost = async (id) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}api/posts/${id}`);
      setPost(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching the post:", err);
      setError("Failed to load the post.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-blue-500 mb-4">{post?.title}</h1>
        <h2 className="text-sm text-gray-500 mb-6">Posted by: {post?.user_id?.name}</h2>
        <div
          className="text-gray-700 text-lg"
          dangerouslySetInnerHTML={{ __html: post?.content }}
        />
        <div className="mt-6">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPost;
