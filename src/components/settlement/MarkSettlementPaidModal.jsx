import React, { useState } from "react";
import { X } from "lucide-react";

const MarkSettlementPaidModal = ({
  onClose,
  onSubmit,
  loading,
}) => {
  const [utr, setUtr] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    if (!utr.trim()) return;
    onSubmit({ utr: utr.trim(), remarks: remarks.trim() });
  };

  return (
    <div className="fixed ml-0 md:ml-58 inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-4 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-1">
          Mark Settlement as Paid
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Enter payment details for this settlement
        </p>

        {/* UTR */}
        <label className="text-xs font-medium">UTR *</label>
        <input
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          placeholder="Enter UTR / Transaction ID"
          className="w-full border rounded-md px-3 py-2 text-sm mt-1 mb-3"
        />

        {/* REMARKS */}
        <label className="text-xs font-medium">Remarks (optional)</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="e.g. Paid via bank transfer"
          rows={3}
          className="w-full border rounded-md px-3 py-2 text-sm mt-1"
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border"
          >
            Cancel
          </button>

          <button
            disabled={loading || !utr.trim()}
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded-md bg-pink-600 text-white hover:bg-pink-700 disabled:opacity-50"
          >
            {loading ? "Marking..." : "Confirm Paid"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkSettlementPaidModal;
