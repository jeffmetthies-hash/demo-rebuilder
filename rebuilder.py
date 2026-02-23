import modal

app = modal.App("demo-rebuilder")

image = (
    modal.Image.debian_slim()
    .pip_install(
        "demucs",
        "ffmpeg-python",
        "fastapi[standard]"
    )
)

@app.function(image=image, gpu="T4")
@modal.fastapi_endpoint(method="POST")
def separate_audio(file_bytes: bytes, filename: str):
    import os
    import base64

    os.makedirs("/tmp/input", exist_ok=True)
    os.makedirs("/tmp/output", exist_ok=True)

    input_path = f"/tmp/input/{filename}"

    with open(input_path, "wb") as f:
        f.write(bytes(file_bytes))

    os.system(f"demucs -n htdemucs_ft -o /tmp/output {input_path}")

    stem_folder = f"/tmp/output/htdemucs/{filename.split('.')[0]}"

    stems = {}

    for stem in ["vocals", "drums", "bass", "other"]:
        path = f"{stem_folder}/{stem}.wav"
        with open(path, "rb") as s:
            stems[stem] = base64.b64encode(s.read()).decode("utf-8")

    return stems