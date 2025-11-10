import Link from "next/link";
import Image from "next/image";
import logo from "@/public/icon-asset.png";
import arrow from "@/public/assets/chevrons-up-down.svg";
import Home from "@/public/assets/Home.svg";
import Invoice from "@/public/assets/Invoice.svg";
import OtherFiles from "@/public/assets/OtherFiles.svg";
import Departments from "@/public/assets/Departments.svg";
import Users from "@/public/assets/Users.svg";
import Settings from "@/public/assets/Settings.svg";
import FlowbitAIlogo from "@/public/assets/FlowbitAilogo.svg";
import ChatWithAI from "@/public/assets/ChatWithAi.png";

export default function Sidebar() {
  return (
    <aside className="w-[220px] h-[860px] bg-white  shadow flex flex-col justify-between  border-b border-gray-200 p-4 ">
      <div>
        <header className="flex justify-center items-center  border-b border-gray-200">
          <div className="flex w-[204px] h-[64px] items-center gap-3">
            <Image
              src={logo}
              alt="Logo"
              width={32}
              height={32}
              className="object-contain rounded-md"
            />

            <div className="flex flex-col leading-tight">
              <h3 className="text-[15px] font-semibold">Buchhaltung</h3>
              <p className="text-sm text-gray-500">12 members</p>
            </div>
          </div>
          <div>
            <Image
              src={arrow}
              alt="Logo"
              width={16}
              height={16}
              className="object-contain rounded-md"
            />
          </div>
        </header>
        {/* <div className="border-b border-gray-200" /> */}
        <div className="flex flex-col mt-6 px-1">
          <p className="text-xs font-semibold text-gray-700 tracking-wide mb-3">
            GENERAL
          </p>

          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-2 py-2  text-sm 
                 text-gray-700 hover:bg-[#E3E6F0] hover:text-gray-900
                 transition-colors"
            >
              {/*  icon placeholder */}
              <Image src={Home} alt="homeicon" width={20} height={20} />
              Dashboard
            </Link>

            <Link
              href="/invoice"
              className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm
                 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Image src={Invoice} alt="homeicon" width={20} height={20} />
              Invoice
            </Link>

            <Link
              href="/other-files"
              className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm
                 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Image src={OtherFiles} alt="homeicon" width={20} height={20} />
              Other files
            </Link>

            <Link
              href="/departments"
              className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm
                 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {" "}
              <Image src={Departments} alt="homeicon" width={20} height={20} />
              Departments
            </Link>

            <Link
              href="/users"
              className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm
                 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Image src={Users} alt="homeicon" width={20} height={20} />
              Users
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm
                 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Image src={Settings} alt="homeicon" width={20} height={20} />
              Settings
            </Link>
            <Link
              href="/chat-with-data"
              className="flex items-center gap-3 px-2 py-2 rounded-lg text-sm
                 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Image src={ChatWithAI} alt="homeicon" width={20} height={20} />
              Chat with Data
            </Link>
          </nav>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-200 pt-6 px-3">
        <div className="flex items-center gap-1">
          <Image
            src={FlowbitAIlogo}
            alt="Flowbit AI Logo"
            width={18}
            height={18}
            className="object-contain"
          />
          <span className="text-[18px] text-black font-medium">Flowbit AI</span>
        </div>
      </div>
    </aside>
  );
}
