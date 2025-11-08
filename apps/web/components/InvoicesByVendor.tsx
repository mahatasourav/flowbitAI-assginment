export default function InvoiceAndSpendCharts() {
  return (
    <section className="bg-white  p-4 rounded shadow">
      <h2 className="font-medium mb-2">Invoices by Vendor</h2>
      <div className="text-sm text-gray-500 mb-3">
        Top vendors by invoice count and net value.
      </div>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Vendor</th>
            <th className="py-2">#Invoices</th>
            <th className="py-2 text-right">Net Value</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              vendor: "Musterfirma Müller",
              invoice: "1234",
              date: "2025-11-04",
              amount: "-358.79",
              status: "Validated",
            },
            {
              vendor: "AcmeCorp",
              invoice: "2345",
              date: "2025-10-20",
              amount: "1478.50",
              status: "Paid",
            },
            {
              vendor: "Global Supply",
              invoice: "4567",
              date: "2025-08-01",
              amount: "240.00",
              status: "Processing",
            },
            {
              vendor: "Musterfirma Müller",
              invoice: "1234",
              date: "2025-11-04",
              amount: "-358.79",
              status: "Validated",
            },
            {
              vendor: "AcmeCorp",
              invoice: "2345",
              date: "2025-10-20",
              amount: "1478.50",
              status: "Paid",
            },
            {
              vendor: "Global Supply",
              invoice: "4567",
              date: "2025-08-01",
              amount: "240.00",
              status: "Processing",
            },
            {
              vendor: "Musterfirma Müller",
              invoice: "1234",
              date: "2025-11-04",
              amount: "-358.79",
              status: "Validated",
            },
            {
              vendor: "AcmeCorp",
              invoice: "2345",
              date: "2025-10-20",
              amount: "1478.50",
              status: "Paid",
            },
            {
              vendor: "Global Supply",
              invoice: "4567",
              date: "2025-08-01",
              amount: "240.00",
              status: "Processing",
            },
          ].map((item, i) => (
            <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
              <td className="py-2">{item.vendor}</td>
              <td className="py-2">{item.invoice}</td>

              <td className="py-2 text-right">€ {item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
