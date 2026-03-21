import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, LayoutGrid, CheckCircle2, Eye, EyeOff, ShieldCheck, RefreshCw, Briefcase, Phone } from 'lucide-react';
import { useCreateCoordinatorMutation, useUpdateCoordinatorMutation } from '../../store/coordinators/coordinatorsApi';
import { useGetProgramsQuery } from '../../store/programs';
import { useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import ConfirmModal from '../../components/shared/ConfirmModal';

const CoordinatorFormModal = ({ isOpen, onClose, t, themeColor, initialData = null, managerId, managerName }) => {
    const accent = themeColor || '#018F64';
    const [createCoordinator, { isLoading: isCreating }] = useCreateCoordinatorMutation();
    const [updateCoordinator, { isLoading: isUpdating }] = useUpdateCoordinatorMutation();
    const { data: programs = [] } = useGetProgramsQuery();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        position: '', // Cargo
        programs: []
    });
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'success' });

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                fullName: initialData.fullName || '',
                email: initialData.email || '',
                password: '',
                phone: initialData.phone || '',
                position: initialData.position || '',
                programs: initialData.programs?.map(p => p._id || p) || []
            });
        } else if (isOpen) {
            setFormData({ fullName: '', email: '', password: '', phone: '', position: '', programs: [] });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const isLoading = isCreating || isUpdating;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleProgram = (id) => {
        setFormData(prev => {
            if (prev.programs.includes(id)) {
                return { ...prev, programs: prev.programs.filter(p => p !== id) };
            } else {
                return { ...prev, programs: [...prev.programs, id] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (initialData) {
                const updateData = { ...formData, id: initialData._id };
                if (!updateData.password) delete updateData.password;
                await updateCoordinator(updateData).unwrap();
            } else {
                await createCoordinator({ ...formData, managerId }).unwrap();
            }
            onClose();
        } catch (error) {
            setLocalError(error.data?.message || 'Error al guardar el coordinador');
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[999999] flex justify-end">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            <div
                className="relative w-full max-w-md bg-white dark:bg-[#0f172a] h-full shadow-2xl flex flex-col border-l border-white/5"
                style={{
                    animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Premium */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl"
                            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 8px 20px ${accent}40` }}
                        >
                            <User size={24} className="drop-shadow-md" />
                        </div>
                        <div>
                            <h2 className="text-[18px] font-black tracking-tight text-gray-900 dark:text-white uppercase">
                                {initialData ? 'Editar Perfil' : 'Nuevo Coordinador'}
                            </h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                                {managerName ? `Equipo: ${managerName}` : 'Gestión de Personal'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all hover:rotate-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                    {localError && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                            <p className="text-[11px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest leading-relaxed">
                                {localError}
                            </p>
                        </div>
                    )}
                    <form id="coordinatorForm" onSubmit={handleSubmit} className="space-y-6">

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={16} className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Ej. Raul Flores"
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent rounded-2xl text-[13px] font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={16} className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="raul@ejemplo.com"
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent rounded-2xl text-[13px] font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Celular / Teléfono</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone size={16} className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="987 654 321"
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent rounded-2xl text-[13px] font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* NUEVO CAMPO: CARGO */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Cargo / Posición</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Briefcase size={16} className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    placeholder="Ej. Líder Regional"
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent rounded-2xl text-[13px] font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                                {initialData ? 'Seguridad' : 'Contraseña Temporal'}
                            </label>
                            {initialData ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm('¿Enviar enlace de restablecimiento?')) {
                                            setModalConfig({
                                                isOpen: true,
                                                title: 'Enviado',
                                                message: 'Se ha enviado el enlace al correo del coordinador.',
                                                variant: 'success'
                                            });
                                        }
                                    }}
                                    className="w-full py-4 px-6 text-[11px] font-black uppercase tracking-widest transition-all rounded-2xl flex items-center justify-center gap-3 border-2 border-dashed border-gray-200 dark:border-white/10 text-emerald-500 hover:bg-emerald-500/5 hover:border-emerald-500/50"
                                >
                                    <RefreshCw size={16} /> Enviar Restablecimiento
                                </button>
                            ) : (
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={16} className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required={!initialData}
                                        className="w-full pl-11 pr-12 py-4 bg-gray-50 dark:bg-white/5 border border-transparent rounded-2xl text-[13px] font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <LayoutGrid size={14} /> Programas Asignados
                            </label>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {programs.filter(p => !managerId || p.managedBy === managerId || p.institution === managerId).map(p => {
                                    const isSelected = formData.programs.includes(p._id);
                                    return (
                                        <div
                                            key={p._id}
                                            onClick={() => toggleProgram(p._id)}
                                            className={`
                                                flex items-center gap-4 p-4 rounded-[1.5rem] border-2 cursor-pointer transition-all
                                                ${isSelected
                                                    ? 'bg-emerald-500/10 border-emerald-500/30'
                                                    : 'bg-gray-50 dark:bg-white/5 border-transparent hover:bg-gray-100 dark:hover:bg-white/10'
                                                }
                                            `}
                                        >
                                            <div className="relative flex-1 min-w-0">
                                                <div className="text-[12px] font-black text-gray-900 dark:text-white uppercase truncate">{p.title}</div>
                                                <div className="text-[10px] font-bold text-gray-400 truncate">{p.location}</div>
                                            </div>
                                            {isSelected && <ShieldCheck size={20} className="text-emerald-500" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Sticky */}
                <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="coordinatorForm"
                        disabled={isLoading}
                        className="flex-[1.5] py-4 px-6 rounded-2xl text-[11px] font-black text-white shadow-2xl disabled:opacity-50 transition-all uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 15px 35px ${accent}40` }}
                    >
                        {isLoading ? '...' : (initialData ? 'Guardar' : 'Crear')}
                        <ShieldCheck size={18} />
                    </button>
                </div>
            </div>

            <ConfirmModal
                {...modalConfig}
                onClose={() => {
                    setModalConfig({ ...modalConfig, isOpen: false });
                    if (modalConfig.variant === 'success') onClose();
                }}
            />

            <style jsx>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.2); border-radius: 4px; }
            `}</style>
        </div>,
        document.body
    );
};

export default CoordinatorFormModal;
