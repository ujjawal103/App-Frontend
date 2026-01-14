import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import OtpVerifyPage from "./OtpVerifyPage";
import { StoreDataContext } from "../../context/StoreContext";

const OtpVerifyWrapper = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setStore } = useContext(StoreDataContext);

  /*
    state structure:
    {
      email,
      tempData?,        // only for signup
      flow: "VERIFY_EMAIL" | "RESET_PASSWORD"
    }
  */

  useEffect(() => {
    if (!state || !state.email || !state.flow) {
      navigate("/store-signup");
    }
  }, [state, navigate]);

  if (!state || !state.email || !state.flow) return null;

  // ✅ SIGNUP SUCCESS
  const handleSignupSuccess = (data) => {
    setStore(data.store);
    localStorage.setItem("token", data.token);
    navigate("/store-home");
  };

  return (
    <OtpVerifyPage
      email={state.email}
      tempData={state.tempData}   // undefined for reset-password (OK)
      flow={state.flow}           // 🔥 IMPORTANT
      onSuccess={handleSignupSuccess}
    />
  );
};

export default OtpVerifyWrapper;
