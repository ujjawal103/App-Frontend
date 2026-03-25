import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MapPin , X} from "lucide-react";
import { Geolocation } from "@capacitor/geolocation";

const StoreLocationCard = ({ store, setStore }) => {

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_BASE_URL;

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [manualSelection, setManualSelection] = useState(false);

  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  /* ===============================
     SEARCH ADDRESS WITH DEBOUNCE
  =============================== */

  useEffect(() => {

  const trimmed = query.trim();

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

  debounceRef.current = setTimeout(async () => {

    try {

      const res = await axios.get(
        `${API}maps/autocomplete?q=${trimmed}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuggestions(res.data.predictions || []);

    } catch {
      setSuggestions([]);
    }

  }, 300);

}, [query]);

  /* ===============================
     SELECT ADDRESS
  =============================== */

    const selectAddress = (place) => {

    const lat = place.geometry.location.lat;
    const lng = place.geometry.location.lng;

    setSelectedPlace({
        lat,
        lng,
        address: place.description
    });

    setManualSelection(true); // 🔥 prevent autocomplete
    setQuery(place.description);
    setSuggestions([]);
    };

  /* ===============================
     SAVE SELECTED LOCATION
  =============================== */

  const saveLocation = async () => {

    if (!selectedPlace) return;

    try {

      setLoading(true);

      const res = await axios.patch(
        `${API}delivery/update-location`,
        {
          latitude: selectedPlace.lat,
          longitude: selectedPlace.lng,
          address: selectedPlace.address
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setStore(prev => ({
        ...prev,
        location: res.data.location,
        selectedAddress: res.data.selectedAddress
      }));

      toast.success("Store location updated");

      setSelectedPlace(null);
      setQuery("");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Failed to save location"
      );

    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     CURRENT LOCATION
  =============================== */

  // const useCurrentLocation = () => {

  //   if (!navigator.geolocation) {
  //     toast.error("Geolocation not supported");
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     async (pos) => {

  //       const lat = pos.coords.latitude;
  //       const lng = pos.coords.longitude;

  //       try {

  //         setLoading(true);

  //         /* reverse geocode from backend */
  //         const geo = await axios.get(
  //           `${API}maps/reverse-geocode?lat=${lat}&lng=${lng}`,
  //           {
  //             headers: { Authorization: `Bearer ${token}` }
  //           }
  //         );

  //         const address = geo.data.address || "Unknown Address";

  //         const res = await axios.patch(
  //           `${API}delivery/update-location`,
  //           {
  //             latitude: lat,
  //             longitude: lng,
  //             address
  //           },
  //           {
  //             headers: { Authorization: `Bearer ${token}` }
  //           }
  //         );

  //         setStore(prev => ({
  //           ...prev,
  //           location: res.data.location,
  //           selectedAddress: res.data.selectedAddress
  //         }));

  //         toast.success("Location updated");

  //       } catch {
  //         toast.error("Failed to fetch address");
  //       }
  //       finally {
  //         setLoading(false);
  //       }

  //     },
  //     () => toast.error("Unable to get location")
  //   );
  // };

  const useCurrentLocation = async () => {
  try {
    setLoading(true);

    /* ===============================
       📱 CAPACITOR ONLY FLOW
    =============================== */

    // 🔥 Step 1: Check permission
    let permission = await Geolocation.checkPermissions();

    // 🔥 Step 2: Ask permission if not granted
    if (permission.location !== "granted") {
      permission = await Geolocation.requestPermissions();
    }

    // ❌ Still denied
    if (permission.location !== "granted") {
      toast.error("Please allow location permission from settings 🙏");
      return;
    }

    // ✅ Step 3: Get location
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000
    });

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    /* ===============================
       🔁 REVERSE GEOCODE
    =============================== */

    const geo = await axios.get(
      `${API}maps/reverse-geocode?lat=${lat}&lng=${lng}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const address = geo.data.address || "Unknown Address";

    /* ===============================
       💾 SAVE TO STORE
    =============================== */

    const res = await axios.patch(
      `${API}delivery/update-location`,
      {
        latitude: lat,
        longitude: lng,
        address
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setStore(prev => ({
      ...prev,
      location: res.data.location,
      selectedAddress: res.data.selectedAddress
    }));

    toast.success("Location updated 🚀");

  } catch (error) {

    console.error(error);

    if (error.message?.includes("timeout")) {
      toast.error("Location taking too long, try again");
    } else {
      toast.error("Failed to fetch location");
    }

  } finally {
    setLoading(false);
  }
};

  useEffect(() => {

  const handleClickOutside = (event) => {

    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSuggestions([]);
    }

  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };

}, []);

const clearInput = () => {
  setQuery("");
  setSuggestions([]);
  setSelectedPlace(null);
};

  return (
    <div className="bg-white shadow-md rounded-xl p-6" ref={wrapperRef}>

      {/* HEADER */}

      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-pink-600" />
        <h2 className="text-lg font-semibold text-gray-800">
          Store Location
        </h2>
      </div>

      {/* CURRENT ADDRESS */}

      {store?.selectedAddress && (
        <p className="text-sm text-gray-600 mb-4">
          {store.selectedAddress}
        </p>
      )}

      {/* SEARCH INPUT */}

    <div className="relative flex gap-2 mb-3">

        <div className="relative flex-1">

            <input
            type="text"
            value={query}
            onChange={(e) => {
                setQuery(e.target.value);
                setSelectedPlace(null);
            }}
            placeholder="Search store address..."
            className="w-full border rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />

            {query && (
            <button
                onClick={clearInput}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
                <X size={16} />
            </button>
            )}

        </div>

        <button
            onClick={saveLocation}
            disabled={!selectedPlace || loading}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 rounded-lg text-sm"
        >
            { loading ? "Saving..." : "Save" }
        </button>

    </div>

      {/* SUGGESTIONS */}

      {suggestions.length > 0 && (

        <div className="border rounded-lg max-h-40 overflow-y-auto mb-4">

          {suggestions.map((place, i) => (

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

      {/* CURRENT LOCATION BUTTON */}

      <button
        onClick={useCurrentLocation}
        disabled={loading}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg text-sm"
      >
        {loading ? "Detecting location..." : "Use Current Location"}
      </button>

    </div>
  );
};

export default StoreLocationCard;