import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import resumeRoutes from "./routes/resume.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    }
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  const frontendUrl =
    process.env.CLIENT_URL ||
    "https://ai-resume-builder-frontend-production.up.railway.app";
  res.redirect(301, frontendUrl);
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", resumeRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    error: "Something went wrong while processing your request."
  });
});

app.listen(port, () => {
  console.log(`Resume Builder API running on http://localhost:${port}`);
});
