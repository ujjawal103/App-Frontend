# 📦 **README – Push Notifications using Firebase FCM (Backend + App)**

### *For MyResto / Tap Resto App (Capacitor + React + Node.js)*

---

## Overview

This guide explains **how to implement push notifications** in a MERN/Node.js + Capacitor React app using:

* **Firebase Cloud Messaging (FCM)**
* **Firebase Service Account**
* **Secure backend token sending (HTTP v1 API)**
* **Device token storage**
* **Invalid token cleanup**
* **Frontend token registration**
* **App receiving notifications in foreground, background & killed states**

---

## 1. Create Firebase Project (FCM)

### Step 1: Go to Firebase Console

👉 [https://console.firebase.google.com](https://console.firebase.google.com)

### Step 2: Click **Add Project**

* Enter project name: **Tap Resto / MyResto**
* Disable Google Analytics (optional)
* Create project

### Step 3: Open the newly created project

---

## 2. Add Android App to Firebase

Inside Firebase →
**Project Overview → Add app → Android**

Enter:

| Field                | Value             |
| -------------------- | ----------------- |
| Android package name | `com.myresto.app` |
| App nickname         | My Resto App      |
| SHA-1                | Optional for now  |

Click **Register App**.

---

## 3. Download google-services.json

After registering the Android app:

Click **Download google-services.json**

Place it here:

```
android/app/google-services.json
```

**This file is required for FCM to work inside the app.**

---

## 4. Enable FCM in Firebase Console

Go to:

**Project Settings → Cloud Messaging**

Verify:

✔ "Cloud Messaging API (Legacy)" → ON
✔ "Firebase Cloud Messaging API (V1)" → ENABLED
✔ Ensure no warnings in Cloud Messaging tab

---

## 5. Enable Firebase Admin SDK API (Google Cloud)

This is required for backend notification sending.

Go to:

👉 [https://console.cloud.google.com/apis/library](https://console.cloud.google.com/apis/library)

Enable the following APIs:

* **Firebase Admin SDK API**
* **Cloud Messaging API**
* **IAM Service Account Credentials API**

---

## 6. Create Service Account (Backend)

1. Go to Google Cloud Console:
   👉 [https://console.cloud.google.com/iam-admin/serviceaccounts](https://console.cloud.google.com/iam-admin/serviceaccounts)

2. Select your Firebase project from the dropdown

3. Click **Create Service Account**

Fill the form:

* Name: `firebase-admin`
* Role: **Owner** (or → Firebase Admin + Cloud Messaging Sender)

4. Click **Create Key → JSON**
5. Download the JSON file and save it locally

---

## 7. Secure Service Account Using Base64 (Render-safe)

**⚠️ IMPORTANT: Never push the JSON file to GitHub.**

Convert JSON to Base64:

### Linux/Mac:

```bash
base64 service-account.json > service.txt
```

### Windows PowerShell:

```powershell
[convert]::ToBase64String([IO.File]::ReadAllBytes("service-account.json")) > service.txt
```

Copy the entire Base64 string from the output file.

---

## 8. Add Base64 string to Render Environment Variables

In your Render/Vercel/hosting platform dashboard:

Create environment variable:

```
FIREBASE_SERVICE_ACCOUNT_BASE64 = <your-base64-string-here>
```

**Do NOT commit this to Git.**

---

## 9. Backend: Load Firebase Service Account (Secure Method)

Create file:

```
backend/utils/firebaseService.js
```

Add the following code:

```js
const { GoogleAuth } = require("google-auth-library");

function loadFirebaseServiceAccount() {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!base64) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable");
  }

  const jsonString = Buffer.from(base64, "base64").toString("utf8");
  return JSON.parse(jsonString);
}

const auth = new GoogleAuth({
  credentials: loadFirebaseServiceAccount(),
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

module.exports = auth;
```

---

## 10. Backend: Send Push Notification (HTTP v1 API)

Create file:

```
backend/utils/sendPushV1.js
```

Add the following code:

```js
const auth = require("./firebaseService");
const { google } = require("googleapis");

async function sendPush(tokens, title, body) {
  try {
    const client = await auth.getClient();
    const projectId = auth.credentials.project_id;

    const url = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

    const message = {
      message: {
        notification: { 
          title, 
          body 
        },
        token: tokens,
      },
    };

    await client.request({
      url,
      method: "POST",
      data: message,
    });

    console.log("✅ Push notification sent successfully");
  } catch (error) {
    console.error("❌ Error sending push notification:", error.message);
    throw error;
  }
}

module.exports = sendPush;
```

---

## 11. Update Store Model to Store FCM Tokens

Update `backend/models/restronStore.model.js`:

Add to the store schema:

```js
fcmTokens: [
  {
    type: String,
    unique: false
  }
]
```

Full schema field:

```js
fcmTokens: {
  type: [String],
  default: []
}
```

---

## 12. Create Route to Save FCM Token

Add to `backend/routes/store.routes.js`:

```js
router.post(
  "/save-fcm-token",
  authMiddleware.authStore,
  [body("token").notEmpty().withMessage("Token is required")],
  storeController.saveFcmToken
);
```

Add to `backend/controllers/store.controller.js`:

```js
module.exports.saveFcmToken = async (req, res) => {
  try {
    const { token } = req.body;
    const storeId = req.store._id;

    // Prevent duplicate tokens
    await storeModel.updateOne(
      { _id: storeId },
      { $addToSet: { fcmTokens: token } }
    );

    res.status(200).json({ 
      message: "FCM token saved successfully",
      token 
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving token", error: error.message });
  }
};
```

---

## 13. Auto-Remove Invalid Tokens (Cleanup)

If FCM returns `"NOT_FOUND"` or `"UNREGISTERED"`:

Add to `backend/utils/sendPushV1.js`:

```js
async function sendPush(tokens, title, body, storeId) {
  try {
    // ... existing code ...
    
    await client.request({
      url,
      method: "POST",
      data: message,
    });
  } catch (error) {
    // Auto-cleanup invalid tokens
    if (error.message.includes("NOT_FOUND") || error.message.includes("UNREGISTERED")) {
      const Store = require("../models/restronStore.model");
      await Store.updateOne(
        { _id: storeId },
        { $pull: { fcmTokens: tokens } }
      );
      console.log("❌ Invalid token removed from database");
    }
    throw error;
  }
}
```

---

## 14. Frontend App: Register Device for Push (Capacitor)

### Step 1: Install Capacitor Push Notifications Plugin

```bash
npm install @capacitor/push-notifications
npx cap sync
```

### Step 2: Create Push Registration Function

Create `src/utils/pushNotifications.js`:

```js
import { PushNotifications } from "@capacitor/push-notifications";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export async function registerPushNotifications(authToken, storeId) {
  try {
    // Request notification permissions
    let perm = await PushNotifications.requestPermissions();
    
    if (perm.receive === "granted") {
      // Register for push notifications
      await PushNotifications.register();
      console.log("✅ Push registration initialized");
    } else {
      console.log("❌ Notification permission denied");
      return;
    }

    // Listen for new tokens
    PushNotifications.addListener("registration", async (token) => {
      console.log("📱 FCM Token:", token.value);
      
      // Save token to localStorage
      localStorage.setItem("fcmToken", token.value);

      // Send token to backend
      try {
        await axios.post(
          `${BASE_URL}/store/save-fcm-token`,
          { token: token.value },
          { 
            headers: { 
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json"
            } 
          }
        );
        console.log("✅ Token saved to backend");
      } catch (error) {
        console.error("❌ Error saving token to backend:", error.message);
      }
    });

    // Handle registration errors
    PushNotifications.addListener("registrationError", (err) => {
      console.error("❌ Registration error:", err.error);
    });

  } catch (error) {
    console.error("❌ Error in push registration:", error.message);
  }
}

export async function listenForNotifications() {
  try {
    // Listen for notifications in foreground
    PushNotifications.addListener("pushNotificationReceived", (notif) => {
      console.log("📬 Notification received (foreground):", notif);
      
      // Show in-app notification or toast
      // You can dispatch Redux action or show a toast here
      const title = notif.notification?.title || "New Notification";
      const body = notif.notification?.body || "New message";
      
      // Example: Show toast
      console.log(`🔔 ${title}: ${body}`);
    });

    // Listen for notification action (when user taps notification)
    PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
      console.log("📲 Notification tapped:", action);
      
      // Navigate to relevant screen based on notification data
      // e.g., navigate to orders page if it's an order notification
    });

  } catch (error) {
    console.error("❌ Error setting up notification listeners:", error.message);
  }
}
```

### Step 3: Call Registration After Login

In your login/authentication component:

```js
import { registerPushNotifications, listenForNotifications } from "../utils/pushNotifications";

// After successful login
async function handleLoginSuccess(response) {
  const { token, store } = response.data;
  
  // Save auth token
  localStorage.setItem("authToken", token);
  
  // Register for push notifications
  await registerPushNotifications(token, store._id);
  
  // Listen for incoming notifications
  await listenForNotifications();
  
  // Navigate to dashboard
  navigate("/dashboard");
}
```

---

## 15. Receiving Notifications in the App

### Foreground (App is open):

```js
PushNotifications.addListener("pushNotificationReceived", (notif) => {
  console.log("Notification received:", notif);
  // Show in-app toast or modal
});
```

### Background (App is minimized):

Android handles automatically:
- ✔ Appears in notification panel
- ✔ Shows title and body
- ✔ Displays small icon + sound

### Killed state:

- ✔ Firebase re-registers app
- ✔ Notification shown in panel
- ✔ Tap notification to open app

---

## 16. Fixing Token Expiry Issue (Offline Mode)

Add to your API interceptor:

```js
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stored data
      localStorage.removeItem("authToken");
      localStorage.removeItem("fcmToken");
      
      // Redirect to login
      navigate("/store-login");
      
      // Show error toast
      toast.error("Session expired. Please login again.");
      
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
```

---

## 17. Sending Notification on New Order

In `backend/controllers/order.controller.js`:

Update the `createOrder` function:

```js
const sendPush = require("../utils/sendPushV1");

module.exports.createOrder = async (req, res) => {
  try {
    // ... existing order creation code ...

    const order = await Order.create({ /* order data */ });
    
    // Get store details
    const store = await Store.findById(order.storeId).select("fcmTokens storeName");

    // Send push notification to all store devices
    if (store.fcmTokens && store.fcmTokens.length > 0) {
      try {
        for (const token of store.fcmTokens) {
          await sendPush(
            token,
            "🍔 New Order Received!",
            `Table ${tableNumber} has placed an order. Amount: ₹${order.totalAmount}`
          );
        }
      } catch (pushError) {
        console.error("Error sending push notification:", pushError.message);
        // Don't fail the order creation if push fails
      }
    }

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};
```

---

## 18. Notification Small Icon Setup (Android)

### Add Icon to Project

1. Create a square icon file (48x48 px PNG)
2. Place it here:

```
android/app/src/main/res/drawable/ic_stat_notify.png
```

### Add to Android Manifest

Edit `android/app/src/main/AndroidManifest.xml`:

Add inside `<application>` tag:

```xml
<meta-data
  android:name="com.google.firebase.messaging.default_notification_icon"
  android:resource="@drawable/ic_stat_notify" />

<meta-data
  android:name="com.google.firebase.messaging.default_notification_color"
  android:resource="@color/notification_color" />
```

---

## 19. Testing Push Notifications

### Prerequisites:

✔ Real Android device (emulator may not support FCM)
✔ App installed via APK or Android Studio
✔ Internet connection active
✔ Device location permissions granted
✔ Notifications enabled in device settings

### Test Steps:

1. **Check Registration Success:**
   - Open app
   - Login to store
   - Check browser console for FCM token
   - Verify token appears in database

2. **Send Test Notification:**
   - Use Postman or curl
   - Call your backend order creation endpoint
   - Or manually trigger `sendPush()` from backend

3. **Verify Receipt:**
   - Check notification panel
   - Verify sound/vibration
   - Tap notification and verify app opens

### Test cURL Command:

```bash
curl -X POST http://localhost:5000/api/order/create \
-H "Content-Type: application/json" \
-d '{
  "storeId": "YOUR_STORE_ID",
  "tableId": "YOUR_TABLE_ID",
  "items": [ /* items data */ ]
}'
```

---

## 20. Final Checklist

Before deploying to production:

✅ Firebase project created
✅ Android app registered
✅ google-services.json placed in `android/app/`
✅ Service account created
✅ Base64 string added to environment variables
✅ Backend using FCM HTTP v1 API
✅ Tokens stored in Store model
✅ Device registration working
✅ App receiving notifications in all states
✅ Push notifications on new order working
✅ Token cleanup on errors implemented
✅ Small icon added to Android
✅ Tested on real device

---

## 🎉 Done — Full Push Notification System Implemented

Your production-level **Push Notification System** is ready!

### Key Features:

- ✔️ Secure service account handling
- ✔️ HTTP v1 FCM API (latest)
- ✔️ Automatic invalid token cleanup
- ✔️ Works in foreground, background, and killed states
- ✔️ Token persistence
- ✔️ Production-ready error handling

### Support:

For issues or questions:
- Check Firebase Cloud Messaging documentation
- Verify all environment variables are set
- Ensure `google-services.json` is in the correct location
- Test with a real device, not an emulator

---

**Perfect for GitHub, documentation, and team handover!** 🚀

---

# 🎨 Splash Screen (Android 12+) – Pink Background Setup

### Capacitor + React + Android Native (Modern Splash API)

This documentation describes the exact steps we implemented to fix the splash screen issue on Android 12+ (API 31+), where:

- Android was always showing the **default system splash**  
- Custom PNG splash was ignored  
- Background was black instead of pink  
- Center icon didn't change  
- Capacitor plugin config did NOT work on Android 12+

This document explains EXACTLY what to do to achieve:

✔ Full pink background  
✔ Default app icon in center  
✔ Working on Android 12, 13, 14+  
✔ No flicker  
✔ No black screen  
✔ 100% native & reliable  

---

## Why Capacitor SplashScreen Plugin Does NOT Work on Android 12+

Android 12 introduced a **mandatory system-controlled splash screen**.

The Capacitor splash plugin's `<item name="android:windowSplashScreenAnimatedIcon">` only works until Android 11.

From Android 12 onward:

### ✔ Android uses system splash  
### ✔ Controlled ONLY through theme (`Theme.SplashScreen`)  
### ❌ Capacitor's plugin config (`androidSplashResourceName`) is ignored  
### ❌ PNG splash cannot stretch full screen unless used as app icon  

Therefore we MUST override the Android theme manually.

---

## Step 1 — Create the Splash Background Color

In:

```
android/app/src/main/res/values/colors.xml
```

Add:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="pink_bg">#E91E63</color>
</resources>
```

This is used by Android system splash API.

---

## Step 2 — Set Android 12+ Splash Theme in styles.xml

Open:

```
android/app/src/main/res/values/styles.xml
```

Replace entire file with:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>

    <!-- Normal app theme -->
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar" />

    <!-- ANDROID 12+ SYSTEM SPLASHSCREEN -->
    <style name="AppTheme.Launch" parent="Theme.SplashScreen">
        <item name="android:windowSplashScreenBackground">@color/pink_bg</item>
        <item name="android:windowSplashScreenAnimatedIcon">@mipmap/ic_launcher</item>
        <item name="postSplashScreenTheme">@style/AppTheme</item>
    </style>

</resources>
```

### What this does:

| Property                         | Meaning                             |
| -------------------------------- | ----------------------------------- |
| `windowSplashScreenBackground`   | Sets splash background → Pink       |
| `windowSplashScreenAnimatedIcon` | Icon in center → App icon           |
| `postSplashScreenTheme`          | Switch to normal theme after splash |

---

## Step 3 — Apply the Splash Theme to MainActivity

Open:

```
android/app/src/main/AndroidManifest.xml
```

Find:

```xml
android:theme="@style/AppTheme"
```

Replace with:

```xml
android:theme="@style/AppTheme.Launch"
```

Example final activity:

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTask"
    android:theme="@style/AppTheme.Launch">

    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>

</activity>
```

---

## Step 4 — Remove Old Capacitor Splash Settings (they are ignored on Android 12)

Delete or ignore these from `capacitor.config.json`:

```json
"androidSplashResourceName": "splash",
"androidScaleType": "CENTER_CROP",
"splashFullScreen": true,
"splashImmersive": true
```

These DO NOT affect Android 12+.

Your splash is now controlled only by:

* `styles.xml`
* `AndroidManifest.xml`
* `colors.xml`

---

## Step 5 — Clean + Rebuild The App (Required)

Run:

```bash
npx cap sync android
cd android
./gradlew clean
```

Then reinstall the app:

```bash
npx cap run android
```

or uninstall from phone → reinstall fresh.

---

## What Did NOT Work (and you should avoid)

❌ Deleting drawable folders
❌ Re-generating splash.png with Capacitor CLI
❌ Using `@capacitor/splash-screen` plugin
❌ Setting `"backgroundColor"` in config
❌ Storing splash in `drawable-land` or `drawable-night`
❌ Relying on PNG splash stretching

Android 12+ forces a **consistent system splash**, not a full custom screen.

Your only control is:

* Background color
* Center icon
* App transition theme

---

## Final Result (Achieved)

After applying all changes:

✔ Full pink background appears instantly
✔ App icon is centered (clean and professional)
✔ No black background
✔ No old splash visible
✔ Works on Android 12, 13, 14+
✔ Behaves exactly how modern apps do (Zomato, Swiggy, BlinkIt, PayTM, etc.)
✔ Stable and future-proof
✔ No dependency on Capacitor plugin

---

## Example Final Files

### colors.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="pink_bg">#E91E63</color>
</resources>
```

### styles.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>

    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar" />

    <style name="AppTheme.Launch" parent="Theme.SplashScreen">
        <item name="android:windowSplashScreenBackground">@color/pink_bg</item>
        <item name="android:windowSplashScreenAnimatedIcon">@mipmap/ic_launcher</item>
        <item name="postSplashScreenTheme">@style/AppTheme</item>
    </style>

</resources>
```

### AndroidManifest.xml (MainActivity)

```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTask"
    android:theme="@style/AppTheme.Launch">

    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>

</activity>
```

---

## Summary Checklist

| Step                                  | Status |
| ------------------------------------- | ------ |
| Created pink background color         | ✅      |
| Set Android 12+ Splash theme          | ✅      |
| Assigned splash theme to MainActivity | ✅      |
| Removed old Capacitor splash features | ✅      |
| Cleaned + rebuilt Gradle              | ✅      |
| Splash working as expected            | ✅      |

---

## 🎉 Done

Your splash screen is now **native**, **stable**, and **Android 12+ compliant**.
