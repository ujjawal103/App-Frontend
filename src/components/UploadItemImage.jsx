import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Upload, Image as ImageIcon, X } from "lucide-react";

const UploadItemImage = ({ item, onClose, onUpdated }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(item.imageUrl || ""); // existing image
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
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
    if (!file) return setErrorText("Please choose an image");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}items/upload-image/${item._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message || "Image uploaded successfully");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("UploadItemImage Error:", err);
      const data = err.response?.data;
      setErrorText(data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-0 md:pl-65 fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
           Upload Image — <span className="text-pink-600 font-bold">{item.itemName}</span>
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
              htmlFor="itemImage"
              className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition relative overflow-hidden"
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
                id="itemImage"
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
                  setPreview(item.imageUrl || "");
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
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                "Uploading..."
              ) : (
                <>
                  <Upload size={16} /> Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadItemImage;
