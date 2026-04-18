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
    respuestas: answers, // Array con las respuestas individuales si se proporciona
    fecha: serverTimestamp()
  });

  return resultRef.id;
}

export async function getTriviaStatistics() {
  const resultadosRef = collection(db, 'resultados_trivia');
  const querySnapshot = await getDocs(resultadosRef);

  const results = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return results;
}

// Función para comprimir imágenes automáticamente
async function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo aspect ratio
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Dibujar y comprimir
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(resolve, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
}

export async function uploadDenunciaFiles(denunciaId, files) {
  const uploadedFiles = [];
  const maxSize = 25 * 1024 * 1024; // Reducido a 25MB para mejor UX - equilibrio entre necesidad corporativa y velocidad
  const baseTimeout = 15000; // Reducido a 15 segundos - crítico para UX en situaciones de estrés

  console.log(`Iniciando upload optimizado de ${files.length} archivo(s)`);

  for (const file of files) {
    console.log(`Procesando archivo: ${file.name}, tamaño original: ${(file.size / 1024 / 1024).toFixed(2)}MB`);

    let processedFile = file;

    // Timeout más corto y fijo para consistencia
    const uploadTimeout = baseTimeout;

    // Compresión más agresiva para velocidad
    if (file.type.startsWith('image/') && file.size > 1 * 1024 * 1024) { // > 1MB
      try {
        console.log(`Comprimiendo imagen agresivamente ${file.name}...`);
        // Compresión más agresiva: menor calidad y tamaño
        const compressedBlob = await compressImage(file, 800, 800, 0.6);
        processedFile = new File([compressedBlob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        console.log(`Imagen comprimida: ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
      } catch (compressError) {
        console.warn(`No se pudo comprimir ${file.name}, usando original:`, compressError);
      }
    }

    // Validar tamaño después de compresión
    if (processedFile.size > maxSize) {
      console.warn(`Archivo ${file.name} demasiado grande (${(processedFile.size / 1024 / 1024).toFixed(2)}MB > ${(maxSize / 1024 / 1024).toFixed(0)}MB), saltando...`);
      continue; // Saltar archivo en lugar de fallar completamente
    }

    // Validar tipo de archivo
    const validTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff',
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
      'application/x-7z-compressed',
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4' // Agregando soporte para audio
    ];

    if (!validTypes.includes(processedFile.type) && !processedFile.type.startsWith('image/')) {
      console.warn(`Tipo de archivo ${processedFile.type} no soportado, saltando ${file.name}...`);
      continue;
    }

    try {
      const fileName = `${Date.now()}-${processedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const fileRef = storageRef(storage, `denuncias/${denunciaId}/${fileName}`);

      console.log(`Subiendo ${processedFile.name} (${(processedFile.size / 1024 / 1024).toFixed(2)}MB)...`);

      // Timeout reducido para situaciones de estrés
      const uploadPromise = uploadBytes(fileRef, processedFile, {
        contentType: processedFile.type || 'application/octet-stream'
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout: Archivo muy grande para subir ahora`)), uploadTimeout)
      );

      // Intentar el upload con timeout más corto
      try {
        await Promise.race([uploadPromise, timeoutPromise]);
        console.log(`Upload completado para ${processedFile.name}`);
      } catch (timeoutError) {
        console.error(`Timeout durante upload de ${processedFile.name}:`, timeoutError);
        console.log(`Saltando archivo ${processedFile.name} por timeout - denuncia se enviará sin él`);
        continue; // Continuar con otros archivos
      }

      // Obtener URL de descarga con timeout más corto
      const urlPromise = getDownloadURL(fileRef);
      const urlTimeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Error obteniendo enlace para "${processedFile.name}"`)), 10000)
      );

      const url = await Promise.race([urlPromise, urlTimeoutPromise]);

      uploadedFiles.push({
        name: processedFile.name,
        originalName: file.name,
        url,
        compressed: processedFile !== file,
        size: processedFile.size
      });

      console.log(`Archivo ${processedFile.name} procesado exitosamente`);

    } catch (fileError) {
      console.error(`Error procesando ${processedFile.name}:`, fileError);
      // En lugar de fallar completamente, continuar con otros archivos
      console.warn(`Saltando archivo problemático: ${processedFile.name}`);
    }
  }

  console.log(`Upload completado. ${uploadedFiles.length} de ${files.length} archivo(s) procesado(s)`);
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
