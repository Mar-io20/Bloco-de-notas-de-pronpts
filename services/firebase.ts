import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPjkYtvTA_C7LdtOZp6VbdzQPcuBvbAQc",
  authDomain: "bloco-de-notas-bddbb.firebaseapp.com",
  projectId: "bloco-de-notas-bddbb",
  storageBucket: "bloco-de-notas-bddbb.firebasestorage.app",
  messagingSenderId: "495567727300",
  appId: "1:495567727300:web:997590dca8b143ab757791"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Habilitar persistência offline
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn("Persistência falhou: Múltiplas abas abertas.");
  } else if (err.code == 'unimplemented') {
    console.warn("Persistência não suportada neste navegador.");
  }
});

const storage = getStorage(app);

export { db, storage, auth };