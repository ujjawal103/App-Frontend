import React, { use, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "../../notification/Notification";
import { MapPin } from "lucide-react";

const DeliveryZoneCard = ({ store }) => {

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_BASE_URL;

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  const [points, setPoints] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);
  const [maxDistanceKm, setMaxDistanceKm] = useState(0);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const debounceRef = useRef(null);




  
  

  useEffect(() => {
    setMaxDistanceKm(store?.deliverySettings?.maxDeliveryDistanceKm || 0);
  }, [store || store?.deliverySettings?.maxDeliveryDistanceKm]);




  function linesIntersect(p1, p2, p3, p4) {

  function ccw(a, b, c) {
    return (c[1]-a[1]) * (b[0]-a[0]) > (b[1]-a[1]) * (c[0]-a[0]);
  }

  return (
    ccw(p1,p3,p4) !== ccw(p2,p3,p4) &&
    ccw(p1,p2,p3) !== ccw(p1,p2,p4)
  );

}



/// Creates a circular polygon around a center point with a given radius in kilometers
function createCircle(center, radiusKm, points = 64) {
  const coords = [];
  const distanceX = radiusKm / (111.32 * Math.cos(center[1] * Math.PI / 180));
  const distanceY = radiusKm / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);

    coords.push([
      center[0] + x,
      center[1] + y
    ]);
  }

  coords.push(coords[0]);

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [coords]
    }
  };
}

useEffect(() => {

  const map = mapInstance.current;
  if (!map) return;

  if (!maxDistanceKm) return;

  const center = store?.location?.coordinates;
  if (!center) return;

  const circleGeoJSON = createCircle(center, maxDistanceKm);

  const drawCircle = () => {

    if (map.getSource("delivery-max-radius")) {
      map.getSource("delivery-max-radius").setData(circleGeoJSON);
      return;
    }

    map.addSource("delivery-max-radius", {
      type: "geojson",
      data: circleGeoJSON
    });

    map.addLayer({
      id: "delivery-max-radius-fill",
      type: "fill",
      source: "delivery-max-radius",
      paint: {
        "fill-color": "#22c55e",
        "fill-opacity": 0.15
      }
    });

    map.addLayer({
      id: "delivery-max-radius-border",
      type: "line",
      source: "delivery-max-radius",
      paint: {
        "line-color": "#16a34a",
        "line-width": 2
      }
    });

  };

  if (map.isStyleLoaded()) {
    drawCircle();
  } else {
    map.once("load", drawCircle);
  }

}, [maxDistanceKm]);





  /* ===============================
     LOAD EXISTING DELIVERY ZONE
  =============================== */

  const loadExistingZone = async () => {

    try {

      const res = await axios.get(
        `${API}delivery/delivery-zone`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const coords = res.data?.deliveryZone?.coordinates?.[0];

      if (!coords || !coords.length) return;

      const formatted = coords.map(([lng, lat]) => [lng, lat]);

      setPoints(formatted);

      formatted.forEach(([lng, lat]) => {

        const marker = new window.OlaMaps.Marker()
          .setLngLat([lng, lat])
          .addTo(mapInstance.current);

        markersRef.current.push(marker);

      });

    } catch {}

  };

  /* ===============================
     INIT MAP
  =============================== */

  useEffect(() => {

    if (!window.OlaMaps || !mapRef.current) {
      console.log("OlaMaps SDK not loaded");
      return;
    }

    const olaMaps = new window.OlaMaps({
      apiKey: import.meta.env.VITE_OLA_MAPS_API_KEY,
      version: "v1"
    });

    const center = store?.location?.coordinates?.length
      ? [store.location.coordinates[0], store.location.coordinates[1]]
      : [80.9462, 26.8467];

    const map = olaMaps.init({
      container: mapRef.current,
      center: center,
      zoom: 16
    });

    mapInstance.current = map;

    map.on("click", (e) => {

      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;

      setPoints(prev => [...prev, [lng, lat]]);

      const marker = new window.OlaMaps.Marker()
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current.push(marker);

    });

    loadExistingZone();

  }, []);

  /* ===============================
     DRAW POLYGON
  =============================== */

  // useEffect(() => {

  //   const map = mapInstance.current;
  //   if (!map) return;
    

  //   if (points.length < 3) {

  //     if (map.getLayer("delivery-zone-fill")) {
  //       map.removeLayer("delivery-zone-fill");
  //     }

  //     if (map.getLayer("delivery-zone-border")) {
  //       map.removeLayer("delivery-zone-border");
  //     }

  //     if (map.getSource("delivery-zone")) {
  //       map.removeSource("delivery-zone");
  //     }
  //     return;

  //   }

  //   const geojson = {
  //     type: "Feature",
  //     geometry: {
  //       type: "Polygon",
  //       coordinates: [[...points, points[0]]]
  //     }
  //   };

  //   if (map.getSource("delivery-zone")) {

  //     map.getSource("delivery-zone").setData(geojson);
  //     return;

  //   }

  //   map.addSource("delivery-zone", {
  //     type: "geojson",
  //     data: geojson
  //   });

  //   map.addLayer({
  //     id: "delivery-zone-fill",
  //     type: "fill",
  //     source: "delivery-zone",
  //     paint: {
  //       "fill-color": "#ec4899",
  //       "fill-opacity": 0.3
  //     }
  //   });

  //   map.addLayer({
  //     id: "delivery-zone-border",
  //     type: "line",
  //     source: "delivery-zone",
  //     paint: {
  //       "line-color": "#db2777",
  //       "line-width": 2
  //     }
  //   });

  // }, [points]);


useEffect(() => {
  const map = mapInstance.current;
  if (!map) return;

  const updatePolygon = () => {

    if (points.length < 3) {

      if (map.getLayer("delivery-zone-fill")) {
        map.removeLayer("delivery-zone-fill");
      }

      if (map.getLayer("delivery-zone-border")) {
        map.removeLayer("delivery-zone-border");
      }

      if (map.getSource("delivery-zone")) {
        map.removeSource("delivery-zone");
      }

      return;
    }

    const geojson = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[...points, points[0]]]
      }
    };

    if (map.getSource("delivery-zone")) {
      map.getSource("delivery-zone").setData(geojson);
      return;
    }

    map.addSource("delivery-zone", {
      type: "geojson",
      data: geojson
    });

    map.addLayer({
      id: "delivery-zone-fill",
      type: "fill",
      source: "delivery-zone",
      paint: {
        "fill-color": "#ec4899",
        "fill-opacity": 0.3
      }
    });

    map.addLayer({
      id: "delivery-zone-border",
      type: "line",
      source: "delivery-zone",
      paint: {
        "line-color": "#db2777",
        "line-width": 2
      }
    });
  };

  if (map.isStyleLoaded()) {
    updatePolygon();
  } else {
    map.once("load", updatePolygon);
  }

}, [points]);



  /* ===============================
     SAVE DELIVERY ZONE
  =============================== */

  const saveZone = async () => {

    if (points.length < 3) {
      toast.error("Polygon requires at least 3 points");
      return;
    }

    try {

      setLoadingAction("save");

      await axios.patch(
        `${API}delivery/update-delivery-zone`,
        { coordinates: points },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Delivery zone saved");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to save delivery zone"
      );

    } finally {

      setLoadingAction(null);

    }

  };

  /* ===============================
     RESET ZONE
  =============================== */

  const deleteZone = async () => {

  try {

    setLoadingAction("delete");

    await axios.delete(
      `${API}delivery/delivery-zone`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    /* clear local state */

    setPoints([]);

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const map = mapInstance.current;

    if (map.getLayer("delivery-zone-fill")) {
      map.removeLayer("delivery-zone-fill");
    }

    if (map.getLayer("delivery-zone-border")) {
      map.removeLayer("delivery-zone-border");
    }

    if (map.getSource("delivery-zone")) {
      map.removeSource("delivery-zone");
    }

    toast.success("Delivery zone reset");

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to reset delivery zone"
    );

  } finally {

    setLoadingAction(null);

  }

};

  const resetZone = () => {

    setPoints([]);

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

  };

  /* ===============================
     UNDO LAST POINT
  =============================== */

  const undoPoint = () => {

    setPoints(prev => prev.slice(0, -1));

    const marker = markersRef.current.pop();
    if (marker) marker.remove();

  };


  const refreshMap = () => {
    setLoadingAction("refresh");
    window.location.reload();
  };




  //search to pin location logic

const selectAddress = (place) => {

  const lat = place.geometry.location.lat;
  const lng = place.geometry.location.lng;

  setSelectedPlace({ lat, lng, address: place.description });
  setQuery(place.description);
  setSuggestions([]);

  const map = mapInstance.current;

  if (map) {
    map.flyTo({
      center: [lng, lat],
      zoom: 17
    });
  }
};

const pinSelectedLocation = () => {

  if (!selectedPlace) {
    toast.error("Select a location first");
    return;
  }

  const { lat, lng } = selectedPlace;
  const map = mapInstance.current;

  // add to polygon
  setPoints(prev => [...prev, [lng, lat]]);

  // add marker
  const marker = new window.OlaMaps.Marker()
    .setLngLat([lng, lat])
    .addTo(map);

  markersRef.current.push(marker);

  toast.success("Point added to delivery zone");
};

const clearInput = () => {
  setQuery("");
  setSuggestions([]);
  setSelectedPlace(null);
};

  useEffect(() => {

  const trimmed = query.trim();

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


  return (
    <div className="bg-white shadow-md rounded-xl p-6">

      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-pink-600" />
        <h2 className="text-lg font-semibold text-gray-800">
          Delivery Zone
        </h2>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Click inside the green circle on the map to draw your delivery boundary.
      </p>

      <div className="mb-4">

  <div className="flex gap-2">

    {/* INPUT + CROSS */}
    <div className="relative flex-1">

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search location to add point..."
        className="w-full border rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
      />

      {query && (
        <button
          onClick={clearInput}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}

    </div>

    {/* PIN BUTTON */}
    <button
      onClick={pinSelectedLocation}
      className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg text-sm"
    >
      Pin Location
    </button>

  </div>

  {/* SUGGESTIONS */}
  {suggestions.length > 0 && (
    <div className="border rounded-lg max-h-40 overflow-y-auto mt-2">

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

</div>

      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-lg border"
      />

      <div className="flex gap-3 mt-4 flex-wrap">

        <button
          onClick={saveZone}
          disabled={loadingAction !== null}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg"
        >
          {loadingAction === "save" ? "Saving..." : "Save Zone"}
        </button>

        <button
          onClick={resetZone}
          disabled={loadingAction !== null}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          Reset
        </button>

        <button
          onClick={undoPoint}
          disabled={loadingAction !== null}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
        >
          Undo
        </button>

        <button
          onClick={deleteZone}
          disabled={loadingAction !== null}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg"
        >
          {loadingAction === "delete" ? "Deleting..." : "Delete Zone"}
        </button>

        <button
          onClick={refreshMap}
          disabled={loadingAction !== null}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {loadingAction === "refresh" ? "Loading..." : "Refresh Map"}
        </button>

      </div>



      {!maxDistanceKm && (
        <p className="text-red-600 text-sm mt-2">
          Please fill required delivery settings (Max Delivery Distance).
        </p>
      )}

    </div>
  );
};

export default DeliveryZoneCard;