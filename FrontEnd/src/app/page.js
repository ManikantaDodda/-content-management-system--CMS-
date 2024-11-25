"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const postsPerPage = 6; // Number of posts per page

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page) => {
    try {
      const { data } = await axios.get(`${apiUrl}api/posts?page=${page}&limit=${postsPerPage}`);
      setPosts(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    // <div className="flex flex-col gap-6 bg-gray-100 p-6">
    //   <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto flex flex-col">
    <div className="flex flex-col gap-6 bg-gray-100 p-6">
      <div className=" bg-white p-8 rounded-lg shadow-lg">

        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center">No posts available. Start by creating one!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="p-6 border border-gray-200 rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition flex flex-col justify-between h-92"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                  <h2 className="text-sm text-gray-500 mb-2">Post By: {post.user_id?.name}</h2>
                  <div
                    className="text-gray-700 text-sm overflow-y-auto flex-grow"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  <button
                    onClick={() => router.push(`/post/${post._id}`)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                  >
                    View Post
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
