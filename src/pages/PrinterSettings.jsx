// import React, { useEffect, useState } from "react";
// import { Capacitor } from "@capacitor/core";
// import toast from "react-hot-toast";
// import { Bluetooth, Printer, Settings } from "lucide-react";
// import { PosPrinter } from "../plugins/posPrinter";
// import FooterNavStore from "../components/FooterNavStore";

// const PrinterSettings = () => {
//   const [bluetoothOn, setBluetoothOn] = useState(false);
//   const [printer, setPrinter] = useState(null);
//   const [checking, setChecking] = useState(false);

//   const isAndroid = Capacitor.getPlatform() === "android";

//   const checkPrinterStatus = async () => {
//     if (!isAndroid) return;

//     setChecking(true);
//     try {
//       const result = await PosPrinter.checkPrinter();
//       setPrinter(result);
//       setBluetoothOn(true);
//     } catch (err) {
//       const msg = err?.message || "";

//       if (msg.toLowerCase().includes("disabled")) {
//         setBluetoothOn(false);
//         setPrinter(null);
//       } else {
//         setBluetoothOn(true);
//         setPrinter(null);
//       }
//     } finally {
//       setChecking(false);
//     }
//   };

//   const openBluetoothSettings = async () => {
//     try {
//       await PosPrinter.openBluetoothSettings();
//     } catch {
//       toast.error("Unable to open Bluetooth settings");
//     }
//   };

//   const testPrinter = async () => {
//     if (!printer) {
//       toast.error("No printer connected");
//       return;
//     }

//     try {
//       toast.loading("Printing test...");
//       await PosPrinter.printText({
//         text: `
// Tap Resto
// --------------------
// Printer Test
// ✅ SUCCESS
// --------------------
// `
//       });
//       toast.dismiss();
//       toast.success("Test printed successfully");
//     } catch {
//       toast.dismiss();
//       toast.error("Printer test failed");
//     }
//   };

//   useEffect(() => {
//     checkPrinterStatus();
//   }, []);

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//         <Printer size={20} /> Printer Settings
//       </h2>

//       {/* Bluetooth Status */}
//       <div className="bg-white rounded-lg shadow p-4 mb-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Bluetooth size={18} />
//             <span className="font-medium">Bluetooth</span>
//           </div>
//           <span
//             className={`text-sm font-semibold ${
//               bluetoothOn ? "text-green-600" : "text-red-500"
//             }`}
//           >
//             {bluetoothOn ? "ON" : "OFF"}
//           </span>
//         </div>

//         {!bluetoothOn && (
//           <button
//             onClick={openBluetoothSettings}
//             className="mt-3 w-full py-2 rounded bg-blue-600 text-white text-sm"
//           >
//             Open Bluetooth Settings
//           </button>
//         )}
//       </div>

//       {/* Printer Status */}
//       <div className="bg-white rounded-lg shadow p-4 mb-4">
//         <div className="flex items-center justify-between">
//           <span className="font-medium">Printer Status</span>
//           {printer ? (
//             <span className="text-green-600 font-semibold">Connected</span>
//           ) : (
//             <span className="text-red-500 font-semibold">Not Connected</span>
//           )}
//         </div>

//         {printer ? (
//           <p className="mt-2 text-sm text-gray-600">
//             🖨️ {printer.name}
//           </p>
//         ) : (
//           <p className="mt-2 text-sm text-gray-500">
//             Pair a thermal printer from phone Bluetooth settings
//           </p>
//         )}

//         {printer && (
//           <button
//             onClick={testPrinter}
//             className="mt-3 w-full py-2 rounded bg-green-600 text-white text-sm"
//           >
//             Test Printer
//           </button>
//         )}
//       </div>

//       {/* Refresh */}
//       <button
//         onClick={checkPrinterStatus}
//         disabled={checking}
//         className="w-full py-2 rounded border text-sm flex items-center justify-center gap-2"
//       >
//         <Settings size={16} />
//         {checking ? "Checking..." : "Refresh Status"}
//       </button>


//       <FooterNavStore />
//     </div>
//   );
// };

// export default PrinterSettings;


import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import toast from "react-hot-toast";
import { Bluetooth, Printer, Settings, Check } from "lucide-react";
import { PosPrinter } from "../plugins/posPrinter";
import FooterNavStore from "../components/FooterNavStore";

const PrinterSettings = () => {
  const isAndroid = Capacitor.getPlatform() === "android";

  const [bluetoothOn, setBluetoothOn] = useState(false);
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [loading, setLoading] = useState(false);

  /* 🔹 Load saved printer */
  useEffect(() => {
    const saved = localStorage.getItem("selectedPrinter");
    if (saved) setSelectedPrinter(JSON.parse(saved));
    refreshPrinters();
  }, []);

  /* 🔹 Refresh paired printers */
  const refreshPrinters = async () => {
    if (!isAndroid) return;

    setLoading(true);
    try {
      const res = await PosPrinter.listPairedPrinters();
      setPrinters(res.devices || []);
      setBluetoothOn(true);
    } catch (err) {
      const msg = err?.message || "";
      if (msg.toLowerCase().includes("disabled")) {
        setBluetoothOn(false);
        setPrinters([]);
      }
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 Select printer */
  const selectPrinter = (printer) => {
    setSelectedPrinter(printer);
    localStorage.setItem("selectedPrinter", JSON.stringify(printer));
    toast.success(`Printer selected: ${printer.name}`);
  };

  /* 🔹 Test print */
  const testPrinter = async () => {
    if (!selectedPrinter) {
      toast.error("Select a printer first");
      return;
    }

    try {
      toast.loading("Printing test...");
      await PosPrinter.printText({
        address: selectedPrinter.address,
        text: `
Tap Resto
--------------------
Printer Test
✅ SUCCESS
--------------------

`
      });
      toast.dismiss();
      toast.success("Printer working perfectly");
    } catch (err) {
      toast.dismiss();
      toast.error("Printer test failed");
    }
  };

  /* 🔹 Open Bluetooth settings */
  const openBluetoothSettings = async () => {
    await PosPrinter.openBluetoothSettings();
  };

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Printer size={20} /> Printer Settings
      </h2>

      {/* Bluetooth */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Bluetooth size={18} />
            Bluetooth
          </div>
          <span
            className={`font-semibold ${
              bluetoothOn ? "text-green-600" : "text-red-500"
            }`}
          >
            {bluetoothOn ? "ON" : "OFF"}
          </span>
        </div>

        {!bluetoothOn && (
          <button
            onClick={openBluetoothSettings}
            className="mt-3 w-full bg-blue-600 text-white py-2 rounded"
          >
            Open Bluetooth Settings
          </button>
        )}
      </div>

      {/* Printers */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h3 className="font-semibold mb-2">Available Printers</h3>

        {printers.length === 0 ? (
          <p className="text-sm text-gray-500">
            Pair printer from phone Bluetooth settings
          </p>
        ) : (
          <ul className="space-y-2">
            {printers.map((p) => {
              const active = selectedPrinter?.address === p.address;
              return (
                <li
                  key={p.address}
                  onClick={() => selectPrinter(p)}
                  className={`p-3 border rounded cursor-pointer flex justify-between items-center ${
                    active ? "border-green-600 bg-green-50" : ""
                  }`}
                >
                  <span>{p.name || "Unknown Device"}</span>
                  {active && <Check className="text-green-600" size={16} />}
                </li>
              );
            })}
          </ul>
        )}

        {selectedPrinter && (
          <button
            onClick={testPrinter}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded"
          >
            Test Printer
          </button>
        )}
      </div>

      {/* Refresh */}
      <button
        onClick={refreshPrinters}
        disabled={loading}
        className="w-full border py-2 rounded flex justify-center items-center gap-2"
      >
        <Settings size={16} />
        {loading ? "Checking..." : "Refresh"}
      </button>

      <FooterNavStore />
    </div>
  );
};

export default PrinterSettings;