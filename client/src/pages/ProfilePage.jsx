import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Camera, Pencil, X, Check, KeyRound } from "lucide-react";
import axios from "axios";

export default function ProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isOwner = user?._id === userId;

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [showAvatarInput, setShowAvatarInput] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/users/${userId}`);
      return data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["user-posts", userId],
    queryFn: async () => {
      const { data } = await axios.get("/api/posts");
      return data.filter((p) => p.user?._id === userId || p.user === userId);
    },
  });

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { data } = await axios.put("/api/users/profile", {
        fullName: editName.trim(),
        bio: editBio.trim(),
        avatarUrl: editAvatarUrl.trim(),
      });
      return data;
    },
    onSuccess: () => {
      setEditing(false);
      setShowAvatarInput(false);
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      toast.success("Profile updated!");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const changePassword = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      const { data } = await axios.put("/api/users/profile", {
        password: newPassword,
      });
      return data;
    },
    onSuccess: () => {
      setChangingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated!");
    },
    onError: (error) => toast.error(error.message || "Failed to update password"),
  });

  const startEditing = () => {
    setEditName(profile?.fullName || "");
    setEditBio(profile?.bio || "");
    setEditAvatarUrl(profile?.avatarUrl || "");
    setEditing(true);
  };

  const name = profile?.fullName || "Anonymous";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-10 flex flex-col items-center gap-4 animate-fade-in sm:flex-row sm:items-start sm:gap-8">
          <div className="relative">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
              <AvatarImage src={editing ? editAvatarUrl : profile?.avatarUrl || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-display font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {isOwner && editing && (
              <div className="absolute -bottom-2 -right-2">
                <Button
                  size="icon"
                  className="rounded-full shadow-lg"
                  onClick={() => setShowAvatarInput(!showAvatarInput)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            {editing ? (
              <div className="space-y-3 w-full max-w-md">
                {showAvatarInput && (
                  <div className="animate-fade-in">
                    <Label className="font-body text-sm">Avatar URL</Label>
                    <Input
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                      className="font-body"
                      placeholder="https://..."
                    />
                  </div>
                )}
                <div>
                  <Label className="font-body text-sm">Name</Label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="font-body"
                  />
                </div>
                <div>
                  <Label className="font-body text-sm">Bio</Label>
                  <Textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="font-body"
                  />
                </div>
                <div className="flex gap-2 justify-center sm:justify-start">
                  <Button
                    size="sm"
                    className="gap-1.5 rounded-full font-body"
                    onClick={() => updateProfile.mutate()}
                  >
                    <Check className="h-4 w-4" /> Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 rounded-full font-body"
                    onClick={() => setEditing(false)}
                  >
                    <X className="h-4 w-4" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-display text-3xl font-bold text-foreground">{name}</h1>
                {profile?.bio && (
                  <p className="mt-2 text-muted-foreground font-body">{profile.bio}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground/70 font-body">
                  {posts?.length || 0} stories
                </p>
                {isOwner && (
                  <div className="flex gap-2 mt-3 justify-center sm:justify-start">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 rounded-full font-body"
                      onClick={startEditing}
                    >
                      <Pencil className="h-4 w-4" /> Edit profile
                    </Button>
                    <Dialog open={changingPassword} onOpenChange={setChangingPassword}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 rounded-full font-body"
                        >
                          <KeyRound className="h-4 w-4" /> Change password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                              id="new-password"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter new password"
                              className="mt-1.5"
                            />
                          </div>
                          <div>
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm new password"
                              className="mt-1.5"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setChangingPassword(false);
                                setNewPassword("");
                                setConfirmPassword("");
                              }}
                            >
                              Cancel
                            </Button>
                            <Button onClick={() => changePassword.mutate()}>
                              Update Password
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
          {isOwner ? "Your Stories" : `Stories by ${name}`}
        </h2>

        {posts && posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <BlogCard
                key={post._id}
                id={post._id}
                title={post.title}
                content={post.content}
                imageUrl={post.imageUrl}
                authorName={post.user?.fullName || "Anonymous"}
                authorAvatar={post.user?.avatarUrl}
                authorId={post.user?._id}
                createdAt={post.createdAt}
                likesCount={post.likesCount || 0}
                commentsCount={post.commentsCount || 0}
                isLiked={post.isLiked}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground font-body">
            No stories yet
          </div>
        )}
      </main>
    </div>
  );
}
