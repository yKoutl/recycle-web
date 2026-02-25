import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Save, Loader2, UploadCloud, MapPin, Building2, Calendar, Trophy } from 'lucide-react';
import ConfirmModal from '../../../components/shared/ConfirmModal';
// IMPORTANTE: Asegúrate de importar desde TU api de programs
import { useCreateProgramMutation, useUpdateProgramMutation } from '../../../store/programs';

const ProgramFormModal = ({ isOpen, onClose, themeColor }) => {
    const { activeProgram } = useSelector((state) => state.programs);
    const [createProgram, { isLoading: isCreating }] = useCreateProgramMutation();
    const [updateProgram, { isLoading: isUpdating }] = useUpdateProgramMutation();
    const accent = themeColor || '#018F64';

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
        category: 'PROYECTO'
    };

    const [formData, setFormData] = useState(initialState);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'danger' });
    const [tempObjective, setTempObjective] = useState('');
    const [tempActivity, setTempActivity] = useState('');

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
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                participants: Number(formData.participants),
                points: Number(formData.points)
            };

            if (activeProgram) {
                await updateProgram({ id: activeProgram._id, ...payload }).unwrap();
            } else {
                await createProgram(payload).unwrap();
            }
            onClose();
        } catch (error) {
            console.error("Error:", error);
            setModalConfig({
                isOpen: true,
                title: 'Error al Guardar',
                message: 'No se pudo guardar el programa. Por favor verifica que todos los campos requeridos estén llenos e intenta de nuevo.',
                variant: 'danger'
            });
        }
    };

    if (!isOpen) return null;

    const isLoading = isCreating || isUpdating;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {activeProgram ? 'Editar Programa' : 'Nuevo Programa'}
                        </h2>
                        <p className="text-sm text-gray-500">Detalles de la iniciativa de reforestación o social</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* FORM BODY */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="programForm" onSubmit={handleSubmit} className="space-y-6">

                        {/* Título y Organización */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className=" flex flex-col">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Título del Programa</label>
                                <input
                                    type="text" name="title" required value={formData.title} onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full placeholder:text-gray-500"
                                    placeholder="Ej: Reforesta Perú"
                                    onFocus={(e) => e.target.style.borderColor = accent}
                                    onBlur={(e) => e.target.style.borderColor = ''}
                                />
                            </div>
                            <div className=" flex flex-col">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Organización Responsable</label>
                                <div className="relative">
                                    <Building2 className="absolute right-3 top-5 text-gray-400" size={18} />
                                    <input
                                        type="text" name="organization" value={formData.organization} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full placeholder:text-gray-500"
                                        placeholder="Ej: Ministerio del Ambiente"
                                        onFocus={(e) => e.target.style.borderColor = accent}
                                        onBlur={(e) => e.target.style.borderColor = ''}
                                    />
                                </div>
                            </div>
                            <div className=" flex flex-col">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tipo de Organización</label>
                                <select
                                    name="organizationType" value={formData.organizationType} onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full"
                                    onFocus={(e) => e.target.style.borderColor = accent}
                                    onBlur={(e) => e.target.style.borderColor = ''}
                                >
                                    <option value="ESTADO">Estado</option>
                                    <option value="PRIVADO">Privado</option>
                                    <option value="ONG">ONG</option>
                                    <option value="COMUNIDAD">Comunidad</option>
                                </select>
                            </div>
                            <div className=" flex flex-col">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Categoría</label>
                                <select
                                    name="category" value={formData.category} onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full"
                                    onFocus={(e) => e.target.style.borderColor = accent}
                                    onBlur={(e) => e.target.style.borderColor = ''}
                                >
                                    <option value="PROYECTO">Proyecto</option>
                                    <option value="TALLER">Taller</option>
                                    <option value="RECOLECCIÓN">Recolección</option>
                                    <option value="VOLUNTARIADO">Voluntariado</option>
                                </select>
                            </div>
                        </div>

                        {/* Detalles Numéricos */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className=" flex flex-col">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ubicación</label>
                                <div className="relative">
                                    <MapPin className="absolute right-3 top-5 text-gray-400" size={18} />
                                    <input
                                        type="text" name="location" value={formData.location} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full placeholder:text-gray-500"
                                        placeholder="Ej: Lima, Perú"
                                        onFocus={(e) => e.target.style.borderColor = accent}
                                        onBlur={(e) => e.target.style.borderColor = ''}
                                    />
                                </div>
                            </div>
                            <div className=" flex flex-col">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Fecha del Evento</label>
                                <div className="relative">
                                    <input
                                        type="date" name="date" value={formData.date} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full"
                                        onFocus={(e) => e.target.style.borderColor = accent}
                                        onBlur={(e) => e.target.style.borderColor = ''}
                                    />
                                </div>
                            </div>
                            <div className=" flex flex-col">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Duración</label>
                                <div className="relative">
                                    <Calendar className="absolute right-3 top-5 text-gray-400" size={18} />
                                    <input
                                        type="text" name="duration" value={formData.duration} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full placeholder:text-gray-500"
                                        placeholder="Ej: 6 meses"
                                        onFocus={(e) => e.target.style.borderColor = accent}
                                        onBlur={(e) => e.target.style.borderColor = ''}
                                    />
                                </div>
                            </div>
                            <div className=" flex flex-col">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Puntos Recompensa</label>
                                <div className="relative">
                                    <Trophy className="absolute right-3 top-5" style={{ color: accent }} size={18} />
                                    <input
                                        type="number" name="points" value={formData.points} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full"
                                        onFocus={(e) => e.target.style.borderColor = accent}
                                        onBlur={(e) => e.target.style.borderColor = ''}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Imagen */}
                        <div className="space-y-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Imagen de Portada</label>

                            {formData.imageUrl && (
                                <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-inner group">
                                    <img
                                        src={formData.imageUrl}
                                        alt="Vista previa"
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/20" />
                                </div>
                            )}

                            <div className="relative">
                                <UploadCloud className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white pl-11 text-sm placeholder:text-gray-500"
                                    placeholder="Pegar URL de imagen (https://...)"
                                    onFocus={(e) => e.target.style.borderColor = accent}
                                    onBlur={(e) => e.target.style.borderColor = ''}
                                />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="flex flex-col">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Descripción General</label>
                            <textarea
                                name="description" rows="3" value={formData.description} onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white mt-2 resize-none border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full placeholder:text-gray-500"
                                onFocus={(e) => e.target.style.borderColor = accent}
                                onBlur={(e) => e.target.style.borderColor = ''}
                            ></textarea>
                        </div>

                        {/* --- SECCIÓN LISTAS (Objetivos y Actividades) --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            {/* Objetivos */}
                            <div className=" flex flex-col">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1" style={{ color: accent }}>Objetivos</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={tempObjective}
                                        onChange={(e) => setTempObjective(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white text-sm placeholder:text-gray-500"
                                        placeholder="Nuevo objetivo..."
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('objectives', tempObjective, setTempObjective))}
                                        onFocus={(e) => e.target.style.borderColor = accent}
                                        onBlur={(e) => e.target.style.borderColor = ''}
                                    />
                                    <button
                                        type="button" onClick={() => addItem('objectives', tempObjective, setTempObjective)}
                                        className="p-2 rounded-lg transition-all"
                                        style={{ backgroundColor: `${accent}20`, color: accent }}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <ul className="space-y-2">
                                    {formData.objectives.map((obj, i) => (
                                        <li key={i} className="flex justify-between items-center text-sm bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-white/10">
                                            <span>• {obj}</span>
                                            <button type="button" onClick={() => removeItem('objectives', i)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Actividades */}
                            <div className=" flex flex-col">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 text-blue-700 dark:text-blue-400">Actividades</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={tempActivity}
                                        onChange={(e) => setTempActivity(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white text-sm placeholder:text-gray-500"
                                        placeholder="Nueva actividad..."
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('activities', tempActivity, setTempActivity))}
                                        onFocus={(e) => e.target.style.borderColor = accent}
                                        onBlur={(e) => e.target.style.borderColor = ''}
                                    />
                                    <button type="button" onClick={() => addItem('activities', tempActivity, setTempActivity)} className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200">
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <ul className="space-y-2">
                                    {formData.activities.map((act, i) => (
                                        <li key={i} className="flex justify-between items-center text-sm bg-white dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-white/10">
                                            <span>• {act}</span>
                                            <button type="button" onClick={() => removeItem('activities', i)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-gray-100 dark:border-white/10 pt-5 mt-5">
                            <div className="md:col-span-3">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Información de Contacto</h3>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email de Contacto</label>
                                <input
                                    type="email"
                                    name="contact.email"
                                    required
                                    value={formData.contact.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white mt-2 pl-2 border dark:border-gray-700 rounded-lg px-1 py-1 w-full placeholder:text-gray-500"
                                    placeholder="contacto@ejemplo.com"
                                    onFocus={(e) => e.target.style.borderColor = accent}
                                    onBlur={(e) => e.target.style.borderColor = ''}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    name="contact.phone"
                                    required
                                    value={formData.contact.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white mt-2 pl-2 border dark:border-gray-700 rounded-lg px-1 py-1 w-full placeholder:text-gray-500"
                                    placeholder="+51 999 999 999"
                                    onFocus={(e) => e.target.style.borderColor = accent}
                                    onBlur={(e) => e.target.style.borderColor = ''}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 ">Sitio Web (Opcional)</label>
                                <input
                                    type="text"
                                    name="contact.website"
                                    value={formData.contact.website}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white mt-2 pl-2 border dark:border-gray-700 rounded-lg px-1 py-1 w-full placeholder:text-gray-500"
                                    placeholder="www.ejemplo.com"
                                    onFocus={(e) => e.target.style.borderColor = accent}
                                    onBlur={(e) => e.target.style.borderColor = ''}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">Cancelar</button>
                    <button
                        type="submit" form="programForm" disabled={isLoading}
                        className="px-6 py-2.5 rounded-xl text-white font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
                        style={{ backgroundColor: accent, boxShadow: `0 8px 20px ${accent}30` }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                        Guardar Programa
                    </button>
                </div>
            </div>


            <ConfirmModal
                {...modalConfig}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
            />
        </div>
    );
};

// Necesario importar Plus localmente para el componente
const Plus = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;

export default ProgramFormModal;