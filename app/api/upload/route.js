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

const res = await fetch("https://jeffmetthies-hash--demo-rebuilder-separate-audio.modal.run", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    file_bytes: Array.from(buffer),
    filename: file.name,
  }),
});

const stems = await res.json();

const saveStem = (name, data) => {
  const stemBuffer = Buffer.from(data, "base64");
  const path = `./public/stems/${name}.wav`;

  fs.writeFileSync(path, stemBuffer);
  console.log("Saved:", path);
};

saveStem("vocals", stems.vocals);
saveStem("drums", stems.drums);
saveStem("bass", stems.bass);
saveStem("other", stems.other);

  console.log("Saved file to:", filePath);

  return new Response("File saved successfully", { status: 200 });
}