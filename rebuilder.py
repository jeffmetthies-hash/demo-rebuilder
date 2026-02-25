import modal
import subprocess
import tempfile
import base64
import os
import time

app = modal.App("demo-rebuilder-v99")

image = (
    modal.Image.debian_slim()
    .pip_install("demucs", "fastapi", "uvicorn", "vercel-blob")
    .apt_install("ffmpeg")
)

@app.function(
    image=image,
    secrets=[modal.Secret.from_name("vercel-blob-token")]
)
@modal.fastapi_endpoint(method="POST")
async def separate_audio(request):

    from fastapi.responses import JSONResponse
    from vercel_blob import put

    data = await request.json()

    audio = base64.b64decode(data["file_bytes"])
    filename = data["filename"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as f:
        f.write(audio)
        input_path = f.name

    output_dir = "/tmp/output"

    run = subprocess.run(
        ["demucs", "-n", "htdemucs_ft", "-o", output_dir, input_path],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    if run.returncode != 0:
        return JSONResponse({"error": run.stderr.decode()}, status_code=500)

    model_folder = os.path.join(output_dir, "htdemucs_ft")
    song_folder = os.listdir(model_folder)[0]
    stem_path = os.path.join(model_folder, song_folder)

    for i in range(30):
        if os.path.exists(f"{stem_path}/vocals.wav"):
            break
        time.sleep(1)

    def upload(name):
        with open(f"{stem_path}/{name}.wav", "rb") as f:
            res = put(
                f"stems/{filename}_{name}.wav",
                f.read(),
                access="public",
                token=os.environ["BLOB_READ_WRITE_TOKEN"]
            )
            return res["url"]

    return JSONResponse({
        "vocals": upload("vocals"),
        "drums": upload("drums"),
        "bass": upload("bass"),
        "other": upload("other")
    })