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
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmKuHHsxJRss0n7J4z5SxEgof2Syabuog",
  authDomain: "triviapwc.firebaseapp.com",
  projectId: "triviapwc",
  storageBucket: "triviapwc.firebasestorage.app",
  messagingSenderId: "588221102437",
  appId: "1:588221102437:web:776bd6ae86d3f2aa8ac98c"
};

// Inicialización
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// --- AUTH FUNCTIONS ---

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

// --- TRIVIA FUNCTIONS ---

export async function saveTriviaResult(score, total, answers = null) {
  if (!auth.currentUser) {
    throw new Error('Debes iniciar sesión para guardar el resultado.');
  }

  const resultRef = doc(collection(db, 'resultados_trivia'));
  await setDoc(resultRef, {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email || '',
    nombre: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || '',
    puntaje: score,
    total,
    porcentaje: Math.round((score / total) * 100),
    respuestas: answers,
    fecha: serverTimestamp()
  });

  return resultRef.id;
}

export async function getTriviaStatistics() {
  const resultadosRef = collection(db, 'resultados_trivia');
  const querySnapshot = await getDocs(resultadosRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// --- HELPER: COMPRESIÓN DE IMÁGENES ---

async function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.6) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', quality);
    };
    img.src = URL.createObjectURL(file);
  });
}

// --- CLOUDINARY UPLOAD ---

async function uploadToCloudinary(file, denunciaId) {
  // Asegúrate de tener estas variables en tu archivo .env
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Faltan credenciales de Cloudinary en variables de entorno.');
  }

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', `denuncias/${denunciaId}`);
  formData.append('public_id', `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9_-]/g, '_')}`);

  const response = await fetch(cloudinaryUrl, { method: 'POST', body: formData });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary Error: ${response.status} ${errorText}`);
  }

  return response.json();
}

// --- DENUNCIAS FUNCTIONS ---

export async function uploadDenunciaFiles(denunciaId, files) {
  const uploadedFiles = [];
  const maxSize = 25 * 1024 * 1024; // 25MB
  const uploadTimeout = 20000; // 20 segundos

  for (const file of files) {
    let processedFile = file;

    // 1. Compresión si es imagen pesada
    if (file.type.startsWith('image/') && file.size > 1 * 1024 * 1024) {
      try {
        const compressedBlob = await compressImage(file);
        processedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });
      } catch (e) {
        console.warn("Error comprimiendo, se usará original", e);
      }
    }

    // 2. Validación de tamaño
    if (processedFile.size > maxSize) {
      console.warn(`Archivo ${file.name} excede el límite.`);
      continue;
    }

    // 3. Intento de subida con Timeout
    try {
      const uploadPromise = uploadToCloudinary(processedFile, denunciaId);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout en subida')), uploadTimeout)
      );

      const result = await Promise.race([uploadPromise, timeoutPromise]);
      
      uploadedFiles.push({
        name: processedFile.name,
        nombre: processedFile.name,
        url: result.secure_url || result.url,
        size: processedFile.size,
        type: processedFile.type,
        provider: 'cloudinary',
        compressed: processedFile !== file
      });
    } catch (error) {
      console.error(`Error al subir ${file.name}:`, error);
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
    fecha: serverTimestamp(),
    timestamp: serverTimestamp()
  }, { merge: true });

  return denunciaRef.id;
}

export async function fetchDenunciasByEmail(email) {
  if (!email) return [];
  const q = query(collection(db, 'denuncias'), where('usuario.email', '==', email));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function fetchAllDenuncias() {
  const snap = await getDocs(collection(db, 'denuncias'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}