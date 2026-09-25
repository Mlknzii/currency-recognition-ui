// app/not-found.js
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
export default function NotFound() {
  return (
    <main className=" text-center">
      <div className="container">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white">
          404
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-200 my-4">
          يبدو أن الصفحة التي تبحث عنها ليست موجودة, <br /> الرجاء التحقق من
          الرابط أو العودة للصفحة الرئيسية.
        </p>
        <Link className="btn btn-primary inline-block " href="/">
          العودة للصفحة الرئيسية
          <FaArrowLeftLong className="inline-block mr-2" />
        </Link>
      </div>
    </main>
  );
}
