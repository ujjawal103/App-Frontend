import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import toast from "react-hot-toast";
import { Bluetooth, Printer, Settings } from "lucide-react";
import { PosPrinter } from "../plugins/posPrinter";
import FooterNavStore from "../components/FooterNavStore";

const PrinterSettings = () => {
  const [bluetoothOn, setBluetoothOn] = useState(false);
  const [printer, setPrinter] = useState(null);
  const [checking, setChecking] = useState(false);

  const isAndroid = Capacitor.getPlatform() === "android";

  const checkPrinterStatus = async () => {
    if (!isAndroid) return;

    setChecking(true);
    try {
      const result = await PosPrinter.checkPrinter();
      setPrinter(result);
      setBluetoothOn(true);
    } catch (err) {
      const msg = err?.message || "";

      if (msg.toLowerCase().includes("disabled")) {
        setBluetoothOn(false);
        setPrinter(null);
      } else {
        setBluetoothOn(true);
        setPrinter(null);
      }
    } finally {
      setChecking(false);
    }
  };

  const openBluetoothSettings = async () => {
    try {
      await PosPrinter.openBluetoothSettings();
    } catch {
      toast.error("Unable to open Bluetooth settings");
    }
  };

  const testPrinter = async () => {
    if (!printer) {
      toast.error("No printer connected");
      return;
    }

    try {
      toast.loading("Printing test...");
      await PosPrinter.printText({
        text: `
Tap Resto
--------------------
Printer Test
✅ SUCCESS
--------------------
`
      });
      toast.dismiss();
      toast.success("Test printed successfully");
    } catch {
      toast.dismiss();
      toast.error("Printer test failed");
    }
  };

  useEffect(() => {
    checkPrinterStatus();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Printer size={20} /> Printer Settings
      </h2>

      {/* Bluetooth Status */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bluetooth size={18} />
            <span className="font-medium">Bluetooth</span>
          </div>
          <span
            className={`text-sm font-semibold ${
              bluetoothOn ? "text-green-600" : "text-red-500"
            }`}
          >
            {bluetoothOn ? "ON" : "OFF"}
          </span>
        </div>

        {!bluetoothOn && (
          <button
            onClick={openBluetoothSettings}
            className="mt-3 w-full py-2 rounded bg-blue-600 text-white text-sm"
          >
            Open Bluetooth Settings
          </button>
        )}
      </div>

      {/* Printer Status */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Printer Status</span>
          {printer ? (
            <span className="text-green-600 font-semibold">Connected</span>
          ) : (
            <span className="text-red-500 font-semibold">Not Connected</span>
          )}
        </div>

        {printer ? (
          <p className="mt-2 text-sm text-gray-600">
            🖨️ {printer.name}
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-500">
            Pair a thermal printer from phone Bluetooth settings
          </p>
        )}

        {printer && (
          <button
            onClick={testPrinter}
            className="mt-3 w-full py-2 rounded bg-green-600 text-white text-sm"
          >
            Test Printer
          </button>
        )}
      </div>

      {/* Refresh */}
      <button
        onClick={checkPrinterStatus}
        disabled={checking}
        className="w-full py-2 rounded border text-sm flex items-center justify-center gap-2"
      >
        <Settings size={16} />
        {checking ? "Checking..." : "Refresh Status"}
      </button>


      <FooterNavStore />
    </div>
  );
};

export default PrinterSettings;
