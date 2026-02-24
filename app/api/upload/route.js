export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response("No file", { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const modalResponse = await fetch(
      "https://jeffmetthies-hash--demo-rebuilder-separate-audio.modal.run",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: buffer,
      }
    );

    if (!modalResponse.ok) {
      const text = await modalResponse.text();
      console.error("Modal error:", text);
      return new Response(text, { status: 500 });
    }

    const stems = await modalResponse.json();

    return Response.json(stems);
  } catch (err) {
    console.error("Upload failed:", err);
    return new Response("Server error", { status: 500 });
  }
}