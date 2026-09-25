"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser, getCurrentUser } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";

const register = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتان");
      return;
    }
    try {
      setLoading(true);

      await registerUser(fullName, email, password);

      await loginUser(email, password);

      const user = await getCurrentUser();
      login(user);
      toast.success("تم إنشاء الحساب بنجاح");
      router.replace("/");
    } catch (err) {
      setError("فشل في إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="container max-w-[400px] my-20 p-5 bg-white dark:bg-gray-600 shadow-2xl">
        <h1 className=" text-gray-600 dark:text-white text-4xl text-center font-bold mb-[50px]">
          إنشاء حساب
        </h1>

        <form onSubmit={handleSubmit} className=" p-2.5">
          {/* Fullname Field */}
          <div className=" mb-5">
            <label
              className=" block text-sm text-gray-500 dark:text-gray-200 mb-2"
              htmlFor="name"
            >
              الأسم كاملا
            </label>
            <input
              required
              value={fullName}
              onChange={(e) => setfullName(e.target.value)}
              name="fullname"
              className=" w-full"
              type="text"
              id="name"
              placeholder="إسمك"
            />
          </div>

          {/* Email Field */}
          <div className=" mb-5">
            <label
              className=" block text-sm text-gray-500 dark:text-gray-200 mb-2"
              htmlFor="email"
            >
              البريد الألكتروني
            </label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              className=" w-full"
              type="email"
              id="email"
              placeholder="example@mail.com"
            />
          </div>

          {/* Password Field */}
          <div className=" mb-5">
            <label
              className=" block text-sm text-gray-500 mb-2"
              htmlFor="password"
            >
              كلمة المرور
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className=" border p-2 w-full"
              type="password"
              name="password"
              id="password"
              placeholder="********"
            />
          </div>

          {/* Password confirm Field */}
          <div className=" mb-5">
            <label
              className=" block text-sm text-gray-500 dark:text-gray-200 mb-2"
              htmlFor="confirm"
            >
              تأكيد كلمة المرور
            </label>
            <input
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              name="confirmPassword"
              className=" w-full"
              type="password"
              id="confirm"
              placeholder="********"
            />
          </div>
          {error && <p className="text-red-500 mb-3">{error}</p>}

          {/* Link to Register page */}
          <Link href="/login" className=" block link my-2">
            لديك حساب؟ تسجيل الدخول
          </Link>

          {/* Submit button */}
          <button
            disabled={loading}
            className=" btn btn-primary w-full"
            type="submit"
          >
            {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default register;
