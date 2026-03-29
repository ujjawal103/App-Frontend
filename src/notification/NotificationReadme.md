# 🔔 Custom Notification System (React + Tailwind)

A lightweight, customizable notification system inspired by modern UI patterns (similar to toast/snackbar systems), built using **React** and **Tailwind CSS** — without any external notification libraries.

---

## 🚀 Features

* ✅ Multiple notifications (stack support)
* ✅ Flexible positioning (top/bottom, left/right/center)
* ✅ Clean floating card UI (modern design)
* ✅ Auto-dismiss with configurable duration
* ✅ Manual close option
* ✅ Type-based styling (success, error, warning, info)
* ✅ Smooth animations (slide up/down)
* ✅ Minimal & reusable API (`toast.success()`, etc.)
* ✅ Fully customizable

---

## 📁 Installation

No external library required (except icons if using `lucide-react`).

```bash
npm install lucide-react
```

---

## ⚙️ Setup

### 1. Add the `Notifications` Component

Place `Notifications.jsx` in your project.

### 2. Add Component to Root

```jsx
import Notifications from "./Notifications";

function App() {
  return (
    <>
      <Notifications position="top-center" />
      {/* Rest of your app */}
    </>
  );
}
```

---

## 🎯 Usage

Import the toast object anywhere:

```js
import { toast } from "./Notifications";
```

### Show Notifications

```js
toast.success("Order placed successfully!");
toast.error("Vendor not found");
toast.warning("Low stock");
toast.info("New update available");
```

---

## 📍 Positioning

You can control where notifications appear (like `<Toaster />`):

```jsx
<Notifications position="top-center" />
```

### Available Positions

| Position      | Description           |
| ------------- | --------------------- |
| top-center    | Default, centered top |
| top-right     | Top right corner      |
| top-left      | Top left corner       |
| bottom-center | Centered bottom       |
| bottom-right  | Bottom right corner   |
| bottom-left   | Bottom left corner    |

---

## 🎨 UI Design

* Rounded rectangular cards (`rounded-xl`)
* Minimum height for consistency (`min-h-[56px]`)
* Small message text (`text-xs`)
* Left colored border (type-based)
* Shadow for elevation (`shadow-lg`)

---

## 🎬 Animations

Add the following to your global CSS:

```css
@keyframes slideDown {
  from {
    transform: translateY(-120%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(120%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease;
}

.animate-slideUp {
  animation: slideUp 0.3s ease;
}
```

---

## 🧠 Behavior

* Notifications stack vertically
* Auto-dismiss after duration (default: 3000ms)
* New notifications do NOT replace old ones
* Manual close button available

---

## 🔧 API Reference

### `toast.success(message, duration?)`

Show success notification

### `toast.error(message, duration?)`

Show error notification

### `toast.warning(message, duration?)`

Show warning notification

### `toast.info(message, duration?)`

Show info notification

#### Parameters

| Param    | Type   | Default  |
| -------- | ------ | -------- |
| message  | string | required |
| duration | number | 3000 ms  |

---

## 🧪 Example

```js
toast.success("Payment completed!", 4000);
toast.error("Something went wrong", 5000);
```

---

## 🧱 Customization

### Change Colors

Edit border styles:

```js
border-l-4 border-green-500
border-l-4 border-red-500
```

---

### Change Size

```js
text-xs        → smaller text  
text-sm        → slightly bigger  
min-h-[56px]   → adjust height  
```

---

### Limit Notifications

Add manually:

```js
setNotifications(prev => [...prev.slice(-2), newNotification]);
```

(Shows max 3 notifications)

---

## 💡 Best Practices

* Use **top-center** for important messages
* Use **bottom positions** for subtle updates
* Keep messages short & clear
* Avoid too many notifications at once

---

## 🚀 Future Improvements

* ⏳ Progress bar timer
* ✋ Swipe to dismiss (mobile UX)
* ⏸ Pause on hover
* 🔊 Sound feedback
* 🎨 Theme support (dark mode)

---

## 📌 Summary

This system gives you:

* Full control over UI & behavior
* No dependency overhead
* Modern production-ready UX

Perfect for apps like dashboards, food delivery, or SaaS platforms.

---

## ❤️ Credits

Built with React + Tailwind
Inspired by modern notification systems (toast/snackbar patterns)

---
