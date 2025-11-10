"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";

export default function ChatWithDataPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [sql, setSql] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState("");

  const ask = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setSql("");
    setRows([]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/chat-with-data`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: query }),
        }
      );

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSql(data.sql);
        setRows(data.results || []);
      }
    } catch (err) {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Chat With Data</h1>

      <div className="flex gap-2">
        <Input
          placeholder="Ask a question about invoices..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={ask} disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {sql && (
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">Generated SQL</h2>
            <pre className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap">
              {sql}
            </pre>
          </CardContent>
        </Card>
      )}

      {rows.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">Query Results</h2>
            <div className="overflow-auto">
              <table className="border-collapse w-full text-sm">
                <thead>
                  <tr>
                    {Object.keys(rows[0]).map((col) => (
                      <th key={col} className="border p-2 bg-muted">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      {Object.values(r).map((cell: any, j) => (
                        <td key={j} className="border p-2">
                          {String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="text-red-600 text-sm font-semibold">{error}</div>
      )}
    </div>
  );
}
