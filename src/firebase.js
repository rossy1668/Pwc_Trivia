import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

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
export const storage = getStorage(app);
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

export async function uploadDenunciaFiles(denunciaId, files) {
  const uploadedFiles = [];

  for (const file of files) {
    const fileRef = storageRef(storage, `denuncias/${denunciaId}/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    uploadedFiles.push({ name: file.name, url });
  }

  return uploadedFiles;
}

export async function submitDenuncia(denunciaData, id = null) {
  const denunciaRef = id ? doc(db, 'denuncias', id) : doc(collection(db, 'denuncias'));

  await setDoc(denunciaRef, {
    ...denunciaData,
    usuario: auth.currentUser
      ? {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email || '',
          nombre: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || ''
        }
      : null,
    fecha: serverTimestamp()
  });

  return denunciaRef.id;
}

export async function fetchDenunciasByEmail(email) {
  if (!email) return [];

  const denunciasRef = collection(db, 'denuncias');
  const denunciasQuery = query(denunciasRef, where('usuario.email', '==', email));
  const querySnapshot = await getDocs(denunciasQuery);

  return querySnapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data()
  }));
}

export async function fetchAllDenuncias() {
  const denunciasRef = collection(db, 'denuncias');
  const querySnapshot = await getDocs(denunciasRef);

  return querySnapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data()
  }));
}
