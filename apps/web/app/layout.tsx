import Sidebar from "@/components/SideBar";
import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "FlowbitAI Dashboard",
  description: "Analytics dashboard for invoice data",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-50 text-slate-900 font-inter">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <Sidebar />
          {/* Main content */}
          <main className="flex-1 ">{children}</main>
        </div>
      </body>
    </html>
  );
}
