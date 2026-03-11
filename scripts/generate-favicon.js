#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const toIco = require("to-ico");

const logoPath = path.join(process.cwd(), "src", "app", "icon.png");
const outputPath = path.join(process.cwd(), "src", "app", "favicon.ico");

const image = fs.readFileSync(logoPath);
toIco([image], { sizes: [16, 24, 32, 48], resize: true })
  .then((result) => {
    fs.writeFileSync(outputPath, result);
    console.log("Generated favicon.ico from icon.png");
  })
  .catch((err) => {
    console.error("Failed to generate favicon:", err);
    process.exit(1);
  });
