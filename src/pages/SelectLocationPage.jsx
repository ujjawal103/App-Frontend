import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "../notification/Notification";
import { useNavigate , useLocation } from "react-router-dom";
import { Locate, MapPin, X, Navigation } from "lucide-react";
import AddressDrawer from "../components/Delivery/AddressDrawer";

const SelectLocationPage = () => {

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const debounceRef = useRef(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_BASE_URL;

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [liveAddress, setLiveAddress] = useState("");
  const [manualSelection, setManualSelection] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [serviceStatus, setServiceStatus] = useState(null);
// "allowed" | "not-serviceable" | "no-store-location" | "no-config"
  const [detectingCurrentLocation, setDetectingCurrentLocation] = useState(false);
  const reverseDebounceRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [finalAddressData, setFinalAddressData] = useState(null);

  const location = useLocation();
  const store = location.state?.store || null;






function getDistanceKm([lng1, lat1], [lng2, lat2]) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

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
  if (!selectedCoords || !store) return;

  const storeCoords = store?.location?.coordinates;

  // ❌ no store location
  if (!storeCoords || storeCoords.length !== 2) {
    setServiceStatus("no-store-location");
    return;
  }

  const userPoint = [selectedCoords.lng, selectedCoords.lat];

  const zone = store?.deliveryZone?.coordinates?.[0];

  // ✅ CASE 1: polygon exists
  if (zone && zone.length >= 3) {
    const inside = isPointInPolygon(userPoint, zone);

    setServiceStatus(inside ? "allowed" : "not-serviceable");
    return;
  }

  // ✅ CASE 2: radius based
  const maxKm = store?.deliverySettings?.maxDeliveryDistanceKm;

  if (!maxKm || maxKm <= 0) {
    setServiceStatus("no-config");
    return;
  }

  const distance = getDistanceKm(storeCoords, userPoint);

  setServiceStatus(distance <= maxKm ? "allowed" : "not-serviceable");

}, [selectedCoords, store]);



  /* ===============================
     INIT MAP (FIXED VERSION)
  =============================== */

 useEffect(() => {

  if (!window.OlaMaps || !mapRef.current) {
    console.log("OlaMaps not loaded");
    return;
  }

  // 🔥 get saved location
  let savedLocation = null;

  try {
    const stored = localStorage.getItem("deliveryLocation");
    if (stored) {
      savedLocation = JSON.parse(stored);
    }
  } catch {}

  const olaMaps = new window.OlaMaps({
    apiKey: import.meta.env.VITE_OLA_MAPS_API_KEY,
    version: "v1"
  });

  const initialCenter = savedLocation
    ? [savedLocation.lng, savedLocation.lat]
    : [80.9462, 26.8467];

  const map = olaMaps.init({
    container: mapRef.current,
    center: initialCenter,
    zoom: savedLocation ? 17 : 15
  });

  mapInstance.current = map;

  // ✅ set selected coords
  if (savedLocation) {
    setSelectedCoords({
      lat: savedLocation.lat,
      lng: savedLocation.lng
    });

    setLiveAddress(savedLocation.address || "");
  } else {
    const center = map.getCenter();
    setSelectedCoords({
      lat: center.lat,
      lng: center.lng
    });
  }

  // 🔥 move listener
  map.on("move", () => {
    const c = map.getCenter();

    setSelectedCoords({
      lat: c.lat,
      lng: c.lng
    });

    if (reverseDebounceRef.current) {
      clearTimeout(reverseDebounceRef.current);
    }

    reverseDebounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${API}maps/reverse-geocode?lat=${c.lat}&lng=${c.lng}`
        );

        setLiveAddress(res.data.address || "Fetching address...");
      } catch {
        setLiveAddress("Fetching address...");
      }
    }, 500);
  });

}, []);

  /* ===============================
     SEARCH AUTOCOMPLETE
  =============================== */

  useEffect(() => {

  const trimmed = query.trim();

  // ✅ prevent re-trigger after selecting suggestion
  if (manualSelection) {
    setManualSelection(false);
    return;
  }

  if (!trimmed) {
    setSuggestions([]);
    return;
  }

  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }

  setSearchLoading(true); // 🔥 start loader

  debounceRef.current = setTimeout(async () => {

    try {
      const res = await axios.get(
        `${API}maps/autocomplete?q=${trimmed}`
      );

      setSuggestions(res.data.predictions || []);
    } catch {
      setSuggestions([]);
    } finally {
      setSearchLoading(false); // 🔥 stop loader
    }

  }, 300);

}, [query]);

  /* ===============================
     SELECT ADDRESS
  =============================== */

  const selectAddress = (place) => {

  const lat = place.geometry.location.lat;
  const lng = place.geometry.location.lng;

  setManualSelection(true); // 🔥 important
  setQuery(place.description);
  setSuggestions([]);

  const map = mapInstance.current;

  if (map) {
    map.flyTo({
      center: [lng, lat],
      zoom: 17
    });
  }

  setSelectedCoords({ lat, lng });
};

  /* ===============================
     CURRENT LOCATION
  =============================== */

 const useCurrentLocation = async () => {
  setDetectingCurrentLocation(true);

  try {
    // 🔍 Check permission status first
    const permission = await navigator.permissions.query({
      name: "geolocation"
    });

    // ❌ If denied already
    if (permission.state === "denied") {
      toast.error("Location permission denied. Please enable it in browser settings.");
      setDetectingCurrentLocation(false);
      return;
    }

    // ✅ This will trigger popup if not decided yet
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setSelectedCoords({ lat, lng });

        mapInstance.current.flyTo({
          center: [lng, lat],
          zoom: 17
        });

        setDetectingCurrentLocation(false);
      },
      (err) => {
        if (err.code === 1) {
          // PERMISSION_DENIED
          toast.error("Please allow location access 🙏");
        } else {
          toast.error("Unable to fetch location");
        }

        setDetectingCurrentLocation(false);
      }
    );

  } catch (err) {
    toast.error("Location not supported");
    setDetectingCurrentLocation(false);
  }
};

  /* ===============================
     CONFIRM LOCATION
  =============================== */

  const confirmLocation = async () => {
  if (!selectedCoords) {
    toast.error("Select a location");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.get(
      `${API}maps/reverse-geocode?lat=${selectedCoords.lat}&lng=${selectedCoords.lng}`
    );

    const address = res.data.address || "Unknown location";

    const finalData = {
      lat: selectedCoords.lat,
      lng: selectedCoords.lng,
      address
    };

    setFinalAddressData(finalData); // 🔥 store temp
    setOpenDrawer(true); // 🔥 open drawer

  } catch {
    toast.error("Failed to fetch address");
  } finally {
    setLoading(false);
  }
};

  const clearInput = () => {
  setQuery("");
  setSuggestions([]);
  setManualSelection(false);
};

  /* ===============================
     UI
  =============================== */

  return (
    <div className="h-screen flex flex-col bg-white relative">

      {/* HEADER */}
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="text-pink-600" />
        <h2 className="font-semibold">Select Delivery Location</h2>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-pink-600 text-lg flex items-center"
        >
          ← Back
        </button>
      </div>


      {/* SEARCH */}
      <div className="p-3">

        <div className="flex gap-2">

          <div className="relative flex-1">

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search location..."
              className="w-full border rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-pink-500"
            />

            {query && (
              <button
                onClick={clearInput}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={16} />
              </button>
            )}

          </div>

          <button
            onClick={useCurrentLocation}
            className="bg-gray-200 px-3 rounded-lg flex items-center justify-center"
          >
            <Navigation size={18} />
          </button>

        </div>

        {/* SUGGESTIONS */}
        {suggestions.length > 0 && (
        <div className="border rounded-lg mt-2 max-h-40 overflow-y-auto">

                        {/* SUGGESTIONS / STATES */}
            {(searchLoading || suggestions.length > 0 || query.trim()) && (
            <div className="border rounded-lg mt-2 max-h-40 overflow-y-auto">

                {/* 🔄 LOADING */}
                {searchLoading && (
                <div className="p-2 text-sm text-gray-500">
                    Searching...
                </div>
                )}

                {/* ❌ NO RESULTS */}
                {!searchLoading && suggestions.length === 0 && query.trim() && (
                <div className="p-2 text-sm text-gray-400">
                    Location not found
                </div>
                )}

                {/* ✅ RESULTS */}
                {!searchLoading && suggestions.map((place, i) => (
                <div
                    key={i}
                    onClick={() => selectAddress(place)}
                    className="p-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                    {place.description}
                </div>
                ))}

            </div>
         )}

        </div>
        )}

      </div>
{/* 
      {liveAddress && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Last selected: {liveAddress}
        </p>
      )} */}

      {/* MAP */}
      <div
        ref={mapRef}
        className="flex-1 relative"
      />

      {/* CENTER PIN */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center">

        {/* ADDRESS LABEL */}
        {liveAddress && (
            <div className="mb-2 bg-white px-3 py-1 rounded-lg shadow text-xs max-w-[200px] text-center">
            {liveAddress}
            </div>
        )}

        {/* BIG FILLED PIN */}
        <div className="w-6 h-6 bg-pink-600 rounded-full border-4 border-white shadow-lg"></div>

        {/* PIN POINTER */}
        <div className="w-2 h-2 bg-pink-600 rotate-45 -mt-1"></div>

        </div>
      </div>

      {/* CURRENT LOCATION BUTTON */}
        <div className="absolute bottom-30 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={useCurrentLocation}
            disabled={detectingCurrentLocation}
            /* Added whitespace-nowrap and justify-center */
            className="bg-pink-600 text-white px-5 py-2 rounded-full shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Locate size={24} color="white" />
            <span>{detectingCurrentLocation ? "Detecting..." : "Current Location"}</span>
          </button>
        </div>



       <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg pb-[env(safe-area-inset-bottom)]">

        {/* SERVICE STATUS */}
        {serviceStatus && (
          <div className="px-3 pt-2 text-center text-sm">

            {serviceStatus === "allowed" && (
              <p className="text-green-600 font-medium">
                ✅ Delivery available at this location
              </p>
            )}

            {serviceStatus === "not-serviceable" && (
              <p className="text-red-600 font-medium">
                ❌ Not serviceable. Try another location
              </p>
            )}

            {serviceStatus === "no-store-location" && (
              <p className="text-red-600 font-medium">
                ❌ Store cannot deliver currently
              </p>
            )}

            {serviceStatus === "no-config" && (
              <p className="text-red-600 font-medium">
                ❌ Delivery not configured for this store
              </p>
            )}

          </div>
        )}

        {/* BUTTON */}
        <div className="p-3">
          <button
            onClick={confirmLocation}
            disabled={loading}
            className="w-full bg-pink-600 text-white py-3 rounded-lg"
          >
            {loading ? "Processing..." : "Save & Add Address"}
          </button>
        </div>

      </div>


      <AddressDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        locationData={finalAddressData}
        navigateBack={() => navigate(-1)}
      />

    </div>
  );
};

export default SelectLocationPage;