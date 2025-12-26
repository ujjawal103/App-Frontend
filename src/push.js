import { PushNotifications } from "@capacitor/push-notifications";
import axios from "axios";

export async function initializePush() {
  console.log("Initializing Push...");

  // Ask permission
  const permStatus = await PushNotifications.requestPermissions();
  if (permStatus.receive !== "granted") {
    console.log("Notifications permission NOT granted.");
    return;
  }

  // Register device
  await PushNotifications.register();

  // 🔥 Handle FIRST token received
  PushNotifications.addListener("registration", async (token) => {
    console.log("FCM Token:", token.value);

    const old = localStorage.getItem("fcm");
    if (old === token.value) {
      console.log("Token unchanged. Skipping update.");
      return;
    }

    

    const authToken = localStorage.getItem("token");

    try {
      await axios.post(
        import.meta.env.VITE_BASE_URL + "stores/add-fcm",
        { fcmToken: token.value },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      console.log("FCM token stored in backend!");
      localStorage.setItem("fcm", token.value);
    } catch (err) {
      console.log("Failed to send FCM token:", err);
    }
  });

  // 🔥 Handle token REFRESH events
  PushNotifications.addListener("registrationToken", async (token) => {
    console.log("FCM Token REFRESHED:", token.value);

    const old = localStorage.getItem("fcm");
    if (old === token.value) {
      console.log("Refreshed token unchanged. Skipping update.");
      return;
    }

    

    const authToken = localStorage.getItem("token");

    try {
      await axios.post(
        import.meta.env.VITE_BASE_URL + "stores/add-fcm",
        { fcmToken: token.value },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      console.log("FCM refreshed token stored!");
      localStorage.setItem("fcm", token.value);
    } catch (err) {
      console.log("Failed to update refreshed FCM token:", err);
    }
  });

  // When push received while app is open
  PushNotifications.addListener("pushNotificationReceived", (notification) => {
    console.log("Push Received:", notification);
  });

  // When user taps notification
  PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (notification) => {
      console.log("Notification Clicked:", notification);
    }
  );

  // Handle registration error
  PushNotifications.addListener("registrationError", (error) => {
    console.error("Registration Error:", error);
  });
}
