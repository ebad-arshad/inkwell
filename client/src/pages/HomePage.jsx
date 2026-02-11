import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Clock } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-20 sm:py-32">
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/src/assets/hero-bg.jpg')" }}
                    />

                    {/* Glassmorphism Overlay */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

                    {/* Content */}
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-foreground sm:text-6xl animate-fade-in">
                            Welcome to <span className="text-primary">Inkwell</span>
                        </h1>
                        <p className="mb-10 text-lg text-muted-foreground font-body max-w-2xl mx-auto animate-fade-in delay-100">
                            A space for writers, thinkers, and storytellers. Discover compelling ideas and share your own voice with the world.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 animate-fade-in delay-200">
                            <Link to="/latest">
                                <Button size="lg" className="gap-2 rounded-full h-12 px-8 text-base">
                                    Start Reading <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/write">
                                <Button size="lg" variant="outline" className="gap-2 rounded-full h-12 px-8 text-base">
                                    Start Writing
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features / Navigation Section */}
                <section className="py-20 container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Link to="/trending" className="group">
                            <div className="border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors h-full flex flex-col items-center text-center bg-card hover:shadow-lg">
                                <div className="p-4 bg-primary/10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="h-8 w-8 text-primary" />
                                </div>
                                <h2 className="text-2xl font-display font-bold mb-3">Trending Stories</h2>
                                <p className="text-muted-foreground font-body">
                                    See what's capturing the community's attention. The most liked and discussed stories of the moment.
                                </p>
                            </div>
                        </Link>

                        <Link to="/latest" className="group">
                            <div className="border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors h-full flex flex-col items-center text-center bg-card hover:shadow-lg">
                                <div className="p-4 bg-primary/10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                                    <Clock className="h-8 w-8 text-primary" />
                                </div>
                                <h2 className="text-2xl font-display font-bold mb-3">Latest Stories</h2>
                                <p className="text-muted-foreground font-body">
                                    Fresh off the press. Discover the newest perspectives and ideas from our growing community.
                                </p>
                            </div>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
