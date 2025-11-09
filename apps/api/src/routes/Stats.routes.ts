import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

/* ---------------------- Percentage Helper ---------------------- */
const percent = (current: number, prev: number): number => {
  if (prev === 0 && current === 0) return 0;      // no activity
  if (prev === 0 && current > 0) return 100;      // growth from zero
  if (prev === 0 && current < 0) return -100;     // negative spike
  return Number((((current - prev) / prev) * 100).toFixed(2));
};

/* ---------------------- Summary Route ---------------------- */
router.get("/stats", async (req, res) => {
  try {
    const now = new Date();

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    /* ----------------------  YTD Spend ---------------------- */
    const ytd = await prisma.invoice.aggregate({
      _sum: { invoiceTotal: true },
      where: {
        invoiceDate: { gte: startOfYear },
        invoiceTotal: { gt: 0 }, // only positive
      },
    });
    const totalSpendYTD = ytd._sum.invoiceTotal || 0;

    /* ---------------------- Total Invoices ---------------------- */
    const totalInvoices = await prisma.invoice.count();

    /* ----------------------  Total Documents ---------------------- */
    const totalDocuments = await prisma.document.count({
      where: {
        createdAt: { gte: startOfThisMonth },
      },
    });

  
    const avg = await prisma.invoice.aggregate({
      _avg: { invoiceTotal: true },
      where: { invoiceTotal: { gt: 0 } },
    });
    const averageInvoiceValue = avg._avg.invoiceTotal || 0;

  
    const thisMonthInvoices = await prisma.invoice.findMany({
      where: {
        invoiceDate: { gte: startOfThisMonth },
        invoiceTotal: { gt: 0 },
      },
    });

    const lastMonthInvoices = await prisma.invoice.findMany({
      where: {
        invoiceDate: { gte: startOfLastMonth, lte: endOfLastMonth },
        invoiceTotal: { gt: 0 },
      },
    });
const spendThisMonth = thisMonthInvoices.reduce(
  (sum: number, inv: { invoiceTotal: number | null }) =>
    sum + (inv.invoiceTotal ?? 0),
  0
);

const spendLastMonth = lastMonthInvoices.reduce(
  (sum: number, inv: { invoiceTotal: number | null }) =>
    sum + (inv.invoiceTotal ?? 0),
  0
);



    const invoiceCountThisMonth = thisMonthInvoices.length;
    const invoiceCountLastMonth = lastMonthInvoices.length;

    const avgThisMonth =
      invoiceCountThisMonth ? spendThisMonth / invoiceCountThisMonth : 0;

    const avgLastMonth =
      invoiceCountLastMonth ? spendLastMonth / invoiceCountLastMonth : 0;

  
    return res.json({
      totalSpendYTD,
      totalInvoices,
      totalDocuments,
      averageInvoiceValue,

      spendChange: percent(spendThisMonth, spendLastMonth),
      invoiceChange: percent(invoiceCountThisMonth, invoiceCountLastMonth),
      documentsChange: percent(totalDocuments, 0), // documents have no last-month history unless added
      avgInvoiceChange: percent(avgThisMonth, avgLastMonth),
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load dashboard stats" });
  }
});

export default router;
