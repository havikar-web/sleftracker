const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Helper to write CRC32 checksum for PNG chunks
function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ (-1)) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const chunkType = Buffer.from(type, "ascii");
  const typeAndData = Buffer.concat([chunkType, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([len, chunkType, data, crc]);
}

function generatePng(size) {
  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk (Width, Height, Bit depth = 8, ColorType = 6 (RGBA), Compression = 0, Filter = 0, Interlace = 0)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 6;  // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = createChunk("IHDR", ihdrData);

  // Raw image data with scanline filter bytes (0 = None)
  // Each scanline: 1 filter byte + size * 4 (RGBA) bytes
  const scanlineLength = 1 + size * 4;
  const rawData = Buffer.alloc(size * scanlineLength);

  const center = size / 2;
  const radius = size * 0.44;

  for (let y = 0; y < size; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < size; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Dark background with rounded shield/circle
      if (dist <= radius) {
        // Deep Indigo/Blue Gradient
        const gradient = y / size;
        const r = Math.round(30 + gradient * 25);  // 30 -> 55
        const g = Math.round(70 + gradient * 60);  // 70 -> 130
        const b = Math.round(220 + gradient * 35); // 220 -> 255

        // Draw a bright lightning / atom core in the middle
        const isCore = (Math.abs(dx) < size * 0.12 && Math.abs(dy) < size * 0.25) || (Math.abs(dy) < size * 0.12 && Math.abs(dx) < size * 0.25);
        if (isCore) {
          rawData[pixelOffset] = 255;     // R
          rawData[pixelOffset + 1] = 255; // G
          rawData[pixelOffset + 2] = 255; // B
          rawData[pixelOffset + 3] = 255; // A
        } else {
          rawData[pixelOffset] = r;
          rawData[pixelOffset + 1] = g;
          rawData[pixelOffset + 2] = b;
          rawData[pixelOffset + 3] = 255;
        }
      } else {
        // Transparent outside
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
      }
    }
  }

  // Compress IDAT
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk("IDAT", compressed);

  // IEND chunk
  const iendChunk = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.join(__dirname, "..", "public");

const icon512 = generatePng(512);
fs.writeFileSync(path.join(publicDir, "icon.png"), icon512);
fs.writeFileSync(path.join(publicDir, "icon-512.png"), icon512);

const icon192 = generatePng(192);
fs.writeFileSync(path.join(publicDir, "icon-192.png"), icon192);

console.log("✅ Successfully generated valid 512x512 and 192x192 PNG icons!");
