"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CreatePostComponent from "@/components/CreatePost";
import { useParams } from "next/navigation";

const UpdatePost = () => {
  const params = useParams();
  
  const [editingPost, setEditingPost] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchCurrentPost = async (id) => {
    try {
      const res = await axios.get(`${apiUrl}api/posts/${id}`);
      const data = res.data;
      setEditingPost(data);
    } catch (error) {
      console.error("Error fetching the post:", error);
    }
  };

  useEffect(() => {
    if (params['id']) {
      fetchCurrentPost(params['id']);
    }
  }, [params]);

  return (
    <CreatePostComponent params={editingPost}/>
  )
};

export default UpdatePost;
