import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Save, Loader2, UploadCloud, Pin, Eye } from 'lucide-react';
import ConfirmModal from '../../../components/shared/ConfirmModal';
// Asegúrate de importar desde TU api creada
import { useCreatePartnerMutation, useUpdatePartnerMutation } from '../../../store/partners';

const PartnerFormModal = ({ isOpen, onClose }) => {
    // 1. Obtenemos el socio seleccionado del estado global
    const { activePartner } = useSelector((state) => state.partners);

    // 2. Hooks de la API para guardar cambios
    const [createPartner, { isLoading: isCreating }] = useCreatePartnerMutation();
    const [updatePartner, { isLoading: isUpdating }] = useUpdatePartnerMutation();

    // 3. Estado inicial basado en tu JSON
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
        // AGREGAMOS ESTOS CAMPOS PARA QUE EL BACKEND NO DE ERROR 400
        rewardsCount: 0,
        usersCount: 0
    };

    const [formData, setFormData] = useState(initialState);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'danger' });

    // Rellenar formulario si estamos editando
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

        // --- VALIDACIÓN RÁPIDA PARA EL LOGO ---
        // Si el usuario no puso logo, el backend dará error. 
        // Asignamos una imagen por defecto si está vacío.
        const payload = {
            ...formData,
            logo: formData.logo.trim() === ''
                ? 'https://via.placeholder.com/150' // URL por defecto válida
                : formData.logo,
            isLocked: false // Al guardar, desbloqueamos el perfil automáticamente
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

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {activePartner ? 'Editar Socio' : 'Nuevo Socio'}
                        </h2>
                        <p className="text-sm text-gray-500">Completa la información de la alianza</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* FORMULARIO */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="partnerForm" onSubmit={handleSubmit} className="space-y-6">

                        {/* Nombre y Tipo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col">
                                <label className="label-text pb-1">Nombre de la Entidad</label>
                                <input
                                    type="text" name="name" required
                                    value={formData.name} onChange={handleChange}
                                    className="input-field border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full"
                                    placeholder="Ej: Alianza Verde"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="label-text pb-1">Tipo de Filtro</label>
                                <select
                                    name="filterType"
                                    value={formData.filterType} onChange={handleChange}
                                    className="input-field border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full"
                                >
                                    <option value="ong">ONG</option>
                                    <option value="financial">Financiera</option>
                                    <option value="government">Gobierno</option>
                                    <option value="corporate">Corporativo</option>
                                </select>
                            </div>
                        </div>

                        {/* Etiqueta y Color */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col">
                                <label className="label-text pb-1">Etiqueta Visible</label>
                                <input
                                    type="text" name="typeLabel"
                                    value={formData.typeLabel} onChange={handleChange}
                                    className="input-field border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full"
                                    placeholder="Ej: Organización"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="label-text pb-1">Color Institucional</label>
                                <div className="flex items-center gap-3 h-[42px]">
                                    <input
                                        type="color" name="mainColor"
                                        value={formData.mainColor} onChange={handleChange}
                                        className="h-full w-20 rounded-lg cursor-pointer border-0 p-0"
                                    />
                                    <span className="text-sm font-mono text-gray-500">{formData.mainColor}</span>
                                </div>
                            </div>
                        </div>

                        {/* Logo */}
                        <div className="flex flex-col">
                            <label className="label-text pb-1">URL del Logo (Obligatorio)</label>
                            <div className="relative">
                                <UploadCloud className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="url" name="logo"
                                    value={formData.logo} onChange={handleChange}
                                    className="input-field pl-10 border dark:border-gray-700 rounded-lg py-2 w-full"
                                    placeholder="https://ejemplo.com/logo.png"
                                    required // Hacemos que el navegador valide que no esté vacío
                                />
                            </div>
                            {formData.logo && (
                                <div className="mt-3 p-2 bg-gray-50 rounded-lg inline-block border border-gray-200">
                                    <img src={formData.logo} alt="Preview" className="h-12 object-contain" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                            )}
                        </div>

                        {/* Descripciones */}
                        <div className="flex flex-col">
                            <label className="label-text pb-1">Descripción</label>
                            <textarea
                                name="description" rows="3"
                                value={formData.description} onChange={handleChange}
                                className="input-field resize-none border dark:border-gray-700 rounded-lg px-2.5 py-2 w-full"
                                placeholder="Breve descripción..."
                            ></textarea>
                        </div>

                        <div className="flex flex-col">
                            <label className="label-text text-green-700 dark:text-green-400 pb-1">Compromiso Ambiental</label>
                            <textarea
                                name="environmentalCommitment" rows="2"
                                value={formData.environmentalCommitment} onChange={handleChange}
                                className="input-field bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 focus:ring-green-500 rounded-lg px-2.5 py-2 w-full"
                                placeholder="Ej: Recuperar 5 toneladas..."
                            ></textarea>
                        </div>

                        {/* Visibilidad y Destacado */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="checkbox" name="isVisible"
                                    checked={formData.isVisible} onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                />
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Eye size={18} />
                                    Visible en Landing
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                <input
                                    type="checkbox" name="isPinned"
                                    checked={formData.isPinned} onChange={handleChange}
                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                />
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Pin size={18} />
                                    Destacar arriba
                                </div>
                            </label>
                        </div>

                    </form>
                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-2xl">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors">
                        Cancelar
                    </button>
                    <button
                        type="submit" form="partnerForm"
                        disabled={isCreating || isUpdating}
                        className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center gap-2"
                    >
                        {(isCreating || isUpdating) ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                        Guardar Socio
                    </button>
                </div>
            </div>

            <style>{`
                .label-text { @apply block text-sm font-semibold text-gray-700 dark:text-gray-300; }
                .input-field { @apply bg-white dark:bg-gray-800 outline-none transition-all text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500; }
            `}</style>

            <ConfirmModal
                {...modalConfig}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default PartnerFormModal;