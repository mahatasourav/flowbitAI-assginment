"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// prisma/seed.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/* -------------------------------------------------------------------------- */
/*                                Helper Utils                                */
/* -------------------------------------------------------------------------- */
function safeGet(obj, pathArr, fallback = null) {
    try {
        return pathArr.reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : null), obj) ?? fallback;
    }
    catch {
        return fallback;
    }
}
function toDate(value) {
    if (!value)
        return null;
    if (typeof value === "string")
        return new Date(value);
    if (value?.$date)
        return new Date(value.$date);
    return null;
}
const getNumber = (field) => {
    if (!field)
        return null;
    if (typeof field === "number")
        return field;
    if (typeof field === "string")
        return field.trim() === "" ? null : Number(field);
    if (typeof field?.value === "number")
        return field.value;
    if (typeof field?.value === "string")
        return field.value.trim() === "" ? null : Number(field.value);
    return null;
};
const getValue = (field) => {
    if (!field)
        return null;
    if (typeof field === "string")
        return field;
    if (typeof field === "number")
        return field.toString();
    if (field?.value !== undefined)
        return String(field.value);
    return null;
};
/* -------------------------------------------------------------------------- */
/*                             Vendor / Customer                              */
/* -------------------------------------------------------------------------- */
async function upsertVendor(vendorObj) {
    const name = safeGet(vendorObj, ["value", "vendorName", "value"]) ||
        safeGet(vendorObj, ["vendorName"]) ||
        null;
    if (!name)
        return null;
    let v = await prisma.vendor.findFirst({ where: { vendorName: name } });
    if (!v) {
        v = await prisma.vendor.create({
            data: {
                vendorName: name,
                vendorTaxId: safeGet(vendorObj, ["value", "vendorTaxId", "value"]),
                vendorAddress: safeGet(vendorObj, ["value", "vendorAddress", "value"]),
                vendorPartyNumber: safeGet(vendorObj, ["value", "vendorPartyNumber", "value"]),
            },
        });
    }
    return v;
}
async function upsertCustomer(customerObj) {
    const name = safeGet(customerObj, ["value", "customerName", "value"]) ||
        safeGet(customerObj, ["customerName"]) ||
        null;
    if (!name)
        return null;
    let c = await prisma.customer.findFirst({ where: { customerName: name } });
    if (!c) {
        c = await prisma.customer.create({
            data: {
                customerName: name,
                customerAddress: safeGet(customerObj, ["value", "customerAddress", "value"]),
            },
        });
    }
    return c;
}
/* -------------------------------------------------------------------------- */
/*                            Invoice + Document Logic                        */
/* -------------------------------------------------------------------------- */
async function createInvoiceFrom(raw) {
    const llm = safeGet(raw, ["extractedData", "llmData"], {});
    /* ------------------ Extract Invoice Fields ------------------ */
    const invBlock = safeGet(llm, ["invoice"], {});
    const invoiceNumber = safeGet(invBlock, ["value", "invoiceId", "value"]) ||
        safeGet(raw, ["analyticsId"]) ||
        null;
    /* ------------------ FIXED: Smart Invoice Date Extraction ------------------ */
    let invoiceDate = toDate(safeGet(invBlock, ["value", "invoiceDate", "value"])) ||
        toDate(safeGet(raw, ["metadata", "uploadedAt"])) ||
        toDate(safeGet(raw, ["processedAt", "$date"])) ||
        toDate(safeGet(invBlock, ["value", "deliveryDate", "value"])) ||
        null;
    const deliveryDate = toDate(safeGet(invBlock, ["value", "deliveryDate", "value"]));
    const summary = safeGet(llm, ["summary", "value"], {});
    const invoiceTotal = summary.invoiceTotal?.value ?? summary.invoiceTotal ?? null;
    /* ------------------ Vendor + Customer ------------------ */
    const vendor = await upsertVendor(safeGet(llm, ["vendor"]));
    const customer = await upsertCustomer(safeGet(llm, ["customer"]));
    /* ------------------ Payment ------------------ */
    const paymentBlock = safeGet(llm, ["payment", "value"], {});
    const payment = await prisma.payment.create({
        data: {
            dueDate: toDate(paymentBlock.dueDate?.value ?? paymentBlock.dueDate),
            paymentTerms: paymentBlock.paymentTerms?.value ?? null,
            bankAccountNumber: paymentBlock.bankAccountNumber?.value ?? null,
            BIC: paymentBlock.BIC?.value ?? null,
            accountName: paymentBlock.accountName?.value ?? null,
            netDays: paymentBlock.netDays?.value ?? null,
            discountPercentage: getNumber(paymentBlock.discountPercentage),
            discountDays: getNumber(paymentBlock.discountDays),
            discountDueDate: toDate(paymentBlock.discountDueDate),
            discountedTotal: getNumber(paymentBlock.discountedTotal),
        },
    });
    /* ------------------ Create Invoice ------------------ */
    const invoice = await prisma.invoice.create({
        data: {
            invoiceNumber: invoiceNumber ?? undefined,
            invoiceDate: invoiceDate ?? undefined,
            deliveryDate: deliveryDate ?? undefined,
            subTotal: summary.subTotal?.value ?? null,
            totalTax: summary.totalTax?.value ?? null,
            invoiceTotal: invoiceTotal ?? null,
            currencySymbol: summary.currencySymbol?.value ?? null,
            status: safeGet(raw, ["validatedData", "status"]) || raw.status || "processed",
            vendorId: vendor?.id ?? undefined,
            customerId: customer?.id ?? undefined,
            paymentId: payment.id,
        },
    });
    /* ------------------ Line Items ------------------ */
    const items = safeGet(llm, ["lineItems", "value", "items", "value"]) ||
        safeGet(llm, ["lineItems", "value", "items"]) ||
        [];
    for (const it of items) {
        await prisma.lineItem.create({
            data: {
                srNo: it.srNo?.value ?? it.srNo,
                description: it.description?.value ?? it.description,
                quantity: getNumber(it.quantity),
                unitPrice: getNumber(it.unitPrice),
                totalPrice: getNumber(it.totalPrice),
                Sachkonto: getValue(it.Sachkonto),
                BUSchluessel: getValue(it.BUSchluessel),
                vatRate: getNumber(it.vatRate),
                vatAmount: getNumber(it.vatAmount),
                invoiceId: invoice.id,
            },
        });
    }
    /* ------------------ Create Document (Real One) ------------------ */
    await prisma.document.create({
        data: {
            name: raw.name ?? `${invoiceNumber || "document"}_${invoice.id}.pdf`,
            filePath: raw.filePath || "",
            fileSize: Number(raw.fileSize?.$numberLong ?? raw.fileSize ?? 0),
            fileType: raw.fileType ?? "application/pdf",
            status: raw.status ?? safeGet(raw, ["validatedData", "status"]) ?? "processed",
            createdAt: toDate(safeGet(raw, ["createdAt"])) ?? invoice.createdAt,
            updatedAt: toDate(safeGet(raw, ["updatedAt"])) ?? invoice.updatedAt,
            invoiceId: invoice.id,
        },
    });
    return invoice;
}
/* -------------------------------------------------------------------------- */
/*                                   MAIN                                     */
/* -------------------------------------------------------------------------- */
async function main() {
    const file = path_1.default.join(__dirname, "../data/Analytics_Test_Data.json");
    if (!fs_1.default.existsSync(file)) {
        console.error("❌ Data file not found:", file);
        process.exit(1);
    }
    const arr = JSON.parse(fs_1.default.readFileSync(file, "utf8"));
    console.log(`✅ Found ${arr.length} documents, inserting...\n`);
    for (const doc of arr) {
        try {
            const inv = await createInvoiceFrom(doc);
            console.log("✅ Inserted invoice:", inv.id, inv.invoiceNumber);
        }
        catch (err) {
            console.error("❌ Failed to insert doc:", err);
        }
    }
    console.log("\n✅ Seeding finished successfully.\n");
}
/* -------------------------------------------------------------------------- */
/*                                EXECUTE                                     */
/* -------------------------------------------------------------------------- */
main()
    .catch((e) => console.error(e))
    .finally(async () => prisma.$disconnect());
