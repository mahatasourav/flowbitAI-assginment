"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get("/cash-outflow", async (req, res) => {
    try {
        const now = new Date();
        // ✅ Fetch invoices that have a dueDate + positive total
        const invoices = await prisma.invoice.findMany({
            where: {
                invoiceTotal: { gt: 0 },
                payment: {
                    dueDate: { not: null },
                },
            },
            include: { payment: true },
        });
        // ✅ Buckets
        const buckets = {
            "0-7": 0,
            "8-30": 0,
            "31-60": 0,
            "60+": 0,
        };
        invoices.forEach((inv) => {
            const due = inv.payment?.dueDate;
            if (!due)
                return;
            const diffDays = Math.ceil((new Date(due).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const total = inv.invoiceTotal ?? 0;
            if (diffDays <= 7)
                buckets["0-7"] += total;
            else if (diffDays <= 30)
                buckets["8-30"] += total;
            else if (diffDays <= 60)
                buckets["31-60"] += total;
            else
                buckets["60+"] += total;
        });
        return res.json([
            { range: "0 - 7 days", value: buckets["0-7"] },
            { range: "8 - 30 days", value: buckets["8-30"] },
            { range: "31 - 60 days", value: buckets["31-60"] },
            { range: "60+ days", value: buckets["60+"] },
        ]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to load cash outflow" });
    }
});
exports.default = router;
