// import React, { useState, useEffect } from "react";
// import {
//   CheckCircle,
//   AlertCircle,
//   X,
//   Info,
//   AlertTriangle,
// } from "lucide-react";

// let notify;

// export const toast = {
//   success: (msg, duration) => notify(msg, "success", duration),
//   error: (msg, duration) => notify(msg, "error", duration),
//   warning: (msg, duration) => notify(msg, "warning", duration),
//   info: (msg, duration) => notify(msg, "info", duration),
// };

// const positionClasses = {
//   "top-right": "top-5 right-5",
//   "top-left": "top-5 left-5",
//   "top-center": "top-5 left-1/2 -translate-x-1/2",
//   "bottom-right": "bottom-5 right-5",
//   "bottom-left": "bottom-5 left-5",
//   "bottom-center": "bottom-5 left-1/2 -translate-x-1/2",
// };

// const Notifications = ({ position = "top-center" }) => {
//   const [notifications, setNotifications] = useState([]);

//   const addNotification = (message, type = "info", duration = 3000) => {
//     const id = Date.now();

//     setNotifications((prev) => [
//       ...prev,
//       { id, message, type },
//     ]);

//     if (duration > 0) {
//       setTimeout(() => removeNotification(id), duration);
//     }
//   };

//   const removeNotification = (id) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//   };

//   useEffect(() => {
//     notify = addNotification;
//   }, []);

//   const getIcon = (type) => {
//     const base = "w-4 h-4";

//     switch (type) {
//       case "success":
//         return <CheckCircle className={`${base} text-green-500`} />;
//       case "error":
//         return <AlertCircle className={`${base} text-red-500`} />;
//       case "warning":
//         return <AlertTriangle className={`${base} text-yellow-500`} />;
//       default:
//         return <Info className={`${base} text-blue-500`} />;
//     }
//   };

//   const getBorder = (type) => {
//     switch (type) {
//       case "success":
//         return "border-l-4 border-green-500";
//       case "error":
//         return "border-l-4 border-red-500";
//       case "warning":
//         return "border-l-4 border-yellow-500";
//       default:
//         return "border-l-4 border-blue-500";
//     }
//   };

//   return (
//     <div
//       className={`fixed z-[9999] w-[90%] max-w-sm space-y-3 ${positionClasses[position]}`}
//     >
//       {notifications.map((n) => (
//         <div
//           key={n.id}
//           className={`flex items-center justify-between gap-3 bg-white shadow-lg rounded-xl px-4 py-3 min-h-[56px] animate-slideDown ${getBorder(
//             n.type
//           )}`}
//         >
//           <div className="flex items-start gap-2">
//             {getIcon(n.type)}
//             <p className="text-xs text-gray-700 leading-snug break-words">
//               {n.message}
//             </p>
//           </div>

//           <button onClick={() => removeNotification(n.id)}>
//             <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Notifications;



import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertCircle,
  X,
  Info,
  AlertTriangle,
} from "lucide-react";

let notify;
let removeNotify;

export const toast = {
  success: (msg, duration) => notify(msg, "success", duration),
  error: (msg, duration) => notify(msg, "error", duration),
  warning: (msg, duration) => notify(msg, "warning", duration),
  info: (msg, duration) => notify(msg, "info", duration),

  // ✅ NEW: loading (no auto remove)
  loading: (msg) => notify(msg, "loading", 0),

  // ✅ NEW: dismiss manually
  dismiss: (id) => removeNotify(id),
};

const positionClasses = {
  "top-right": "top-5 right-5",
  "top-left": "top-5 left-5",
  "top-center": "top-5 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-5 right-5",
  "bottom-left": "bottom-5 left-5",
  "bottom-center": "bottom-5 left-1/2 -translate-x-1/2",
};

const Notifications = ({ position = "top-center" }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info", duration = 3000) => {
    const id = Date.now();

    setNotifications((prev) => [
      ...prev,
      { id, message, type },
    ]);

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration);
    }

    return id; // ✅ IMPORTANT for dismiss
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    notify = addNotification;
    removeNotify = removeNotification;
  }, []);

  const getIcon = (type) => {
    const base = "w-4 h-4";

    switch (type) {
      case "success":
        return <CheckCircle className={`${base} text-green-500`} />;
      case "error":
        return <AlertCircle className={`${base} text-red-500`} />;
      case "warning":
        return <AlertTriangle className={`${base} text-yellow-500`} />;
      case "loading":
        return (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        );
      default:
        return <Info className={`${base} text-blue-500`} />;
    }
  };

  const getBorder = (type) => {
    switch (type) {
      case "success":
        return "border-l-4 border-green-500";
      case "error":
        return "border-l-4 border-red-500";
      case "warning":
        return "border-l-4 border-yellow-500";
      case "loading":
        return "border-l-4 border-blue-500";
      default:
        return "border-l-4 border-blue-500";
    }
  };

  return (
    <div
      className={`fixed z-[9999] w-[90%] max-w-sm space-y-3 ${positionClasses[position]}`}
    >
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-center justify-between gap-3 bg-white shadow-lg rounded-xl px-4 py-3 min-h-[56px] animate-slideDown ${getBorder(
            n.type
          )}`}
        >
          <div className="flex items-start gap-2">
            {getIcon(n.type)}
            <p className="text-xs text-gray-700 leading-snug break-words">
              {n.message}
            </p>
          </div>

          <button onClick={() => removeNotification(n.id)}>
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;