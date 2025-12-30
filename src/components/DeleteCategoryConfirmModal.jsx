import React from "react";
import ReactDOM from "react-dom";
import { Trash2 } from "lucide-react";

const DeleteCategoryConfirmModal = ({
  isOpen,
  categoryName,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  const Modal = (
    <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-80 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-red-100">
            <Trash2 className="text-red-600" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Delete Category
          </h2>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">
            {categoryName}
          </span>
          ?  
          <br />
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(Modal, document.body);
};

export default DeleteCategoryConfirmModal;
