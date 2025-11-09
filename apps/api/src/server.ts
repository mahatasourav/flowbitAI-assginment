import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import invoiceByVendorRoutes from "./routes/invoicesByVendor.routes";
import StatsRoutes from "./routes/Stats.routes";
import invoiceTrend from "./routes/invoiceTrend.routes";
import topVendorsRoutes from "./routes/topVendors.routes"; 
import catagoreySpendRoutes from "./routes/catagoreySpend.routes";
import cashOutflowRoutes from "./routes/cashOutflow.routes";




const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;


app.use(StatsRoutes);
app.use(invoiceTrend);
app.use(topVendorsRoutes);
app.use(catagoreySpendRoutes);
app.use(cashOutflowRoutes);
app.use(invoiceByVendorRoutes);


app.get("/", (_req, res) => {
  res.send(" Backend running, Prisma connected (no routes yet)");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
