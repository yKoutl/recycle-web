import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios'; // 🚀 Ahora usamos axios para subir al backend
import { UploadCloud, CheckCircle2, XCircle, Loader2, Image as ImageIcon, Trash2, Search, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
                }, 'image/webp', 0.85);
            };
            img.onerror = () => reject(new Error('Image Load Failed'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('FileReader Error'));
        reader.readAsDataURL(file);
    });
};

const FirebaseImageUpload = forwardRef(({ onUploadSuccess, currentImageUrl, themeColor = '#018F64' }, componentRef) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [localFile, setLocalFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const fileInputRef = useRef(null);

    const { user, token } = useSelector((state) => state.auth);
    const dbRole = user?.role?.toUpperCase();
    const isAuthorized = ['ADMIN', 'MANAGER', 'COORDINATOR'].includes(dbRole);

    // 🕵️ LOG 1: Estado inicial de autenticación
    useEffect(() => {
        if (!localFile && currentImageUrl) {
            setPreviewUrl(currentImageUrl);
        }
    }, [currentImageUrl, localFile]);

    useImperativeHandle(componentRef, () => ({
        hasFile: () => !!localFile,
        uploadFile: async () => {
            if (!localFile) return previewUrl;
            return await forceUpload(localFile);
        }
    }));

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!isAuthorized) {
            setError('No tienes permisos suficientes.');
            return;
        }

        try {
            setError(null);
            const webpFile = await convertToWebP(file);
            setLocalFile(webpFile);
            setPreviewUrl(URL.createObjectURL(webpFile));
        } catch (err) {
            console.error(err);
            setError("Error al procesar imagen.");
        }
    };

    const forceUpload = async (fileToUpload) => {
        setError(null);
        setUploading(true);
        setProgress(10); // Progreso simulado inicial

        try {
            const formData = new FormData();
            formData.append('file', fileToUpload);

            const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });

            const downloadURL = response.data.url;

            if (onUploadSuccess) onUploadSuccess(downloadURL);
            setUploading(false);
            setLocalFile(null);
            return downloadURL;

        } catch (err) {
            console.error("Backend Upload Error:", err);
            setError("Error al subir al servidor.");
            setUploading(false);
            throw err;
        }
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
                    ${error ? 'border-red-500/50 bg-red-500/5' : 'border-gray-200 dark:border-white/10 dark:bg-white/5 bg-gray-50'}`}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />

                <AnimatePresence mode="wait">
                    {uploading ? (
                        <motion.div key="uploading" className="flex flex-col items-center gap-3">
                            <Loader2 className="animate-spin text-emerald-500" size={32} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{progress}% Subiendo...</span>
                        </motion.div>
                    ) : previewUrl ? (
                        <motion.div key="preview" className="w-full h-full relative group">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-[1.8rem]" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button onClick={(e) => { e.stopPropagation(); setIsPreviewOpen(true); }} className="p-3 bg-blue-500 text-white rounded-2xl"><Search size={20} /></button>
                                <button onClick={handleRemove} className="p-3 bg-red-500 text-white rounded-2xl"><Trash2 size={20} /></button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <UploadCloud size={32} className="text-gray-400" />
                            <span className="text-[11px] font-black uppercase">Subir vía Backend 🔥</span>
                        </div>
                    )}
                </AnimatePresence>

                {error && <div className="absolute top-0 inset-x-0 p-3 bg-red-500/10 text-red-500 text-[10px] uppercase font-bold text-center">{error}</div>}
            </div>

            {/* Modal de Previsualización */}
            <AnimatePresence>
                {isPreviewOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPreviewOpen(false)} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
                        <img src={previewUrl} alt="Preview" className="max-w-full max-h-full rounded-[2rem] object-contain shadow-2xl" />
                        <button className="absolute top-8 right-8 p-4 bg-white/10 text-white rounded-2xl" onClick={() => setIsPreviewOpen(false)}><X size={24} /></button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default FirebaseImageUpload;
