import React, { useState , useEffect } from "react";
import { X, MapPin, Phone, User, Home, Navigation } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const AddressDrawer = ({ open, onClose, locationData, navigateBack }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    house: "",
    street: "",
    landmark: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
  if (!open) return;

  try {
    const stored = localStorage.getItem("deliveryLocation");
    if (!stored) return;

    const data = JSON.parse(stored);

    setForm({
      firstName: data?.name?.firstName || "",
      lastName: data?.name?.lastName || "",
      house: data?.contactDetails?.address?.house || "",
      street: data?.contactDetails?.address?.street || "",
      landmark: data?.contactDetails?.address?.landmark || "",
      phone: data?.contactDetails?.phone || "",
    });

  } catch (err) {
    console.log("Failed to load saved address");
  }

}, [open]);

  const inputStyle = (error) => `
    w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl text-sm transition-all duration-200
    focus:bg-white focus:ring-2 outline-none
    ${error 
      ? "border-red-400 focus:ring-red-100" 
      : "border-gray-200 focus:border-pink-500 focus:ring-pink-100"}
  `;

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name required";
    if (!form.house.trim()) newErrors.house = "House/Flat number required";
    if (!/^[6-9]\d{9}$/.test(form.phone)) newErrors.phone = "Enter valid 10-digit number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
        // toast.error("Please fill required deatails correctly.");
        return;
    }

    const finalData = {
      ...locationData,
      name: { firstName: form.firstName, lastName: form.lastName },
      contactDetails: {
        address: { house: form.house, street: form.street, landmark: form.landmark },
        phone: form.phone,
      },
    };

    localStorage.setItem("deliveryLocation", JSON.stringify(finalData));
    toast.success("Address saved successfully!");
    onClose();
    if(navigateBack) navigateBack();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-[2.5rem] shadow-2xl max-h-[92vh] flex flex-col"
          >
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-2" />

            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Delivery Details</h2>
                <p className="text-xs text-gray-500">Enter your address for accurate delivery</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-gray-100 rounded-full hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              
              {/* Personal Info Group */}
              <section>
                <label className="text-[11px] font-bold uppercase tracking-wider text-pink-600 mb-3 block">Personal Info</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400" size={16} />
                    <input
                      value={form.firstName}
                      placeholder="First Name"
                      className={inputStyle(errors.firstName)}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    />
                    {errors.firstName && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.firstName}</p>}
                  </div>
                  <div className="relative">
                    <input
                        value={form.lastName}
                      placeholder="Last Name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    />
                  </div>
                </div>
              </section>

              {/* Address Details Group */}
              <section className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-pink-600 mb-1 block">Address Details</label>
                <div className="relative">
                  <Home className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  <input
                    value={form.house}
                    placeholder="House / Flat / Block No."
                    className={inputStyle(errors.house)}
                    onChange={(e) => setForm({ ...form, house: e.target.value })}
                  />
                  {errors.house && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.house}</p>}
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  <input
                    value={form.street}
                    placeholder="Apartment / Road / Area"
                    className={inputStyle()}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                  />
                </div>

                <div className="relative">
                  <Navigation className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  <input
                    value={form.landmark}
                    placeholder="Nearby Landmark (Optional)"
                    className={inputStyle()}
                    onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                  />
                </div>
              </section>

              {/* Contact Group */}
              <section>
                <label className="text-[11px] font-bold uppercase tracking-wider text-pink-600 mb-3 block">Contact</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  <div className="absolute left-10 top-3 text-sm text-gray-500 border-r pr-2 py-0.5 border-gray-300">+91</div>
                  <input
                    value={form.phone}
                    placeholder="Mobile Number"
                    className={`${inputStyle(errors.phone)} !pl-20`}
                    type="tel"
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.phone}</p>}
                </div>
              </section>
            </div>

            {/* Sticky Footer Button */}
            <div className="p-6 bg-white border-t border-gray-100">
              <button
                onClick={handleSubmit}
                className="w-full bg-pink-600 hover:bg-pink-700 active:scale-[0.98] text-white py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-pink-200 flex items-center justify-center gap-2"
              >
                Save & Continue
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddressDrawer;