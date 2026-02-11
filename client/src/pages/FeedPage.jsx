import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const PAGE_SIZE = 12;

function TrendingPosts() {
  const { data: trending, isLoading } = useQuery({
    queryKey: ["trending-posts"],
    queryFn: async () => {
      const { data } = await axios.get('/api/posts/trending');
      return data.map((p) => ({
        ...p,
        likesCount: p.likesCount || 0,
        isLiked: p.isLiked || false,
        commentsCount: p.commentsCount || 0,
        author: p.user || { fullName: "Unknown", avatarUrl: "" },
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (!trending || trending.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trending.map((post) => (
        <BlogCard
          key={post._id}
          id={post._id}
          title={post.title}
          content={post.content}
          imageUrl={post.imageUrl}
          authorName={post.author?.fullName || "Anonymous"}
          authorAvatar={post.author?.avatarUrl}
          authorId={post.author?._id}
          createdAt={post.createdAt}
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
          isLiked={post.isLiked}
        />
      ))}
    </div>
  );
}

export default function FeedPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  // eslint-disable-next-line no-unused-vars
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["posts", searchQuery, page],
    queryFn: async () => {
      // Fetch posts from backend
      // Note: Backend currently returns all posts. Search/Pagination typically handled on backend.
      // For now, fetching all and filtering on client if needed, or just displaying key ones.
      const { data } = await axios.get('/api/posts');

      // Simple client-side search filtering if backend doesn't support it yet
      let posts = data;
      if (searchQuery) {
        posts = posts.filter(p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      return posts.map((p) => ({
        ...p,
        likesCount: p.likesCount || 0,
        isLiked: p.isLiked || false,
        commentsCount: p.commentsCount || 0,
        author: p.user || { fullName: "Unknown", avatarUrl: "" },
      }));
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {searchQuery && (
          <div className="mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Results for "{searchQuery}"</h2>
          </div>
        )}

        {/* Trending Section */}
        {!searchQuery && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-primary/10 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-5 w-5"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0 1.1.2 2.2.5 3c.3.9.8 1.8 1.5 2.5a7 7 0 0 1 1.5-6Z" /></svg>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Trending on Inkwell</h2>
            </div>
            <TrendingPosts />
          </section>
        )}

        {
          !searchQuery && (
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Latest Stories</h1>
              <p className="mt-2 text-muted-foreground font-body">Discover fresh perspectives and ideas</p>
            </div>
          )
        }

        {
          isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : data && data.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((post) => (
                  <BlogCard
                    key={post._id}
                    id={post._id}
                    title={post.title}
                    content={post.content}
                    imageUrl={post.imageUrl}
                    authorName={post.author?.fullName || "Anonymous"}
                    authorAvatar={post.author?.avatarUrl}
                    authorId={post.author?._id || post.user?._id}
                    createdAt={post.createdAt}
                    likesCount={post.likesCount}
                    commentsCount={post.commentsCount}
                    isLiked={post.isLiked}
                  />
                ))}
              </div>
              {/* Pagination buttons disabled for now as backend returns all */}
              <div className="mt-8 flex justify-center gap-3">
                {/* 
              {page > 0 && (
                <Button variant="outline" className="rounded-full font-body" onClick={() => setPage(page - 1)}>Previous</Button>
              )}
              {data.length === PAGE_SIZE && (
                <Button variant="outline" className="rounded-full font-body" onClick={() => setPage(page + 1)}>Next</Button>
              )} 
              */}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-lg text-muted-foreground font-body">No stories found</p>
              <p className="text-sm text-muted-foreground/70 font-body">Be the first to share your thoughts</p>
            </div>
          )
        }
      </main >
    </div >
  );
}
