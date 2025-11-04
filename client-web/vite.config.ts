import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@users": path.resolve(__dirname, "./src/users"),
      "@auth": path.resolve(__dirname, "./src/auth"),
      "@workouts": path.resolve(__dirname, "./src/routines/workouts"),
      "@exercises": path.resolve(__dirname, "./src/routines/exercises"),
      "@foods": path.resolve(__dirname, "./src/nutrition/foods"),
      "@meals": path.resolve(__dirname, "./src/nutrition/meals"),
    },
  },
});
