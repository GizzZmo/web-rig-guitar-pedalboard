#!/usr/bin/env node
import { createServer } from "node:http";
import { readFileSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const outDir = join(root, "artifacts", "screenshots");
mkdirSync(outDir, { recursive: true });

const mime = {
  ".html": "text/html; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".md": "text/markdown; charset=utf-8"
};

const server = createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  const file = url.pathname === "/" ? "/index.html" : url.pathname;
  try {
    const body = readFileSync(join(root, file.slice(1)));
    res.writeHead(200, { "content-type": mime[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;

const browser = await chromium.launch({ args: ["--no-sandbox"] });

const shots = [
  { name: "desktop.png", width: 1440, height: 900 },
  { name: "laptop.png", width: 1280, height: 800 },
  { name: "mobile.png", width: 390, height: 844 }
];

for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: shot.width, height: shot.height } });
  await page.goto(origin + "/", { waitUntil: "networkidle" });
  await page.waitForSelector("#startBtn");
  await page.screenshot({
    path: join(outDir, shot.name),
    fullPage: true
  });
  await page.close();
  console.log("wrote", shot.name);
}

await browser.close();
server.close();
