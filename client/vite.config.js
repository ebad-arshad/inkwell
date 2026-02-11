import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";


export default defineConfig(({ mode }) => ({
    server: {
        host: "::",
        port: 8080,
        proxy: {
            '/api': 'http://localhost:5000'
        },
        allowedHosts: [
            'nonmalignantly-delayable-tasha.ngrok-free.dev'
        ]
    },
    plugins: [
        react(),
    ].filter(Boolean),
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
}));
