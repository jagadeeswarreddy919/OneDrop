const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
const webpush = require('web-push');

let messaging = null;

// Configure VAPID for Web Push Notifications (Mobile status bar delivery)
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BPc2F7ZFdeZzgc37MGS70XAmwRIj9WUDcpGAgCEexk05blYrae9gTIgTf5pkuzGuzS0AM9WnSFd-t-lVAc-ye_o';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'JBQA0CwG4MfoGkI2FZXXvuSaNVCsmPTblxbQMm_AjZ4';
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:onedroplifesaver@gmail.com';

try {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  console.log('[WebPush VAPID] Web Push Service initialized with VAPID credentials.');
} catch (err) {
  console.warn('[WebPush VAPID] VAPID initialization notice:', err.message);
}

try {
  // Path to the service account credentials JSON
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, '../../config/firebase-service-account.json');

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    messaging = admin.messaging();
    console.log('[Firebase Push] Admin SDK initialized successfully.');
  } else {
    console.warn('[Firebase Push] Service Account JSON not found. WebPush VAPID active for PWA mobile push notifications.');
  }
} catch (error) {
  console.error('[Firebase Push] Initialization notice:', error.message);
}

/**
 * Verifies a Firebase ID token sent from the client.
 * If Firebase Admin SDK is not initialized, supports a developer fallback.
 * @param {string} idToken - The Firebase ID token to verify
 */
const verifyFirebaseIdToken = async (idToken) => {
  if (!idToken) {
    throw new Error('No ID token provided');
  }

  // Developer mock token extraction
  if (idToken.startsWith('mock_firebase_token:')) {
    try {
      const jsonStr = idToken.slice('mock_firebase_token:'.length);
      const payload = JSON.parse(jsonStr);
      console.log('[Firebase Auth Mock] Decoded mock token:', payload);
      return payload;
    } catch (e) {
      throw new Error('Invalid mock token format');
    }
  }

  const isFirebaseInitialized = admin.apps.length > 0;
  if (isFirebaseInitialized) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      // Map Firebase claims to unified claims
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        email_verified: decodedToken.email_verified || false,
        name: decodedToken.name || ''
      };
    } catch (error) {
      console.error('[Firebase Auth] Real token verification failed:', error.message);
      throw error;
    }
  } else {
    console.warn('[Firebase Auth] Admin SDK not initialized. Applying development fallback decoding.');
    try {
      const parts = idToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        return {
          uid: payload.user_id || payload.sub || 'mock_uid_123',
          email: payload.email || 'mock@example.com',
          email_verified: payload.email_verified ?? true,
          name: payload.name || 'Mock User'
        };
      }
    } catch (e) {
      // Ignore parsing errors
    }

    return {
      uid: 'mock_uid_dev_' + Math.random().toString(36).slice(-6),
      email: 'mock_developer@onedrop.org',
      email_verified: true,
      name: 'Developer Mock'
    };
  }
};

/**
 * Sends a real-time push notification via Web Push VAPID or FCM
 * @param {string|object} token - FCM Device Token or WebPush Subscription Object/JSON string
 * @param {object} payload - Notification data containing title, body, and meta
 */
const sendPushNotification = async (token, payload) => {
  if (!token) return { success: false, reason: 'No push token or subscription provided.' };

  // 1. Handle WebPush Subscription Object or JSON string from Mobile PWA
  let subscription = null;
  if (typeof token === 'object' && token.endpoint) {
    subscription = token;
  } else if (typeof token === 'string' && token.startsWith('{') && token.includes('endpoint')) {
    try {
      subscription = JSON.parse(token);
    } catch (e) {}
  }

  if (subscription && subscription.endpoint) {
    try {
      const pushPayload = JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: '/be_a_hero.png',
        badge: '/be_a_hero.png',
        tag: payload.tag || payload.data?.type || 'onedrop-push',
        data: payload.data || {}
      });

      await webpush.sendNotification(subscription, pushPayload);
      console.log(`[WebPush Gateway] Successfully sent mobile status bar alert to ${subscription.endpoint.slice(0, 45)}...`);
      return { success: true, gateway: 'WebPush' };
    } catch (err) {
      console.error('[WebPush Gateway] Mobile push failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  // 2. Handle Firebase Admin FCM Token if initialized
  if (messaging) {
    const message = {
      token,
      notification: {
        title: payload.title,
        body: payload.body
      },
      data: payload.data || {},
      webpush: {
        notification: {
          title: payload.title,
          body: payload.body,
          icon: '/be_a_hero.png',
          badge: '/be_a_hero.png',
          vibrate: [300, 100, 300, 100, 300],
          requireInteraction: true,
          tag: payload.tag || payload.data?.tag || payload.data?.type || 'onedrop-push'
        }
      }
    };
    try {
      const response = await messaging.send(message);
      console.log('[Firebase Push] Notification sent successfully:', response);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('[Firebase Push] Error sending FCM message:', error.message);
      return { success: false, error: error.message };
    }
  }

  console.log(`[Push Notification Dispatch Log] Token: ${typeof token === 'string' ? token.slice(0, 30) : 'Sub'} | Title: ${payload.title} | Body: ${payload.body}`);
  return { success: true, mocked: true };
};

module.exports = { 
  admin, 
  verifyFirebaseIdToken, 
  sendPushNotification 
};
