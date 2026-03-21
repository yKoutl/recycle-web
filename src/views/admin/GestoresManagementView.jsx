import React, { useState } from 'react';
import { Search, RotateCw, UserPlus, Mail, Trash2, Fingerprint, Plus, Eye, Pencil, Power, CheckCircle2, XCircle, Users, Shield, Send, ChevronDown, ChevronRight, UserCog } from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../../store/user/usersApi';
import GestorFormModal from './GestorFormModal';
import InviteGestorModal from './InviteGestorModal';
import ConfirmModal from '../../components/modals/ConfirmModal';

const GestoresManagementView = ({ t, themeColor }) => {
    const { data: users, isLoading, refetch } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    // Modales
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const [activeGestor, setActiveGestor] = useState(null);
    const [isDetailOnly, setIsDetailOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
    const [expandedRows, setExpandedRows] = useState({});
    const accent = themeColor || '#018F64';

    const gestores = users?.filter(u =>
        u.role?.toUpperCase() === 'MANAGER' &&
        (u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    const handleOpenModal = (gestor = null, detail = false) => {
        setActiveGestor(gestor);
        setIsDetailOnly(detail);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setConfirmAction(() => async () => {
            try {
                await deleteUser(id).unwrap();
            } catch (err) {
                setErrorModal({ isOpen: true, message: err.data?.message || 'Error al eliminar el usuario' });
            }
        });
        setIsConfirmOpen(true);
    };

    const toggleStatus = async (user) => {
        try {
            await updateUser({ id: user._id, isActive: !user.isActive }).unwrap();
        } catch (err) {
            setErrorModal({ isOpen: true, message: err.data?.message || 'Error al cambiar el estado del usuario' });
        }
    };

    const activeCount = gestores.filter(g => g.isActive !== false).length;

    const renderTableActions = (user, isTeamMember = false) => (
        <div className="flex items-center justify-end gap-1.5 px-2">
            <button onClick={(e) => { e.stopPropagation(); handleOpenModal(user, true); }} className="p-2.5 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all hover:scale-110 active:scale-90 shadow-sm hover:shadow-md"><Eye size={16} strokeWidth={2.5} /></button>
            <button onClick={(e) => { e.stopPropagation(); handleOpenModal(user, false); }} className="p-2.5 rounded-xl text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all hover:scale-110 active:scale-90 shadow-sm hover:shadow-md"><Pencil size={16} strokeWidth={2.5} /></button>
            <button onClick={(e) => { e.stopPropagation(); toggleStatus(user); }} className="p-2.5 rounded-xl text-gray-400 transition-all hover:scale-110 active:scale-90 shadow-sm hover:shadow-md" style={user.isActive === false ? { color: accent } : {}}><Power size={16} strokeWidth={2.5} /></button>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(user._id); }} className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all hover:scale-110 active:scale-90 shadow-sm hover:shadow-md"><Trash2 size={16} strokeWidth={2.5} /></button>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-20">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 8px 20px ${accent}30` }}>
                        <Users size={22} strokeWidth={1.75} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            Gestor Oficial
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            Administra cuentas institucionales oficiales.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:opacity-100 transition-all active:scale-95 shadow-sm hover:-translate-y-1 hover:scale-105"
                    >
                        <Send size={16} strokeWidth={2.5} /> Mandar Invitación
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-6 py-3 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:opacity-100 transition-all active:scale-95 shadow-xl hover:-translate-y-1 hover:scale-105"
                        style={{
                            background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                            boxShadow: `0 10px 25px ${accent}40`
                        }}
                    >
                        <Plus size={16} strokeWidth={3} /> Nuevo gestor
                    </button>
                </div>
            </div>

            {/* ── Search ── */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} strokeWidth={1.75} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                        style={{ outline: 'none' }}
                        onFocus={(e) => {
                            e.target.style.borderColor = accent;
                            e.target.style.boxShadow = `0 0 0 4px ${accent}15`;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '';
                            e.target.style.boxShadow = '';
                        }}
                    />
                </div>
                <button
                    onClick={() => refetch()}
                    className="p-2.5 text-gray-500 hover:text-gray-800 dark:hover:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl transition-all hover:border-gray-300"
                    title="Refrescar"
                >
                    <RotateCw size={15} strokeWidth={1.75} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* ── Table / Mobile Cards ── */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5" style={{ background: `linear-gradient(to right, ${accent}10, ${accent}05)` }}>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Gestor Oficial</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Identificación</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Estado</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-5">
                                            <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-lg" />
                                        </td>
                                    </tr>
                                ))
                            ) : gestores.length > 0 ? (
                                gestores.map((gestor) => {
                                    return (
                                        <React.Fragment key={gestor._id}>
                                            <tr className="hover:bg-gray-50/70 dark:hover:bg-white/[0.025] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm relative"
                                                            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
                                                        >
                                                            {(gestor.fullName?.[0] || 'G').toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                                {gestor.fullName}
                                                                <Shield size={12} className="text-emerald-500" />
                                                            </div>
                                                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                                <Mail size={11} strokeWidth={1.75} />
                                                                {gestor.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                        {gestor.profile?.institution || 'Sin Institución'}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-2">
                                                        <Fingerprint size={12} strokeWidth={1.75} />
                                                        {gestor.documentNumber || 'N/D'} • {gestor.phone || 'S/T'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {gestor.isActive !== false ? (
                                                        <span
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-black/5 dark:border-white/5"
                                                            style={{ backgroundColor: `${accent}15`, color: accent }}
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                                                            Activo
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                                                            Inactivo
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {renderTableActions(gestor)}
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <tr><td colSpan="4" className="px-6 py-20 text-center text-gray-400">Sin gestores registrados</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {gestores.map((gestor) => {
                        return (
                            <div key={gestor._id} className="p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                                            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
                                        >
                                            {(gestor.fullName?.[0] || 'G').toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-gray-900 dark:text-white truncate flex items-center gap-1">
                                                {gestor.fullName} <Shield size={12} className="text-emerald-500" />
                                            </div>
                                            <div className="text-xs text-gray-400 truncate">{gestor.email}</div>
                                        </div>
                                    </div>
                                </div>



                                <div className="flex items-center gap-2 pt-2 border-t border-gray-50 dark:border-white/5">
                                    <button onClick={() => handleOpenModal(gestor, true)} className="flex-1 py-2 rounded-xl text-gray-500 hover:text-blue-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all"><Eye size={14} /> VER</button>
                                    <button onClick={() => handleOpenModal(gestor, false)} className="flex-1 py-2 rounded-xl text-gray-500 hover:text-amber-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all"><Pencil size={14} /> EDIT</button>
                                    <button onClick={() => toggleStatus(gestor)} className="flex-1 py-2 rounded-xl text-gray-500 hover:text-orange-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all"><Power size={14} /></button>
                                    <button onClick={() => handleDelete(gestor._id)} className="flex-1 py-2 rounded-xl text-gray-500 hover:text-red-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <GestorFormModal
                isOpen={isModalOpen}
                activeUser={activeGestor}
                isDetailOnly={isDetailOnly}
                themeColor={accent}
                onClose={() => {
                    setIsModalOpen(false);
                    setActiveGestor(null);
                    setIsDetailOnly(false);
                    refetch();
                }}
            />

            <InviteGestorModal
                isOpen={isInviteModalOpen}
                themeColor={accent}
                onClose={() => setIsInviteModalOpen(false)}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmAction}
                title="¿Deseas eliminar este gestor?"
                message="Esta acción no se puede deshacer y se perderán todos los datos vinculados."
                confirmText="ELIMINAR AHORA"
                type="danger"
            />

            <ConfirmModal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
                onConfirm={() => setErrorModal({ ...errorModal, isOpen: false })}
                title="Error en la operación"
                message={errorModal.message}
                confirmText="ENTENDIDO"
                type="warning"
                cancelText=""
            />
        </div>
    );
};

export default GestoresManagementView;
