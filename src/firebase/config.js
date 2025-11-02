import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvqXFvGOtPOwugO3Q59FOiIAfmvF4sv38",
  authDomain: "imagetoolspro-e8af5.firebaseapp.com",
  projectId: "imagetoolspro-e8af5",
  storageBucket: "imagetoolspro-e8af5.firebasestorage.app",
  messagingSenderId: "517014077079",
  appId: "1:517014077079:web:c22536540865f49c1ff3d2",
  databaseURL: "https://imagetoolspro-e8af5-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

