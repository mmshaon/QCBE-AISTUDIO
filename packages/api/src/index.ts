import express from "express";
import { greet } from "@qcbe/shared";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.send(greet("World"));
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API running: http://localhost:${port}`);
});
