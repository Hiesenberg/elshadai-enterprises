import { useState } from "react";
import {
  FiX,
  FiPlus,
  FiTrash2,
  FiDownload,
  FiLoader,
} from "react-icons/fi";
import { generateEstimatePdf } from "../../utils/estimatePdf";
import "./EstimateModal.css";

let itemIdCounter = 0;

const createEmptyItem = () => ({
  id: ++itemIdCounter,
  description: "",
  qty: 1,
  rate: 0,
});

function EstimateModal({ booking, onClose }) {
  const [items, setItems] = useState([createEmptyItem(), createEmptyItem()]);
  const [taxRate, setTaxRate] = useState(18);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => setItems((prev) => [...prev, createEmptyItem()]);

  const removeItem = (id) =>
    setItems((prev) =>
      prev.length > 1 ? prev.filter((item) => item.id !== id) : prev
    );

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (Number(item.qty) || 0) * (Number(item.rate) || 0),
    0
  );

  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  const formatAmount = (amount) =>
    `Rs. ${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

  const handleDownload = () => {
    setIsGenerating(true);

    try {
      const doc = generateEstimatePdf({
        booking,
        items,
        taxRate,
        subtotal,
        tax,
        total,
      });

      doc.save(`Estimate-${booking.name.replace(/\s+/g, "-")}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="estimate-overlay" onClick={onClose}>
      <div className="estimate-modal" onClick={(e) => e.stopPropagation()}>
        <div className="estimate-header">
          <div>
            <h2>Create Estimate</h2>
            <p>
              {booking.name} — {booking.service}
            </p>
          </div>
          <button className="icon-btn close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="estimate-body">
          <div className="customer-card">
            <div className="customer-item">
              <span>Name</span>
              <strong>{booking.name}</strong>
            </div>
            <div className="customer-item">
              <span>Email</span>
              <strong>{booking.email}</strong>
            </div>
            <div className="customer-item">
              <span>Phone</span>
              <strong>{booking.phone}</strong>
            </div>
            <div className="customer-item">
              <span>Location</span>
              <strong>{booking.location}</strong>
            </div>
          </div>

          <div className="items-section">
            <h3>Line Items</h3>

            <div className="items-head">
              <span className="col-desc">Description</span>
              <span className="col-num">Qty</span>
              <span className="col-num">Rate (Rs)</span>
              <span className="col-amount">Amount</span>
              <span className="col-del" />
            </div>

            {items.map((item) => (
              <div className="item-row" key={item.id}>
                <input
                  type="text"
                  className="col-desc"
                  placeholder="e.g. Labour charges"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, "description", e.target.value)
                  }
                />
                <input
                  type="number"
                  className="col-num"
                  min="1"
                  value={item.qty}
                  onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                />
                <input
                  type="number"
                  className="col-num"
                  min="0"
                  placeholder="0"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                />
                <span className="col-amount amount-text">
                  {formatAmount(
                    (Number(item.qty) || 0) * (Number(item.rate) || 0)
                  )}
                </span>
                <button
                  className="col-del remove-item-btn"
                  title="Remove"
                  onClick={() => removeItem(item.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}

            <button className="add-item-btn" onClick={addItem}>
              <FiPlus /> Add Line Item
            </button>
          </div>

          <div className="totals">
            <div className="totals-row">
              <span>Subtotal</span>
              <strong>{formatAmount(subtotal)}</strong>
            </div>
            <div className="totals-row">
              <span>
                Tax (%){" "}
                <input
                  type="number"
                  className="tax-input"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                />
              </span>
              <strong>{formatAmount(tax)}</strong>
            </div>
            <div className="totals-row grand-total">
              <span>Total</span>
              <strong>{formatAmount(total)}</strong>
            </div>
          </div>
        </div>

        <div className="estimate-actions">
          <button className="btn btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-download"
            onClick={handleDownload}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <FiLoader className="spin" />
            ) : (
              <FiDownload />
            )}
            {isGenerating ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EstimateModal;
