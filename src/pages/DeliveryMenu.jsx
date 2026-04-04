import React, { useEffect, useState } from "react";
import { toast } from "../notification/Notification";
import Loading from "../components/Loading";
import MenuItemCard from "../components/MenuItemCard";
import DeliveryCartDrawer from "../components/DeliveryCartDrawer";
import CategoryFilterQRBar from "../components/CategoryFilterQRBar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MenuItemCardSkeleton from "../components/MenuItemCardSkeleton";
import { MapPin, ChevronRight, CheckCircle2, XCircle, Search, Clock, Store } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";



const DeliveryMenu = ({ restaurantName = "Demo sweets" }) => {
  const { storeId, tableId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [store, setStore] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [serviceStatus, setServiceStatus] = useState(null);
// allowed | not-serviceable | no-store-location | no-config
  const [distanceKm, setDistanceKm] = useState(null);
  const navigate = useNavigate();
  const [lastOrder, setLastOrder] = useState(null);
  const [deliveryMeta, setDeliveryMeta] = useState(null);




function getDistanceKm([lng1, lat1], [lng2, lat2]) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}



useEffect(() => {
  if (!deliveryLocation || !store) return;

  const storeCoords = store?.location?.coordinates;

  // ❌ no store location
  if (!storeCoords || storeCoords.length !== 2) {
    setServiceStatus("no-store-location");
    return;
  }

  const userPoint = [deliveryLocation.lng, deliveryLocation.lat];

  const zone = store?.deliveryZone?.coordinates?.[0];

  // ✅ CASE 1: polygon exists
  if (zone && zone.length >= 3) {
    const inside = isPointInPolygon(userPoint, zone);
    setServiceStatus(inside ? "allowed" : "not-serviceable");

    // 🔥 optional: still calculate distance for display
    const dist = getDistanceKm(storeCoords, userPoint);
    setDistanceKm(dist.toFixed(2));
    return;
  }

  // ✅ CASE 2: radius fallback
  const maxKm = store?.deliverySettings?.maxDeliveryDistanceKm;

  if (!maxKm || maxKm <= 0) {
    setServiceStatus("no-config");
    return;
  }

  const distance = getDistanceKm(storeCoords, userPoint);
 
  setDistanceKm(distance.toFixed(2));
  setServiceStatus(distance <= maxKm ? "allowed" : "not-serviceable");

}, [deliveryLocation, store]);



  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, [storeId]);


  useEffect(() => {
  const stored = localStorage.getItem("lastOrder");
  if (stored) {
    try {
      setLastOrder(JSON.parse(stored));
    } catch {
      setLastOrder(null);
    }
  }
}, []);



  const fetchCategories = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}categories/${storeId}`
    );
    setCategories(res.data.categories || []);
  } catch (err) {
    toast.error("Failed to load categories");
  }
};

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}items/menu/${storeId}`
      );

      setStore(data.store);

      // store all items, both available and unavailable
      setMenuItems(data.items);

      // by default: show only available ones
      const available = data.items.filter(
        (item) =>
          item.available && item.variants.some((v) => v.available === true)
      );
      setFilteredItems(available);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item, variant) => {
    if (!item.available || !variant.available)
      return toast.error("This item is unavailable");

    const existing = cart.find(
      (c) => c.itemId === item._id && c.variant === variant.name && c.variantId === variant._id
    );

    let updatedCart;
    if (existing) {
      updatedCart = cart.map((c) =>
        c.itemId === item._id && c.variant === variant.name && c.variantId === variant._id
          ? { ...c, quantity: c.quantity + 1 }
          : c
      );
    } else {
      updatedCart = [
        ...cart,
        {
          itemId: item._id,
          itemName: item.itemName,
          variantId: variant._id,
          variant: variant.name,
          price: variant.price,
          quantity: 1,
        },
      ];
    }

    setCart(updatedCart);
    toast.success("Added to cart");
  };

  const updateQuantity = (itemId, variantId, variantName, change) => {
    setCart((prev) => {
      const updated = prev
        .map((c) => {
          if (c.itemId === itemId && c.variant === variantName && c.variantId === variantId) {
            const newQuantity = c.quantity + change;
            return { ...c, quantity: Math.max(0, newQuantity) };
          }
          return c;
        })
        .filter((c) => c.quantity > 0);
      return updated;
    });
  };


  useEffect(() => {
  let data = menuItems;

  // ✅ CATEGORY FILTER
  if (activeCategory !== "all") {
    data = data.filter((item) => {
      if (typeof item.categoryId === "string") {
        return item.categoryId === activeCategory;
      }
      return item.categoryId?._id === activeCategory;
    });
  }

  // ✅ SEARCH BY ITEM NAME OR CATEGORY NAME
  if (searchTerm.trim()) {
    data = data.filter((item) => {
      const itemNameMatch = item.itemName
        .toLowerCase()
        .includes(searchTerm);

      const categoryNameMatch = item.categoryId?.name
        ?.toLowerCase()
        .includes(searchTerm);

      return itemNameMatch || categoryNameMatch;
    });
  }

  // ✅ CUSTOMER RULE: only show available items unless searching
  if (!searchTerm.trim()) {
    data = data.filter(
      (item) =>
        item.available &&
        item.variants.some((v) => v.available === true)
    );
  }

  setFilteredItems(data);
}, [menuItems, activeCategory, searchTerm]);


const handleSearch = (e) => {
  setSearchTerm(e.target.value.toLowerCase());
};









//location effect
useEffect(() => {
  const saved = localStorage.getItem("deliveryLocation");
  if (saved) {
    setDeliveryLocation(JSON.parse(saved));
  }
}, []);


  




useEffect(() => {
  if (!deliveryLocation || !store) return;

  const addressParts = deliveryLocation?.contactDetails?.address;

  // ✅ build full address string
  const fullAddress = [
    addressParts?.house,
    addressParts?.street,
    addressParts?.landmark
  ]
    .filter(Boolean)
    .join(", ");

  // ✅ delivery settings
  const settings = store?.deliverySettings || {};

  const base = settings.baseDeliveryCharge || 0;
  const perKm = settings.pricePerKm || 0;

  let deliveryCharge = 0;

  if (base && perKm) {
    deliveryCharge = base + perKm * Number(distanceKm || 0);
  } else if (base) {
    deliveryCharge = base;
  } else if (perKm) {
    deliveryCharge = perKm * Number(distanceKm || 0);
  }

  setDeliveryMeta({
    name: {
      firstName: deliveryLocation?.name?.firstName || "",
      lastName: deliveryLocation?.name?.lastName || ""
    },
    contactDetails: {
      phone: deliveryLocation?.contactDetails?.phone || ""
    },
    address: fullAddress || "",
    liveAddress: deliveryLocation.address || "",
    lat: Number(deliveryLocation.lat),
    lng: Number(deliveryLocation.lng),
    distanceKm: Number(distanceKm || 0),
    deliveryCharge: Number(deliveryCharge.toFixed(2))
  });

}, [deliveryLocation, store, distanceKm]);
  


// if (loading) return <Loading />;



  //gemini final
  return (
    <div className="pb-28 min-h-[100vh] bg-gray-200">

      <div className="bg-pink-600 px-4 pt-4 pb-4 rounded-b-[1.5rem] shadow-lg transition-all">
          {/* 1. TOP ROW: Store & Dynamic Status */}
            <div className="flex justify-between items-start mb-4">

              {/* LEFT SIDE */}
              <div className="flex flex-col min-w-0 pr-2">
                
                <h1 className="text-xl font-extrabold text-white tracking-tight leading-none truncate">
                  {store.storeName || restaurantName}
                </h1>

                <div className="flex items-center gap-1 mt-2">
                  <FaWhatsapp size={14} className="text-green-300" />
                  <span className="text-[10px] font-bold text-pink-200 tracking-wider uppercase">
                    {store?.storeDetails?.phoneNumber || "CONTACT NOT PROVIDED"}
                  </span>
                </div>

              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col items-end gap-1 shrink-0">

                

                {/* Open/Close Badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border ${
                  store?.status === 'open' 
                    ? "bg-green-500/20 border-green-400 text-green-300" 
                    : "bg-red-500/20 border-red-400 text-red-300"
                }`}>
                  <span className="relative flex h-2 w-2">
                    {store?.status === 'open' && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      store?.status === 'open' ? "bg-green-400" : "bg-red-400"
                    }`}></span>
                  </span>

                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {store?.status === 'open' ? 'Open' : 'Closed'}
                  </span>
                </div>

                {/* Delivery Status */}
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-tight whitespace-nowrap">
                  {store?.status === "open" && store?.deliveryQr?.active && store?.deliverySettings?.deliveryEnabled
                    ? "Accepting Online Orders"
                    : "Delivery Closed"}
                </span>

              </div>

            </div>

          {/* 2. DELIVERY CARD: Compact version (Keep your existing logic) */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
              <div className="px-3 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="shrink-0 w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
                    <MapPin className="text-pink-600" size={16} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] uppercase font-bold text-gray-400 leading-none mb-0.5">Deliver to</span>
                    <p className="text-xs font-bold text-gray-800 truncate">
                      {deliveryLocation ? deliveryLocation.address : "Set delivery location"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/select-location", { state: { store } })}
                  className="shrink-0 text-[10px] font-black text-pink-600 bg-pink-50 px-3 py-1.5 rounded-md active:scale-95 transition-all"
                >
                  {deliveryLocation ? "CHANGE" : "SET"}
                </button>
              </div>

              {/* Mini Service Status Bar */}
              {deliveryLocation && serviceStatus && (
                <div className={`px-3 py-1 flex items-center justify-between border-t border-gray-50 ${
                  serviceStatus === "allowed" ? "bg-green-50/50" : "bg-red-50/50"
                }`}>
                  <div className="flex items-center gap-1">
                    {serviceStatus === "allowed" ? 
                      <CheckCircle2 size={12} className="text-green-600" /> : 
                      <XCircle size={12} className="text-red-600" />
                    }
                    <span className={`text-[9px] font-bold ${serviceStatus === "allowed" ? "text-green-700" : "text-red-700"}`}>
                      {serviceStatus === "allowed" ? "In Service Zone" : "Out of Reach"}
                    </span>
                  </div>
                  {distanceKm && <span className="text-[9px] font-medium text-gray-400">{distanceKm} km away</span>}
                </div>
              )}
            </div>

      </div>

      {/* 3. SEARCH BAR: Integrated Flex Style */}
      <div className="mx-4 my-3">
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl shadow-inner focus-within:ring-2 focus-within:ring-white/50 transition-all">
          {/* Icon stays in place naturally */}
          <Search className="text-gray-400 shrink-0" size={18} />
          
          {/* Input takes up all remaining space */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search your favorite dishes..."
            className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 border-none p-0"
          />
        </div>
      </div>

      {/* --- CATEGORY FILTER (Kept as is) --- */}
      <div className="mt-2">
        <CategoryFilterQRBar
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

        {/* Menu List */}
        <div className="px-4">
        <div className="space-y-3">
          {loading ? (
            <>
              {[...Array(6)].map((_, index) => (
                <MenuItemCardSkeleton key={index} />
              ))}
            </>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-gray-500">No items found</p>
          ) : (
            filteredItems.map((item) => (
              <MenuItemCard
                key={item._id}
                item={item}
                addToCart={addToCart}
                updateQuantity={updateQuantity}
                cart={cart}
              />
            ))
          )}
        </div>
        </div>

        {/* Cart Drawer */}
        <DeliveryCartDrawer
          open={cartOpen}
          setOpen={setCartOpen}
          cart={cart}
          setCart={setCart}
          storeId={storeId}
          tableId={tableId}
          store={store}
          deliveryMeta={deliveryMeta}
          serviceStatus={serviceStatus} 
        />

        {/* Bottom Action Bar */}
             <div className="fixed bottom-0 left-0 right-0 bg-gray-200 border-t p-3 z-10">
  <div className="flex gap-3">

    {/* ✅ CASE: Cart exists → NO Track Order */}
    {cart.length > 0 ? (
      <>
        {lastOrder && (
          <button
            onClick={() => navigate("/last-order")}
            className="w-1/2 bg-gray-800 text-white py-3 rounded font-medium"
          >
            My Last Order
          </button>
        )}

        <button
          onClick={() => setCartOpen(true)}
          className={`bg-pink-600 text-white py-3 rounded font-medium ${
            lastOrder ? "w-1/2" : "w-full"
          }`}
        >
          View Cart ({new Set(cart.map(i => i.itemId)).size})
        </button>
      </>
    ) : (
      <>
        {/* ✅ CASE: No Cart */}

        {/* Track Order */}
        <button
          onClick={() => navigate("/track-my-order")}
          className={`bg-green-600 text-white py-3 rounded font-medium ${
            lastOrder ? "w-1/2" : "w-full"
          }`}
        >
          Track Order
        </button>

        {/* Last Order */}
        {lastOrder && (
          <button
            onClick={() => navigate("/last-order")}
            className="w-1/2 bg-gray-800 text-white py-3 rounded font-medium"
          >
            My Last Order
          </button>
        )}
      </>
    )}

  </div>
</div>


    </div>
  );


  
};

export default DeliveryMenu;















// return (
  //   <div className="pb-28 min-h-[100vh] bg-gray-200">

  //     <Helmet>
  //       <title>{store?.storeName || "Store"} Menu – QR Ordering by Tap Resto</title>
  //       <meta name="robots" content="noindex,nofollow" />
  //     </Helmet>

  //     <div className="p-3 border-b bg-gray-200">

      

  //     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all">
  //       {/* TOP SECTION: ADDRESS SELECTION */}
  //       <div className="p-4 flex items-center justify-between gap-4">
  //         <div className="flex items-center gap-3 min-w-0">
  //           {/* Icon Circle */}
  //           <div className="shrink-0 w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center">
  //             <MapPin className="text-pink-600" size={20} />
  //           </div>
            
  //           {/* Address Info */}
  //           <div className="flex flex-col min-w-0">
  //             <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
  //               Deliver to
  //             </span>
  //             <div className="flex items-center gap-1 mt-0.5">
  //               {deliveryLocation ? (
  //                 <p className="text-sm font-bold text-gray-800 truncate">
  //                   {deliveryLocation.address}
  //                 </p>
  //               ) : (
  //                 <p className="text-sm font-bold text-pink-500 animate-pulse">
  //                   Set your delivery location
  //                 </p>
  //               )}
  //             </div>
  //           </div>
  //         </div>

  //         <button
  //           onClick={() => navigate("/select-location", { state: { store } })}
  //           className="shrink-0 flex items-center gap-1 text-[11px] font-extrabold bg-pink-600 text-white px-4 py-2 rounded-full shadow-md shadow-pink-100 active:scale-95 transition-all"
  //         >
  //           {deliveryLocation ? "CHANGE" : "SET"}
  //           <ChevronRight size={14} />
  //         </button>
  //       </div>

  //       {/* BOTTOM SECTION: SERVICE STATUS (Conditional) */}
  //       {deliveryLocation && serviceStatus && (
  //         <div className={`px-4 py-2.5 border-t flex items-center justify-between ${
  //           serviceStatus === "allowed" ? "bg-green-50/50 border-green-100" : "bg-red-50/50 border-red-100"
  //         }`}>
  //           <div className="flex items-center gap-2">
  //             {serviceStatus === "allowed" ? (
  //               <>
  //                 <CheckCircle2 size={16} className="text-green-600" />
  //                 <span className="text-xs font-semibold text-green-700">Serviceable Area</span>
  //               </>
  //             ) : (
  //               <>
  //                 <XCircle size={16} className="text-red-600" />
  //                 <span className="text-xs font-semibold text-red-700">
  //                   {serviceStatus === "not-serviceable" && "Location out of reach"}
  //                   {serviceStatus === "no-store-location" && "Store is currently offline"}
  //                   {serviceStatus === "no-config" && "Delivery not available"}
  //                 </span>
  //               </>
  //             )}
  //           </div>

  //           {distanceKm && (
  //             <div className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter ${
  //               serviceStatus === "allowed" 
  //                 ? "bg-green-600 text-white" 
  //                 : "bg-red-600 text-white"
  //             }`}>
  //               {distanceKm} KM AWAY
  //             </div>
  //           )}
  //         </div>
  //       )}
  //     </div>

  //     </div>



  //     {/* Navbar */}
  //     <h1 className="text-2xl font-bold text-center mb-2 px-4 pt-4">
  //       {store.storeName || restaurantName}
  //     </h1>

  //     {/* Search Bar */}
  //     <div className="px-4">
  //       <input
  //       type="text"
  //       value={searchTerm}
  //       onChange={handleSearch}
  //       placeholder="Search items by name or category..."
  //       className="w-full p-2 rounded-md border border-gray-700 mb-4 outline-none focus:ring-1 focus:border-0 focus:ring-pink-700"
  //     />
  //     </div>

  //     {/* Category Filter */}
  //     <CategoryFilterQRBar
  //       categories={categories}
  //       activeCategory={activeCategory}
  //       onSelect={setActiveCategory}
  //     />

  //     {/* Menu List */}
  //     <div className="px-4">
  //     <div className="space-y-3">
  //       {loading ? (
  //         <>
  //           {[...Array(6)].map((_, index) => (
  //             <MenuItemCardSkeleton key={index} />
  //           ))}
  //         </>
  //       ) : filteredItems.length === 0 ? (
  //         <p className="text-center text-gray-500">No items found</p>
  //       ) : (
  //         filteredItems.map((item) => (
  //           <MenuItemCard
  //             key={item._id}
  //             item={item}
  //             addToCart={addToCart}
  //             updateQuantity={updateQuantity}
  //             cart={cart}
  //           />
  //         ))
  //       )}
  //     </div>
  //     </div>

  //     {/* Cart Drawer */}
  //     <DeliveryCartDrawer
  //       open={cartOpen}
  //       setOpen={setCartOpen}
  //       cart={cart}
  //       setCart={setCart}
  //       storeId={storeId}
  //       tableId={tableId}
  //       store={store}
  //     />

  //     {/* Bottom Action Bar */}
  //     {(cart.length > 0 || lastOrder) && (
  //       <div className="fixed bottom-0 left-0 right-0 bg-gray-200 border-t p-3 z-10">
  //         <div
  //           className={`flex gap-3 ${
  //             cart.length > 0 && lastOrder ? "flex-row" : "flex-col"
  //           }`}
  //         >
  //           {/* Last Order Button */}
  //           {lastOrder && (
  //             <button
  //               onClick={() => navigate("/last-order")}
  //               className={`bg-gray-800 text-white py-3 rounded font-medium ${
  //                 cart.length > 0 ? "w-1/2" : "w-full"
  //               }`}
  //             >
  //               My Last Order
  //             </button>
  //           )}

  //           {/* View Cart Button */}
  //           {cart.length > 0 && (
  //             <button
  //               onClick={() => setCartOpen(true)}
  //               className={`bg-pink-600 text-white py-3 rounded font-medium ${
  //                 lastOrder ? "w-1/2" : "w-full"
  //               }`}
  //             >
  //               View Cart ({new Set(cart.map(i => i.itemId)).size})
  //             </button>
  //           )}
  //         </div>
  //       </div>
  //     )}


  //   </div>
  // );