import pino from "pino";

export const logger = pino({
  name: "project-titan",
  level: process.env.LOG_LEVEL ?? "info"
});
