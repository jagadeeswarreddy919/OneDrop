const cron = require('node-cron');
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const Notification = require('../models/Notification');
const { sendPushNotification } = require('../utils/firebase');
const { broadcastToUsers } = require('../config/socket');

/**
 * Send 5-Hour Blood Request Check Notification to all active users.
 */
const sendBloodRequestCheckNotification = async () => {
  try {
    console.log('[NotificationScheduler] Running 5-hour blood request check notification...');
    
    // Count pending blood requests
    const activeRequestsCount = await BloodRequest.countDocuments({ status: 'Pending' });
    
    // Find all registered users (including unavailable or busy users)
    const users = await User.find({}, '_id fullName fcmToken phone');
    if (!users || users.length === 0) {
      console.log('[NotificationScheduler] No users found to dispatch blood request reminders.');
      return { success: true, count: 0 };
    }

    let messageTitle = 'ONEDROP Reminder 🩸';
    let messageBody = 'Open the app to check for new blood requests and keep your donation availability updated. Save a life today!';
    
    if (activeRequestsCount > 0) {
      messageTitle = '🚨 Blood Requests Available!';
      messageBody = `There are ${activeRequestsCount} active blood request(s) awaiting heroes. Open ONEDROP now to see if you can help!`;
    }

    const notificationDocs = [];
    const userIdsToNotify = [];

    for (const user of users) {
      userIdsToNotify.push(user._id);
      notificationDocs.push({
        recipient: user._id,
        type: 'general_announcement',
        message: messageBody,
        read: false,
        createdAt: new Date()
      });

      // Send FCM push notification if token exists
      if (user.fcmToken) {
        sendPushNotification(user.fcmToken, {
          title: messageTitle,
          body: messageBody,
          data: {
            type: 'blood_request_reminder',
            activeRequestsCount: activeRequestsCount.toString()
          }
        }).catch(err => console.error(`[NotificationScheduler] FCM push error for user ${user._id}:`, err.message));
      }
    }

    // Batch insert notifications in MongoDB
    if (notificationDocs.length > 0) {
      await Notification.insertMany(notificationDocs);
      console.log(`[NotificationScheduler] Inserted ${notificationDocs.length} blood request check notifications into DB.`);
    }

    // Broadcast socket alert to connected users so frontend auto-refreshes feed
    broadcastToUsers(userIdsToNotify, 'new_notification', {
      type: 'general_announcement',
      message: messageBody,
      title: messageTitle,
      createdAt: new Date()
    });

    return { success: true, count: notificationDocs.length, activeRequestsCount };
  } catch (error) {
    console.error('[NotificationScheduler Error - Blood Request Check]:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send Time-Based Greeting Notification (Morning, Afternoon, Evening)
 * @param {'morning' | 'afternoon' | 'evening'} slot
 */
const sendGreetingNotification = async (slot) => {
  try {
    const validSlots = ['morning', 'afternoon', 'evening'];
    const greetingSlot = validSlots.includes(slot) ? slot : 'morning';

    console.log(`[NotificationScheduler] Dispatching ${greetingSlot.toUpperCase()} greeting notification...`);
    
    const users = await User.find({}, '_id fullName fcmToken');
    if (!users || users.length === 0) {
      console.log('[NotificationScheduler] No users found for greeting dispatch.');
      return { success: true, count: 0 };
    }

    const notificationDocs = [];
    const userIdsToNotify = [];

    for (const user of users) {
      const firstName = user.fullName ? user.fullName.split(' ')[0] : 'Lifesaver';
      let title = '';
      let message = '';

      if (greetingSlot === 'morning') {
        title = 'Good Morning! 🌅 Welcome to ONEDROP';
        message = `Good Morning, ${firstName}! 🌅 Welcome to ONEDROP — your active blood donor bridge. Explore active blood requests and verify your donor availability today!`;
      } else if (greetingSlot === 'afternoon') {
        title = 'Good Afternoon! ☀️ ONEDROP Community Update';
        message = `Good Afternoon, ${firstName}! ☀️ Stay updated with ONEDROP. Check certified blood bank inventories and active patient requests in your state.`;
      } else {
        title = 'Good Evening! 🌙 ONEDROP Evening Review';
        message = `Good Evening, ${firstName}! 🌙 Thank you for supporting the ONEDROP lifesaver network. Review local blood storage levels and emergency requests tonight.`;
      }

      userIdsToNotify.push(user._id);
      notificationDocs.push({
        recipient: user._id,
        type: 'greeting',
        message: message,
        read: false,
        createdAt: new Date()
      });

      // Send FCM push notification if token exists
      if (user.fcmToken) {
        sendPushNotification(user.fcmToken, {
          title,
          body: message,
          data: {
            type: 'greeting',
            slot: greetingSlot
          }
        }).catch(err => console.error(`[NotificationScheduler] Greeting FCM error for user ${user._id}:`, err.message));
      }
    }

    // Insert into DB
    if (notificationDocs.length > 0) {
      await Notification.insertMany(notificationDocs);
      console.log(`[NotificationScheduler] Inserted ${notificationDocs.length} ${greetingSlot} greeting notifications into DB.`);
    }

    // Broadcast socket alert to online sockets
    broadcastToUsers(userIdsToNotify, 'new_notification', {
      type: 'greeting',
      slot: greetingSlot,
      createdAt: new Date()
    });

    return { success: true, count: notificationDocs.length, slot: greetingSlot };
  } catch (error) {
    console.error(`[NotificationScheduler Error - ${slot} Greeting]:`, error.message);
    return { success: false, error: error.message };
  }
};

const Message = require('../models/Message');

/**
 * Purge chat messages older than 30 days to enforce 30-day chat retention policy.
 */
const purgeOldChatMessages = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await Message.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
    if (result.deletedCount > 0) {
      console.log(`[NotificationScheduler] Purged ${result.deletedCount} chat messages older than 30 days.`);
    }
  } catch (error) {
    console.error('[NotificationScheduler Error - 30-Day Chat Cleanup]:', error.message);
  }
};

/**
 * Initialize all cron jobs and initial interval triggers
 */
const initNotificationScheduler = () => {
  console.log('[NotificationScheduler] Initializing background notification schedules...');

  // 1. Cron schedule for 5-hour blood request check notification: every 5 hours (at minute 0 of hours 0,5,10,15,20)
  cron.schedule('0 */5 * * *', () => {
    console.log('[NotificationScheduler Cron] 5-hour blood request check triggered.');
    sendBloodRequestCheckNotification();
  });

  // 2. Cron schedule for Morning Greeting (08:00 AM)
  cron.schedule('0 8 * * *', () => {
    console.log('[NotificationScheduler Cron] Morning greeting triggered at 08:00 AM.');
    sendGreetingNotification('morning');
  });

  // 3. Cron schedule for Afternoon Greeting (01:00 PM / 13:00)
  cron.schedule('0 13 * * *', () => {
    console.log('[NotificationScheduler Cron] Afternoon greeting triggered at 01:00 PM.');
    sendGreetingNotification('afternoon');
  });

  // 4. Cron schedule for Evening Greeting (07:00 PM / 19:00)
  cron.schedule('0 19 * * *', () => {
    console.log('[NotificationScheduler Cron] Evening greeting triggered at 07:00 PM.');
    sendGreetingNotification('evening');
  });

  // 5. Cron schedule for 30-Day Chat Message Retention Cleanup (02:00 AM daily)
  cron.schedule('0 2 * * *', () => {
    console.log('[NotificationScheduler Cron] Executing daily 30-day chat retention cleanup...');
    purgeOldChatMessages();
  });

  // Execute initial 30-day cleanup 30 seconds after server startup
  setTimeout(purgeOldChatMessages, 30 * 1000);

  console.log('[NotificationScheduler] Cron schedules registered successfully:');
  console.log('  - Blood Request Check: Every 5 Hours (0 */5 * * *)');
  console.log('  - Morning Greeting:    08:00 AM Daily (0 8 * * *)');
  console.log('  - Afternoon Greeting:  01:00 PM Daily (0 13 * * *)');
  console.log('  - Evening Greeting:    07:00 PM Daily (0 19 * * *)');
  console.log('  - 30-Day Chat Cleanup: 02:00 AM Daily (0 2 * * *)');
};

module.exports = {
  initNotificationScheduler,
  sendBloodRequestCheckNotification,
  sendGreetingNotification,
  purgeOldChatMessages
};

