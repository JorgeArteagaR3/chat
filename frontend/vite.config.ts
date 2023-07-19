import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/socket.io": {
                target: "https://chat-2km2.onrender.com/",
                ws: true,
            },
        },
    },
});
