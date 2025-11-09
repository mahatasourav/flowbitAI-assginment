import Image from "next/image";
import GreenGraph from "@/public/assets/GreenGraph.png";
import RedGraph from "@/public/assets/RedGraph.png";

export default function StatCard({
  title,
  value,
  note,
  graph,
}: {
  title: string;
  value: string;
  note?: string;
  graph?: string;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col gap-4">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <div className="text-2xl font-semibold mt-2">{value}</div>

          {note && (
            <div
              className={`text-xs mt-2 ${
                graph === "RedGraph" ? "text-red-600" : "text-green-600"
              }`}
            >
              {note}
            </div>
          )}
        </div>

        {graph && (
          <Image
            src={graph === "GreenGraph" ? GreenGraph : RedGraph}
            alt="Status Graph"
            width={46}
            height={26}
          />
        )}
      </div>
    </div>
  );
}
