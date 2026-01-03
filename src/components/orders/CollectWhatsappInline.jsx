import React, { useState , useRef , useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CollectWhatsappInline = ({ orderId, onSaved }) => {
  const [whatsappValue, setWhatsappValue] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [saving, setSaving] = useState(false);


  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  const saveWhatsapp = async () => {
    if (whatsappValue.length !== 10) {
      return setWhatsappError("Please enter a valid 10-digit number");
    }

    try {
      setSaving(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}orders/${orderId}/whatsapp`,
        { whatsapp: whatsappValue },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Number saved");
      onSaved(res.data.order.whatsapp); // 👈 pass back to parent
    } catch (err) {
      setWhatsappError(err.response?.data?.message || "Failed to save number");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3 border-t pt-3"
    onClick={(e) => e.stopPropagation()}
    >
      <div className="flex gap-2 md:mr-40 lg:mr-200">
        <input
          ref={inputRef}
          type="tel"
          placeholder="Enter WhatsApp number"
          value={whatsappValue}
          onChange={(e) => {setWhatsappValue(e.target.value); setWhatsappError("")}}
          className="flex-1 border border-pink-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
        />

        <button
          onClick={saveWhatsapp}
          disabled={saving}
          className="bg-pink-600 hover:bg-pink-700 cursor-pointer text-white px-3 py-1 rounded text-sm"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      {whatsappError && (
        <p className="text-red-500 text-xs mt-1">{whatsappError}</p>
      )}
    </div>
  );
};

export default CollectWhatsappInline;
