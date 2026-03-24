import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    X, Save, Loader2, MapPin, Building2, Calendar, Trophy,
    ChevronDown, Zap, ShieldCheck, Plus, Activity, Clock,
    Award, CheckCircle2, XCircle, Target, Users, UploadCloud, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// IMPORTANTE: Asegúrate de importar desde TU api de programs
import { useCreateProgramMutation, useUpdateProgramMutation } from '../../../store/programs';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import FirebaseImageUpload from '../../../components/shared/FirebaseImageUpload';

const ProgramFormModal = ({ isOpen, onClose, themeColor }) => {
    const { activeProgram } = useSelector((state) => state.programs);
    const [createProgram, { isLoading: isCreating }] = useCreateProgramMutation();
    const [updateProgram, { isLoading: isUpdating }] = useUpdateProgramMutation();
    const accent = themeColor || '#018F64';
    const imageRef = useRef(null);

    const initialState = {
        title: '',
        organization: '',
        organizationType: 'ESTADO',
        participants: 0,
        location: '',
        duration: '',
        points: 0,
        imageUrl: '',
        description: '',
        objectives: [],
        activities: [],
        contact: {
            email: '',
            phone: '',
            website: ''
        },
        date: '',
        category: 'PROYECTO',
        status: 'PENDING',
        indications: '',
        observations: ''
    };

    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'ADMIN';

    const [formData, setFormData] = useState(initialState);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'danger' });
    const [tempObjective, setTempObjective] = useState('');
    const [tempActivity, setTempActivity] = useState('');
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(activeProgram || initialState);
        }
    }, [isOpen, activeProgram]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const addItem = (field, value, setter) => {
        if (!value.trim()) return;
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], value]
        }));
        setter('');
    };

    const removeItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setShowErrors(false);

        if (tempObjective.trim() || tempActivity.trim()) {
            alert("Tienes un objetivo o actividad sin agregar. Haz clic en el botón '+' antes de guardar.");
            return;
        }

        // 1. Validaciones Locales Detalladas
        const requiredFields = [];
        if (!formData.title?.trim()) requiredFields.push('Título del Programa');
        if (!formData.organization?.trim()) requiredFields.push('Nombre de la Organización');
        if (!formData.location?.trim()) requiredFields.push('Ubicación del Evento');
        if (!formData.description?.trim()) requiredFields.push('Descripción del Proyecto');
        if (!formData.contact?.email?.trim()) requiredFields.push('Correo Electrónico de Contacto');
        if (!formData.contact?.phone?.trim()) requiredFields.push('Teléfono de Contacto');
        if (!formData.points && formData.points !== 0) requiredFields.push('Puntos de Recompensa');

        if (requiredFields.length > 0) {
            setShowErrors(true);
            setModalConfig({
                isOpen: true,
                title: 'Información Incompleta',
                message: `Por favor completa los siguientes campos obligatorios para continuar: ${requiredFields.join(', ')}.`,
                variant: 'danger'
            });
            const container = document.querySelector('.overflow-y-auto');
            if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            // Limpieza estricta de datos para cumplir con el DTO del Servidor
            const allowedKeys = [
                'title', 'organization', 'organizationType', 'participants',
                'location', 'duration', 'points', 'imageUrl', 'description',
                'objectives', 'activities', 'contact', 'date', 'category',
                'indications', 'coordinatorList'
            ];

            const payload = {};
            allowedKeys.forEach(key => {
                if (key in formData) {
                    if (key === 'participants' || key === 'points') {
                        payload[key] = Number(formData[key] || 0);
                    } else {
                        payload[key] = formData[key];
                    }
                }
            });

            if (imageRef.current && imageRef.current.hasFile()) {
                payload.imageUrl = await imageRef.current.uploadFile();
            }

            if (activeProgram) {
                await updateProgram({ id: activeProgram._id, ...payload }).unwrap();
            } else {
                await createProgram(payload).unwrap();
            }
            onClose();
        } catch (error) {
            console.error("Error del servidor:", error);

            let errorMessage = 'No se pudo procesar la solicitud.';

            // Tratamiento de errores de validación de NestJS (Class Validator)
            if (error.data?.message) {
                if (Array.isArray(error.data.message)) {
                    errorMessage = `Errores de validación: ${error.data.message.join('; ')}`;
                } else {
                    errorMessage = error.data.message;
                }
            }

            // Traducciones rápidas de campos comunes
            const translations = {
                'title': 'Título',
                'organization': 'Organización',
                'location': 'Ubicación',
                'description': 'Descripción',
                'points': 'Puntos',
                'should not exist': 'no debe enviarse',
                'must be a number': 'debe ser un número',
                'must be a string': 'debe ser un texto',
                'property': 'la propiedad'
            };

            Object.entries(translations).forEach(([key, val]) => {
                errorMessage = errorMessage.replace(new RegExp(key, 'gi'), val);
            });

            setModalConfig({
                isOpen: true,
                title: 'Error de Validación',
                message: errorMessage,
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
                        <div className="p-3 text-white rounded-[1.5rem] shadow-xl" style={{ backgroundColor: accent, boxShadow: `0 8px 25px ${accent} 40` }}>
                            {activeProgram ? <Save size={24} /> : <Zap size={24} />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                {activeProgram ? 'Actualizar Proyecto' : 'Crear Nuevo Programa'}
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configuración técnica y validación administrativa</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white dark:hover:bg-white/10 rounded-2xl transition-all group shadow-sm active:scale-90">
                        <X size={20} className="text-gray-400 group-hover:text-red-500" />
                    </button>
                </div>

                {/* FORM BODY */}
                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 flex-1">

                    {/* SECCIÓN 1: Identidad */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                            <Zap size={18} style={{ color: accent }} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Identidad del Programa</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Título Oficial</label>
                                <input
                                    type="text" name="title" required value={formData.title} onChange={handleChange}
                                    placeholder="Ej: Reforesta Amazonas 2024"
                                    className={`w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 transition-all font-bold text-gray-900 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 dark:placeholder:text-gray-500 ${showErrors && !formData.title?.trim() ? 'border-red-500/50 shadow-[0_0_15px_-5px_red]' : 'border-transparent'}`}
                                    style={{ '--tw-ring-color': `${accent} 20` }}
                                    onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 10px 25px ${accent} 15`; }}
                                    onBlur={(e) => { e.target.style.borderColor = showErrors && !formData.title?.trim() ? 'rgba(239, 68, 68, 0.5)' : 'transparent'; e.target.style.boxShadow = ''; }}
                                />
                                {showErrors && !formData.title?.trim() && <span className="text-[9px] font-black text-red-500 uppercase mt-2 ml-4 tracking-widest">Este campo es obligatorio</span>}
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Nombre de la Organización</label>
                                <input
                                    type="text" name="organization" required value={formData.organization} onChange={handleChange}
                                    placeholder="Nombre de la Institución o Empresa"
                                    className={`w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 transition-all font-bold text-gray-900 dark:text-white outline-none focus:bg-white dark:focus:bg-gray-800 dark:placeholder:text-gray-500 ${showErrors && !formData.organization?.trim() ? 'border-red-500/50 shadow-[0_0_15px_-5px_red]' : 'border-transparent'}`}
                                    onFocus={(e) => { e.target.style.borderColor = accent; }}
                                    onBlur={(e) => { e.target.style.borderColor = showErrors && !formData.organization?.trim() ? 'rgba(239, 68, 68, 0.5)' : 'transparent'; }}
                                />
                                {showErrors && !formData.organization?.trim() && <span className="text-[9px] font-black text-red-500 uppercase mt-2 ml-4 tracking-widest">Por favor ingresa la organización</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Tipo Organización</label>
                                    <CustomSelect
                                        value={formData.organizationType}
                                        onChange={(v) => setFormData({ ...formData, organizationType: v })}
                                        accent={accent}
                                        options={[
                                            { id: 'ESTADO', label: 'Estatal / Público' },
                                            { id: 'NOS_PLANET', label: 'Nos Planet Central' },
                                            { id: 'ONG', label: 'ONG / Fondos Privados' }
                                        ]}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Categoría</label>
                                    <CustomSelect
                                        value={formData.category}
                                        onChange={(v) => setFormData({ ...formData, category: v })}
                                        accent={accent}
                                        options={[
                                            { id: 'PROYECTO', label: 'Proyecto Integral' },
                                            { id: 'TALLER', label: 'Taller / Capacitación' },
                                            { id: 'RECOLECCIÓN', label: 'Campaña Reciclaje' },
                                            { id: 'VOLUNTARIADO', label: 'Voluntariado' }
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: Ejecución */}
                    <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                            <Calendar size={18} style={{ color: accent }} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Ejecución y Ubicación</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Ubicación</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text" name="location" value={formData.location} onChange={handleChange}
                                        placeholder="Ubicación técnica..."
                                        className={`w-full pl-12 pr-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 transition-all font-bold text-sm text-gray-900 dark:text-white outline-none dark:placeholder:text-gray-500 ${showErrors && !formData.location?.trim() ? 'border-red-500/50 shadow-[0_0_15px_-5px_red]' : 'border-transparent'}`}
                                        onFocus={(e) => { e.target.style.borderColor = accent; }}
                                        onBlur={(e) => { e.target.style.borderColor = showErrors && !formData.location?.trim() ? 'rgba(239, 68, 68, 0.5)' : 'transparent'; }}
                                    />
                                </div>
                                {showErrors && !formData.location?.trim() && <span className="text-[9px] font-black text-red-500 uppercase mt-2 ml-4 tracking-widest">Falta la ubicación</span>}
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Fecha Evento</label>
                                <input
                                    type="date" name="date" value={formData.date} onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-sm text-gray-900 dark:text-white outline-none"
                                    onFocus={(e) => { e.target.style.borderColor = accent; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Recompensa (Puntos)</label>
                                <div className="relative group">
                                    <Trophy className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="number" name="points" value={formData.points} onChange={handleChange}
                                        className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-sm text-gray-900 dark:text-white outline-none dark:placeholder:text-gray-500"
                                        onFocus={(e) => { e.target.style.borderColor = accent; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Duración</label>
                                <div className="relative group">
                                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text" name="duration" value={formData.duration} onChange={handleChange}
                                        placeholder="Ej: 3 meses"
                                        className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-sm text-gray-900 dark:text-white outline-none dark:placeholder:text-gray-500"
                                        onFocus={(e) => { e.target.style.borderColor = accent; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Meta de Participantes</label>
                                <div className="relative group">
                                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="number" name="participants" value={formData.participants} onChange={handleChange}
                                        placeholder="Ej: 50"
                                        className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-sm text-gray-900 dark:text-white outline-none dark:placeholder:text-gray-500"
                                        onFocus={(e) => { e.target.style.borderColor = accent; }}
                                        onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 ml-1">Imagen del Programa / Proyecto</label>
                            <FirebaseImageUpload
                                ref={imageRef}
                                themeColor={accent}
                                folder="programs"
                                currentImageUrl={formData.imageUrl}
                                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                            />
                            {showErrors && !formData.imageUrl?.trim() && (
                                <span className="text-[9px] font-black text-red-500 uppercase mt-3 ml-4 tracking-widest flex items-center gap-2">
                                    <XCircle size={10} /> Debes subir una imagen para el programa
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Descripción Detallada del Programa</label>
                            <textarea
                                name="description" required rows="4" value={formData.description} onChange={handleChange}
                                placeholder="Describe el impacto social y ambiental de este proyecto..."
                                className={`w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 transition-all font-medium text-xs text-gray-900 dark:text-white outline-none dark:placeholder:text-gray-500 min-h-[120px] ${showErrors && !formData.description?.trim() ? 'border-red-500/50 shadow-[0_0_15px_-5px_red]' : 'border-transparent'}`}
                                onFocus={(e) => { e.target.style.borderColor = accent; }}
                                onBlur={(e) => { e.target.style.borderColor = showErrors && !formData.description?.trim() ? 'rgba(239, 68, 68, 0.5)' : 'transparent'; }}
                            />
                            {showErrors && !formData.description?.trim() && <span className="text-[9px] font-black text-red-500 uppercase mt-2 ml-4 tracking-widest">Escribe una descripción</span>}
                        </div>
                    </div>

                    {/* SECCIÓN 3: Objetivos y Actividades */}
                    <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                            <Award size={18} style={{ color: accent }} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Metas y Actividades</h3>
                        </div>

                        <div className="space-y-8">
                            {/* Objetivos UI */}
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Target size={14} style={{ color: accent }} /> Objetivos Estratégicos
                                </label>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text" value={tempObjective} onChange={(e) => setTempObjective(e.target.value)}
                                        placeholder="Definir nuevo objetivo..."
                                        className="flex-1 px-5 py-4 rounded-[1.2rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all outline-none text-xs font-bold dark:text-white dark:placeholder:text-gray-500"
                                        style={{ '--tw-ring-color': `${accent} 20` }}
                                        onFocus={(e) => e.target.style.borderColor = accent}
                                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('objectives', tempObjective, setTempObjective))}
                                    />
                                    <button
                                        type="button" onClick={() => addItem('objectives', tempObjective, setTempObjective)}
                                        className="p-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[1.2rem] shadow-xl active:scale-95 transition-all hover:opacity-90"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {formData.objectives.map((obj, i) => (
                                            <motion.div
                                                key={`obj - ${i} `} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 rounded-[1.2rem] group hover:border-gray-200 dark:hover:border-white/10 transition-all shadow-sm"
                                            >
                                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-lg" style={{ backgroundColor: accent }}>
                                                    {i + 1}
                                                </div>
                                                <span className="flex-1 text-[11px] font-bold text-gray-700 dark:text-gray-200 leading-relaxed uppercase tracking-tight">{obj}</span>
                                                <button type="button" onClick={() => removeItem('objectives', i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"><X size={16} /></button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Actividades UI */}
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Activity size={14} style={{ color: '#3b82f6' }} /> Plan de Actividades
                                </label>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text" value={tempActivity} onChange={(e) => setTempActivity(e.target.value)}
                                        placeholder="Nueva actividad técnica..."
                                        className="flex-1 px-5 py-4 rounded-[1.2rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all outline-none text-xs font-bold dark:text-white dark:placeholder:text-gray-500"
                                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                        onBlur={(e) => e.target.style.borderColor = 'transparent'}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('activities', tempActivity, setTempActivity))}
                                    />
                                    <button
                                        type="button" onClick={() => addItem('activities', tempActivity, setTempActivity)}
                                        className="p-4 bg-blue-600 text-white rounded-[1.2rem] shadow-xl active:scale-95 transition-all hover:bg-blue-700"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <AnimatePresence>
                                        {formData.activities.map((act, i) => (
                                            <motion.div
                                                key={`act - ${i} `} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex items-center gap-4 p-4 bg-blue-500/[0.02] border border-blue-500/10 rounded-[1.2rem] group transition-all hover:border-blue-500/20 shadow-sm border-l-4 border-l-blue-500"
                                            >
                                                <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg">
                                                    <Activity size={12} />
                                                </div>
                                                <span className="flex-1 text-[11px] font-black uppercase tracking-widest text-gray-800 dark:text-gray-100">{act}</span>
                                                <button type="button" onClick={() => removeItem('activities', i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"><X size={16} /></button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 4: Contacto (Opcional) */}
                    <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                            <Building2 size={18} style={{ color: accent }} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Canales de Contacto <span className="text-[9px] lowercase font-medium opacity-60">(opcional)</span></h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Correo Electrónico</label>
                                <input
                                    type="email" name="contact.email" value={formData.contact?.email} onChange={handleChange}
                                    placeholder="ejemplo@organizacion.com"
                                    className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-sm text-gray-900 dark:text-white outline-none dark:placeholder:text-gray-500"
                                    onFocus={(e) => { e.target.style.borderColor = accent; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Teléfono de Contacto</label>
                                <input
                                    type="text" name="contact.phone" value={formData.contact?.phone} onChange={handleChange}
                                    placeholder="+51 999 999 999"
                                    className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-sm text-gray-900 dark:text-white outline-none dark:placeholder:text-gray-500"
                                    onFocus={(e) => { e.target.style.borderColor = accent; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                                />
                            </div>
                            <div className="md:col-span-2 flex flex-col">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Sitio Web / Link</label>
                                <input
                                    type="text" name="contact.website" value={formData.contact?.website} onChange={handleChange}
                                    placeholder="https://tu-organizacion.com"
                                    className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-bold text-sm text-gray-900 dark:text-white outline-none dark:placeholder:text-gray-500"
                                    onFocus={(e) => { e.target.style.borderColor = accent; }}
                                    onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 5: INDICACIONES PARA PARTICIPANTES (Visible para Gestor/Admin) */}
                    <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 border-l-4 pl-4" style={{ borderColor: accent }}>
                            <MessageSquare size={18} style={{ color: accent }} />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Indicaciones para Participantes</h3>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">
                                ¿Qué deben saber los participantes al unirse? <span className="text-[9px] lowercase font-medium opacity-60">(opcional)</span>
                            </label>
                            <textarea
                                name="indications"
                                rows="3"
                                value={formData.indications || ''}
                                onChange={handleChange}
                                placeholder="Escribe aquí los pasos a seguir o información útil para el usuario..."
                                className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent transition-all font-medium text-xs text-gray-900 dark:text-white outline-none dark:placeholder:text-gray-500 min-h-[80px] focus:bg-white dark:focus:bg-gray-800"
                                onFocus={(e) => { e.target.style.borderColor = accent; }}
                                onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                            />
                        </div>
                    </div>

                    {/* SECCIÓN 6: Validación Administrativa (Solo ADMIN) */}
                    {isAdmin && (
                        <div className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.02] border-2 border-dashed border-gray-200 dark:border-white/10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/20 text-amber-500 rounded-xl">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-800 dark:text-gray-200">Moderación del Programa</h3>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Define el estado administrativo del proyecto</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { id: 'PENDING', label: 'Pendiente', color: '#f59e0b', bg: 'bg-amber-500', icon: Clock },
                                    { id: 'APPROVED', label: 'Aprobado', color: '#10b981', bg: 'bg-emerald-500', icon: CheckCircle2 },
                                    { id: 'REJECTED', label: 'Rechazado', color: '#ef4444', bg: 'bg-red-500', icon: XCircle }
                                ].map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status: s.id })}
                                        className={`py-5 px-4 rounded-[2rem] flex flex-col items-center gap-3 transition-all border-2 relative overflow-hidden group
                                        ${formData.status === s.id
                                                ? 'text-white border-transparent'
                                                : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-400 hover:border-gray-200 dark:hover:border-white/10'
                                            }`}
                                        style={formData.status === s.id ? {
                                            backgroundColor: s.color,
                                            boxShadow: `0 20px 40px ${s.color}30`
                                        } : {}}
                                    >
                                        <div className={`p-2 rounded-xl transition-all ${formData.status === s.id ? 'bg-white/20' : 'bg-gray-50 dark:bg-white/5'}`}>
                                            <s.icon size={20} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</span>

                                        {formData.status === s.id && (
                                            <motion.div
                                                layoutId="activeStatus"
                                                className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                                    <MessageSquare size={14} className="text-amber-500" /> Observaciones Críticas y Feedback
                                </label>
                                <textarea
                                    name="observations"
                                    rows="6"
                                    value={formData.observations || ''}
                                    onChange={handleChange}
                                    placeholder="Escribe aquí las correcciones necesarias o felicitaciones para el gestor..."
                                    className="w-full px-8 py-6 rounded-[2rem] bg-white dark:bg-[#080c14] border-2 border-transparent focus:border-amber-500/20 outline-none text-xs font-bold leading-relaxed shadow-inner dark:text-white dark:placeholder:text-gray-600 transition-all"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="p-8 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex gap-4">
                    <button onClick={onClose} className="flex-1 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">Cancelar</button>
                    <button
                        onClick={handleSubmit} disabled={isLoading}
                        className="flex-[2] px-10 py-4 text-white rounded-[1.5rem] text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                        style={{ backgroundColor: accent, boxShadow: `0 15px 35px ${accent} 40` }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (activeProgram ? 'Actualizar Proyecto' : 'Publicar Programa')}
                        <Save size={20} />
                    </button>
                </div>
            </div>

            <ConfirmModal
                {...modalConfig}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
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


export default ProgramFormModal;