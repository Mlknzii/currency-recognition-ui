import { Geist_Mono, Beiruti } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/app/context/AuthContext";

import Header from "../components/Header";
import Footer from "../components/Footer";

const beiruti = Beiruti({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "arabic"],
  variable: "--font-beiruti",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CurrencyApp",
  description: "ابدأ التعرف على العملات واكتشف التزوير الان",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${beiruti.className} ${geistMono.variable} antialiased `}
      >
        <AuthProvider>
          <ThemeProvider attribute="class" enableSystem defaultTheme="system">
            <Header />
            {children}
            <Toaster
              duration={5000}
              position="top-center"
              reverseOrder={false}
            />
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
