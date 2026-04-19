import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// -- Config Firebase --
const firebaseConfig = {
  apiKey: "AIzaSyCmKuHHsxJRss0n7J4z5SxEgof2Syabuog",
  authDomain: "triviapwc.firebaseapp.com",
  projectId: "triviapwc",
  storageBucket: "triviapwc.firebasestorage.app",
  messagingSenderId: "588221102437",
  appId: "1:588221102437:web:776bd6ae86d3f2aa8ac98c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let userId = null;

// Verifica si el usuario está autenticado
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  userId = user.uid;
  document.getElementById('loading').style.display = 'none';
  window.iniciarTrivia?.();
});

window.guardarEnFirebase = async function(puntaje, total) {
  if (!userId) return;
  try {
    const docRef = doc(db, "resultados_trivia", `${userId}-${Date.now()}`);
    await setDoc(docRef, {
      uid: userId,
      email: auth.currentUser?.email || '',
      puntaje,
      total,
      porcentaje: Math.round((puntaje / total) * 100),
      fecha: serverTimestamp()
    });
    console.log("✅ Resultado guardado en Firebase");
  } catch (e) {
    console.error("Error guardando:", e);
  }
};
