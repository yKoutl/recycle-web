import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    X, Video, Trophy, Clock, Tag, AlignLeft, Save,
    Loader2, Award, Youtube, LayoutPanelTop, ChevronDown,
    Eye, EyeOff, Sparkles, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateInductionMutation } from '../../../store/induction';

const InductionModal = ({ isOpen, onClose, themeColor }) => {
    const [createInduction, { isLoading, isSuccess }] = useCreateInductionMutation();
    const accent = themeColor || '#018F64';

    const categories = [
        { id: 'Tutorial', label: 'Tutorial Técnico' },
        { id: 'Reciclaje', label: 'Guía de Reciclaje' },
        { id: 'Eco-Tips', label: 'Consejos Ecológicos' },
        { id: 'Premios', label: 'Guía de Recompensas' }
    ];

    const initialForm = {
        title: '',
        category: 'Tutorial',
        duration: '',
        ecoPoints: 0,
        videoUrl: '',
        description: '',
        isActive: true
    };

    const [form, setForm] = useState(initialForm);
    const [showErrors, setShowErrors] = useState(false);

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
        setShowErrors(false);

        // Validación simple
        if (!form.title || !form.videoUrl) {
            setShowErrors(true);
            return;
        }

        try {
            await createInduction(form).unwrap();
        } catch (err) {
            console.error("Error al crear inducción:", err);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex justify-end bg-black/70 backdrop-blur-md animate-in fade-in transition-all">
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-white dark:bg-gray-900 w-full max-w-xl h-full shadow-2xl border-l border-gray-100 dark:border-white/10 flex flex-col overflow-hidden"
            >
                {/* HEADER - Estilo Dashboard Pro */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 text-white rounded-[1.5rem] shadow-xl" style={{ backgroundColor: accent, boxShadow: `0 8px 25px ${accent}40` }}>
                            <Video size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                                Nueva Inducción
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gestión de contenido educativo en video</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white dark:hover:bg-white/10 rounded-2xl transition-all group active:scale-90">
                        <X size={20} className="text-gray-400 group-hover:text-red-500" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">

                    {/* SECCIÓN 1: Datos Generales */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                            <Sparkles size={18} style={{ color: accent }} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Identidad del Contenido</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Título del Video</label>
                                <input
                                    type="text" name="title" value={form.title} onChange={handleChange}
                                    placeholder="Ej: Tutorial de Separación de Residuos"
                                    className={`w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 transition-all font-bold text-gray-900 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 ${showErrors && !form.title ? 'border-red-500/50 shadow-[0_0_15px_-5px_red]' : 'border-transparent'}`}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Categoría</label>
                                    <CustomSelect
                                        value={form.category}
                                        onChange={(v) => setForm({ ...form, category: v })}
                                        accent={accent}
                                        options={categories}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Duración estimada</label>
                                    <div className="relative">
                                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text" name="duration" value={form.duration} onChange={handleChange}
                                            placeholder="MM:SS"
                                            className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-sm text-gray-900 dark:text-white outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: Gamificación */}
                    <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: '#f59e0b' }}>
                            <Trophy size={18} className="text-amber-500" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Recompensa por Visualización</h3>
                        </div>

                        <div className="p-6 rounded-[2rem] bg-amber-500/[0.03] border border-amber-500/10 flex items-center justify-between">
                            <div>
                                <h4 className="text-[11px] font-black uppercase text-amber-600 tracking-widest">Eco-puntos a otorgar</h4>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Se sumarán al perfil al terminar el video</p>
                            </div>
                            <div className="relative w-32">
                                <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
                                <input
                                    type="number" name="ecoPoints" value={form.ecoPoints} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-amber-500/20 text-center font-black text-amber-600 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 3: Multimedia */}
                    <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: '#3b82f6' }}>
                            <Youtube size={18} className="text-blue-500" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Recurso de Video</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">URL de YouTube / Vimeo</label>
                                <div className="relative">
                                    <Video className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text" name="videoUrl" value={form.videoUrl} onChange={handleChange}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className={`w-full pl-12 pr-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 transition-all font-bold text-xs text-gray-900 dark:text-white outline-none ${showErrors && !form.videoUrl ? 'border-red-500/50' : 'border-transparent'}`}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Descripción corta</label>
                                <textarea
                                    name="description" rows="3" value={form.description} onChange={handleChange}
                                    placeholder="Explica brevemente de qué trata este video..."
                                    className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-medium text-xs text-gray-900 dark:text-white outline-none min-h-[100px] focus:bg-white dark:focus:bg-gray-800"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 4: Estado */}
                    <div className="p-6 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border-2 border-dashed border-gray-200 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${form.isActive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gray-200 text-gray-400'}`}>
                                {form.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-200">Visibilidad</p>
                                <p className="text-[9px] text-gray-400 uppercase font-bold">{form.isActive ? 'Público en la app' : 'Oculto / Borrador'}</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex gap-4">
                    <button type="button" onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">Cancelar</button>
                    <button
                        onClick={handleSubmit} disabled={isLoading}
                        className="flex-[2] px-10 py-4 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                        style={{ backgroundColor: accent, boxShadow: `0 15px 35px ${accent}40` }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        Guardar Inducción
                    </button>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

// Componente Local: CustomSelect
const CustomSelect = ({ value, onChange, options, accent }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-sm text-gray-900 dark:text-white cursor-pointer flex justify-between items-center ${isOpen ? 'bg-white dark:bg-gray-800 shadow-xl' : ''}`}
                style={{ borderColor: isOpen ? accent : 'transparent' }}
            >
                {options.find(o => o.id === value)?.label || 'Seleccionar...'}
                <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} style={isOpen ? { color: accent } : {}} size={14} />
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden z-[1001]"
                    >
                        {options.map(opt => (
                            <div
                                key={opt.id}
                                onClick={() => { onChange(opt.id); setIsOpen(false); }}
                                className={`px-6 py-3.5 text-xs font-bold cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-white/5 ${value === opt.id ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}
                                style={value === opt.id ? { backgroundColor: accent } : {}}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            {isOpen && <div className="fixed inset-0 z-[1000] cursor-default" onClick={() => setIsOpen(false)} />}
        </div>
    );
};

export default InductionModal;