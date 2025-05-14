// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Sua configuração do Firebase (pegue isso do console do Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyAQS99BpVQFtI7c33vgHuZuN5PCzSvynaE",
  authDomain: "clinica-estetica-admin.firebaseapp.com",
  projectId: "clinica-estetica-admin",
  storageBucket: "clinica-estetica-admin.firebasestorage.app",
  messagingSenderId: "202222494297",
  appId: "1:202222494297:web:574aff6d23ea8d6f93c748",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
