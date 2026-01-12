// import { registerPlugin } from '@capacitor/core';

// export const PosPrinter = registerPlugin('PosPrinter');

import { registerPlugin } from "@capacitor/core";

export const PosPrinter = registerPlugin("PosPrinter", {
  web: () => ({
    checkPrinter: async () => {
      throw new Error("POS printer not available on web");
    },
    printText: async () => {
      throw new Error("POS printer not available on web");
    },
    openBluetoothSettings: async () => {
      throw new Error("Bluetooth settings not available on web");
    },
  }),
});

