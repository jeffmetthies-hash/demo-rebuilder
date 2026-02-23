export const runtime = "nodejs";

export async function POST(req) {
  const data = await req.formData();
  const file = data.get("file");

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  console.log("Uploaded file:", file.name);

  return new Response("File received", { status: 200 });
}