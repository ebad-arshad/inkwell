import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import { useState } from "react";
import axios from "axios";
import { Clock } from "lucide-react";

export default function LatestStoriesPage() {
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
                posts = posts.filter((p) =>
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
                {searchQuery ? (
                    <div className="mb-6">
                        <h2 className="font-display text-2xl font-bold text-foreground">Results for "{searchQuery}"</h2>
                    </div>
                ) : (
                    <div className="mb-8 flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-display text-3xl font-bold text-foreground md:text-3xl">Latest Stories</h1>
                            <p className="mt-1 text-muted-foreground font-body text-sm">Fresh perspectives from the community</p>
                        </div>
                    </div>
                )}

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
