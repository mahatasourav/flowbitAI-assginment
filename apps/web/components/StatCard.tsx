// apps/web/components/StatCard.tsx
export default function StatCard({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {note && <div className="text-xs text-green-600 mt-2">{note}</div>}
    </div>
  );
}
