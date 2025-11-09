// apps/web/app/page.tsx
"use client";
import { useEffect, useState } from "react";
import StatCardd from "../components/StatCard";
import InvoiceTrendCharts from "../components/InvoiceTrendChart";
import VendorSpendChart from "@/components/VendorSpendChart";
import InvoicesByVendor from "../components/InvoicesByVendor";
import Image from "next/image";
import DashboardLeft from "@/public/assets/DashboardLeft.svg";
import ProfileImage from "@/public/assets/ProfileImage.jpg";
import ThreeDot from "@/public/assets/ThreeDot.svg";
import CatagoreySpend from "@/components/CatagoreySpend";
import CashOutFlow from "@/components/CashOutFlow";
import { apiGet } from "@/lib/api";

// ...

type Stats = {
  totalSpendYTD: number;
  totalInvoicesProcessed: number;
  documentsUploaded: number;
  avgInvoiceValue: number;
};

export default function Page() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await apiGet("/stats");
      setSummary(data);
    }
    load();
  }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <div>
      <header className=" w-[1220px] h-[80px] flex justify-between border-b border-gray-200 p-8 ">
        <div className="flex items-center gap-3">
          <Image
            src={DashboardLeft}
            alt="Dashboard Icon"
            width={20}
            height={20}
          />
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        </div>
        <div className="text-sm text-gray-500 flex items-center justfiy-between gap-6 ">
          {/* Amit Jadhav • 12 members • Admin */}

          <div className="flex gap-3 justify-center items-center">
            <Image
              src={ProfileImage}
              alt="Dashboard Icon"
              width={36}
              height={36}
              className="rounded-full"
            />
            <span className="flex flex-col leading-tight">
              <p className="text-sm font-medium text-gray-800">Amit Jadhav</p>
              <p className="text-xs text-gray-500">Admin</p>
            </span>
          </div>
          <div>
            <Image src={ThreeDot} alt="Dashboard Icon" width={16} height={16} />
          </div>
        </div>
      </header>

      <div className="p-4 flex flex-col gap-4">
        {/* <---- First Section --->  */}
        <section className="grid grid-cols-4 gap-4  mt-2">
          <StatCardd
            title="Total Spend (YTD)"
            value={`€ ${formatNumber(summary.totalSpendYTD)}`}
            note={`${summary.spendChange >= 0 ? "+" : ""}${
              summary.spendChange
            }% from last month`}
            graph={summary.spendChange >= 0 ? "GreenGraph" : "RedGraph"}
          />
          <StatCardd
            title="Total Invoices Processed"
            value={`${summary.totalInvoices}`}
            note={`${summary.invoiceChange >= 0 ? "+" : ""}${
              summary.invoiceChange
            }% from last month`}
            graph={summary.invoiceChange >= 0 ? "GreenGraph" : "RedGraph"}
          />

          <StatCardd
            title="Documents Uploaded (This Month)"
            value={`${summary.totalDocuments}`}
            note={`${
              summary.documentsChange > 0
                ? `+${summary.documentsChange} more`
                : summary.documentsChange < 0
                ? `${summary.documentsChange} less`
                : `0 same`
            } from last month`}
            graph={summary.documentsChange >= 0 ? "GreenGraph" : "RedGraph"}
          />

          <StatCardd
            title="Average Invoice Value"
            value={`€ ${formatNumber(summary.averageInvoiceValue)}`}
            note={`${summary.avgInvoiceChange >= 0 ? "+" : ""}${
              summary.avgInvoiceChange
            }% from last month`}
          />
        </section>

        {/* <---- Second Section --->  */}
        <section className="grid grid-cols-2 gap-4 mb-6 items-stretch">
          <div className="h-full bg-white p-4 rounded-lg shadow">
            <InvoiceTrendCharts />
          </div>

          <div
            className="h-full bg-white p-4 rounded-lg
           shadow"
          >
            <VendorSpendChart />
          </div>
        </section>

        {/* <---- Third Section --->  */}
        <section className="grid grid-cols-3 gap-4 mb-6 h-[437px]">
          {/* Invoices Table */}
          <CatagoreySpend />
          <CashOutFlow />
          <InvoicesByVendor />
        </section>
      </div>
    </div>
  );
}

function formatNumber(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
