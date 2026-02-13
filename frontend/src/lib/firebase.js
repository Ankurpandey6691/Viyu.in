// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check for missing config to provide helpful errors
const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

let app;
let auth = null;
let googleProvider = null;
let facebookProvider = null;

if (missingKeys.length > 0) {
  console.warn(
    `%c🔥 Firebase Error: Missing configuration keys: ${missingKeys.join(', ')}.\n` +
    `Make sure you have created a .env file with your Firebase credentials.`,
    'font-weight: bold; font-size: 14px; color: #ff4d4f;'
  );
} else {
  // Initialize Firebase ONLY if keys are present
  try {
    console.log("🔥 Initializing Firebase with:", {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      apiKey: firebaseConfig.apiKey ? "..." + firebaseConfig.apiKey.slice(-4) : "MISSING"
    });
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    facebookProvider = new FacebookAuthProvider();
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
  }
}

export { auth, googleProvider, facebookProvider };
