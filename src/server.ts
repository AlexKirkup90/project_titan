import express from "express";
import { env } from "./config/env.js";
import { ingestionRouter } from "./routes/ingestion.js";
import { logger } from "./utils/logger.js";

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", ingestionRouter);

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "Project Titan ingestion service listening");
});
