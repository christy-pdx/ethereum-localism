const fs = require("fs");
const path = require("path");

const contentAssets = path.join(process.cwd(), "content", "assets");
const publicAssets = path.join(process.cwd(), "public", "knowledge-garden", "assets");

if (fs.existsSync(contentAssets)) {
  fs.mkdirSync(path.dirname(publicAssets), { recursive: true });
  if (fs.existsSync(publicAssets)) {
    fs.rmSync(publicAssets, { recursive: true });
  }
  fs.cpSync(contentAssets, publicAssets, { recursive: true });
  console.log("Copied content/assets to public/knowledge-garden/assets");
}
