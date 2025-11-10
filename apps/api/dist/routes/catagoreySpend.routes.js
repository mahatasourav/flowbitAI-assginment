"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.get("/category-spend", async (req, res) => {
    try {
        const items = await prisma.lineItem.findMany({
            select: {
                Sachkonto: true,
                totalPrice: true,
            },
            where: {
                totalPrice: { gt: 0 },
            },
        });
        const categoryMap = {};
        items.forEach((item) => {
            const category = item.Sachkonto || "Uncategorized";
            if (!categoryMap[category])
                categoryMap[category] = 0;
            categoryMap[category] += item.totalPrice ?? 0;
        });
        const result = Object.entries(categoryMap)
            .map(([category, totalSpend]) => ({
            category,
            totalSpend,
        }))
            .sort((a, b) => b.totalSpend - a.totalSpend);
        return res.json(result);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to load category spend" });
    }
});
exports.default = router;
