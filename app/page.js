"use client";

import { useState } from "react";

export default function Home() {
  const [stems, setStems] = useState(null);

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    alert("Uploading & Processing...");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setStems(data);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Demo Rebuilder Workstation</h1>

      <input type="file" onChange={handleUpload} />

      {stems && (
        <div>
          <Track name="Vocals" src={stems.vocals} />
          <Track name="Drums" src={stems.drums} />
          <Track name="Bass" src={stems.bass} />
          <Track name="Other" src={stems.other} />
        </div>
      )}
    </div>
  );
}

function Track({ name, src }) {
  return (
    <div>
      <h3>{name}</h3>
      <audio controls src={src} />
    </div>
  );
}