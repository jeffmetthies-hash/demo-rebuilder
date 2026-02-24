export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response("No file", { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const modalResponse = await fetch(
      "https://jeffmetthies-hash--demo-rebuilder-separate-audio.modal.run",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_bytes: base64,
          filename: file.name,
        }),
      }
    );

    const text = await modalResponse.text();
    console.log("Modal returned:", text);

    if (!modalResponse.ok) {
      return new Response(text, { status: 500 });
    }

    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Upload failed:", err);
    return new Response("Server error", { status: 500 });
  }
}