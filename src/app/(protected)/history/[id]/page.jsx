"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

import { getSinglePrediction } from "@/lib/api";
import toast from "react-hot-toast";

import Image from "next/image";
import { toPng } from "html-to-image";
import { FaFloppyDisk, FaShareNodes } from "react-icons/fa6";

const SinglePredictionPage = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const detailsRef = useRef();

  const params = useParams(); // Get the dynamic id from URL

  const { id } = params;
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSinglePrediction = async () => {
      try {
        const data = await getSinglePrediction(id);
        setPrediction(data);
      } catch (err) {
        setError("فشل في تحميل تفاصيل التعرف!");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSinglePrediction();
    }
  }, [id]);

  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const backgroundColor = isDarkMode ? "#0f172a" : "#ffffff";
  // Share & Save Handlers
  const handleSave = async () => {
    if (!detailsRef.current) return;

    try {
      const dataUrl = await toPng(detailsRef.current, {
        cacheBust: true,
        backgroundColor: backgroundColor,
        pixelRatio: 2, // higher quality
      });

      const link = document.createElement("a");
      link.download = "currency-details.png";
      link.href = dataUrl;
      link.click();
      toast.success("تمت الحفظ بنجاح.");
    } catch (error) {
      toast.error("فشل في الحفظ!");
    }
  };

  const handleShare = async () => {
    if (!detailsRef.current) return;

    try {
      const dataUrl = await toPng(detailsRef.current, {
        cacheBust: true,
        backgroundColor: backgroundColor,
        pixelRatio: 2,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "currency-details.png", {
        type: blob.type,
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "تفاصيل التعرف على العملة",
          files: [file],
        });
        toast.success("تمت المشاركة بنجاح.");
      } else {
        toast.error("المشاركة بالصور غير مدعومة في هذا المتصفح.");
      }
    } catch (error) {
      toast.error("فشل في المشاركة!");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen grid place-items-center">يتم التحميل...</div>
    );

  if (error)
    return (
      <div className="min-h-screen grid place-items-center text-red-500">
        {error}
      </div>
    );

  if (!prediction)
    return (
      <div className="min-h-screen grid place-items-center">غير متوفر!</div>
    );
  return (
    <main>
      <div className=" container md:w-2xl max-w-full  mx-auto bg-white dark:bg-gray-900 md:rounded-2xl p-6 my-2.5 shadow-xl">
        <div className=" w-full grid place-items-center p-5" ref={detailsRef}>
          <h1 className=" heading1 my-4">تفاصيل التعرف على العملة</h1>
          {prediction.image_path && (
            <Image
              src={`${API_URL}${prediction.image_path}`}
              alt={prediction.name_en}
              className=" max-w-full object-cover rounded-lg my-8 shadow-lg"
              width={400}
              height={400}
              unoptimized
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          )}

          <div className="flex items-center justify-between w-full max-w-md  dark:border-gray-600 border-gray-400 pb-4 mb-4">
            <h2 className=" text-xl font-black text-gray-800 dark:text-gray-200">
              إسم العملة:{" "}
            </h2>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-400">
              {prediction.name_ar} <br />
              <span> {prediction.name_en}</span>
            </p>
          </div>

          <div className="flex items-center justify-between w-full max-w-md  dark:border-gray-600 border-gray-400 pb-4 mb-4">
            <h2 className=" text-xl font-black text-gray-800 dark:text-gray-200">
              القيمة:{" "}
            </h2>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-400">
              {prediction.denomination_value}
            </p>
          </div>

          <div className="flex items-center justify-between w-full max-w-md  dark:border-gray-600 border-gray-400 pb-4 mb-4">
            <h2 className=" text-xl font-black text-gray-800 dark:text-gray-200">
              التزوير:{" "}
            </h2>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-400">
              {prediction.is_counterfeit ? "مزوّرة" : "غير مزوّرة"}
            </p>
          </div>

          <div className="flex items-center justify-between w-full max-w-md  dark:border-gray-600 border-gray-400 pb-4 mb-4">
            <h2 className=" text-xl font-black text-gray-800 dark:text-gray-200">
              نسبة الثقة:{" "}
            </h2>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-400">
              {prediction.confidence}%
            </p>
          </div>
          <div className="flex items-center justify-between w-full max-w-md  dark:border-gray-600 border-gray-400 pb-4 mb-4">
            <h2 className=" text-xl font-black text-gray-800 dark:text-gray-200">
              التاريخ :{" "}
            </h2>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-400">
              {new Date(prediction.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-6 items-center" data-ignore={true}>
          <button onClick={handleShare} className="btn btn-primary">
            مشاركة
            <FaShareNodes className=" inline-block mr-2" />
          </button>
          <button onClick={handleSave} className="btn btn-success">
            حفظ الصورة
            <FaFloppyDisk className=" inline-block mr-2" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default SinglePredictionPage;
