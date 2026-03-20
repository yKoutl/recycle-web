import React, { useState, useEffect } from 'react';
import { X, Video, Trophy, Clock, Tag, AlignLeft, Save, Loader2, Award } from 'lucide-react';
import { useCreateInductionMutation } from '../../../store/induction';

const InductionModal = ({ isOpen, onClose, themeColor }) => {
    const [createInduction, { isLoading, isSuccess }] = useCreateInductionMutation();
    const accent = themeColor || '#018F64';

    const initialForm = {
        title: '',
        category: 'Tutorial',
        duration: '',
        ecoPoints: 0, // <--- Solo este campo
        videoUrl: '',
        description: '',
        isActive: true
    };

    const [form, setForm] = useState(initialForm);

    // Resetear formulario cuando se cierra o se guarda con éxito
    useEffect(() => {
        if (isSuccess || !isOpen) {
            setForm(initialForm);
            if (isSuccess) onClose();
        }
    }, [isSuccess, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked :
                type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createInduction(form).unwrap();
        } catch (err) {
            console.error("Error al crear inducción:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl text-white" style={{ background: accent }}>
                            <Video size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nueva Inducción</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* Título */}
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-2">
                                <AlignLeft size={12} /> Título de la Inducción
                            </label>
                            <input
                                required
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Ej: Guía básica de compostaje"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 transition-all text-sm"
                                style={{ '--tw-ring-color': `${accent}20` }}
                                onFocus={(e) => e.target.style.borderColor = accent}
                                onBlur={(e) => e.target.style.borderColor = ''}
                            />
                        </div>

                        {/* Categoría */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-2">
                                <Tag size={12} /> Categoría
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 text-sm appearance-none cursor-pointer"
                                style={{ '--tw-ring-color': `${accent}20` }}
                            >
                                <option value="Tutorial">Tutorial</option>
                                <option value="Reciclaje">Reciclaje</option>
                                <option value="Eco-Tips">Eco-Tips</option>
                                <option value="Premios">Premios</option>
                            </select>
                        </div>

                        {/* Duración */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-2">
                                <Clock size={12} /> Duración (MM:SS)
                            </label>
                            <input
                                required
                                name="duration"
                                value={form.duration}
                                onChange={handleChange}
                                placeholder="05:30"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 text-sm"
                                style={{ '--tw-ring-color': `${accent}20` }}
                            />
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-2">
                                <Trophy size={12} className="text-amber-500" /> Eco-puntos de Recompensa
                            </label>
                            <input
                                type="number"
                                name="ecoPoints"
                                value={form.ecoPoints}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none text-sm font-bold"
                            />
                        </div>

                        {/* Video URL */}
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-2">
                                <Video size={12} /> URL del Video (YouTube/Vimeo)
                            </label>
                            <input
                                required
                                name="videoUrl"
                                value={form.videoUrl}
                                onChange={handleChange}
                                placeholder="https://youtube.com/..."
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none text-sm"
                            />
                        </div>

                        {/* Descripción */}
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-2">
                                <AlignLeft size={12} /> Descripción corta
                            </label>
                            <textarea
                                required
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none text-sm resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                                className="w-5 h-5 rounded-md border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-xs font-bold text-gray-500 uppercase group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">Publicar inmediatamente</span>
                        </label>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg flex items-center gap-2 disabled:opacity-50 active:scale-95 transition-all"
                                style={{ background: accent, boxShadow: `0 8px 20px ${accent}40` }}
                            >
                                {isLoading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Save size={18} />
                                )}
                                Guardar Inducción
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InductionModal;