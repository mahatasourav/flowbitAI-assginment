import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/* ---------------------- Percentage Helper ---------------------- */
const percent = (current: number, prev: number): number => {
  if (prev === 0 && current === 0) return 0;  // no activity
  if (prev === 0) return 100;                // treat "from zero" as growth
  return Number((((current - prev) / prev) * 100).toFixed(2));
};

/* ---------------------- Clean Date Helper ---------------------- */
const validDate = (d: Date | null): Date | null =>
  d instanceof Date && !isNaN(d.getTime()) ? d : null;

/* ---------------------- Summary Route ---------------------- */
router.get("/stats", async (req, res) => {
  try {
    const now = new Date();

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    /* ---------------------- Fetch all invoices once (Important for performance) ---------------------- */
    const invoices = await prisma.invoice.findMany({
      where: { invoiceTotal: { gt: 0 } },
    });

    const docs = await prisma.document.findMany();

    /* ---------------------- Normalize date ---------------------- */
    const normalize = (inv: any) => ({
      total: inv.invoiceTotal ?? 0,
      date: validDate(inv.invoiceDate),
    });

    const normalized = invoices.map(normalize);

    /* ---------------------- Filter groups ---------------------- */
    const ytd = normalized.filter(
      (inv) => inv.date && inv.date >= startOfYear
    );

    const thisMonth = normalized.filter(
      (inv) => inv.date && inv.date >= startOfThisMonth
    );

    const lastMonth = normalized.filter(
      (inv) =>
        inv.date &&
        inv.date >= startOfLastMonth &&
        inv.date <= endOfLastMonth
    );

    /* ---------------------- Summaries ---------------------- */
    const sum = (arr: any[]) => arr.reduce((s, x) => s + x.total, 0);

    const totalSpendYTD = sum(ytd);
    const spendThisMonth = sum(thisMonth);
    const spendLastMonth = sum(lastMonth);

    const totalInvoices = invoices.length;

    const totalDocumentsThisMonth = docs.filter(
      (d) => d.createdAt >= startOfThisMonth
    ).length;

    const avgInvoiceValue =
      invoices.length ? sum(normalized) / invoices.length : 0;

    const avgThisMonth =
      thisMonth.length ? spendThisMonth / thisMonth.length : 0;
    const avgLastMonth =
      lastMonth.length ? spendLastMonth / lastMonth.length : 0;

    /* ---------------------- Response ---------------------- */
    return res.json({
      totalSpendYTD,
      totalInvoices,
      totalDocuments: totalDocumentsThisMonth,
      averageInvoiceValue: avgInvoiceValue,

      //  spendChange: spendLastMonth,
      // invoiceChange: lastMonth.length,
      // documentsChange: totalDocumentsThisMonth, // no last-month docs available
    
      // avgInvoiceChange: avgLastMonth,

      

      spendChange: percent(spendThisMonth,spendLastMonth),
      invoiceChange: percent(thisMonth.length, lastMonth.length),
      documentsChange: percent(totalDocumentsThisMonth, 0), // no last-month docs available
      avgInvoiceChange: percent(avgThisMonth, avgLastMonth),
    });
  } catch (err) {
    console.error("Stats Error:", err);
    return res.status(500).json({ error: "Failed to load dashboard stats" });
  }
});

export default router;
