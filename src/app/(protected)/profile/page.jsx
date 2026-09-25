"use client";
import { useState, useEffect } from "react";
import { getCurrentUser, deleteCurrentUser } from "@/lib/api";

import Image from "next/image";
import toast from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import { useRouter } from "next/navigation";

const profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        setError("فشل تحميل بيانات المستخدم");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCurrentUser();
      toast.success("تم حذف الحساب بنجاح");
      setIsOpen(false);
      router.push("/login");
    } catch (error) {
      toast.error("فشل حذف الحساب");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-700 dark:text-gray-300">
            جاري تحميل الملف الشخصي...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">
          بيانات المستخدم غير متوفرة.
        </p>
      </div>
    );
  }

  return (
    <main>
      <div className=" container md:w-2xl max-w-full mx-auto bg-white dark:bg-gray-900 md:rounded-2xl p-6 my-2.5 shadow-xl">
        {/* Avatar */}
        <div className=" flex justify-center">
          <Image
            src="/avatar.png"
            alt="profile picture"
            width={110}
            height={110}
            className="rounded-full shadow-md border dark:border-gray-700"
          />
        </div>

        {/* Title */}
        <h1 className=" heading1 my-4">الملف الشخصي</h1>

        {/* Info */}
        <div className="mt-8 space-y-5">
          <div className="flex justify-between items-center border-b border-gray- dark:border-gray-700 pb-3">
            <span className="font-bold text-gray-800 dark:text-gray-200">
              الاسم الكامل
            </span>
            <span className="text-gray-700 dark:text-gray-400">
              {user.fullname}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-gray- dark:border-gray-700 pb-3">
            <span className="font-bold text-gray-800 dark:text-gray-200">
              البريد الإلكتروني
            </span>
            <span className="text-gray-700 dark:text-gray-400">
              {user.email}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-gray- dark:border-gray-700 pb-3">
            <span className="font-bold text-gray-800 dark:text-gray-200">
              تاريخ الإنشاء
            </span>
            <span className="text-gray-700 dark:text-gray-400">
              {new Date(user.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-start">
          <button onClick={() => setIsOpen(true)} className="btn btn-danger">
            حذف حسابي
            <MdDeleteOutline className=" mr-2 inline-block" size={20} />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">
              تأكيد الحذف
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              هل أنت متأكد أنك تريد اكمال عملية الحذف, لا يمكن التراجع عن هذا
              الإجراء.
            </p>

            <div className="flex justify-between gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:opacity-90 transition"
              >
                إلغاء
              </button>

              <button
                onClick={() => {
                  handleDelete();
                  router.push("/login");
                }}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                {deleting ? "جاري الحذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default profile;
