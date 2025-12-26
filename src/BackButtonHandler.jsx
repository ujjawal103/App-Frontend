import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";


export default function BackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  const ROOT_PAGES = ["/store-home", "/store-login"];

  useEffect(() => {
    const handler = () => {
      console.log("Back Button Fired!", location.pathname);

      if (ROOT_PAGES.includes(location.pathname)) {
        CapacitorApp.exitApp();
      } else {
        navigate(-1);
      }
    };

    // listen for Android back button
    window.addEventListener("backbutton", handler);

    return () => {
      window.removeEventListener("backbutton", handler);
    };
  }, [location.pathname]);

  return null;
}



