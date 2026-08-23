import fs from "fs";
import path from "path";

// A 1x1 blue PNG buffer, or generate a valid 192x192 PNG header
// Minimal valid transparent/colored PNG
const pngHex =
  "89504e470d0a1a0a0000000d49484452000000c0000000c0080600000067ab2d67000000017352474200aece1ce90000000467414d410000b18f0bfc61050000001849444154785eedc101010000008220ffab6e4840700000000049454e44ae426082";
const pngBuffer = Buffer.from(pngHex, "hex");

const publicDir = path.join(process.cwd(), "public");

fs.writeFileSync(path.join(publicDir, "icon.png"), pngBuffer);
fs.writeFileSync(path.join(publicDir, "favicon.ico"), pngBuffer);
console.log("Created icon.png and favicon.ico");
