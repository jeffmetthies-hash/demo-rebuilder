export const runtime = "nodejs";

import fs from "fs";
import path from "path";

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const filePath = path.join(uploadDir, file.name);

  fs.writeFileSync(filePath, buffer);

await fetch("https://jeffmetthies-hash--demo-rebuilder-separate-audio.modal.run", {
  method: "POST",
  headers: {
    "Content-Type": "application/octet-stream",
  },
  body: buffer,
});

  console.log("Saved file to:", filePath);

  return new Response("File saved successfully", { status: 200 });
}