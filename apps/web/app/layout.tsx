import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "Flowbit Dashboard",
  description: "Analytics dashboard for invoice data",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-72 bg-white border-r p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-6">Buchhaltung</h2>
              <nav className="flex flex-col space-y-2">
                <Link href="/" className="hover:bg-slate-100 px-3 py-2 rounded">Dashboard</Link>
                <Link href="/invoice" className="hover:bg-slate-100 px-3 py-2 rounded">Invoice</Link>
                <Link href="/other-files" className="hover:bg-slate-100 px-3 py-2 rounded">Other files</Link>
                <Link href="/departments" className="hover:bg-slate-100 px-3 py-2 rounded">Departments</Link>
                <Link href="/users" className="hover:bg-slate-100 px-3 py-2 rounded">Users</Link>
                <Link href="/settings" className="hover:bg-slate-100 px-3 py-2 rounded">Settings</Link>
              </nav>
            </div>
            <div className="text-sm text-gray-500">Flowbit AI</div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
