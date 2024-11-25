"use client";
import ViewPost from "@/components/ViewPost";
import { useParams } from "next/navigation";

export default function PostPage() {
    const params = useParams();
  return <ViewPost params={params} />;
}
