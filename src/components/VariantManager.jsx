import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

/**
 * Props:
 *  - item: item object (contains variants array)
 *  - onClose: () => void
 *  - onUpdated: () => void
 *
 * This component allows:
 *  - Add variant -> POST /addvariant/:itemId
 *  - Edit variant -> PUT /editvariant/:itemId/:variantId
 *  - Toggle availability -> PUT /editvariant/available/:itemId/:variantId
 *  - Remove variant -> DELETE /removevariant/:itemId/:variantId
 */
const VariantManager = ({ item, onClose, onUpdated }) => {
  const [variants, setVariants] = useState(item?.variants || []);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [errorText, setErrorText] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    setVariants(item?.variants || []);
  }, [item]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorText("");
    if (!newName.trim()) return setErrorText("Variant name required");
    if (newPrice === "" || isNaN(newPrice)) return setErrorText("Valid price required");

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}items/addvariant/${item._id}`,
        { variantName: newName.trim(), price: parseFloat(newPrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Variant added");
      setNewName("");
      setNewPrice("");
      onUpdated(); // refresh parent
      // local update will be fetched by parent
    } catch (err) {
      console.error("AddVariant Error:", err);
      const data = err.response?.data;
      setErrorText(data?.message || "Failed to add variant");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (v) => {
    setEditId(v._id || v.id || v.name); // _id expected
    setEditName(v.name);
    setEditPrice(v.price);
    setErrorText("");
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return setErrorText("Variant name required");
    if (editPrice === "" || isNaN(editPrice)) return setErrorText("Valid price required");
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}items/editvariant/${item._id}/${editId}`,
        { variantName: editName.trim(), price: parseFloat(editPrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Variant updated");
      setEditId(null);
      setEditName("");
      setEditPrice("");
      onUpdated();
    } catch (err) {
      console.error("EditVariant Error:", err);
      const data = err.response?.data;
      setErrorText(data?.message || "Failed to update variant");
    } finally {
      setLoading(false);
    }
  };

  const toggleVariant = async (variantId, currentAvailable) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}items/editvariant/available/${item._id}/${variantId}`,
        { available: !currentAvailable },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Variant availability updated");
      onUpdated();
    } catch (err) {
      console.error("ToggleVariant Error:", err);
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (variantId) => {
    // prevent removing last variant: check current count
    if (variants.length <= 1) {
      toast.error("Cannot remove the only remaining variant");
      return;
    }
    if (!confirm("Remove this variant?")) return;
    try {
      setLoading(true);
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}items/removevariant/${item._id}/${variantId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Variant removed");
      onUpdated();
    } catch (err) {
      console.error("RemoveVariant Error:", err);
      toast.error(err.response?.data?.message || "Failed to remove variant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start sm:items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-xl w-full max-w-2xl p-5 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Manage Variants — {item.itemName}</h3>
          <button onClick={onClose} className="text-sm text-gray-600">Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Current variants list */}
          <div>
            <h4 className="font-medium mb-2">Variants</h4>
            <ul className="space-y-2">
              {variants.map((v) => (
                <li key={v._id || v.name} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <div>
                    <div className="text-sm font-medium">{v.name}</div>
                    <div className="text-xs text-gray-500">₹{v.price}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(v)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleVariant(v._id, v.available)}
                      className={`text-sm ${v.available ? "text-green-600" : "text-gray-500"}`}
                    >
                      {v.available ? "Available" : "Unavailable"}
                    </button>

                    <button
                      onClick={() => handleRemove(v._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Add / Edit variant form */}
          <div>
            <h4 className="font-medium mb-2">{editId ? "Edit Variant" : "Add Variant"}</h4>

            <form onSubmit={editId ? handleEdit : handleAdd} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Variant name (e.g. Full)"
                  value={editId ? editName : newName}
                  onChange={(e) => (editId ? setEditName(e.target.value) : setNewName(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={editId ? editPrice : newPrice}
                  onChange={(e) => (editId ? setEditPrice(e.target.value) : setNewPrice(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {errorText && <div className="text-sm text-red-600">{errorText}</div>}

              <div className="flex justify-end gap-2">
                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setEditName("");
                      setEditPrice("");
                      setErrorText("");
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
                  disabled={loading}
                >
                  {loading ? "Saving..." : (editId ? "Update" : "Add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantManager;
