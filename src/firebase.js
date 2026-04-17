import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmKuHHsxJRss0n7J4z5SxEgof2Syabuog",
  authDomain: "triviapwc.firebaseapp.com",
  projectId: "triviapwc",
  storageBucket: "triviapwc.firebasestorage.app",
  messagingSenderId: "588221102437",
  appId: "1:588221102437:web:776bd6ae86d3f2aa8ac98c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  return signOut(auth);
}

export async function saveTriviaResult(score, total) {
  if (!auth.currentUser) {
    throw new Error('Debes iniciar sesión para guardar el resultado.');
  }

  const resultRef = doc(collection(db, 'resultados_trivia'));
  await setDoc(resultRef, {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email || '',
    puntaje: score,
    total,
    porcentaje: Math.round((score / total) * 100),
    fecha: serverTimestamp()
  });
}

export async function submitDenuncia(denunciaData) {
  const denunciaRef = doc(collection(db, 'denuncias'));
  await setDoc(denunciaRef, {
    ...denunciaData,
    usuario: auth.currentUser ? {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email || ''
    } : null,
    fecha: serverTimestamp()
  });
}
