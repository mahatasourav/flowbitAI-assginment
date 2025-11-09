import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";

type VendorSummary = {
  vendorName: string;
  invoiceCount: number;
  netValue: number;
};

export default function InvoiceAndSpendCharts() {
  const [vendors, setVendors] = useState<VendorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const data: VendorSummary[] = await apiGet("/invoices");
        setVendors(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch vendor summary");
      } finally {
        setLoading(false);
      }
    }

    fetchVendors();
  }, []);

  return (
    <section className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-medium mb-2">Invoices by Vendor</h2>
      <div className="text-sm text-gray-500 mb-3">
        Top vendors by invoice count and net value.
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Vendor</th>
              <th className="py-2">#Invoices</th>
              <th className="py-2 text-right">Net Value</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                <td className="py-2">{v.vendorName}</td>
                <td className="py-2">{v.invoiceCount}</td>
                <td className="py-2 text-right">€ {v.netValue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
