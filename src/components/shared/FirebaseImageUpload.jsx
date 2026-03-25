import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';
import { storage, auth } from '../../config/firebase';
import { useSelector } from 'react-redux';
import { UploadCloud, CheckCircle2, XCircle, Loader2, Image as ImageIcon, Trash2, ShieldCheck, Lock, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const convertToWebP = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (!blob) return reject(new Error('Canvas to Blob Failed'));
                    const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                        type: 'image/webp',
                    });
                    resolve(newFile);
                }, 'image/webp', 0.85); // 85% calidad
            };
            img.onerror = () => reject(new Error('Image Load Failed'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('FileReader Error'));
        reader.readAsDataURL(file);
    });
};

const FirebaseImageUpload = forwardRef(({ onUploadSuccess, currentImageUrl, folder = 'general', themeColor = '#018F64' }, componentRef) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [localFile, setLocalFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const fileInputRef = useRef(null);

    const { user } = useSelector((state) => state.auth);
    const dbRole = user?.role?.toUpperCase();
    const isAuthorized = ['ADMIN', 'MANAGER', 'COORDINATOR'].includes(dbRole);

    // 🕵️ LOG 1: Estado inicial de autenticación
    useEffect(() => {
        console.log("DEBUG AUTH: Verificando estado inicial...");
        console.log("DEBUG AUTH: Rol detectado:", dbRole);
        console.log("DEBUG AUTH: ¿Está autorizado?", isAuthorized);
        console.log("DEBUG AUTH: ¿Usuario Firebase actual?", auth.currentUser ? auth.currentUser.uid : "NINGUNO");

        if (isAuthorized && !auth.currentUser) {
            console.log("DEBUG AUTH: Intentando login anónimo automático...");
            signInAnonymously(auth)
                .then((userCredential) => {
                    console.log("DEBUG AUTH ✅: Login anónimo exitoso:", userCredential.user.uid);
                })
                .catch((err) => {
                    console.error("DEBUG AUTH ❌: Error en useEffect (L52):", err.code, err.message);
                    console.dir(err); // Esto mostrará el objeto de error completo
                });
        }
    }, [isAuthorized]);

    useEffect(() => {
        // Solo actualizamos preview si no hay local file y cambió la de prop
        if (!localFile && currentImageUrl) {
            setPreviewUrl(currentImageUrl);
        }
    }, [currentImageUrl, localFile]);

    // Exponer la función de subida hacia el componente padre
    useImperativeHandle(componentRef, () => ({
        hasFile: () => !!localFile,
        uploadFile: async () => {
            if (!localFile) return previewUrl; // Si no hay local, retorna la actual
            return await forceUpload(localFile);
        }
    }));

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!isAuthorized) {
            setError('No tienes permisos suficientes para subir imágenes.');
            return;
        }
        if (!file.type.startsWith('image/')) {
            setError('Por favor selecciona una imagen válida.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit pre-converison
            setError('La imagen es demasiado grande. Máximo 5MB.');
            return;
        }

        try {
            setError(null);
            const webpFile = await convertToWebP(file);
            setLocalFile(webpFile);
            setPreviewUrl(URL.createObjectURL(webpFile));
        } catch (err) {
            console.error(err);
            setError("Error al convertir imagen a formato WebP.");
        }
    };

    const forceUpload = (fileToUpload) => {
        return new Promise(async (resolve, reject) => {
            setError(null);
            setUploading(true);
            setProgress(0);

            try {
                // 🕵️ LOG 2: Verificación antes de subir
                console.log("DEBUG UPLOAD: Iniciando proceso de subida...");

                if (!auth.currentUser) {
                    console.log("DEBUG UPLOAD: No hay usuario activo, reintentando login...");
                    try {
                        const cred = await signInAnonymously(auth);
                        console.log("DEBUG UPLOAD ✅: Reintento de login exitoso:", cred.user.uid);
                    } catch (signInErr) {
                        console.error("DEBUG UPLOAD ❌: Error fatal en login (L109):", signInErr.code);
                        throw signInErr; // Lanza para capturarlo en el catch principal
                    }
                }

                console.log("DEBUG UPLOAD: Generando referencia en Storage...");
                const storageRef = ref(storage, `${folder}/${Date.now()}_${fileToUpload.name}`);
                const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setProgress(Math.round(progressValue));
                    },
                    (err) => {
                        console.error("DEBUG UPLOAD ❌: Error en tarea de subida:", err);
                        setError("Error al subir la imagen a Firebase.");
                        setUploading(false);
                        reject(err);
                    },
                    async () => {
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log("DEBUG UPLOAD ✅: URL generada:", downloadURL);

                            // Lógica de borrado antiguo...
                            if (currentImageUrl && currentImageUrl.includes('firebasestorage.googleapis.com')) {
                                try {
                                    const oldRef = ref(storage, currentImageUrl);
                                    await deleteObject(oldRef);
                                    console.log("DEBUG UPLOAD: Imagen antigua borrada.");
                                } catch (e) {
                                    console.log("DEBUG UPLOAD: No se pudo borrar la antigua (ignorable).");
                                }
                            }

                            if (onUploadSuccess) onUploadSuccess(downloadURL);
                            setUploading(false);
                            setLocalFile(null);
                            resolve(downloadURL);
                        } catch (e) {
                            reject(e);
                        }
                    }
                );
            } catch (err) {
                console.error("DEBUG UPLOAD ❌: Error en catch principal:", err);
                setError(`Error de autenticación: ${err.code}`);
                setUploading(false);
                reject(err);
            }
        });
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        setLocalFile(null);
        setPreviewUrl('');
        if (onUploadSuccess) onUploadSuccess('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full">
            <div
                onClick={() => !uploading && isAuthorized && fileInputRef.current?.click()}
                className={`group relative w-full h-40 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden
                    ${uploading || !isAuthorized ? 'pointer-events-none' : 'hover:border-solid'} 
                    ${!isAuthorized ? 'bg-gray-100 dark:bg-white/[0.02] border-gray-200' : ''}
                    ${error ? 'border-red-500/50 bg-red-500/5' : 'border-gray-200 dark:border-white/10 dark:bg-white/5 bg-gray-50'}`}
                style={{ borderColor: !error && !uploading && isAuthorized ? 'rgba(0,0,0,0.1)' : undefined }}
                onMouseEnter={(e) => { if (!uploading && !error && isAuthorized) e.currentTarget.style.borderColor = themeColor; }}
                onMouseLeave={(e) => { if (!uploading && !error && isAuthorized) e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />

                <AnimatePresence mode="wait">
                    {!isAuthorized ? (
                        <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2 text-gray-400">
                            <Lock size={24} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-center px-6">Permisos insuficientes</span>
                        </motion.div>
                    ) : uploading ? (
                        <motion.div
                            key="uploading"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center justify-center gap-3 p-6 w-full h-full bg-white/80 dark:bg-black/40 backdrop-blur-md z-20"
                        >
                            <Loader2 className="animate-spin text-emerald-500" size={32} />
                            <div className="w-full max-w-xs bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden mt-1">
                                <motion.div
                                    className="h-full bg-emerald-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "easeOut" }}
                                />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#018F64]">{progress}% Subiendo...</span>
                        </motion.div>
                    ) : previewUrl ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full h-full relative group"
                        >
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-[1.8rem] transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsPreviewOpen(true); }}
                                    className="p-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all transform hover:scale-110 shadow-xl"
                                    title="Ver en Modal"
                                >
                                    <Search size={20} />
                                </button>
                                <button
                                    onClick={handleRemove}
                                    className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all transform hover:scale-110 shadow-xl"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                    className="p-3 bg-white text-gray-900 rounded-2xl hover:bg-gray-100 transition-all transform hover:scale-110 shadow-xl"
                                >
                                    <ImageIcon size={20} />
                                </button>
                            </div>
                            {/* Un pequeño badge si está lista para subir (pero aún no se sube) */}
                            {localFile && (
                                <div className="absolute top-4 left-4 p-2 bg-yellow-400 text-gray-900 rounded-xl shadow-lg" title="Archivo WebP listo para guardar">
                                    <span className="text-[9px] font-black uppercase px-1">Pendiente</span>
                                </div>
                            )}
                            {!localFile && (
                                <div className="absolute top-4 left-4 p-2 bg-emerald-500 text-white rounded-xl shadow-lg">
                                    <ShieldCheck size={16} />
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-3 text-center px-8"
                        >
                            <div className="p-4 rounded-3xl bg-white dark:bg-white/5 shadow-xl group-hover:scale-110 transition-transform">
                                <UploadCloud size={32} className="text-gray-400 group-hover:text-[#018F64] transition-colors" />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Seleccionar Imagen</h4>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">PNG, JPG (se convierte a WebP)</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <div className="absolute top-0 inset-x-0 p-3 bg-red-500/10 border-b border-red-500/20 backdrop-blur-md flex items-center gap-2 z-10">
                        <XCircle size={14} className="text-red-500" />
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{error}</span>
                    </div>
                )}
            </div>

            {/* Modal de Previsualización */}
            <AnimatePresence>
                {isPreviewOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsPreviewOpen(false)}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
                    >
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={previewUrl}
                            alt="Full Preview"
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-full max-h-full rounded-[2rem] object-contain shadow-2xl border-2 border-white/10"
                        />
                        <button
                            className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-white/20 hover:scale-105 text-white rounded-2xl transition-all"
                            onClick={() => setIsPreviewOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default FirebaseImageUpload;
