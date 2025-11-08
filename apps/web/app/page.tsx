// apps/web/app/page.tsx
"use client";
import { useEffect, useState } from "react";
import StatCardd from "../components/StatCard";
import InvoiceAndSpendCharts from "../components/InvoiceAndSpendChart";
import InvoicesByVendor from "../components/InvoicesByVendor";

// ...

<InvoiceAndSpendCharts />;

type Stats = {
  totalSpendYTD: number;
  totalInvoicesProcessed: number;
  documentsUploaded: number;
  avgInvoiceValue: number;
};

export default function Page() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // mock data for now — we'll wire real API next
    setStats({
      totalSpendYTD: 12679.25,
      totalInvoicesProcessed: 64,
      documentsUploaded: 17,
      avgInvoiceValue: 2455.0,
    });
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Amit Jadhav • 12 members • Admin
        </div>
      </header>

      {/* <---- First Section --->  */}
      <section className="grid grid-cols-4 gap-4 mb-6">
        <StatCardd
          title="Total Spend (YTD)"
          value="€ 12,679.25"
          note="+8.2% from last month"
        />
        <StatCardd
          title="Total Spend (YTD)"
          value="€ 12,679.25"
          note="+8.2% from last month"
        />
        <StatCardd
          title="Total Spend (YTD)"
          value="€ 12,679.25"
          note="+8.2% from last month"
        />
        <StatCardd
          title="Total Spend (YTD)"
          value="€ 12,679.25"
          note="+8.2% from last month"
        />
      </section>

      {/* <---- Second Section --->  */}
      <section>
        <InvoiceAndSpendCharts />
      </section>

      {/* <---- Third Section --->  */}
      <section className="grid grid-cols-3 gap-4 mb-6">
        {/* Invoices Table */}
        <InvoicesByVendor />
        <InvoicesByVendor />
        <InvoicesByVendor />
      </section>
    </div>
  );
}

function formatNumber(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
