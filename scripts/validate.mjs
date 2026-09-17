#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";

const requiredFiles = [
  "index.html",
  "README.md",
  "LICENSE",
  "vercel.json",
  "assets/README.md",
  "assets/screenshots/desktop.svg"
];

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length) {
  console.error("Missing required assets:\n" + missing.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}

const html = readFileSync("index.html", "utf8");
const checks = [
  ["doctype", /<!DOCTYPE html>/i],
  ["title", /Web Rig/],
  ["start button", /id="startBtn"/],
  ["input device", /id="inputDevice"/],
  ["output device", /id="outputDevice"/],
  ["tuner", /id="tuneNote"/],
  ["presets", /id="preset"/],
  ["audio constraints", /echoCancellation:\s*false/],
  ["low latency hint", /latencyHint:\s*0/]
];

const failed = checks.filter(([, re]) => !re.test(html)).map(([name]) => name);
if (failed.length) {
  console.error("index.html failed checks:\n" + failed.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}

if (html.length < 8000) {
  console.error("index.html looks too small to be the pedalboard");
  process.exit(1);
}

console.log(`OK  ${requiredFiles.length} assets  index.html ${html.length} bytes`);
