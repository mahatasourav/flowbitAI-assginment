import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/vendors/top10", async (req, res) => {
  try {
    // ✅ Fetch all invoices that have valid vendor & total
    const invoices = await prisma.invoice.findMany({
      where: {
        invoiceTotal: { gt: 0 },
        vendorId: { not: null }
      },
      include: {
        vendor: true
      }
    });

    // ✅ Aggregate spend by vendorName
    const vendorMap: Record<string, number> = {};

    invoices.forEach((inv: {
  invoiceTotal: number | null;
  vendor: { vendorName: string | null } | null;
}) => {
  const name = inv.vendor?.vendorName || "Unknown Vendor";
  if (!vendorMap[name]) vendorMap[name] = 0;
  vendorMap[name] += inv.invoiceTotal ?? 0;
});


    // ✅ Convert map → sorted array
    const result = Object.entries(vendorMap)
      .map(([vendorName, totalSpend]) => ({ vendorName, totalSpend }))
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 10);

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load top vendors" });
  }
});

export default router;
