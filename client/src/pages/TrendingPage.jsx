import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import axios from "axios";

export default function TrendingPage() {
    const { data: trending, isLoading } = useQuery({
        queryKey: ["trending-posts-page"],
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

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0 1.1.2 2.2.5 3c.3.9.8 1.8 1.5 2.5a7 7 0 0 1 1.5-6Z" /></svg>
                    </div>
                    <h1 className="font-display text-3xl font-bold text-foreground">Trending Stories</h1>
                </div>

                {isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
                        ))}
                    </div>
                ) : trending && trending.length > 0 ? (
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
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-lg text-muted-foreground font-body">No trending stories yet</p>
                    </div>
                )}
            </main>
        </div>
    );
}
