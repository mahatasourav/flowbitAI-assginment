import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

interface CategoryItem {
  Sachkonto: string | null;
  totalPrice: number | null;
}

router.get("/category-spend", async (req, res) => {
  try {
    const items: CategoryItem[] = await prisma.lineItem.findMany({
      select: {
        Sachkonto: true,
        totalPrice: true,
      },
      where: {
        totalPrice: { gt: 0 },
      },
    });

    const categoryMap: Record<string, number> = {};

    items.forEach((item) => {
      const category = item.Sachkonto || "Uncategorized";

      if (!categoryMap[category]) categoryMap[category] = 0;
      categoryMap[category] += item.totalPrice ?? 0;
    });

    const result = Object.entries(categoryMap)
      .map(([category, totalSpend]) => ({
        category,
        totalSpend,
      }))
      .sort((a, b) => b.totalSpend - a.totalSpend);

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load category spend" });
  }
});

export default router;
