"use client";

import { useState } from "react";

export default function Home() {
  const [tracks, setTracks] = useState(null);

  const loadTracks = () => {
    const t = Date.now();

    setTracks({
      vocals: `/stems/vocals.wav?t=${t}`,
      drums: `/stems/drums.wav?t=${t}`,
      bass: `/stems/bass.wav?t=${t}`,
      other: `/stems/other.wav?t=${t}`,
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
        onChange={async (e) => {
          const file = e.target.files[0];
          const formData = new FormData();
          formData.append("file", file);

          await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          alert("Uploaded to GPU!");
        }}
        className="mb-4"
      />

      <button
        onClick={loadTracks}
        className="bg-white text-black px-4 py-2 mb-6"
      >
        Load Demo Stems
      </button>

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