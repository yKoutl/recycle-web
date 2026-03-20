import React, { useState, useEffect } from 'react';
import { X, Save, Gift, Tag, Info, Layers, Box, Calendar, ScrollText, Building2, ListFilter } from 'lucide-react';
import { Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useCreateRewardMutation, useUpdateRewardMutation } from '../../../store/rewards';

const RewardFormModal = ({ isOpen, onClose, themeColor }) => {
    const { activeReward } = useSelector((state) => state.rewards || {});
    const [createReward] = useCreateRewardMutation();
    const [updateReward] = useUpdateRewardMutation();
    const accent = themeColor || '#018F64';

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
        imageUrl: '', // <--- Ahora se usará activamente
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
            // 1. Extraemos (destructuring) los campos prohibidos para separarlos del resto
            const {
                _id,
                __v,
                createdAt,
                updatedAt,
                isActive,
                ...editableData
            } = formData;

            // 2. Preparamos los datos finales asegurando tipos correctos
            const dataToSave = {
                ...editableData,
                expiryDate: new Date(formData.expiryDate).toISOString(),
                points: Number(formData.points),
                stock: Number(formData.stock)
            };

            if (activeReward) {
                // Enviamos el ID por separado y el body limpio
                await updateReward({
                    id: activeReward._id,
                    ...dataToSave
                }).unwrap();
            } else {
                await createReward(dataToSave).unwrap();
            }

            onClose();
        } catch (err) {
            // El error 400 que mostraste ahora debería desaparecer
            console.error('Error al guardar:', err);
        }
    };

    if (!isOpen) return null;

    const labelClass = "text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2 mb-2";
    const inputClass = "w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-4 transition-all font-medium dark:text-white placeholder:text-gray-400";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col max-h-[95vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
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

                <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">

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

                    <div className="space-y-3">
                        <label className={labelClass} style={{ color: accent }}>
                            <ImageIcon size={12} /> Imagen del Premio
                        </label>

                        <div className="flex gap-4 items-center">
                            {/* Previsualización miniatura */}
                            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                {formData.imageUrl ? (
                                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="text-gray-300" size={24} />
                                )}
                            </div>

                            {/* Input para la URL */}
                            <div className="flex-1 relative">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="text"
                                    className={`${inputClass} pl-10`}
                                    placeholder="https://cloudinary.com/mi-imagen.jpg"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Patrocinador y Vencimiento */}
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

                    {/* Términos */}
                    <div className="space-y-1">
                        <label className={labelClass} style={{ color: accent }}><ScrollText size={12} /> Términos y Condiciones</label>
                        <textarea className={`${inputClass} h-16 resize-none`} value={formData.terms} onChange={(e) => setFormData({ ...formData, terms: e.target.value })} required />
                    </div>

                    {/* Puntos y Stock */}
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

                    {/* Botones de Acción */}
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-4 border border-gray-100 dark:border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-4 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
                            style={{ backgroundColor: accent, boxShadow: `0 8px 20px ${accent}30` }}
                        >
                            <Save size={16} /> {activeReward ? 'Guardar Cambios' : 'Crear Premio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RewardFormModal;