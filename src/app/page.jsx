"use client";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { useAuth } from "@/app/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const displayName = user?.fullname || user?.email || null;

  return (
    <main className="">
      <div className="container mx-auto p-4 max-w-5xl grid place-items-center">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-indigo-500">
          {displayName ? (
            <>
              مرحبا {displayName} <br /> كيف يمكنني مساعدتك ؟
            </>
          ) : (
            <>
              مرحبا بك في متعرف العملات... <br /> كيف يمكنني مساعدتك ؟
            </>
          )}
        </h1>
        <Link href="/predict" className="btn btn-primary inline-block mt-6">
          ابدأ الآن
          <FaArrowLeft className=" inline-block mr-2" />
        </Link>
      </div>
    </main>
  );
}
