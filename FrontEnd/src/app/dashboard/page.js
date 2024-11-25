"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/utils/config";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axiosInstance.get(`${apiUrl}api/user-posts`);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleNavigate = () => {
    router.push("/create_post");
  };

  const handleEdit = (post) => {
    router.push(`/update_post/${post._id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`${apiUrl}api/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className=" bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleNavigate}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition"
          >
            Create New Post
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center">No posts available. Start by creating one!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                key={post._id}
                className="p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition flex flex-col justify-between h-82"
              >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                  <div
                    className="text-gray-700 text-sm mb-4"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-500 hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button
                     onClick={() => router.push(`/post/${post._id}`)}
                      className="text-blue-500 hover:underline font-medium"
                    >
                      Preview Post
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 hover:underline font-medium"
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
