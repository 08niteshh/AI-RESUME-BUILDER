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
  res.type("html").send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AI Resume Builder API</title>
        <style>
          body {
            align-items: center;
            background: #f8fafc;
            color: #0f172a;
            display: flex;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            justify-content: center;
            margin: 0;
            min-height: 100vh;
          }
          main {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            box-shadow: 0 18px 60px -30px rgba(15, 23, 42, 0.35);
            max-width: 520px;
            padding: 32px;
          }
          h1 { margin: 0 0 8px; }
          p { color: #475569; line-height: 1.6; }
          a {
            background: #0f172a;
            border-radius: 8px;
            color: white;
            display: inline-block;
            font-weight: 700;
            margin-top: 8px;
            padding: 10px 14px;
            text-decoration: none;
          }
          code {
            background: #f1f5f9;
            border-radius: 6px;
            padding: 2px 6px;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>AI Resume Builder API</h1>
          <p>This is the Express backend. Open the React frontend at <code>http://localhost:5173</code>.</p>
          <a href="http://localhost:5173">Open Resume Builder</a>
        </main>
      </body>
    </html>
  `);
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
