"use client";

import { useRef, useState, useEffect } from "react";
import { IoCameraOutline, IoCameraReverseOutline } from "react-icons/io5";

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [facingMode, setFacingMode] = useState("environment"); // rear default

  /* ───────── Stop camera safely ───────── */
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  /* ───────── Open camera with facingMode ───────── */
  const openCamera = async () => {
    setError("");
    setOpen(true);

    try {
      stopCamera();

      let stream;
      try {
        // Prefer exact facingMode (mobile browsers)
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: facingMode } },
        });
      } catch {
        // Fallback for browsers that don't support exact
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      setError("Camera not available");
      setOpen(false);
    }
  };

  /* ───────── Close camera ───────── */
  const closeCamera = () => {
    stopCamera();
    setOpen(false);
  };

  /* ───────── Capture image ───────── */
  const capture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(blob);
      },
      "image/jpeg",
      0.95
    );

    closeCamera();
  };

  /* ───────── Switch camera ───────── */
  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  /* ───────── Restart camera when facingMode changes ───────── */
  useEffect(() => {
    if (!open) return;
    openCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  /* ───────── Cleanup on unmount ───────── */
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <>
      {/* Open Camera Button */}
      <button
        type="button"
        onClick={openCamera}
        className="w-full rounded bg-indigo-600 py-2 text-white grid place-items-center"
      >
        <IoCameraOutline size={48} />
      </button>

      {error && <p className="mt-2 text-center text-red-500">{error}</p>}

      {/* ───────── Camera Popup ───────── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-xl bg-gray-900 p-4 text-white shadow-xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg bg-black"
            />

            <p className="mt-2 text-center text-sm text-gray-400">
              ضع العملة داخل الإطار مع إضاءة جيدة
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={capture}
                className="flex-1 rounded bg-green-600 py-2"
              >
                التقاط
              </button>

              <button
                type="button"
                onClick={switchCamera}
                className="flex items-center justify-center rounded bg-blue-600 px-4"
              >
                <IoCameraReverseOutline size={24} />
              </button>

              <button
                type="button"
                onClick={closeCamera}
                className="flex-1 rounded bg-gray-600 py-2"
              >
                الغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

