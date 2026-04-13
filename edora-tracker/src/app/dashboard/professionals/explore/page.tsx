"use client";

import { useState, useEffect, useCallback } from "react";
import { ExploreContentCard } from "./_components/explore-content-card";
import { ExplorePageHeader } from "./_components/explore-page-header";
import { getExplorePosts } from "@/app/actions/explore-actions";
import { Compass } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ExplorePost } from "./_components/explore-content-card";
import { ExploreInputSection } from "./_components/explore-input-section";
import { ExploreSectionSkeleton } from "./_components/explore-section-skeleton";

const ExplorePage = () => {
  const [posts, setPosts] = useState<ExplorePost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getExplorePosts();
      if (result.success && result.posts) {
        const formattedPosts: ExplorePost[] = result.posts.map((post: any) => ({
          id: post.id,
          author: {
            name: post.author?.name || "Anonymous",
            avatar:
              post.author?.image ||
              `https://i.pravatar.cc/150?u=${post.authorId}`,
            role: post.author?.role || "Professional",
            location: "",
          },
          content: post.content,
          timeAgo: formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
          }),
          likes: post.likes || 0,
          comments: post.comments || 0,
          shares: post.shares || 0,
          tags: post.tags || [],
        }));
        setPosts(formattedPosts);
      } else {
        setPosts([]);
      }
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <div className="mx-auto w-full max-w-3xl pt-6 space-y-6">
      <ExplorePageHeader onPostCreated={loadPosts} />

      {loading ? (
        <ExploreSectionSkeleton />
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Compass className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No posts yet</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Be the first to share something with the professional community!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <ExploreContentCard key={post.id} post={post} />
          ))}
        </div>
      )}
      <ExploreInputSection />
    </div>
  );
};

export default ExplorePage;
