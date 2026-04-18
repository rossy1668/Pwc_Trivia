import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";
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

export async function signUpWithEmail(email, password, displayName = '') {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && credential.user) {
    await updateProfile(credential.user, { displayName });
  }
  return credential;
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
  const maxSize = 50 * 1024 * 1024; // 50MB por archivo
  const uploadTimeout = 60000; // 60 segundos timeout

  for (const file of files) {
    // Validar tamaño
    if (file.size > maxSize) {
      throw new Error(`Archivo "${file.name}" demasiado grande. Máximo 50MB.`);
    }

    // Validar tipo de archivo
    const validTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed'
    ];

    if (!validTypes.includes(file.type) && !file.type.startsWith('image/')) {
      console.warn(`Tipo de archivo ${file.type} puede no ser soportado, intentando subir...`);
    }

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const fileRef = storageRef(storage, `denuncias/${denunciaId}/${fileName}`);

      // Crear una promesa con timeout
      const uploadPromise = uploadBytes(fileRef, file, {
        contentType: file.type || 'application/octet-stream'
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout al subir archivo. Intenta con un archivo más pequeño.')), uploadTimeout)
      );

      // Competir entre el upload y el timeout
      await Promise.race([uploadPromise, timeoutPromise]);

      // Obtener URL de descarga
      const url = await getDownloadURL(fileRef);
      uploadedFiles.push({ name: file.name, url });

      console.log(`Archivo ${file.name} subido exitosamente`);
    } catch (fileError) {
      console.error(`Error subiendo ${file.name}:`, fileError);
      throw new Error(`No se pudo subir "${file.name}": ${fileError.message}`);
    }
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
