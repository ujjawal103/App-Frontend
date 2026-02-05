// import { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { App as CapacitorApp } from "@capacitor/app";


// export default function BackButtonHandler() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const ROOT_PAGES = ["/store-home", "/store-login"];

//   useEffect(() => {
//     const handler = () => {
//       console.log("Back Button Fired!", location.pathname);

//       if (ROOT_PAGES.includes(location.pathname)) {
//         CapacitorApp.exitApp();
//       } else {
//         navigate(-1);
//       }
//     };

//     // listen for Android back button
//     window.addEventListener("backbutton", handler);

//     return () => {
//       window.removeEventListener("backbutton", handler);
//     };
//   }, [location.pathname]);

//   return null;
// }



import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { App } from "@capacitor/app";

export default function BackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  const ROOT_PAGES = ["/store-home", "/store-login", "/admin-login" , "/admin-signup" , "/admin-dashboard"];

  useEffect(() => {
    const remove = App.addListener("backButton", () => {
      console.log("Back:", location.pathname);

      if (ROOT_PAGES.includes(location.pathname)) {
        App.exitApp(); // ✅ exit only on root pages
      } else {
        navigate(-1); // ✅ go back one step
      }
    });

    return () => {
      remove.then(r => r.remove());
    };
  }, [location.pathname]);

  return null;
}
