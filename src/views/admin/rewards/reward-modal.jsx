import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import {
    X, Save, Loader2, Gift, Tag, Info, Layers, Box,
    Calendar, ScrollText, Building2, ListFilter,
    Link as LinkIcon, Image as ImageIcon, Sparkles, ShieldCheck,
    ChevronDown, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateRewardMutation, useUpdateRewardMutation } from '../../../store/rewards';

const RewardFormModal = ({ isOpen, onClose, themeColor }) => {
    const { activeReward } = useSelector((state) => state.rewards || {});
    const [createReward, { isLoading: isCreating }] = useCreateRewardMutation();
    const [updateReward, { isLoading: isUpdating }] = useUpdateRewardMutation();
    const accent = themeColor || '#018F64';

    const categories = [
        { id: 'products', label: 'Productos Físicos' },
        { id: 'partners', label: 'Alianzas / Partners' },
        { id: 'discounts', label: 'Cupones de Descuento' },
        { id: 'experiences', label: 'Experiencias' },
        { id: 'donations', label: 'Donaciones' },
    ];

    const initialState = {
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
    };

    const [formData, setFormData] = useState(initialState);
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (activeReward) {
                setFormData({
                    ...activeReward,
                    expiryDate: activeReward.expiryDate ? activeReward.expiryDate.split('T')[0] : ''
                });
            } else {
                setFormData(initialState);
            }
        }
    }, [activeReward, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowErrors(false);

        // Validaciones básicas
        if (!formData.title?.trim() || !formData.sponsor?.trim() || !formData.imageUrl?.trim()) {
            setShowErrors(true);
            return;
        }

        try {
            const { _id, __v, createdAt, updatedAt, isActive, ...editableData } = formData;
            const payload = {
                ...editableData,
                expiryDate: new Date(formData.expiryDate).toISOString(),
                points: Number(formData.points),
                stock: Number(formData.stock)
            };

            if (activeReward) {
                await updateReward({ id: activeReward._id, ...payload }).unwrap();
            } else {
                await createReward(payload).unwrap();
            }
            onClose();
        } catch (err) {
            console.error('Error al guardar:', err);
        }
    };

    if (!isOpen) return null;

    const isLoading = isCreating || isUpdating;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex justify-end bg-black/70 backdrop-blur-md animate-in fade-in transition-all">
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-white dark:bg-gray-900 w-full max-w-xl h-full shadow-2xl border-l border-gray-100 dark:border-white/10 flex flex-col overflow-hidden"
            >
                {/* HEADER - Estilo Programas */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 text-white rounded-[1.5rem] shadow-xl" style={{ backgroundColor: accent, boxShadow: `0 8px 25px ${accent}40` }}>
                            {activeReward ? <Save size={24} /> : <Gift size={24} />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                {activeReward ? 'Actualizar Premio' : 'Nuevo Premio Eco'}
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 text-emerald-500">Configuración de recompensas y stock</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white dark:hover:bg-white/10 rounded-2xl transition-all group active:scale-90">
                        <X size={20} className="text-gray-400 group-hover:text-red-500" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">

                    {/* SECCIÓN 1: Identidad del Premio */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                            <Sparkles size={18} style={{ color: accent }} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Identidad del Premio</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Nombre Comercial</label>
                                <input
                                    type="text" name="title" value={formData.title} onChange={handleChange}
                                    placeholder="Ej: Bolsa Reutilizable de Tela Organica"
                                    className={`w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 transition-all font-bold text-gray-900 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 ${showErrors && !formData.title?.trim() ? 'border-red-500/50' : 'border-transparent'}`}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Patrocinador / Marca</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text" name="sponsor" value={formData.sponsor} onChange={handleChange}
                                            placeholder="Nombre de la marca"
                                            className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-sm text-gray-900 dark:text-white outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Categoría</label>
                                    <CustomSelect
                                        value={formData.category}
                                        onChange={(v) => setFormData({ ...formData, category: v })}
                                        accent={accent}
                                        options={categories}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: Logística y Puntos */}
                    <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                            <Layers size={18} style={{ color: accent }} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Economía y Disponibilidad</h3>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Costo (EcoPuntos)</label>
                                <input
                                    type="number" name="points" value={formData.points} onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-black text-center text-gray-900 dark:text-white outline-none"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Stock Actual</label>
                                <input
                                    type="number" name="stock" value={formData.stock} onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-black text-center text-gray-900 dark:text-white outline-none"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Vencimiento</label>
                                <input
                                    type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange}
                                    className="w-full px-4 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-xs text-gray-900 dark:text-white outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 3: Contenido y Multimedia */}
                    <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                            <ImageIcon size={18} style={{ color: accent }} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Multimedia y Detalles</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-4 items-center p-4 bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-white/10">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/5 shadow-inner">
                                    {formData.imageUrl ? (
                                        <img src={formData.imageUrl} alt="Reward" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="text-gray-300" size={32} />
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">URL de la Imagen (Cloudinary)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                        <input
                                            type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                                            placeholder="https://link-de-imagen.jpg"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 text-xs font-bold outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Descripción del Premio</label>
                                <textarea
                                    name="description" rows="3" value={formData.description} onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-medium text-xs text-gray-900 dark:text-white outline-none min-h-[100px]"
                                    placeholder="Detalla las características del producto o servicio..."
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Términos y Condiciones</label>
                                <div className="relative">
                                    <ScrollText className="absolute left-5 top-5 text-gray-300" size={16} />
                                    <textarea
                                        name="terms" rows="3" value={formData.terms} onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-medium text-xs text-gray-900 dark:text-white outline-none min-h-[80px]"
                                        placeholder="Restricciones de canje, horarios, etc..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex gap-4">
                    <button onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">Cancelar</button>
                    <button
                        onClick={handleSubmit} disabled={isLoading}
                        className="flex-[2] px-10 py-4 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                        style={{ backgroundColor: accent, boxShadow: `0 15px 35px ${accent}40` }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (activeReward ? 'Guardar Cambios' : 'Publicar Premio')}
                        <Save size={20} />
                    </button>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

// Reutilizamos el CustomSelect del diseño de Programas
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

export default RewardFormModal;