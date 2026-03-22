import React, { useState } from 'react';
import { Search, Plus, Mail, Trash2, Fingerprint, Eye, Pencil, Power, Shield, Send, Users2, ChevronDown } from 'lucide-react';
import { useGetUsersQuery } from '../../store/user/usersApi';
import { useGetCoordinatorsQuery, useDeleteCoordinatorMutation, useUpdateCoordinatorMutation } from '../../store/coordinators/coordinatorsApi';
import { motion, AnimatePresence } from 'framer-motion';
import CoordinatorFormModal from './CoordinatorFormModal';
import InviteCoordinatorModal from './InviteCoordinatorModal';
import ConfirmModal from '../../components/modals/ConfirmModal';

const ManagerTeamView = ({ t, themeColor, isGestorView = false, user }) => {
    const { data: users, isLoading: isUsersLoading } = useGetUsersQuery(undefined, { skip: isGestorView });
    const [selectedManagerId, setSelectedManagerId] = useState(isGestorView ? user?.uid || user?._id : '');
    const { data: teamMembers = [], isLoading, refetch } = useGetCoordinatorsQuery(selectedManagerId, { skip: !selectedManagerId });

    const [deleteCoordinator] = useDeleteCoordinatorMutation();
    const [updateCoordinator] = useUpdateCoordinatorMutation();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });
    const [activeUser, setActiveUser] = useState(null);
    const [isDetailOnly, setIsDetailOnly] = useState(false);

    const accent = themeColor || '#018F64';

    // Gestores para el selector (solo en Admin)
    const managers = !isGestorView ? (users?.filter(u => u.role?.toUpperCase() === 'MANAGER' || u.role?.toUpperCase() === 'ADMIN' || u.role?.toUpperCase() === 'RECYCLE') || []) : [];

    const [isSelectOpen, setIsSelectOpen] = useState(false);

    // Filtrado de equipo local (por si hay más de 10 o paginación en el futuro, pero la búsqueda es instantánea)
    const filteredTeam = teamMembers?.filter(u =>
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleOpenModal = (user = null, detail = false) => {
        setActiveUser(user);
        setIsDetailOnly(detail);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setConfirmAction(() => async () => {
            try {
                await deleteCoordinator(id).unwrap();
            } catch (err) {
                setErrorModal({ isOpen: true, message: err.data?.message || 'Error al eliminar el usuario' });
            }
        });
        setIsConfirmOpen(true);
    };

    const toggleStatus = async (user) => {
        try {
            await updateCoordinator({ id: user._id, isActive: !user.isActive }).unwrap();
        } catch (err) {
            setErrorModal({ isOpen: true, message: err.data?.message || 'Error al cambiar el estado del usuario' });
        }
    };

    const renderTableActions = (user) => (
        <div className="flex items-center justify-end gap-1.5 px-2">
            <button onClick={(e) => handleOpenModal(user, true)} className="p-2.5 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all hover:scale-110 active:scale-90 shadow-sm hover:shadow-md"><Eye size={16} strokeWidth={2.5} /></button>
            <button onClick={(e) => handleOpenModal(user, false)} className="p-2.5 rounded-xl text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all hover:scale-110 active:scale-90 shadow-sm hover:shadow-md"><Pencil size={16} strokeWidth={2.5} /></button>
            <button onClick={(e) => toggleStatus(user)} className="p-2.5 rounded-xl text-gray-400 transition-all hover:scale-110 active:scale-90 shadow-sm hover:shadow-md" style={user.isActive === false ? { color: accent } : {}}><Power size={16} strokeWidth={2.5} /></button>
            <button onClick={(e) => handleDelete(user._id)} className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all hover:scale-110 active:scale-90 shadow-sm hover:shadow-md"><Trash2 size={16} strokeWidth={2.5} /></button>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 8px 20px ${accent}30` }}>
                        <Users2 size={22} strokeWidth={1.75} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            {isGestorView ? 'Mi Equipo' : 'Equipo del Gestor'}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {isGestorView ? 'Administra a los coordinadores que darán seguimiento a tus programas.' : 'Selecciona un Gestor Oficial para visualizar a los coordinadores de su equipo.'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {selectedManagerId && (
                        <>
                            <button
                                onClick={() => setIsInviteModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:opacity-100 transition-all shadow-sm active:scale-95 hover:scale-105"
                            >
                                <Send size={16} /> Invitar Coordinador
                            </button>
                            <button
                                onClick={() => handleOpenModal()}
                                className="flex items-center gap-2 px-6 py-3 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:opacity-100 transition-all shadow-xl active:scale-95 hover:scale-105"
                                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 10px 25px ${accent}40` }}
                            >
                                <Plus size={16} /> Crear Coordinador
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Select & Search */}
            <div className="flex flex-col sm:flex-row items-center gap-4 z-[50] relative">
                {!isGestorView && (
                    <div className="relative w-full sm:w-1/3 group">
                        <div
                            onClick={() => setIsSelectOpen(!isSelectOpen)}
                            className={`w-full flex items-center justify-between pl-4 pr-10 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none transition-all text-gray-900 dark:text-white font-bold cursor-pointer select-none`}
                            style={{
                                borderColor: isSelectOpen ? accent : '',
                                boxShadow: isSelectOpen ? `0 0 0 4px ${accent}20, 0 10px 25px ${accent}15` : ''
                            }}
                            onMouseEnter={(e) => { if (!isSelectOpen) e.currentTarget.style.borderColor = `${accent}60`; }}
                            onMouseLeave={(e) => { if (!isSelectOpen) e.currentTarget.style.borderColor = ''; }}
                        >
                            <span className="truncate">
                                {selectedManagerId
                                    ? (managers.find(m => m._id === selectedManagerId)?.fullName + ' – ' + (managers.find(m => m._id === selectedManagerId)?.profile?.institution || (managers.find(m => m._id === selectedManagerId)?.role === 'ADMIN' ? 'Equipo Recycle' : 'Particular')))
                                    : 'Seleccione un Gestor Oficial...'}
                            </span>
                            <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-transform duration-300 ${isSelectOpen ? 'rotate-180' : ''}`}>
                                <ChevronDown size={18} className="text-gray-400" style={isSelectOpen ? { color: accent } : {}} />
                            </div>
                        </div>

                        <AnimatePresence>
                            {isSelectOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 5, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute left-0 top-full w-full mt-1 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60] backdrop-blur-xl"
                                >
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                        <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
                                            Resultados: {managers.length}
                                        </div>
                                        {managers.map(m => (
                                            <div
                                                key={m._id}
                                                onClick={() => {
                                                    setSelectedManagerId(m._id);
                                                    setIsSelectOpen(false);
                                                }}
                                                className={`px-4 py-3 text-sm font-bold cursor-pointer transition-all flex flex-col gap-0.5
                                                    ${selectedManagerId === m._id
                                                        ? 'text-white'
                                                        : 'text-gray-700 dark:text-gray-300 hover:text-white'
                                                    }
                                                `}
                                                style={selectedManagerId === m._id ? { backgroundColor: accent } : {}}
                                                onMouseEnter={(e) => { if (selectedManagerId !== m._id) e.currentTarget.style.backgroundColor = `${accent}20`; }}
                                                onMouseLeave={(e) => { if (selectedManagerId !== m._id) e.currentTarget.style.backgroundColor = ''; }}
                                            >
                                                <span>{m.fullName}</span>
                                                <span className={`text-[10px] uppercase tracking-wide opacity-70 ${selectedManagerId === m._id ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                                    {m.profile?.institution || (m.role === 'ADMIN' ? 'Recycle Team' : 'Gestor Particular')}
                                                </span>
                                            </div>
                                        ))}
                                        {managers.length === 0 && (
                                            <div className="px-4 py-6 text-center text-gray-400 text-xs italic">
                                                No se encontraron gestores o admins.
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} strokeWidth={1.75} />
                    <input
                        type="text"
                        placeholder="Buscar coordinador por nombre o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400 font-medium group-hover:border-emerald-500/20 focus:border-emerald-500 active:ring-4 ring-emerald-500/5 shadow-sm"
                        onFocus={(e) => { e.target.style.borderColor = accent; }}
                        onBlur={(e) => { e.target.style.borderColor = ''; }}
                    />
                </div>
            </div>

            {/* Table */}
            {selectedManagerId ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5" style={{ background: `linear-gradient(to right, ${accent}10, ${accent}05)` }}>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Coordinador</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Cargo / Info</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Estado</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                                {isLoading ? (
                                    <tr><td colSpan="4" className="px-6 py-10 text-center">Cargando...</td></tr>
                                ) : filteredTeam.length > 0 ? (
                                    filteredTeam.map((member) => (
                                        <tr key={member._id} className="hover:bg-gray-50/70 dark:hover:bg-white/[0.025] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center font-bold text-sm shrink-0 text-gray-600 dark:text-gray-300">
                                                        {(member.fullName?.[0] || 'C').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-white">{member.fullName}</div>
                                                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Mail size={11} strokeWidth={1.75} />{member.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500/80">Coordinador</span>
                                                    <span className="text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-tight">
                                                        {member.programs?.length > 0 ? `${member.programs.length} programa(s) asignados` : 'Sin programas'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {member.isActive !== false ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border" style={{ backgroundColor: `${accent}15`, color: accent, borderColor: `${accent}20` }}>Activo</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-white/5 text-gray-500 border border-gray-200 dark:border-white/10">Inactivo</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">{renderTableActions(member)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="px-6 py-20 text-center text-gray-400">Este gestor no tiene coordinadores en su equipo.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden divide-y divide-gray-50 dark:divide-white/[0.04]">
                        {filteredTeam.map((member) => (
                            <div key={member._id} className="p-5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center font-bold text-sm shrink-0 text-gray-600 dark:text-gray-300">
                                        {(member.fullName?.[0] || 'C').toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="font-bold text-gray-900 dark:text-white truncate">{member.fullName}</div>
                                        <div className="text-xs text-gray-400 truncate">{member.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-gray-50 dark:border-white/5">
                                    <button onClick={() => handleOpenModal(member, true)} className="flex-1 py-2 text-xs font-bold text-gray-500 bg-gray-50 dark:bg-white/5 rounded-xl"><Eye size={14} className="mx-auto" /></button>
                                    <button onClick={() => handleOpenModal(member, false)} className="flex-1 py-2 text-xs font-bold text-amber-500 bg-gray-50 dark:bg-white/5 rounded-xl"><Pencil size={14} className="mx-auto" /></button>
                                    <button onClick={() => toggleStatus(member)} className="flex-1 py-2 text-xs font-bold text-orange-500 bg-gray-50 dark:bg-white/5 rounded-xl"><Power size={14} className="mx-auto" /></button>
                                    <button onClick={() => handleDelete(member._id)} className="flex-1 py-2 text-xs font-bold text-red-500 bg-gray-50 dark:bg-white/5 rounded-xl"><Trash2 size={14} className="mx-auto" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm text-center">
                    <div className="w-16 h-16 rounded-3xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4 text-gray-400">
                        <Users2 size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ningún Gestor Seleccionado</h3>
                    <p className="text-sm text-gray-500 max-w-sm">Por favor, utiliza el selector superior para buscar y seleccionar a un Gestor Oficial y poder visualizar la lista de coordinadores que colaboran en su equipo.</p>
                </div>
            )}

            <CoordinatorFormModal
                isOpen={isModalOpen}
                initialData={activeUser}
                managerId={selectedManagerId}
                managerName={isGestorView ? user?.fullName : managers?.find(m => m._id === selectedManagerId)?.fullName}
                themeColor={accent}
                onClose={() => { setIsModalOpen(false); setActiveUser(null); setIsDetailOnly(false); refetch(); }}
            />

            <InviteCoordinatorModal
                isOpen={isInviteModalOpen}
                themeColor={accent}
                onClose={() => setIsInviteModalOpen(false)}
                managerName={isGestorView ? user?.fullName : managers?.find(m => m._id === selectedManagerId)?.fullName}
                managerId={selectedManagerId}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmAction}
                title="¿Deseas eliminar este usuario?"
                message="Esta acción no se puede deshacer y el usuario perderá el acceso."
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

export default ManagerTeamView;
