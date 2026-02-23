"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">
        Demo Rebuilder
      </h1>

      <input
        type="file"
        accept="audio/*"
        onChange={handleUpload}
        className="mb-4"
      />

      {file && (
        <p className="mt-4">
          Uploaded: {file.name}
        </p>
      )}
    </div>
  );
}