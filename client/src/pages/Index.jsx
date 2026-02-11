import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowRight, PenLine, Heart, BookOpen } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) {
      navigate("/feed");
    }
  }, [user, loading, navigate]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxs("div", { className: "relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-2xl text-center animate-fade-in", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display text-5xl font-bold leading-tight text-foreground md:text-7xl", children: "Inkwell" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-lg text-muted-foreground font-body md:text-xl", children: "A place to write, read, and connect with great thinkers and storytellers." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center", children: [
        /* @__PURE__ */ jsx(Button, { asChild: true, size: "lg", className: "gap-2 rounded-full px-8 font-body", children: /* @__PURE__ */ jsxs(Link, { to: "/signup", children: [
          "Start writing ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) }),
        /* @__PURE__ */ jsx(Button, { asChild: true, variant: "outline", size: "lg", className: "gap-2 rounded-full px-8 font-body", children: /* @__PURE__ */ jsx(Link, { to: "/login", children: "Sign in" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 mt-20 grid w-full max-w-4xl gap-6 sm:grid-cols-3", children: [
      { icon: PenLine, title: "Write", desc: "Share your ideas and stories with the world" },
      { icon: Heart, title: "Connect", desc: "Like, comment, and engage with other writers" },
      { icon: BookOpen, title: "Discover", desc: "Explore fresh perspectives and new ideas" }
    ].map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/80 p-6 text-center backdrop-blur-sm animate-slide-up", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6 text-primary" }) }),
      /* @__PURE__ */ jsx("h3", { className: "font-display text-lg font-bold text-foreground", children: title }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground font-body", children: desc })
    ] }, title)) })
  ] }) });
}
export {
  Index as default
};
