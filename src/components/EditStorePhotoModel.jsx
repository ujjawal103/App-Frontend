import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { StoreDataContext } from "../context/StoreContext";

const EditStorePhotoModal = ({ store, onClose, onUpdated }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(store?.storeDetails?.photo || "");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const { setStore } = useContext(StoreDataContext);

  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setErrorText("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setErrorText("");

    if (!file) return setErrorText("Please choose an image first");

    try {
      setLoading(true);
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await axios.post(
        `${import.meta.env.VITE_BASE_URL}cloudinary/upload-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrl = uploadRes.data.url;

      // Update store photo
      const updateRes = await axios.put(
        `${import.meta.env.VITE_BASE_URL}stores/update-photo`,
        { photo: imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(updateRes.data.message || "Store photo updated successfully!");
        // Update store in context
        setStore((prev) => ({
          ...prev,
          storeDetails: { ...prev.storeDetails, photo: imageUrl },
        }));
      onUpdated(imageUrl);
      onClose();
    } catch (err) {
      const data = err.response?.data;
      setErrorText(data?.message || "Failed to update store photo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Update Store Photo
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-4">
          {/* Image Preview */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="storeImage"
              className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition relative overflow-hidden"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <ImageIcon size={40} className="mb-2" />
                  <p className="text-sm font-medium">Click to choose image</p>
                  <p className="text-xs text-gray-400">JPG, PNG, or JPEG</p>
                </div>
              )}
              <input
                id="storeImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview(store?.storeDetails?.photo || "");
                  setFile(null);
                }}
                className="mt-2 text-xs text-red-500 hover:underline"
              >
                Remove Selected Image
              </button>
            )}
          </div>

          {/* Error Text */}
          {errorText && (
            <p className="text-sm text-red-600 text-center">{errorText}</p>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                "Updating..."
              ) : (
                <>
                  <Upload size={16} /> Update
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStorePhotoModal;
