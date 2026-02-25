import React, { useState, useEffect } from 'react';
import { X, Save, User as UserIcon, Mail, Lock, Shield, UserPlus, Fingerprint, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useRegisterMutation } from '../../store/auth';
import { useUpdateUserMutation } from '../../store/user/usersApi';
import ConfirmModal from '../../components/shared/ConfirmModal';

const GestorFormModal = ({ isOpen, onClose, activeUser = null, isDetailOnly = false, themeColor }) => {
    const [register] = useRegisterMutation();
    const [updateUser] = useUpdateUserMutation();
    const accent = themeColor || '#018F64';
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        documentNumber: '',
        phone: '',
        institution: '',
        role: 'OFFICIAL'
    });

    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'success' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (activeUser) {
                setFormData({
                    fullName: activeUser.fullName || '',
                    email: activeUser.email || '',
                    password: '',
                    documentNumber: activeUser.documentNumber || '',
                    phone: activeUser.phone || '',
                    institution: activeUser.institution || '',
                    role: 'OFFICIAL'
                });
            } else {
                const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();
                setFormData({
                    fullName: '',
                    email: '',
                    password: tempPassword,
                    documentNumber: '',
                    phone: '',
                    institution: '',
                    role: 'OFFICIAL'
                });
            }
        }
    }, [isOpen, activeUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDetailOnly) return;

        setIsLoading(true);
        try {
            if (activeUser) {
                // Modo Edición
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password; // No enviar password si está vacía en edición

                await updateUser({ id: activeUser._id, ...updateData }).unwrap();
                setModalConfig({
                    isOpen: true,
                    title: 'Gestor Actualizado',
                    message: `Los datos de ${formData.fullName} han sido actualizados.`,
                    variant: 'success'
                });
            } else {
                // Modo Creación
                await register(formData).unwrap();
                setModalConfig({
                    isOpen: true,
                    title: 'Gestor Creado',
                    message: `El gestor ${formData.fullName} ha sido registrado correctamente. Contraseña temporal: ${formData.password}`,
                    variant: 'success'
                });
            }
        } catch (err) {
            console.error('Error saving gestor:', err);
            setModalConfig({
                isOpen: true,
                title: 'Error al Guardar',
                message: err.data?.message || 'No se pudo completar la operación. Verifica los datos.',
                variant: 'danger'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const isEditing = !!activeUser;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 text-white rounded-2xl shadow-lg" style={{ backgroundColor: accent, boxShadow: `0 8px 20px ${accent}30` }}>
                            {isDetailOnly ? <UserIcon size={20} /> : (isEditing ? <Save size={20} /> : <UserPlus size={20} />)}
                        </div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                            {isDetailOnly ? 'Detalles del Gestor' : (isEditing ? 'Editar Gestor' : 'Añadir Nuevo Gestor')}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2" style={{ color: accent }}>
                                <UserIcon size={12} /> Nombre Completo
                            </label>
                            <input
                                type="text"
                                readOnly={isDetailOnly}
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 transition-all font-medium disabled:opacity-50 dark:text-white placeholder:text-gray-500"
                                style={{ '--tw-ring-color': `${accent}15` }}
                                onFocus={(e) => e.target.style.borderColor = accent}
                                onBlur={(e) => e.target.style.borderColor = ''}
                                placeholder="Ej: Juan Pérez"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2" style={{ color: accent }}>
                                <Mail size={12} /> Correo Electrónico
                            </label>
                            <input
                                type="email"
                                readOnly={isDetailOnly}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 transition-all font-medium disabled:opacity-50 dark:text-white placeholder:text-gray-500"
                                style={{ '--tw-ring-color': `${accent}15` }}
                                onFocus={(e) => e.target.style.borderColor = accent}
                                onBlur={(e) => e.target.style.borderColor = ''}
                                placeholder="gestor@recycleapp.com"
                                required
                            />
                        </div>

                        {!isDetailOnly && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ color: accent }}>
                                        <Lock size={12} /> {isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña Temporal'}
                                    </label>
                                    {!isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const temp = Math.random().toString(36).slice(-8).toUpperCase();
                                                setFormData({ ...formData, password: temp });
                                                setShowPassword(true);
                                            }}
                                            className="text-[9px] font-black uppercase tracking-tighter flex items-center gap-1 hover:opacity-70 transition-opacity"
                                            style={{ color: accent }}
                                        >
                                            <RefreshCw size={10} /> Generar Nueva
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 transition-all font-medium pr-12 dark:text-white placeholder:text-gray-500"
                                        style={{ '--tw-ring-color': `${accent}15` }}
                                        onFocus={(e) => e.target.style.borderColor = accent}
                                        onBlur={(e) => e.target.style.borderColor = ''}
                                        placeholder={isEditing ? 'Dejar vacío para no cambiar' : '••••••••'}
                                        required={!isEditing}
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2" style={{ color: accent }}>
                                <Fingerprint size={12} /> DNI / Documento
                            </label>
                            <input
                                type="text"
                                readOnly={isDetailOnly}
                                value={formData.documentNumber}
                                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 transition-all font-bold disabled:opacity-50 dark:text-white placeholder:text-gray-500"
                                style={{ '--tw-ring-color': `${accent}15` }}
                                onFocus={(e) => e.target.style.borderColor = accent}
                                onBlur={(e) => e.target.style.borderColor = ''}
                                placeholder="12345678"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2" style={{ color: accent }}>
                                <Shield size={12} /> Institución / Municipio
                            </label>
                            <input
                                type="text"
                                readOnly={isDetailOnly}
                                value={formData.institution || ''}
                                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 transition-all font-bold disabled:opacity-50 dark:text-white placeholder:text-gray-500"
                                style={{ '--tw-ring-color': `${accent}15` }}
                                onFocus={(e) => e.target.style.borderColor = accent}
                                onBlur={(e) => e.target.style.borderColor = ''}
                                placeholder="Ej: Municipalidad de Lima"
                                required
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2" style={{ color: accent }}>
                                <Shield size={12} /> Rol Asignado
                            </label>
                            <div
                                className="w-full bg-white dark:bg-white/5 border rounded-2xl px-5 py-4 text-xs font-black uppercase flex items-center gap-2 italic"
                                style={{ borderColor: `${accent}40`, color: accent }}
                            >
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }}></div>
                                Rol: Gestor de Portal ({formData.institution || 'Sin asignar'})
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-gray-100 dark:border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                        >
                            {isDetailOnly ? 'Cerrar' : 'Cancelar'}
                        </button>
                        {!isDetailOnly && (
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-6 py-4 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                                style={{ backgroundColor: accent, boxShadow: `0 8px 20px ${accent}30` }}
                            >
                                {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar Gestor' : 'Confirmar Gestor')}
                                <Save size={16} />
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <ConfirmModal
                {...modalConfig}
                onClose={() => {
                    setModalConfig({ ...modalConfig, isOpen: false });
                    if (modalConfig.variant === 'success') onClose();
                }}
            />
        </div>
    );
};

export default GestorFormModal;
