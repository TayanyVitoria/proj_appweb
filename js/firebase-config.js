// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// SUA CONFIG DO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDyHnTPbjTBMyofMLzRBaJSy0PpTlqbPF8",
  authDomain: "app-webtay.firebaseapp.com",
  projectId: "app-webtay",
  storageBucket: "app-webtay.firebasestorage.app",
  messagingSenderId: "183926690103",
  appId: "1:183926690103:web:44e9eef5241edad8878ab2"
};

// Inicializa o app corretamente
const app = initializeApp(firebaseConfig);
console.log("Firebase inicializado com sucesso!");

// Exporta corretamente (ESSENCIAL!)
export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };
