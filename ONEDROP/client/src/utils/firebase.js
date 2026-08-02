import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { API_URL } from './api';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'onedrop-c83e7.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'onedrop-c83e7',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'onedrop-c83e7.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

let messagingInstance = null;
let authInstance = null;

// Initialize Firebase App
const getFirebaseApp = () => {
  const apps = getApps();
  if (apps.length) return apps[0];
  if (firebaseConfig.apiKey) {
    return initializeApp(firebaseConfig);
  }
  return null;
};

// Initialize Auth
export const getAuthInstance = () => {
  if (authInstance) return authInstance;
  const app = getFirebaseApp();
  if (app) {
    authInstance = getAuth(app);
    return authInstance;
  }
  return null;
};

// Check if Real Firebase is configured
const isRealFirebase = () => {
  return !!firebaseConfig.apiKey;
};

/* ==========================================================================
   FIREBASE AUTHENTICATION WRAPPERS (With Dev Mock Fallbacks)
   ========================================================================== */

export const firebaseSignInWithEmail = async (email, password) => {
  if (isRealFirebase()) {
    const auth = getAuthInstance();
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await credentials.user.getIdToken();
    return { idToken, user: credentials.user };
  } else {
    console.log('[Mock Firebase Auth] Sign in with email:', email);
    const mockUid = `mock_uid_${email.replace(/[^a-zA-Z0-9]/g, '')}`;
    const idToken = `mock_firebase_token:{"uid":"${mockUid}","email":"${email}","email_verified":true,"name":"Mock Developer"}`;
    return { idToken, user: { email, emailVerified: true, uid: mockUid } };
  }
};

export const firebaseCreateUserWithEmail = async (email, password) => {
  if (isRealFirebase()) {
    const auth = getAuthInstance();
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await credentials.user.getIdToken();
    return { idToken, user: credentials.user };
  } else {
    console.log('[Mock Firebase Auth] Create user with email:', email);
    const mockUid = `mock_uid_${email.replace(/[^a-zA-Z0-9]/g, '')}`;
    const idToken = `mock_firebase_token:{"uid":"${mockUid}","email":"${email}","email_verified":false,"name":"Mock Developer"}`;
    return { idToken, user: { email, emailVerified: false, uid: mockUid } };
  }
};

export const firebaseSignInWithGoogle = async () => {
  if (isRealFirebase()) {
    const auth = getAuthInstance();
    const provider = new GoogleAuthProvider();
    const credentials = await signInWithPopup(auth, provider);
    const idToken = await credentials.user.getIdToken();
    return { idToken, user: credentials.user };
  } else {
    console.log('[Mock Firebase Auth] Sign in with Google popup');
    const email = 'google_mock@onedrop.org';
    const mockUid = 'mock_uid_google_999';
    const idToken = `mock_firebase_token:{"uid":"${mockUid}","email":"${email}","email_verified":true,"name":"Google Mock User"}`;
    return { idToken, user: { email, emailVerified: true, uid: mockUid } };
  }
};

export const firebaseSendPasswordReset = async (email) => {
  if (isRealFirebase()) {
    const auth = getAuthInstance();
    await sendPasswordResetEmail(auth, email);
  } else {
    console.log('[Mock Firebase Auth] Dispatched password reset email to:', email);
    try {
      const response = await fetch(`${API_URL}/api/auth/mock-forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to dispatch recovery email.');
      }
    } catch (error) {
      console.error('[Mock Firebase Auth] Reset email error:', error.message);
      throw error;
    }
  }
};

export const firebaseSendEmailVerification = async (email) => {
  if (isRealFirebase()) {
    const auth = getAuthInstance();
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  } else {
    console.log('[Mock Firebase Auth] Dispatched email verification link to:', email);
    if (!email) {
      console.warn('[Mock Firebase Auth] No email provided to send verification link.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/auth/mock-send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to dispatch verification email.');
      }
    } catch (error) {
      console.error('[Mock Firebase Auth] Verification email error:', error.message);
      throw error;
    }
  }
};

export const firebaseVerifyEmailOTP = async (email, otp) => {
  console.log('[Mock Firebase Auth] Verifying email OTP code:', otp);
  const response = await fetch(`${API_URL}/api/auth/mock-verify-email-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, otp })
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || 'Verification code is invalid or has expired.');
  }
  return await response.json();
};


export const firebaseGetCurrentUserToken = async (forceRefresh = false) => {
  if (isRealFirebase()) {
    const auth = getAuthInstance();
    if (auth.currentUser) {
      if (forceRefresh) {
        await auth.currentUser.reload();
      }
      return await auth.currentUser.getIdToken(forceRefresh);
    }
    return null;
  } else {
    // If not verified yet in mock, simulate verification on force refresh!
    return `mock_firebase_token:{"uid":"mock_uid_dev_123","email":"mock_developer@onedrop.org","email_verified":true,"name":"Developer Mock"}`;
  }
};

export const firebaseSignOut = async () => {
  if (isRealFirebase()) {
    const auth = getAuthInstance();
    await signOut(auth);
  } else {
    console.log('[Mock Firebase Auth] Signed out.');
  }
};

export const firebaseIsEmailVerified = () => {
  if (isRealFirebase()) {
    const auth = getAuthInstance();
    return auth.currentUser ? auth.currentUser.emailVerified : false;
  }
  return true;
};

/* ==========================================================================
   PUSH NOTIFICATIONS SETUP (FCM)
   ========================================================================== */

const registerMessagingServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return null;
  try {
    if (navigator.serviceWorker.controller) {
      return await navigator.serviceWorker.ready;
    }
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  } catch (err) {
    console.warn('[FCM] Messaging SW registration failed:', err.message);
    return null;
  }
};

const getMessagingInstance = async () => {
  if (messagingInstance) return messagingInstance;
  const supported = await isSupported();
  if (!supported || !firebaseConfig.apiKey) return null;

  const app = getFirebaseApp();
  if (app) {
    messagingInstance = getMessaging(app);
    return messagingInstance;
  }
  return null;
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const requestFcmToken = async () => {
  try {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('[PWA Push] Push notifications not supported in this browser.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[PWA Push] Notification permission denied by user.');
      return null;
    }

    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || VAPID_KEY || 'BPc2F7ZFdeZzgc37MGS70XAmwRIj9WUDcpGAgCEexk05blYrae9gTIgTf5pkuzGuzS0AM9WnSFd-t-lVAc-ye_o';

    // 1. Try native W3C WebPush Subscription on active PWA Service Worker
    try {
      const swReg = await navigator.serviceWorker.ready;
      if (swReg && 'pushManager' in swReg) {
        let sub = await swReg.pushManager.getSubscription();
        if (!sub) {
          sub = await swReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
          });
        }
        if (sub) {
          const subJsonStr = JSON.stringify(sub);
          console.log('[PWA Push] Mobile status bar push subscription generated successfully!');
          return subJsonStr;
        }
      }
    } catch (webPushErr) {
      console.warn('[PWA Push] Native WebPush subscription error, trying FCM fallback:', webPushErr.message);
    }

    // 2. Fallback to Firebase Messaging SDK if configured
    const messaging = await getMessagingInstance();
    if (messaging) {
      const swRegistration = await registerMessagingServiceWorker();
      const token = await getToken(messaging, {
        vapidKey: vapidPublicKey,
        serviceWorkerRegistration: swRegistration
      });
      if (token) {
        console.log('[FCM] Device token registered via FCM SDK.');
        return token;
      }
    }

    return null;
  } catch (error) {
    console.error('[PWA Push] Token error:', error.message);
    return null;
  }
};

export const listenForForegroundMessages = async (callback) => {
  const messaging = await getMessagingInstance();
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
};

export const saveFcmTokenToServer = async (token, authToken) => {
  if (!token || !authToken) return;
  await fetch(`${API_URL}/api/auth/fcm-token`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    },
    body: JSON.stringify({ fcmToken: token })
  });
};
