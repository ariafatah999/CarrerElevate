import app from "./server.js";
import path from "path";
import express from "express";

const PORT = 3000;

async function init() {
  if (process.env.NODE_ENV !== "production") {
    // Prevent static bundler analysis from pulling in Vite in production/serverless builds
    const viteModule = "vite";
    const { createServer: createViteServer } = await import(viteModule);
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CareerElevate AI Server] Live on http://localhost:${PORT}`);
  });
}

init();
