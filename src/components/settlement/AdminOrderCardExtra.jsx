import { FaWhatsapp } from "react-icons/fa";

const AdminOrderCardExtra = ({ order }) => {
  return (
    <div className="mt-2 text-xs text-gray-600 space-y-1">
      <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">
            Table #{order.tableId?.tableNumber || tableNumber || "N/A"}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              order.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : order.status === "confirmed"
                ? "bg-blue-100 text-blue-700"
                : order.status === "completed"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {order.status}
          </span>
        </div>
      <p className="text-gray-600 mt-1 text-xs">👤 {order.username || "Guest"}</p>
      <p className="text-gray-600 text-xs flex items-center gap-1"><FaWhatsapp /> {order.whatsapp || "Not provided"}</p>
      <p className="text-gray-500 text-xs">
          {new Date(order.createdAt).toLocaleString()}
      </p>
      <p><b>Razorpay Order:</b> {order.razorpayOrderId}</p>
      <p><b>Payment ID:</b> {order.razorpayPaymentId}</p>
      <p><b>Paid At:</b> {new Date(order.paidAt).toLocaleString("en-IN")}</p>
      <p className="font-semibold text-sm">₹{order.totalAmount}</p>
    </div>
  );
};

export default AdminOrderCardExtra;
