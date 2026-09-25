"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, getCurrentUser } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";

const login = () => {
  const router = useRouter();
  
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // const res = await loginUser(email, password);
      await loginUser(email, password);
      const user = await getCurrentUser();
      login(user);
      
      toast.success("تم تسجيل الدخول بنجاح");
      
      router.replace("/");
    } catch (err) {
      setError(" حدث خطأ اثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="container max-w-[400px] p-5 bg-white dark:bg-gray-600 shadow-2xl">
        <h1 className=" text-gray-600 dark:text-white text-4xl text-center font-bold mb-[50px]">
          تسجيل الدخول
        </h1>
        <form onSubmit={handleSubmit} className=" p-2.5">
          <div className=" mb-5">
            <label
              className=" block text-sm text-gray-500 dark:text-gray-200 mb-2"
              htmlFor="email"
            >
              البريد الألكتروني
            </label>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" w-full"
              id="email"
              placeholder="example@mail.com"
            />
          </div>

          <div className=" mb-5">
            <label
              className=" block text-sm text-gray-500 dark:text-gray-200 mb-2"
              htmlFor="password"
            >
              كلمة المرور
            </label>
            <input
              required
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" w-full"
              id="password"
              placeholder="********"
            />
          </div>
          {error && <p className="text-red-500 mb-3">{error}</p>}
          <Link href="/register" className=" block link my-2">
            ليس لديك حساب؟ انشاء حساب
          </Link>
          <button
            disabled={loading}
            className=" btn btn-primary w-full"
            type="submit"
          >
            {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default login;
