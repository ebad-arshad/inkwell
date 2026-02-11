import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import axios from "axios";
function WritePage() {
  const { id } = useParams();
  const isEditing = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [saving, setSaving] = useState(false);
  useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await axios.get(`/api/posts/${id}`);
      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setImageUrl(data.imageUrl || "");
      }
      return data;
    },
    enabled: isEditing
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }
    if (!content.trim()) {
      toast.error("Please add some content");
      return;
    }
    if (!user) return;
    setSaving(true);
    try {
      if (isEditing) {
        await axios.put(`/api/posts/${id}`, {
          title: title.trim(),
          content: content.trim(),
          imageUrl
        });
        toast.success("Post updated!");
      } else {
        await axios.post("/api/posts", {
          title: title.trim(),
          content: content.trim(),
          imageUrl
        });
        toast.success("Post published!");
      }
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/feed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "container mx-auto max-w-3xl px-4 py-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-8 font-display text-3xl font-bold text-foreground", children: isEditing ? "Edit Story" : "Write a Story" }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "title", className: "font-body", children: "Title" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "title",
              placeholder: "Give your story a title...",
              value: title,
              onChange: (e) => setTitle(e.target.value),
              className: "mt-1.5 font-display text-xl font-semibold",
              maxLength: 200
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { className: "font-body", children: "Cover Image" }),
          /* @__PURE__ */ jsx("div", { className: "mt-1.5", children: imageUrl ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("img", { src: imageUrl, alt: "Cover", className: "h-56 w-full rounded-lg object-cover" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setImageUrl(""),
                className: "absolute right-2 top-2 rounded-full bg-foreground/70 p-1.5 text-background transition-colors hover:bg-foreground",
                children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }) : /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: showUrlInput ? /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Paste image URL here...",
                value: imageUrl,
                onChange: (e) => setImageUrl(e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", onClick: () => setShowUrlInput(false), children: "Cancel" })
          ] }) : /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowUrlInput(true),
              className: "flex h-40 w-full items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary",
              children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
                /* @__PURE__ */ jsx(ImagePlus, { className: "h-8 w-8" }),
                /* @__PURE__ */ jsx("span", { className: "font-body text-sm", children: "Add a cover image URL" })
              ] })
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "content", className: "font-body", children: "Content" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "content",
              placeholder: "Tell your story...",
              value: content,
              onChange: (e) => setContent(e.target.value),
              className: "mt-1.5 min-h-[300px] font-body leading-relaxed"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "rounded-full font-body", disabled: saving, children: saving ? "Saving..." : isEditing ? "Update Story" : "Publish Story" }),
          /* @__PURE__ */ jsx(Button, { type: "button", variant: "ghost", className: "rounded-full font-body", onClick: () => navigate(-1), children: "Cancel" })
        ] })
      ] })
    ] })
  ] });
}
export {
  WritePage as default
};
