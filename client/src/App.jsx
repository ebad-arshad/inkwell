import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
// import FeedPage from "./pages/FeedPage"; 
import LatestStoriesPage from "./pages/LatestStoriesPage";
import TrendingPage from "./pages/TrendingPage";
import WritePage from "./pages/WritePage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import BookmarksPage from "./pages/BookmarksPage";
import NotFound from "./pages/NotFound";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/feed" element={<LatestStoriesPage />} /> {/* Keeping /feed as alias or just replacing */}
                <Route path="/latest" element={<LatestStoriesPage />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/post/:id" element={<PostPage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/write" element={<ProtectedRoute><WritePage /></ProtectedRoute>} />
                <Route path="/write/:id" element={<ProtectedRoute><WritePage /></ProtectedRoute>} />
                <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
