"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

import { useTheme } from "next-themes";

import { IoLogOutOutline } from "react-icons/io5";
import { IoLogInOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { CiMenuFries } from "react-icons/ci";
import Image from "next/image";

import { FaSun } from "react-icons/fa6";
import { IoMoon } from "react-icons/io5";
import ToggleBtn from "./ToggleBtn";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-wide text-zinc-900 dark:text-white"
          >
            <Image src="/logo.svg" alt="Logo" width={50} height={40} />
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {!isAuthenticated ? (
                <Link href="/login" className="btn btn-primary">
                  تسجيل الدخول
                  <IoLogInOutline className=" mr-2 inline-block" size={20} />
                </Link>
              ) : (
                <>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    الملف الشخصي
                  </Link>
                  <Link
                    href="/history"
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    السجل
                  </Link>
                  <Link
                    href="/predict"
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    ابدأ التحقق
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/login");
                    }}
                    className="btn btn-danger"
                  >
                    تسجيل الخروج
                    <IoLogOutOutline className=" inline-block mr-2" size={20} />
                  </button>
                </>
              )}
            </div>

            <button
              aria-label="Toggle Theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2 p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
            >
              {theme === "dark" ? (
                <FaSun className="h-6 w-6 text-yellow-400" />
              ) : (
                <IoMoon className="h-6 w-6 text-zinc-900" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden rounded-lg p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <IoClose className="h-6 w-6 text-zinc-900 dark:text-white" />
              ) : (
                <CiMenuFries className="h-6 w-6 text-zinc-900 dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex flex-col gap-3 px-4 py-4">
            {!isAuthenticated ? (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="btn btn-primary w-fit"
              >
                تسجيل الدخول
                <IoLogInOutline className=" mr-2 inline-block" size={20} />
              </Link>
            ) : (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  الملف الشخصي
                </Link>
                <Link
                  href="/history"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  السجل
                </Link>
                <Link
                  href="/predict"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  ابدأ التحقق
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    router.push("/login");
                  }}
                  className="btn btn-danger w-fit"
                >
                  تسجيل الخروج
                  <IoLogOutOutline className=" inline-block mr-2" size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
