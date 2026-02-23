"use client";

import { useState } from "react";

export default function Home() {
  const [tracks, setTracks] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const stems = await res.json();

    setTracks({
      vocals: stems.vocals,
      drums: stems.drums,
      bass: stems.bass,
      other: stems.other,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        Demo Rebuilder Workstation
      </h1>

      <input
        type="file"
        accept="audio/*"
        onChange={handleUpload}
        className="mb-4"
      />

      {tracks && (
        <div className="space-y-4">
          <Track name="Vocals" src={tracks.vocals} />
          <Track name="Drums" src={tracks.drums} />
          <Track name="Bass" src={tracks.bass} />
          <Track name="Other" src={tracks.other} />
        </div>
      )}
    </div>
  );
}

function Track({ name, src }) {
  return (
    <div className="border p-4">
      <h2>{name}</h2>
      <audio controls src={src}></audio>
    </div>
  );
}