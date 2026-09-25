"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import axios from "@/lib/axios";
import CameraCapture from "@/components/CameraCapture";

import { useRouter } from "next/navigation";
import { MdUpload, MdUploadFile } from "react-icons/md";

export default function PredictPage() {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  // const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* ───────── Image preview ───────── */
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  /* ───────── Submit ───────── */
  const handlePredict = async (e) => {
    e.preventDefault();
    if (!file) return;

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/predict/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const predictionId = res.data.id;
      toast.success("تم التحقق بنجاح!");
      router.push(`/history/${predictionId}`);
    } catch (err) {
      setError("فشل التحقق");
    } finally {
      setSubmitting(false);
    }
  };

  /* ───────── Reset ───────── */
  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setError("");
  };
  return (
    <main>
      <div className=" container mx-auto w-full max-w-md bg-white dark:bg-gray-900 md:rounded-2xl p-6 my-2.5 shadow-xl space-y-5">
        <h1 className="heading1 my-4">ابدأ التحقق</h1>

        {/* ───────── Upload input ───────── */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="fileUpload"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <label
          htmlFor="fileUpload"
          className="grid place-items-center cursor-pointer rounded-lg border-2 border-dashed border-gray-600 p-4 text-center hover:border-indigo-500"
        >
          <MdUploadFile className="block m-2 text-3xl" />
          أرفع صورة العملة للتحقق
        </label>

        {/* ───────── Camera component ───────── */}
        <CameraCapture
          onCapture={(blob) => {
            const capturedFile = new File([blob], "camera.jpg", {
              type: "image/jpeg",
            });
            setFile(capturedFile);
          }}
        />

        {/* ───────── Preview ───────── */}
        {preview && (
          <div className="rounded-xl overflow-hidden border border-gray-700">
            <Image
              src={preview}
              alt="Currency preview"
              width={400}
              height={300}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* ───────── Actions ───────── */}
        <div className="flex gap-2">
          <button
            onClick={handlePredict}
            disabled={!file || submitting}
            className="btn btn-primary w-1/2 disabled:opacity-50"
          >
            {submitting ? "يتم التحقق..." : "التحقق"}
          </button>

          <button
            onClick={resetAll}
            disabled={!file}
            className="btn btn-secondary w-1/2 disabled:opacity-50"
          >
            إعادة تعيين
          </button>
        </div>

        {/* ───────── Errors ───────── */}
        {error && <p className="text-center text-red-400">{error}</p>}
      </div>
    </main>
  );
}
