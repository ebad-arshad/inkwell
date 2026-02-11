import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatDate } from "@/lib/dateUtils";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Pencil,
  Trash2,
  Send,
  BookmarkCheck
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import axios from "axios";
function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const updateCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      await axios.put(`/api/posts/${id}/comments/${commentId}`, { content: editCommentContent });
    },
    onSuccess: () => {
      setEditingCommentId(null);
      setEditCommentContent("");
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      toast.success("Comment updated");
    },
    onError: () => toast.error("Failed to update comment")
  });
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      await axios.delete(`/api/posts/${id}/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      toast.success("Comment deleted");
    },
    onError: () => toast.error("Failed to delete comment")
  });
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/posts/${id}`);
      return data;
    }
  });
  const comments = post?.comments || [];
  const likesCount = post?.likesCount || 0;
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  if (post && isLiked !== post.isLiked && !isLoading) {
    setIsLiked(post.isLiked);
  }
  if (post && isBookmarked !== post.isBookmarked && !isLoading) {
    setIsBookmarked(post.isBookmarked);
  }
  const isOwner = user?._id === post?.user?._id;
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in");
      await axios.post(`/api/posts/${id}/like`);
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
    onError: () => toast.error("Failed to like post")
  });
  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in");
      const { data } = await axios.post(`/api/posts/${id}/bookmark`);
      return data;
    },
    onSuccess: (data) => {
      setIsBookmarked(data.isBookmarked);
      if (data.isBookmarked) {
        toast.success("Post saved to bookmarks");
      } else {
        toast.success("Post removed from bookmarks");
      }
    },
    onError: () => toast.error("Failed to update bookmark")
  });
  useQuery({
    queryKey: ["isBookmarked", id],
    queryFn: async () => {
      if (!user) return false;
      try {
        const { data } = await axios.get("/api/users/bookmarks");
        const isBm = data.some((p) => p._id === id);
        setIsBookmarked(isBm);
        return isBm;
      } catch {
        return false;
      }
    },
    enabled: !!user && !!id
  });
  const addCommentMutation = useMutation({
    mutationFn: async () => {
      if (!user || !comment.trim()) throw new Error("Invalid");
      await axios.post(`/api/posts/${id}/comment`, { content: comment.trim() });
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
    onError: () => toast.error("Failed to add comment")
  });
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/posts/${id}`);
    },
    onSuccess: () => {
      toast.success("Post deleted");
      navigate("/feed");
    },
    onError: () => toast.error("Failed to delete post")
  });
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsx("div", {
        className: "container mx-auto max-w-3xl px-4 py-16", children: /* @__PURE__ */ jsxs("div", {
          className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-8 w-3/4 animate-pulse rounded bg-muted" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 w-1/2 animate-pulse rounded bg-muted" }),
        /* @__PURE__ */ jsx("div", { className: "h-64 animate-pulse rounded bg-muted" })
          ]
        })
      })
      ]
    });
  }
  if (!post) {
    return /* @__PURE__ */ jsxs("div", {
      className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center py-20", children: /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground font-body", children: "Post not found" }) })
      ]
    });
  }
  const authorName = post.user?.fullName || "Anonymous";
  const authorInitials = authorName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("article", {
      className: "container mx-auto max-w-3xl px-4 py-8 animate-fade-in", children: [
        post.imageUrl && /* @__PURE__ */ jsx("div", { className: "mb-8 overflow-hidden rounded-xl", children: /* @__PURE__ */ jsx("img", { src: post.imageUrl, alt: post.title, className: "h-80 w-full object-cover" }) }),
      /* @__PURE__ */ jsxs("header", {
          className: "mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "mb-4 font-display text-3xl font-bold leading-tight text-foreground md:text-4xl", children: post.title }),
        /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(Link, {
              to: `/profile/${post.user?._id}`, children: /* @__PURE__ */ jsxs(Avatar, {
                className: "h-10 w-10", children: [
            /* @__PURE__ */ jsx(AvatarImage, { src: post.user?.avatarUrl || "" }),
            /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary text-primary-foreground text-sm font-body font-semibold", children: authorInitials })
                ]
              })
            }),
          /* @__PURE__ */ jsxs("div", {
              children: [
            /* @__PURE__ */ jsx(Link, { to: `/profile/${post.user?._id}`, className: "text-sm font-semibold font-body text-foreground hover:text-primary transition-colors", children: authorName }),
            /* @__PURE__ */ jsxs("p", {
                className: "text-xs text-muted-foreground font-body", children: [
                  formatDate(post.createdAt, "MMMM d, yyyy"),
                  post.updatedAt !== post.createdAt && " \xB7 Updated"
                ]
              })
              ]
            })
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsx("div", { className: "prose prose-lg max-w-none font-body text-foreground leading-relaxed whitespace-pre-wrap", children: post.content }),
      /* @__PURE__ */ jsxs("div", {
          className: "mt-8 flex items-center justify-between border-y border-border py-4", children: [
        /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => user ? likeMutation.mutate() : toast.error("Sign in to like"),
                className: `flex items-center gap-1.5 text-sm font-body transition-colors ${isLiked ? "text-accent" : "text-muted-foreground hover:text-accent"}`,
                children: [
                /* @__PURE__ */ jsx(Heart, { className: `h-5 w-5 ${isLiked ? "fill-current" : ""}` }),
                  likesCount
                ]
              }
            ),
          /* @__PURE__ */ jsxs("span", {
              className: "flex items-center gap-1.5 text-sm text-muted-foreground font-body", children: [
            /* @__PURE__ */ jsx(MessageCircle, { className: "h-5 w-5" }),
                " ",
                comments.length
              ]
            })
            ]
          }),
        /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => user ? bookmarkMutation.mutate() : toast.error("Sign in to bookmark"),
                className: `transition-colors ${isBookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"}`,
                children: isBookmarked ? /* @__PURE__ */ jsx(BookmarkCheck, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Bookmark, { className: "h-5 w-5" })
              }
            ),
          /* @__PURE__ */ jsx("button", { onClick: handleShare, className: "text-muted-foreground transition-colors hover:text-primary", children: /* @__PURE__ */ jsx(Share2, { className: "h-5 w-5" }) }),
              isOwner && /* @__PURE__ */ jsxs(Fragment, {
                children: [
            /* @__PURE__ */ jsx("button", { onClick: () => navigate(`/write/${id}`), className: "text-muted-foreground transition-colors hover:text-primary", children: /* @__PURE__ */ jsx(Pencil, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxs(AlertDialog, {
                  children: [
              /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: "text-muted-foreground transition-colors hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-5 w-5" }) }) }),
              /* @__PURE__ */ jsxs(AlertDialogContent, {
                    children: [
                /* @__PURE__ */ jsxs(AlertDialogHeader, {
                      children: [
                  /* @__PURE__ */ jsx(AlertDialogTitle, { children: "Delete this post?" }),
                  /* @__PURE__ */ jsx(AlertDialogDescription, { children: "This action cannot be undone." })
                      ]
                    }),
                /* @__PURE__ */ jsxs(AlertDialogFooter, {
                      children: [
                  /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
                  /* @__PURE__ */ jsx(AlertDialogAction, { onClick: () => deletePostMutation.mutate(), children: "Delete" })
                      ]
                    })
                    ]
                  })
                  ]
                })
                ]
              })
            ]
          })
          ]
        }),
      /* @__PURE__ */ jsxs("section", {
          className: "mt-8", children: [
        /* @__PURE__ */ jsxs("h3", {
            className: "mb-6 font-display text-xl font-bold text-foreground", children: [
              "Comments (",
              comments.length,
              ")"
            ]
          }),
            user && /* @__PURE__ */ jsxs("div", {
              className: "mb-6 flex gap-3", children: [
          /* @__PURE__ */ jsx(
                Textarea,
                {
                  placeholder: "Write a comment...",
                  value: comment,
                  onChange: (e) => setComment(e.target.value),
                  className: "min-h-[80px] font-body"
                }
              ),
          /* @__PURE__ */ jsx(
                Button,
                {
                  size: "icon",
                  className: "shrink-0 rounded-full",
                  onClick: () => addCommentMutation.mutate(),
                  disabled: !comment.trim() || addCommentMutation.isPending,
                  children: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
                }
              )
              ]
            }),
        /* @__PURE__ */ jsx("div", {
              className: "space-y-4", children: comments.map((c) => {
                const cName = c.user?.fullName || "Anonymous";
                const cInitials = cName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                return /* @__PURE__ */ jsxs("div", {
                  className: "rounded-lg border border-border bg-card p-4 animate-fade-in group", children: [
            /* @__PURE__ */ jsxs("div", {
                    className: "mb-2 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", {
                      className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Link, {
                        to: `/profile/${c.user?._id}`, children: /* @__PURE__ */ jsxs(Avatar, {
                          className: "h-7 w-7", children: [
                  /* @__PURE__ */ jsx(AvatarImage, { src: c.user?.avatarUrl || "" }),
                  /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-secondary text-secondary-foreground text-xs font-body", children: cInitials })
                          ]
                        })
                      }),
                /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold font-body text-foreground", children: cName }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground font-body", children: formatDate(c.createdAt, "MMM d, yyyy") })
                      ]
                    }),
                      user && /* @__PURE__ */ jsxs("div", {
                        className: "flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100", children: [
                          user._id === c.user?._id && /* @__PURE__ */ jsx(
                            "button",
                            {
                              onClick: () => {
                                setEditingCommentId(c._id);
                                setEditCommentContent(c.content);
                              },
                              className: "text-muted-foreground hover:text-primary",
                              children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" })
                            }
                          ),
                          (user._id === c.user?._id || isOwner) && /* @__PURE__ */ jsx(
                            "button",
                            {
                              onClick: () => deleteCommentMutation.mutate(c._id),
                              className: "text-muted-foreground hover:text-destructive",
                              children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
                            }
                          )
                        ]
                      })
                    ]
                  }),
                    editingCommentId === c._id ? /* @__PURE__ */ jsxs("div", {
                      className: "space-y-2", children: [
              /* @__PURE__ */ jsx(
                        Textarea,
                        {
                          value: editCommentContent,
                          onChange: (e) => setEditCommentContent(e.target.value),
                          className: "min-h-[60px] font-body text-sm"
                        }
                      ),
              /* @__PURE__ */ jsxs("div", {
                        className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(
                          Button,
                          {
                            size: "sm",
                            className: "h-7 text-xs",
                            onClick: () => updateCommentMutation.mutate(c._id),
                            disabled: !editCommentContent.trim(),
                            children: "Save"
                          }
                        ),
                /* @__PURE__ */ jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "ghost",
                            className: "h-7 text-xs",
                            onClick: () => setEditingCommentId(null),
                            children: "Cancel"
                          }
                        )
                        ]
                      })
                      ]
                    }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground font-body leading-relaxed", children: c.content })
                  ]
                }, c._id);
              })
            })
          ]
        })
      ]
    })
    ]
  });
}
export {
  PostPage as default
};
