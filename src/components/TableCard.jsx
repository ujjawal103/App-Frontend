import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaTrash, FaEdit, FaDownload, FaPrint } from "react-icons/fa";
import html2canvas from "html2canvas";
import Loading from "./Loading";
import { StoreDataContext } from "../context/StoreContext";

const TableCard = ({ table, onRefresh }) => {
  const token = localStorage.getItem("token");
  const [showConfirm, setShowConfirm] = useState(false); // ✅ for popup control
  const [showEdit, setShowEdit] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading , setLoading] = useState(false);
  const [message , setMessage] = useState("");
  const {store , setStore} = useContext(StoreDataContext);
  

  // 🗑️ Delete Table
  const handleDelete = async () => {
    setLoading(true);
    setMessage("Deleting Table...");
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}tables/remove/${table._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Table deleted");
      onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete table");
    } finally {
      setShowConfirm(false);
      setLoading(false);
      setMessage("");
    }
  };

   const handleEdit = async () => {
    setLoading(true);
    setMessage("Updating table details...");
    setErrorMsg(""); // reset error
    if (!newTableNumber) return setErrorMsg("Please enter a table number");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}tables/edit/${table._id}`,
        { newTableNumber },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Table updated successfully!");
      setShowEdit(false);
      setNewTableNumber("");
      onRefresh();
    } catch (error) {
      // Show validation / backend errors inline
      if (error.response?.data?.errors?.length) {
        setErrorMsg(error.response.data.errors[0].msg);
      } else if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Something went wrong");
      }
    }
    finally{
      setLoading(false);
      setMessage("");
    }
  };

  // ⬇️ Download QR (same)
  const handleDownloadQR = async () => {
    try {
      const element = document.createElement("div");
      element.innerHTML = `
        <div id="qr-design" style="
          font-family: 'Poppins', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 600px;
          background: #d8cc22ff;
          padding: 40px;
          border-radius: 16px;
          border: 2px solid #ccc;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          text-align: center;
        ">
          <h1 style="font-size:28px;font-weight:700;margin-bottom:10px;color:#1a1a1a;">🍽️ ${store.storeName}</h1>
          <h2 style="font-size:18px;color:#555;margin-bottom:25px;">Table #${table.tableNumber}</h2>
          <img id="qr-image" crossOrigin="anonymous" src="${table.qrCode}" alt="QR Code" style="width:350px;height:350px;margin:20px 0;" />
          <p style="font-size:18px;font-weight:600;color:${table.isOccupied ? "#e72333ff" : "#de2969ff"};">
            ${table.isOccupied ? "Occupied" : "Available"}
          </p>
          <p style="font-size:14px;color:#666;margin-top:20px;">Scan the QR to place your order easily</p>
        </div>
      `;
      document.body.appendChild(element);
      element.style.position = "absolute";
      element.style.left = "-9999px";

      const img = element.querySelector("#qr-image");
      await new Promise((resolve) => {
        img.onload = () => setTimeout(resolve, 100);
        img.onerror = resolve;
      });

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const url = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = url;
      link.download = `Table-${table.tableNumber}-QR.png`;
      link.click();

      document.body.removeChild(element);
      toast.success("QR downloaded with design!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download QR code");
    }
  };

  const handlePrintQR = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Table ${table.tableNumber} - QR Code</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
            @media print {
              @page { size: A4; margin: 0; }
              body { margin: 0; }
            }
            body {
              font-family: 'Poppins', sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background: #de2969ff;
              text-align: center;
            }
            .container {
              border: 2px solid #ccc;
              border-radius: 16px;
              padding: 40px;
              width: 80%;
              max-width: 600px;
              background: #d8cc22ff;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .title {
              font-size: 35px;
              font-weight: 700;
              color: #000000ff;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .subtitle {
              font-size: 18px;
              color: #555;
              margin-bottom: 25px;
            }
            img {
              width: 350px;
              height: 350px;
              margin: 20px 0;
            }
            .status {
              font-size: 25px;
              font-weight: 600;
              margin: 10px 0;
              color: ${table.isOccupied ? "#e63946" : "#e30fabff"};
            }
            .footer {
              font-size: 14px;
              color: #666;
              margin-top: 25px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="title">🍽️ ${store.storeName}</div>
            <div class="subtitle">Table #${table.tableNumber}</div>
            <img src="${table.qrCode}" alt="QR Code" />
            <div class="status">${table.isOccupied ? "Occupied" : "Available"}</div>
            <div class="footer">Scan the QR to place your order easily</div>
          </div>
          <script>
            window.print();
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
    {loading && <Loading message={message} />}
      {/* <div className="relative bg-pink-100 shadow-md rounded-xl p-4 flex flex-col items-center justify-between text-center border border-pink-100 hover:shadow-lg transition"> */}
      <div
        className="relative cursor-pointer overflow-hidden rounded-2xl p-4 flex flex-col items-center justify-between
        bg-pink-700 text-white shadow border-2 border-pink-700 hover:shadow-lg transition min-w-[167px] max-w-[160px] md:min-w-[300px] md:max-w-[300px] mb-4 md:ml-2"
      >

         <div className="absolute -bottom-10 -right-2 w-90 h-40 bg-yellow-400 rounded-[100px]"></div>
        <div className="absolute top-10 left-20 w-40 h-60 bg-yellow-400 rounded-full md:left-40 md:w-50 md:h-50"></div>


        <h2 className="text-lg font-semibold text-white z-2">Table #{table.tableNumber}</h2>

        <img
          src={table.qrCode}
          alt={`QR ${table.tableNumber}`}
          className="w-24 h-24 my-3 rounded-lg bg-white p-2 z-2"
        />

        <div className="border-t border-1 border-white/100 mb-3 z-2 w-full"></div>

        {/* ✅ QR Actions */}
        <div className="flex gap-2 mt-2 z-2">
          <button
            onClick={handleDownloadQR}
            className="p-2 bg-pink-700 text-white rounded-full hover:bg-pink-800"
            title="Download QR"
          >
            <FaDownload size={14} />
          </button>
          <button
            onClick={handlePrintQR}
            className="p-2 bg-pink-700 text-white rounded-full hover:bg-pink-800 flex items-center"
            title="Print QR"
          >
            <FaPrint size={14} />
          </button>
          <button
            onClick={() => setShowEdit(true)}
            className="p-2 bg-pink-700 text-white rounded-full hover:bg-pink-800"
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => setShowConfirm(true)} // ✅ open popup
            className="p-2 bg-pink-700 text-white rounded-full hover:bg-pink-800 z-2"
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
        </div>

        {/* ⚙️ Edit & Delete */}
        {/* <div className="flex gap-3 mt-3">
          <button
            onClick={() => setShowEdit(true)}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => setShowConfirm(true)} // ✅ open popup
            className="p-2 bg-red-100 rounded-full hover:bg-red-200 text-red-600 z-2"
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
        </div> */}
      </div>


      {/* 🧩 Edit Modal */}
      {showEdit && (
        <div className="p-0 md:pl-65 fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center w-80">
            <h3 className="text-lg font-semibold text-pink-600 mb-3">
              Edit Table #{table.tableNumber}
            </h3>
            <input
              type="number"
              placeholder="Enter new table number"
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 text-center focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {errorMsg && (
              <p className="text-sm text-red-500 mb-3">{errorMsg}</p>
            )}
            <div className="flex justify-center gap-3 mt-2">
              <button
                onClick={() => {setShowEdit(false), setLoading(false);}}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 rounded-md bg-pink-500 hover:bg-pink-600 text-white font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🧩 Custom Delete Confirmation Popup */}
      {showConfirm && (
        <div className="p-0 md:pl-65 fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center w-80">
            <h3 className="text-lg font-semibold text-pink-600 mb-3">
              Delete Table #{table.tableNumber}?
            </h3>
            <p className="text-gray-600 text-sm mb-5">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => { setShowConfirm(false) , setLoading(false); }}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableCard;