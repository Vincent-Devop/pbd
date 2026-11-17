import express from "express";
import path from "node:path";
import { configureApp } from "./server/_core/app";

const app = configureApp(express());

// Vercel serves files from /public through its CDN. These handlers provide
// the HTML shell for client-side routes and the separate operations interface.
const publicDir = path.resolve(process.cwd(), "public");

app.get("/ops", (_req, res, next) => {
  res.sendFile(path.join(publicDir, "ops.html"), (error) => {
    if (error) next(error);
  });
});

app.get("*", (_req, res, next) => {
  res.sendFile(path.join(publicDir, "index.html"), (error) => {
    if (error) next(error);
  });
});

export default app;
