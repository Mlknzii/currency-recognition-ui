"use client";
import { useTheme } from "next-themes";
import React from "react";

const ToggleBtn = () => {
  const { theme, setTheme } = useTheme();
  return (
    <select
      className=" p-2 outline-none border-2 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      <option value="system">النظام</option>
      <option value="dark">الوضع الليلي</option>
      <option value="light">الوضع النهاري</option>
    </select>
  );
};

export default ToggleBtn;
