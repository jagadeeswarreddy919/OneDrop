require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendPushNotification } = require('../utils/firebase');

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/onedrop';
    console.log('[Test Notification Script] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('[Test Notification Script] Connected successfully.');

    const users = await User.find({}).select('_id fullName fcmToken role email');
    console.log(`[Test Notification Script] Found ${users.length} total users in DB.`);

    const messageTitle = '📢 Admin System Test Notification';
    const messageBody = '👋 Hello from ONEDROP Admin! Test notification verified across DB, Push, and Sidebar Notification section.';

    const notificationDocs = users.map(u => ({
      recipient: u._id,
      type: 'admin_broadcast',
      message: `${messageTitle}: ${messageBody}`,
      read: false,
      createdAt: new Date()
    }));

    if (notificationDocs.length > 0) {
      await Notification.insertMany(notificationDocs);
      console.log(`[Test Notification Script] Created ${notificationDocs.length} notification documents in DB.`);
    }

    let fcmSentCount = 0;
    const sentFcmTokens = new Set();

    for (const u of users) {
      if (u.fcmToken && !sentFcmTokens.has(u.fcmToken)) {
        sentFcmTokens.add(u.fcmToken);
        try {
          const res = await sendPushNotification(u.fcmToken, {
            title: messageTitle,
            body: messageBody,
            tag: 'onedrop-admin-test',
            data: {
              type: 'admin_broadcast',
              title: messageTitle,
              message: messageBody
            }
          });
          if (res && res.success) {
            fcmSentCount++;
            console.log(`[Test Notification Script] FCM push delivered to ${u.fullName} (${u.email})`);
          }
        } catch (fcmErr) {
          console.error(`[Test Notification Script] FCM error for ${u.fullName}:`, fcmErr.message);
        }
      }
    }

    console.log(`[Test Notification Script] Summary: Sent ${notificationDocs.length} DB notifications and ${fcmSentCount} FCM push notifications.`);
    process.exit(0);
  } catch (err) {
    console.error('[Test Notification Script] Fatal Error:', err);
    process.exit(1);
  }
};

run();
