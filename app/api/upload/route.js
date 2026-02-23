export const runtime = "nodejs";

import fs from "fs";
import { put } from "@vercel/blob";

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Send to GPU (Modal)
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

  // Save stems to Blob storage
  const saveStem = async (name, data) => {
    const stemBuffer = Buffer.from(data, "base64");

    const blob = await put(
      `stems/${Date.now()}-${name}.wav`,
      stemBuffer,
      { access: "public" }
    );

    return blob.url;
  };

  const vocalUrl = await saveStem("vocals", stems.vocals);
  const drumUrl = await saveStem("drums", stems.drums);
  const bassUrl = await saveStem("bass", stems.bass);
  const otherUrl = await saveStem("other", stems.other);

  return new Response(
    JSON.stringify({
      vocals: vocalUrl,
      drums: drumUrl,
      bass: bassUrl,
      other: otherUrl,
    }),
    { status: 200 }
  );
}