import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Gift, Tag, Info, Layers, Box, Calendar, ScrollText, Building2, ListFilter } from 'lucide-react';
import { Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateRewardMutation, useUpdateRewardMutation } from '../../../store/rewards';
import FirebaseImageUpload from '../../../components/shared/FirebaseImageUpload';

const RewardFormModal = ({ isOpen, onClose, themeColor }) => {
    const { activeReward } = useSelector((state) => state.rewards || {});
    const [createReward] = useCreateRewardMutation();
    const [updateReward] = useUpdateRewardMutation();
    const accent = themeColor || '#018F64';
    const imageRef = useRef(null);

    // Lista oficial de categorías según tu backend
    const categories = [
        { value: 'products', label: 'Productos Físicos' },
        { value: 'partners', label: 'Alianzas / Partners' },
        { value: 'discounts', label: 'Cupones de Descuento' },
        { value: 'experiences', label: 'Experiencias' },
        { value: 'donations', label: 'Donaciones' },
    ];

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        points: 0,
        stock: 0,
        category: 'products',
        sponsor: '',
        expiryDate: '',
        terms: '',
        isPartner: false,
    });

    useEffect(() => {
        if (activeReward) {
            setFormData({
                ...activeReward,
                expiryDate: activeReward.expiryDate ? activeReward.expiryDate.split('T')[0] : ''
            });
        } else {
            setFormData({
                title: '', description: '', points: 0, stock: 0,
                category: 'products', imageUrl: '', sponsor: '',
                expiryDate: '', terms: '', isPartner: false
            });
        }
    }, [activeReward, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {
                _id,
                __v,
                createdAt,
                updatedAt,
                isActive,
                ...editableData
            } = formData;

            // Esperar que suba la imagen a Firebase ANTES de guardar el formulario
            let finalImageUrl = editableData.imageUrl;
            if (imageRef.current && imageRef.current.hasFile()) {
                finalImageUrl = await imageRef.current.uploadFile();
            }

            const dataToSave = {
                ...editableData,
                imageUrl: finalImageUrl,
                expiryDate: new Date(formData.expiryDate).toISOString(),
                points: Number(formData.points),
                stock: Number(formData.stock)
            };

            if (activeReward) {
                await updateReward({
                    id: activeReward._id,
                    ...dataToSave
                }).unwrap();
            } else {
                await createReward(dataToSave).unwrap();
            }

            onClose();
        } catch (err) {
            console.error('Error al guardar:', err);
        }
    };

    if (!isOpen) return null;

    const labelClass = "text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2 mb-2";
    const inputClass = "w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-4 transition-all font-medium dark:text-white placeholder:text-gray-400";

    return createPortal(
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in" onClick={onClose}>
            <div className="w-full max-w-md h-full bg-white dark:bg-gray-900 flex flex-col shadow-2xl border-l border-gray-100 dark:border-white/5 animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6 border-b border-gray-50 dark:border-white/5 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 text-white rounded-2xl shadow-lg" style={{ backgroundColor: accent }}>
                            <Gift size={20} />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
                            {activeReward ? 'Editar Premio' : 'Nuevo Premio'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">

                        {/* Título */}
                        <div className="space-y-1">
                            <label className={labelClass} style={{ color: accent }}><Tag size={12} /> Título</label>
                            <input type="text" className={inputClass} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                        </div>

                        {/* Descripción */}
                        <div className="space-y-1">
                            <label className={labelClass} style={{ color: accent }}><Info size={12} /> Descripción</label>
                            <textarea className={`${inputClass} h-16 resize-none`} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                        </div>

                        {/* Categoría (Dropdown) */}
                        <div className="space-y-1">
                            <label className={labelClass} style={{ color: accent }}><ListFilter size={12} /> Categoría del Premio</label>
                            <select
                                className={`${inputClass} appearance-none cursor-pointer`}
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value} className="text-gray-900">
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-4">
                            <label className={labelClass} style={{ color: accent }}>
                                <ImageIcon size={12} /> Imagen del Premio
                            </label>

                            <FirebaseImageUpload
                                ref={imageRef}
                                themeColor={accent}
                                folder="rewards"
                                currentImageUrl={formData.imageUrl}
                                onUploadSuccess={(url) => setFormData({ ...formData, imageUrl: url })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className={labelClass} style={{ color: accent }}><Building2 size={12} /> Patrocinador</label>
                                <input type="text" className={inputClass} value={formData.sponsor} onChange={(e) => setFormData({ ...formData, sponsor: e.target.value })} required />
                            </div>
                            <div className="space-y-1">
                                <label className={labelClass} style={{ color: accent }}><Calendar size={12} /> Vencimiento</label>
                                <input type="date" className={inputClass} value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} required />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className={labelClass} style={{ color: accent }}><ScrollText size={12} /> Términos y Condiciones</label>
                            <textarea className={`${inputClass} h-16 resize-none`} value={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.value })} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className={labelClass} style={{ color: accent }}><Layers size={12} /> Puntos</label>
                                <input type="number" className={inputClass} value={formData.points} onChange={(e) => setFormData({ ...formData, points: e.target.value })} min="0" required />
                            </div>
                            <div className="space-y-1">
                                <label className={labelClass} style={{ color: accent }}><Box size={12} /> Stock</label>
                                <input type="number" className={inputClass} value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} min="0" required />
                            </div>
                        </div>

                    </div>

                    {/* Footer Fijo */}
                    <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex gap-3 shrink-0">
                        <button type="button" onClick={onClose} className="flex-1 py-3.5 border border-gray-200 dark:border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3.5 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                            style={{ backgroundColor: accent, boxShadow: `0 8px 20px ${accent}30` }}
                        >
                            <Save size={16} /> {activeReward ? 'Guardar Cambios' : 'Crear Premio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default RewardFormModal;