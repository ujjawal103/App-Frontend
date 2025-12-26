import React from "react";
import { FaPlus } from "react-icons/fa";

const AddTableButton = ({ onAdd }) => {
  return (
    <button
      onClick={onAdd}
      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg bg-gray-900 shadow hover:opacity-90 transition"
    >
      <FaPlus size={14} /> Add Table
    </button>
  );
};

export default AddTableButton;
