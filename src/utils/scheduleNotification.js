import { LocalNotifications } from "@capacitor/local-notifications";

export async function scheduleDailyMorningNotification() {
  // Step 1: Permission
  const perm = await LocalNotifications.requestPermissions();
  if (perm.display !== "granted") return;

  // Step 2: Daily notification schedule
  await LocalNotifications.schedule({
    notifications: [
      {
        id: 1,
        title: "Hey Boss",
        body: "update your menu items for today",
        smallIcon: "ic_stat_notify",
        // iconColor: "#E91E63",
        largeIcon: "ic_stat_notify",
        sound: "ping.aiff",
        largeIcon: "ic_stat_notify_large",
        sound: "ping.aiff",
        schedule: {
          repeats: true,
          every: "day",
          at: new Date(new Date().setHours(9, 0, 0, 0)), // daily 9:00 AM
        },
      },
    ],
  });

  console.log("Daily 9AM reminder scheduled");


  // Test notification after 3 seconds
//   await LocalNotifications.schedule({
//   notifications: [{
//     id: 1,
//     title: "Test",
//     body: "Testing local notification",
//     smallIcon: "ic_stat_notify",
//     iconColor: "#488AFF",
//     largeIcon: "ic_stat_notify",
//     sound: "ping.aiff",
//     schedule: { at: new Date(Date.now() + 3000) },
//   }]
// });

}


