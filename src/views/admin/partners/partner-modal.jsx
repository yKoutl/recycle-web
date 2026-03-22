import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    X, Save, Loader2, UploadCloud, Pin, Eye,
    Building2, ShieldCheck, Palette, Layout,
    Zap, Award, ChevronDown, CheckCircle2, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import { useCreatePartnerMutation, useUpdatePartnerMutation } from '../../../store/partners';

const PartnerFormModal = ({ isOpen, onClose, themeColor }) => {
    const { activePartner } = useSelector((state) => state.partners);
    const [createPartner, { isLoading: isCreating }] = useCreatePartnerMutation();
    const [updatePartner, { isLoading: isUpdating }] = useUpdatePartnerMutation();
    const accent = themeColor || '#018F64';

    const initialState = {
        name: '',
        filterType: 'ong',
        typeLabel: 'Organización',
        logo: '',
        mainColor: '#2E8B57',
        description: '',
        environmentalCommitment: '',
        isPinned: false,
        isVisible: true,
        rewardsCount: 0,
        usersCount: 0
    };

    const [formData, setFormData] = useState(initialState);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'danger' });

    useEffect(() => {
        if (isOpen) {
            setFormData(activePartner || initialState);
        }
    }, [isOpen, activePartner]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            logo: formData.logo.trim() === ''
                ? 'https://via.placeholder.com/150'
                : formData.logo,
            isLocked: false
        };

        try {
            if (activePartner) {
                await updatePartner({ id: activePartner._id, ...payload }).unwrap();
            } else {
                await createPartner(payload).unwrap();
            }
            onClose();
        } catch (error) {
            console.error("Error al guardar:", error);
            setModalConfig({
                isOpen: true,
                title: 'Error al Guardar',
                message: error.data?.message || 'Verifica que todos los datos sean correctos e intenta de nuevo.',
                variant: 'danger'
            });
        }
    };

    if (!isOpen) return null;

    const isLoading = isCreating || isUpdating;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex justify-end bg-black/70 backdrop-blur-md animate-in fade-in transition-all" onDoubleClick={onClose}>
            <div
                className="bg-white dark:bg-gray-900 w-full max-w-xl h-full shadow-2xl border-l border-gray-100 dark:border-white/10 flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden"
                onClick={e => e.stopPropagation()}
                onDoubleClick={e => e.stopPropagation()}
            >

                {/* HEADER */}
                <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 text-white rounded-[1.5rem] shadow-xl" style={{ backgroundColor: accent, boxShadow: `0 8px 25px ${accent}40` }}>
                            {activePartner ? <ShieldCheck size={24} /> : <Building2 size={24} />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                {activePartner ? 'Editar Socio' : 'Nuevo Aliado'}
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gestión estratégica de alianzas corporativas</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white dark:hover:bg-white/10 rounded-2xl transition-all group shadow-sm active:scale-90">
                        <X size={20} className="text-gray-400 group-hover:text-red-500" />
                    </button>
                </div>

                {/* FORM BODY */}
                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">

                    {/* SECCIÓN 1: Identidad Corporativa */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                            <Zap size={18} style={{ color: accent }} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Perfil del Socio</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Nombre de la Entidad</label>
                                <input
                                    type="text" name="name" required value={formData.name} onChange={handleChange}
                                    placeholder="Ej: Banco Nacional del Perú"
                                    className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-gray-900 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 dark:placeholder:text-gray-500"
                                    onFocus={(e) => { e.target.style.borderColor = accent; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Tipo de Filtro</label>
                                    <CustomSelect
                                        value={formData.filterType}
                                        onChange={(v) => setFormData({ ...formData, filterType: v })}
                                        accent={accent}
                                        options={[
                                            { id: 'ong', label: 'ONG' },
                                            { id: 'financial', label: 'Financiera' },
                                            { id: 'government', label: 'Gobierno' },
                                            { id: 'corporate', label: 'Corporativo' }
                                        ]}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Etiqueta Visible</label>
                                    <input
                                        type="text" name="typeLabel" value={formData.typeLabel} onChange={handleChange}
                                        placeholder="Ej: Organización"
                                        className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-sm text-gray-900 dark:text-white outline-none dark:placeholder:text-gray-500"
                                        onFocus={(e) => { e.target.style.borderColor = accent; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: Marca y Colores */}
                    <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                            <Palette size={18} style={{ color: accent }} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Identidad Visual</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Color Institucional</label>
                                <div className="flex items-center gap-4 p-2 bg-gray-50 dark:bg-white/5 rounded-[1.5rem] border border-gray-100 dark:border-white/10">
                                    <input
                                        type="color" name="mainColor" value={formData.mainColor} onChange={handleChange}
                                        className="w-12 h-12 rounded-2xl cursor-pointer border-0 bg-transparent"
                                    />
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{formData.mainColor}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Logo URL</label>
                                <div className="relative">
                                    <UploadCloud className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text" name="logo" required value={formData.logo} onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-sm text-gray-900 dark:text-white outline-none dark:placeholder:text-gray-500"
                                        onFocus={(e) => { e.target.style.borderColor = accent; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                                    />
                                </div>
                            </div>
                        </div>

                        {formData.logo && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center p-6 bg-white dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-white/10">
                                <img src={formData.logo} alt="Preview" className="h-20 object-contain drop-shadow-2xl" onError={(e) => e.target.style.display = 'none'} />
                            </motion.div>
                        )}
                    </div>

                    {/* SECCIÓN 3: Propuesta de Valor */}
                    <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                            <Award size={18} style={{ color: accent }} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Contenido y Compromisos</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Descripción de la Alianza</label>
                                <textarea
                                    name="description" rows="3" value={formData.description} onChange={handleChange}
                                    placeholder="Describe brevemente la trayectoria y razón social del socio..."
                                    className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-medium text-xs text-gray-900 dark:text-white outline-none dark:placeholder:text-gray-500 min-h-[100px]"
                                    onFocus={(e) => { e.target.style.borderColor = accent; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-500 tracking-widest mb-3 ml-1">Compromiso Ambiental Estratégico</label>
                                <textarea
                                    name="environmentalCommitment" rows="3" value={formData.environmentalCommitment} onChange={handleChange}
                                    placeholder="Ej: Plantar 5,000 árboles en la amazonía para 2025..."
                                    className="w-full px-6 py-4 rounded-[1.5rem] bg-amber-50 dark:bg-amber-500/5 border-2 border-transparent transition-all font-bold text-xs text-gray-900 dark:text-amber-100 outline-none dark:placeholder:text-amber-800/40 min-h-[100px]"
                                    onFocus={(e) => { e.target.style.borderColor = '#d97706'; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 4: Estados y Visibilidad */}
                    <div className="p-6 rounded-[2rem] bg-gray-500/[0.03] border-2 border-dashed border-gray-200 dark:border-white/10 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button" onClick={() => setFormData({ ...formData, isVisible: !formData.isVisible })}
                                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${formData.isVisible ? 'bg-emerald-500 text-white border-transparent' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-white/5'}`}
                            >
                                {formData.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                                {formData.isVisible ? 'Visible' : 'Oculto'}
                            </button>
                            <button
                                type="button" onClick={() => setFormData({ ...formData, isPinned: !formData.isPinned })}
                                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${formData.isPinned ? 'bg-amber-500 text-white border-transparent shadow-lg shadow-amber-500/20' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-white/5'}`}
                            >
                                <Pin size={18} className={formData.isPinned ? 'rotate-45' : ''} />
                                {formData.isPinned ? 'Destacado' : 'Normal'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex gap-4">
                    <button onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">Cancelar</button>
                    <button
                        type="submit" form="partnerForm" onClick={handleSubmit} disabled={isLoading}
                        className="flex-[2] px-10 py-4 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                        style={{ backgroundColor: accent, boxShadow: `0 15px 35px ${accent}40` }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {activePartner ? 'Actualizar Socio' : 'Guardar Alianza'}
                    </button>
                </div>
            </div>

            <ConfirmModal
                {...modalConfig}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>, document.body
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
                        initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden z-[1001]"
                    >
                        {options.map(opt => (
                            <div
                                key={opt.id} onClick={() => { onChange(opt.id); setIsOpen(false); }}
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

export default PartnerFormModal;