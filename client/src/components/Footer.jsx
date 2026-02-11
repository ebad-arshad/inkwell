import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                    {/* Left Side */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-display text-2xl font-bold">Inkwell</h3>
                        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                            A place to write, read, and connect with great thinkers and storytellers.
                            Share your voice with the world.
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col gap-4 md:text-right">
                        <h4 className="font-semibold text-foreground">Created by</h4>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li>Musab</li>
                            <li>Ebad</li>
                            <li>Kamil</li>
                            <li>Usman</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Center */}
                <div className="pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Inkwell. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
