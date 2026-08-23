import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        // Other server settings like port or host
        port: 5173,
        host: '127.0.0.1', 
        
        // Add this line to allow your custom domain
        allowedHosts: ['timebuddy.test']
      }
});
