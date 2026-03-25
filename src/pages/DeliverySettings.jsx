import React, { useEffect, useState , useContext} from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import FooterNavStore from "../components/FooterNavStore";

import DeliveryQRCard from "../components/Delivery/DeliveryQrCard";
import DeliveryToggleCard from "../components/Delivery/DeliveryToggleCard";
import DeliveryPricingCard from "../components/Delivery/DeliveryPricingCard";
import FreeDeliveryCard from "../components/Delivery/FreeDeliveryCard";
import StoreLocationCard from "../components/Delivery/StoreLocationCard";
import DeliveryZoneCard from "../components/Delivery/DeliveryzoneCard";
import { StoreDataContext } from "../context/StoreContext";


const DeliverySettings = () => {

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_BASE_URL;

  const [settings, setSettings] = useState(null);
  const [deliveryQr, setDeliveryQr] = useState(null);
  const [loading, setLoading] = useState(true);

  const { store , setStore} = useContext(StoreDataContext);

  /* ===============================
     FETCH DELIVERY SETTINGS
  =============================== */

  const fetchDeliverySettings = async () => {

    try {

      const res = await axios.get(
        `${API}delivery/delivery-settings`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSettings(res.data.deliverySettings);

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Failed to load delivery settings"
      );

    }
  };

  /* ===============================
     FETCH DELIVERY QR
  =============================== */

  const fetchDeliveryQR = async () => {

    try {

      const res = await axios.get(
        `${API}delivery`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data?.deliveryQr) {

        const qr = res.data.deliveryQr;

        setDeliveryQr({
            qrCode: qr.qrCode,
            qrPublicId: qr.qrPublicId,
            isActive: Boolean(qr.active),
            qrPayFirstEnabled: Boolean(qr.qrPayFirstEnabled)
        });

      }

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Failed to load delivery QR"
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchDeliverySettings();
    fetchDeliveryQR();
  }, []);

//   if (loading) {

//     return (
//       <div className="w-full min-h-screen flex items-center justify-center text-gray-500">
//         Loading delivery settings...
//       </div>
//     );

//   }

  return (
    <>

      <div className="w-full min-h-screen bg-gray-100 md:pl-64 md:pt-8 p-4 mb-20 md:mb-0">

        {/* HEADER */}
        <div className="fixed flex justify-between items-center bg-pink-600 w-full top-0 left-0 md:pl-64 p-4 z-10 shadow-md">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Delivery Settings
          </h1>
        </div>



        <div className="mt-20 space-y-6 max-w-6xl mx-auto">

          <StoreLocationCard
          store={store}
          setStore={setStore}
        />

          {/* QR + DELIVERY TOGGLE */}

          <div className="grid gap-6 lg:grid-cols-2">

            <DeliveryQRCard
              deliveryQr={deliveryQr}
              setDeliveryQr={setDeliveryQr}
            />

            <DeliveryToggleCard
              initialStatus={settings?.deliveryEnabled}
              deliveryQr={deliveryQr}
              setDeliveryQr={setDeliveryQr}
            />

          </div>

          {/* PRICING + FREE DELIVERY */}

          <div className="grid gap-6 lg:grid-cols-2">

            <DeliveryPricingCard settings={settings} />

            <FreeDeliveryCard settings={settings} />

          </div>

          <div className="grid gap-6">
            <DeliveryZoneCard store={store} />
          </div>

        </div>
        
        
      </div>

      <FooterNavStore />

    </>
  );
};

export default DeliverySettings;