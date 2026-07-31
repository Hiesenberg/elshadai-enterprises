import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const NAVY = [15, 23, 42];
const GOLD = [212, 175, 55];
const TEXT = [51, 65, 85];
const LIGHT = [248, 250, 252];

const formatRupees = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

export function generateEstimatePdf({
  booking,
  items,
  taxRate,
  subtotal,
  tax,
  total,
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const today = new Date().toLocaleDateString("en-IN");
  const estimateNo = `EST-${String(Date.now()).slice(-6)}`;

  // Header band
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(...GOLD);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Elshadai Enterprises", 14, 16);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Professional Home Maintenance Services", 14, 24);
  doc.text(
    "Bangalore, Karnataka  |  +91 98765 43210  |  elshadaienterprises@gmail.com",
    14,
    30
  );

  // Title + estimate meta
  doc.setTextColor(...NAVY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("ESTIMATE", 14, 52);
  doc.setFontSize(10);
  doc.setTextColor(...TEXT);
  doc.setFont("helvetica", "normal");
  doc.text(`Estimate No: ${estimateNo}`, pageWidth - 14, 52, {
    align: "right",
  });
  doc.text(`Date: ${today}`, pageWidth - 14, 57, { align: "right" });

  // Billed to (customer info)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text("Prepared For:", 14, 66);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...TEXT);
  doc.text(`Name: ${booking.name}`, 14, 72);
  doc.text(`Email: ${booking.email}`, 14, 77);
  doc.text(`Phone: ${booking.phone}`, 14, 82);
  doc.text(`Service: ${booking.service}`, 14, 87);
  doc.text(`Location: ${booking.location}`, 14, 92);

  // Line items table
  const body = items
    .filter((item) => item.description.trim())
    .map((item, index) => [
      index + 1,
      item.description,
      String(item.qty),
      `Rs. ${Number(item.rate || 0).toFixed(2)}`,
      `Rs. ${(Number(item.qty || 0) * Number(item.rate || 0)).toFixed(2)}`,
    ]);

  autoTable(doc, {
    startY: 100,
    head: [["#", "Description", "Qty", "Rate", "Amount"]],
    body,
    theme: "grid",
    headStyles: {
      fillColor: NAVY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    styles: { fontSize: 10, textColor: TEXT, cellPadding: 4 },
    alternateRowStyles: { fillColor: LIGHT },
    columnStyles: {
      0: { cellWidth: 14, halign: "center" },
      2: { cellWidth: 22, halign: "center" },
      3: { cellWidth: 32, halign: "right" },
      4: { cellWidth: 38, halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  const totalsX = pageWidth - 14;
  doc.setFontSize(10);
  doc.setTextColor(...TEXT);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", totalsX - 45, finalY, { align: "right" });
  doc.text(formatRupees(subtotal), totalsX, finalY, { align: "right" });
  doc.text(`Tax (${taxRate}%)`, totalsX - 45, finalY + 7, { align: "right" });
  doc.text(formatRupees(tax), totalsX, finalY + 7, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...NAVY);
  doc.text("Total", totalsX - 45, finalY + 16, { align: "right" });
  doc.text(formatRupees(total), totalsX, finalY + 16, { align: "right" });

  // Footer
  doc.setDrawColor(...NAVY);
  doc.line(14, pageHeight - 30, pageWidth - 14, pageHeight - 30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...TEXT);
  doc.text("Thank you for choosing Elshadai Enterprises!", 14, pageHeight - 22);
  doc.text(
    "This estimate is valid for 30 days from the date above.",
    14,
    pageHeight - 17
  );
  doc.text(`Generated on ${today}`, pageWidth - 14, pageHeight - 22, {
    align: "right",
  });

  return doc;
}
