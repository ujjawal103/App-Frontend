import axios from "axios";

export async function removeFcmToken() {
  const token = localStorage.getItem("token");
  const fcm = localStorage.getItem("fcm");

  if (!fcm || !token) return;

  try {
    await axios.delete(
      import.meta.env.VITE_BASE_URL + "stores/remove-fcm",
      {
        data: { fcmToken: fcm },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("FCM Token removed from DB");
  } catch (err) {
    console.log("Failed to remove FCM token", err.response?.data || err);
  }
}
