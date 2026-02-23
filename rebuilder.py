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

    os.makedirs("/tmp/input", exist_ok=True)
    os.makedirs("/tmp/output", exist_ok=True)

    input_path = f"/tmp/input/{filename}"

    with open(input_path, "wb") as f:
        f.write(file_bytes)

    os.system(f"demucs -o /tmp/output {input_path}")

    return {"status": "Separated!"}