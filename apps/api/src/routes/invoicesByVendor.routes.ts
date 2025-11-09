import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// Type for aggregated vendor data
type VendorAgg = {
  vendorId: string | null;
  _count: { vendorId: number };
  _sum: { invoiceTotal: number | null };
};

// Type for the final vendor summary
type VendorSummary = {
  vendorName: string;
  invoiceCount: number;
  netValue: number;
};

router.get("/invoices", async (req, res) => {
  try {
    const {
      search = "",
      startDate,
      endDate,
      vendorId,
      status,
      minTotal,
      maxTotal,
    } = req.query;

    const filters: any = {};

    if (search) {
      filters.OR = [
        { invoiceNumber: { contains: search as string, mode: "insensitive" } },
        { vendor: { vendorName: { contains: search as string, mode: "insensitive" } } },
        { customer: { customerName: { contains: search as string, mode: "insensitive" } } },
      ];
    }

    if (startDate || endDate) {
      filters.invoiceDate = {};
      if (startDate) filters.invoiceDate.gte = new Date(startDate as string);
      if (endDate) filters.invoiceDate.lte = new Date(endDate as string);
    }

    if (vendorId) filters.vendorId = vendorId as string;
    if (status) filters.status = status as string;
    if (minTotal || maxTotal) {
      filters.invoiceTotal = {};
      if (minTotal) filters.invoiceTotal.gte = Number(minTotal);
      if (maxTotal) filters.invoiceTotal.lte = Number(maxTotal);
    }

    // Aggregate invoices by vendor
    const vendorAgg: VendorAgg[] = await prisma.invoice.groupBy({
      by: ["vendorId"],
      where: filters,
      _count: { vendorId: true },
      _sum: { invoiceTotal: true },
    });

    // Fetch vendor names
    const vendorNames = await prisma.vendor.findMany({
      where: {
        id: { in: vendorAgg.map((v: VendorAgg) => v.vendorId).filter(Boolean) as string[] },
      },
      select: { id: true, vendorName: true },
    });

    const vendorNameMap: Record<string, string> = Object.fromEntries(
      vendorNames.map((v: { id: string; vendorName: string | null }) => [v.id, v.vendorName ?? "Unknown Vendor"])
    );

    // Map to final vendor summary
    const vendorSummary: VendorSummary[] = vendorAgg.map((v: VendorAgg) => ({
      vendorName: vendorNameMap[v.vendorId ?? ""] || "Unknown Vendor",
      invoiceCount: v._count.vendorId,
      netValue: v._sum.invoiceTotal ?? 0,
    }));

    return res.json(vendorSummary);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch vendor summary" });
  }
});

export default router;
