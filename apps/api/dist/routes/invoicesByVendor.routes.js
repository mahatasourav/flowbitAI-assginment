"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get("/invoices", async (req, res) => {
    try {
        const { search = "", startDate, endDate, vendorId, status, minTotal, maxTotal, } = req.query;
        const filters = {};
        if (search) {
            filters.OR = [
                { invoiceNumber: { contains: search, mode: "insensitive" } },
                { vendor: { vendorName: { contains: search, mode: "insensitive" } } },
                { customer: { customerName: { contains: search, mode: "insensitive" } } },
            ];
        }
        if (startDate || endDate) {
            filters.invoiceDate = {};
            if (startDate)
                filters.invoiceDate.gte = new Date(startDate);
            if (endDate)
                filters.invoiceDate.lte = new Date(endDate);
        }
        if (vendorId)
            filters.vendorId = vendorId;
        if (status)
            filters.status = status;
        if (minTotal || maxTotal) {
            filters.invoiceTotal = {};
            if (minTotal)
                filters.invoiceTotal.gte = Number(minTotal);
            if (maxTotal)
                filters.invoiceTotal.lte = Number(maxTotal);
        }
        // ✅ Let Prisma infer the return type
        const vendorAgg = await prisma.invoice.groupBy({
            by: ["vendorId"],
            where: filters,
            _count: { vendorId: true },
            _sum: { invoiceTotal: true },
        });
        const vendorNames = await prisma.vendor.findMany({
            where: {
                id: { in: vendorAgg.map((v) => v.vendorId).filter(Boolean) },
            },
            select: { id: true, vendorName: true },
        });
        const vendorNameMap = Object.fromEntries(vendorNames.map((v) => [v.id, v.vendorName || "Unknown Vendor"]));
        const vendorSummary = vendorAgg.map((v) => ({
            vendorName: vendorNameMap[v.vendorId || ""] || "Unknown Vendor",
            invoiceCount: v._count.vendorId,
            netValue: v._sum.invoiceTotal || 0,
        }));
        return res.json(vendorSummary);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch vendor summary" });
    }
});
exports.default = router;
