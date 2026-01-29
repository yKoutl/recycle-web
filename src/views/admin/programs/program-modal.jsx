import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Save, Loader2, UploadCloud, MapPin, Building2, Calendar, Trophy } from 'lucide-react';
// IMPORTANTE: Asegúrate de importar desde TU api de programs
import { useCreateProgramMutation, useUpdateProgramMutation } from '../../../store/programs';

const ProgramFormModal = ({ isOpen, onClose }) => {
    // 1. Obtener programa seleccionado (o null si es crear)
    const { activeProgram } = useSelector((state) => state.programs);

    // 2. Hooks de la API
    const [createProgram, { isLoading: isCreating }] = useCreateProgramMutation();
    const [updateProgram, { isLoading: isUpdating }] = useUpdateProgramMutation();

    // 3. Estado inicial basado en TU JSON
    const initialState = {
        title: '',
        organization: '',
        organizationType: 'ESTADO', // Valor por defecto
        participants: 0,
        location: '',
        duration: '',
        points: 0,
        imageUrl: '',
        description: '',
        objectives: [], // Array de strings
        activities: [], // Array de strings
        contact: {
            email: '',
            phone: '',
            website: ''
        }
    };

    const [formData, setFormData] = useState(initialState);

    // Estados temporales para inputs de arrays (Objetivos y Actividades)
    const [tempObjective, setTempObjective] = useState('');
    const [tempActivity, setTempActivity] = useState('');

    // Rellenar formulario al abrir
    useEffect(() => {
        if (isOpen) {
            setFormData(activeProgram || initialState);
        }
    }, [isOpen, activeProgram]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Manejo especial para campos anidados (contact.email, etc.)
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

    // Funciones para manejar Arrays (Objetivos / Actividades)
    const addItem = (field, value, setter) => {
        if (!value.trim()) return;
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], value]
        }));
        setter(''); // Limpiar input temporal
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
            // Aseguramos que números sean números
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
            alert("Error al guardar: " + JSON.stringify(error));
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
                                <label className="label-text">Título del Programa</label>
                                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="input-field mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full" placeholder="Ej: Reforesta Perú" />
                            </div>
                            <div className=" flex flex-col">
                                <label className="label-text">Organización Responsable</label>
                                <div className="relative">
                                    <Building2 className="absolute right-3 top-5 text-gray-400" size={18} />
                                    <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="input-field mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full" placeholder="Ej: Ministerio del Ambiente" />
                                </div>
                            </div>
                            <div className=" flex flex-col">
                                <label className="label-text">Tipo de Organización</label>
                                <select name="organizationType" value={formData.organizationType} onChange={handleChange} className="input-field mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full">
                                    <option value="ESTADO">Estado</option>
                                    <option value="PRIVADO">Privado</option>
                                    <option value="ONG">ONG</option>
                                    <option value="COMUNIDAD">Comunidad</option>
                                </select>
                            </div>
                        </div>

                        {/* Detalles Numéricos */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className=" flex flex-col">
                                <label className="label-text">Ubicación</label>
                                <div className="relative">
                                    <MapPin className="absolute right-3 top-5 text-gray-400" size={18} />
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full" placeholder="Ej: Lima, Perú" />
                                </div>
                            </div>
                            <div className=" flex flex-col">
                                <label className="label-text">Duración</label>
                                <div className="relative">
                                    <Calendar className="absolute right-3 top-5 text-gray-400" size={18} />
                                    <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="input-field mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full" placeholder="Ej: 6 meses" />
                                </div>
                            </div>
                            <div className=" flex flex-col">
                                <label className="label-text">Puntos Recompensa</label>
                                <div className="relative">
                                    <Trophy className="absolute right-3 top-5 text-yellow-500" size={18} />
                                    <input type="number" name="points" value={formData.points} onChange={handleChange} className="input-field mt-2 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full" />
                                </div>
                            </div>
                        </div>

                        {/* Imagen */}
                        <div>
                            <label className="label-text">Imagen de Portada (URL)</label>
                            <div className="relative">
                                <UploadCloud className="absolute left-3 top-5 text-gray-400" size={20} />
                                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="input-field mt-2 pl-10 border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full" placeholder="https://..." />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="flex flex-col">
                            <label className="label-text">Descripción General</label>
                            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} className="input-field mt-2 resize-none border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full"></textarea>
                        </div>

                        {/* --- SECCIÓN LISTAS (Objetivos y Actividades) --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            {/* Objetivos */}
                            <div className=" flex flex-col">
                                <label className="label-text text-green-700 dark:text-green-400">Objetivos</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={tempObjective}
                                        onChange={(e) => setTempObjective(e.target.value)}
                                        className="input-field text-sm"
                                        placeholder="Nuevo objetivo..."
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('objectives', tempObjective, setTempObjective))}
                                    />
                                    <button type="button" onClick={() => addItem('objectives', tempObjective, setTempObjective)} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <ul className="space-y-2">
                                    {formData.objectives.map((obj, i) => (
                                        <li key={i} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-gray-200">
                                            <span>• {obj}</span>
                                            <button type="button" onClick={() => removeItem('objectives', i)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Actividades */}
                            <div className=" flex flex-col">
                                <label className="label-text text-blue-700 dark:text-blue-400">Actividades</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={tempActivity}
                                        onChange={(e) => setTempActivity(e.target.value)}
                                        className="input-field text-sm"
                                        placeholder="Nueva actividad..."
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('activities', tempActivity, setTempActivity))}
                                    />
                                    <button type="button" onClick={() => addItem('activities', tempActivity, setTempActivity)} className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <ul className="space-y-2">
                                    {formData.activities.map((act, i) => (
                                        <li key={i} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-gray-200">
                                            <span>• {act}</span>
                                            <button type="button" onClick={() => removeItem('activities', i)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-gray-100 pt-5 mt-5">
                            <div className="md:col-span-3">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Información de Contacto</h3>
                            </div>

                            <div>
                                <label className="label-text">Email de Contacto</label>
                                <input
                                    type="email"
                                    name="contact.email" // Ojo con el nombre compuesto
                                    required // <--- ESTO ES IMPORTANTE
                                    value={formData.contact.email}
                                    onChange={handleChange}
                                    className="input-field mt-2 pl-2 border dark:border-gray-700 rounded-lg px-1 py-1 w-full"
                                    placeholder="contacto@ejemplo.com"
                                />
                            </div>

                            <div>
                                <label className="label-text">Teléfono</label>
                                <input
                                    type="tel"
                                    name="contact.phone"
                                    required // <--- ESTO ES IMPORTANTE
                                    value={formData.contact.phone}
                                    onChange={handleChange}
                                    className="input-field mt-2 pl-2 border dark:border-gray-700 rounded-lg px-1 py-1 w-full"
                                    placeholder="+51 999 999 999"
                                />
                            </div>

                            <div>
                                <label className="label-text ">Sitio Web (Opcional)</label>
                                <input
                                    type="text"
                                    name="contact.website"
                                    value={formData.contact.website}
                                    onChange={handleChange}
                                    className="input-field mt-2 pl-2 border dark:border-gray-700 rounded-lg px-1 py-1 w-full"
                                    placeholder="www.ejemplo.com"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors">Cancelar</button>
                    <button type="submit" form="programForm" disabled={isLoading} className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-lg flex items-center gap-2">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                        Guardar Programa
                    </button>
                </div>
            </div>

            <style>{`
                .label-text { @apply block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1; }
                .input-field { @apply w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none transition-all text-gray-900 dark:text-white; }
            `}</style>
        </div>
    );
};

// Necesario importar Plus localmente para el componente
const Plus = ({ size }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;

export default ProgramFormModal;