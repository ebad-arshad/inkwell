import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import axios from "axios";
import { Link } from "react-router-dom";
function BookmarksPage() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const { data } = await axios.get("/api/users/bookmarks");
      return data;
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "container mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-8 font-display text-3xl font-bold text-foreground", children: "Saved Stories" }),
      isLoading ? /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-80 animate-pulse rounded-lg bg-muted" }, i)) }) : posts && posts.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: posts.filter((post) => post).map((post) => /* @__PURE__ */ jsx(
        BlogCard,
        {
          id: post._id,
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl,
          authorName: post.user?.fullName || "Anonymous",
          authorAvatar: post.user?.avatarUrl,
          authorId: post.user?._id,
          createdAt: post.createdAt,
          likesCount: post.likesCount || 0,
          commentsCount: post.commentsCount || 0,
          isLiked: post.isLiked
        },
        post._id
      )) }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20", children: [
        /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground font-body", children: "No saved stories yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/70 font-body", children: "Bookmark stories to read later" }),
        /* @__PURE__ */ jsx(Link, { to: "/feed", className: "mt-4 text-primary hover:underline", children: "Browse Feed" })
      ] })
    ] })
  ] });
}
export {
  BookmarksPage as default
};
