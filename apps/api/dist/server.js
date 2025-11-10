"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const invoicesByVendor_routes_1 = __importDefault(require("./routes/invoicesByVendor.routes"));
const Stats_routes_1 = __importDefault(require("./routes/Stats.routes"));
const invoiceTrend_routes_1 = __importDefault(require("./routes/invoiceTrend.routes"));
const topVendors_routes_1 = __importDefault(require("./routes/topVendors.routes"));
const catagoreySpend_routes_1 = __importDefault(require("./routes/catagoreySpend.routes"));
const cashOutflow_routes_1 = __importDefault(require("./routes/cashOutflow.routes"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 4000;
app.use(Stats_routes_1.default);
app.use(invoiceTrend_routes_1.default);
app.use(topVendors_routes_1.default);
app.use(catagoreySpend_routes_1.default);
app.use(cashOutflow_routes_1.default);
app.use(invoicesByVendor_routes_1.default);
app.get("/", (_req, res) => {
    res.send(" Backend running, Prisma connected (no routes yet)");
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
