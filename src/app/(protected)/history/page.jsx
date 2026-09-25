"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPredictions, clearPredictions } from "@/lib/api";
import { MdDeleteOutline } from "react-icons/md";

import toast from "react-hot-toast";

const page = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [clearing, setClearing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getPredictions();
        setHistory(data);
      } catch (err) {
        setError("فشل في تحميل السجل!");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleClearHistory = async () => {
    setClearing(true);
    try {
      await clearPredictions();
      toast.success("تم حذف السجل بنجاح");
      setIsOpen(false);
      setHistory([]); // instantly update UI
    } catch (err) {
      setError("فشل في حذف السجل!");
    } finally {
      setClearing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen grid place-items-center">تحميل السجل...</div>
    );
  if (error)
    return (
      <div className="min-h-screen grid place-items-center text-red-500">
        {error}
      </div>
    );

  return (
    <main>
      <div className=" container mx-auto md:w-4xl bg-white dark:bg-gray-900 md:rounded-2xl max-w-full p-6 my-2.5 shadow-xl overflow-x-auto">
        <h1 className=" heading1 my-4">السجل</h1>
        {history.length > 0 && (
          <button
            disabled={clearing}
            onClick={() => setIsOpen(true)}
            className=" btn btn-danger mb-6"
          >
            {clearing ? (
              "يتم الحذف..."
            ) : (
              <>
                حذف السجل
                <MdDeleteOutline className=" inline-block mr-2" size={20} />
              </>
            )}
          </button>
        )}
        <div className="overflow-x-auto rounded bg-white dark:bg-gray-900 border border-gray-900 dark:border-gray-200 ">
          <table className=" overflow-x-auto min-w-full divide-y divide-gray-900 dark:divide-gray-200">
            <thead className="ltr:text-left rtl:text-right">
              <tr className="*:font-medium *:text-gray-900 dark:*:text-white">
                <th className="px-3 py-2 whitespace-nowrap">#</th>
                <th className="px-3 py-2 whitespace-nowrap">التاريخ</th>
                <th className="px-3 py-2 whitespace-nowrap">أسم العملة</th>
                <th className="px-3 py-2 whitespace-nowrap">الرمز</th>
                <th className="px-3 py-2 whitespace-nowrap">القيمة</th>
                <th className="px-3 py-2 whitespace-nowrap">نسبة الثقة</th>
                <th className="px-3 py-2 whitespace-nowrap">التزوير</th>
                <th className="px-3 py-2 whitespace-nowrap">التفاصيل</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-900 dark:divide-gray-200">
              {history.length === 0 ? (
                <tr className="*:text-gray-900 *:first:font-medium dark:*:text-white">
                  <td className="px-3 py-2 whitespace-nowrap" rowSpan={5}>
                    لايوجد عناصر لعرضها!
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr
                    key={item.id}
                    className="*:text-gray-900 *:first:font-medium dark:*:text-white hover:opacity-75"
                  >
                    <td className="px-3 py-2 whitespace-nowrap">{item.id}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {item.name_ar}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {item.currency_code}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {item.denomination_value}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {item.confidence}%
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {item.is_counterfeit ? "مزوّرة" : "غير مزوّرة"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <button
                        onClick={() => router.push(`/history/${item.id}`)}
                        className="btn btn-primary inline-block"
                        href="#"
                      >
                        عرض
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
                disabled={clearing}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:opacity-90 transition"
              >
                إلغاء
              </button>

              <button
                onClick={handleClearHistory}
                disabled={clearing}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                {clearing ? "جاري الحذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default page;
