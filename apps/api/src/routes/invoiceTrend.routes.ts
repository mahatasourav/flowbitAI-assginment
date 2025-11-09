import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/invoice-trend", async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // ✅ Fetch invoices (Prisma will auto-infer the type)
    const invoices = await prisma.invoice.findMany({
      where: {
        invoiceDate: { gte: startDate },
        invoiceTotal: { gt: 0 }, // ignore negative totals
      },
      orderBy: { invoiceDate: "asc" },
    });

    const monthlyMap: Record<string, { count: number; spend: number }> = {};

   invoices.forEach((inv: { invoiceDate: Date | null; invoiceTotal: number | null }) => {
  if (!inv.invoiceDate) return;

  const d = new Date(inv.invoiceDate);
  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  if (!monthlyMap[key]) {
    monthlyMap[key] = { count: 0, spend: 0 };
  }

  monthlyMap[key].count += 1;
  monthlyMap[key].spend += inv.invoiceTotal ?? 0;
});


    // ✅ Fill last 12 months (including missing months)
    const result = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      const row = monthlyMap[key] ?? { count: 0, spend: 0 };

      result.push({
        month: key,
        invoiceCount: row.count,
        totalSpend: row.spend,
        avgInvoiceValue: row.count ? row.spend / row.count : 0,
      });
    }

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load invoice trend" });
  }
});

export default router;
