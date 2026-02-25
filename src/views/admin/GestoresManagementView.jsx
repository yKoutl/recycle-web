import React, { useState } from 'react';
import { Search, RotateCw, UserPlus, Mail, Trash2, Fingerprint, Plus, Eye, Pencil, Power, CheckCircle2, XCircle, Users } from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../../store/user/usersApi';
import GestorFormModal from './GestorFormModal';

const GestoresManagementView = ({ t, themeColor }) => {
    const { data: users, isLoading, refetch } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeGestor, setActiveGestor] = useState(null);
    const [isDetailOnly, setIsDetailOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const accent = themeColor || '#018F64';

    const gestores = users?.filter(u =>
        u.role?.toUpperCase() === 'OFFICIAL' &&
        (u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    const handleOpenModal = (gestor = null, detail = false) => {
        setActiveGestor(gestor);
        setIsDetailOnly(detail);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este gestor? Esta acción no se puede deshacer.')) {
            try {
                await deleteUser(id).unwrap();
            } catch (err) {
                console.error('Error al eliminar gestor:', err);
            }
        }
    };

    const toggleStatus = async (gestor) => {
        try {
            await updateUser({ id: gestor._id, isActive: !gestor.isActive }).unwrap();
        } catch (err) {
            console.error('Error toggling status:', err);
        }
    };

    const activeCount = gestores.filter(g => g.isActive !== false).length;

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
                            Gestores institucionales
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            Administra las cuentas institucionales y sus permisos de acceso.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-md"
                    style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 4px 14px ${accent}40` }}
                >
                    <Plus size={16} strokeWidth={2.5} /> Nuevo gestor
                </button>
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

            {/* ── Stats bar ── */}
            <div className="flex items-center justify-end gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <Users size={11} strokeWidth={2} />
                    {gestores.length} total
                </span>
                <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-black/5 dark:border-white/5"
                    style={{ backgroundColor: `${accent}15`, color: accent }}
                >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                    {activeCount} activos
                </span>
                {gestores.length - activeCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-xs font-semibold text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        {gestores.length - activeCount} inactivos
                    </span>
                )}
            </div>

            {/* ── Table / Mobile Cards ── */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5" style={{ background: `linear-gradient(to right, ${accent}10, ${accent}05)` }}>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Gestor</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Identificación</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Estado</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="4" className="px-6 py-5">
                                            <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-lg" />
                                        </td>
                                    </tr>
                                ))
                            ) : gestores.length > 0 ? (
                                gestores.map((gestor) => (
                                    <tr key={gestor._id} className="hover:bg-gray-50/70 dark:hover:bg-white/[0.025] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                                                    style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}
                                                >
                                                    {(gestor.fullName?.[0] || 'G').toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-white">{gestor.fullName}</div>
                                                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                        <Mail size={11} strokeWidth={1.75} />
                                                        {gestor.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <Fingerprint size={14} strokeWidth={1.75} className="text-gray-300 dark:text-gray-600" />
                                                {gestor.documentNumber || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5 ml-5">{gestor.phone || 'Sin teléfono'}</div>
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
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => handleOpenModal(gestor, true)} className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"><Eye size={16} /></button>
                                                <button onClick={() => handleOpenModal(gestor, false)} className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"><Pencil size={16} /></button>
                                                <button onClick={() => toggleStatus(gestor)} className="p-2 rounded-lg text-gray-400 transition-all" style={gestor.isActive === false ? { color: accent } : {}}><Power size={16} /></button>
                                                <button onClick={() => handleDelete(gestor._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="px-6 py-20 text-center text-gray-400">Sin gestores registrados</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {gestores.map((gestor) => (
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
                                        <div className="font-bold text-gray-900 dark:text-white truncate">{gestor.fullName}</div>
                                        <div className="text-xs text-gray-400 truncate">{gestor.email}</div>
                                    </div>
                                </div>
                                {gestor.isActive !== false ? (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border" style={{ backgroundColor: `${accent}15`, color: accent }}>Activo</span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 text-gray-400">Inactivo</span>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                                    <div className="text-[9px] uppercase text-gray-400 font-bold mb-0.5">DNI/ID</div>
                                    <div className="font-medium text-gray-700 dark:text-gray-300">{gestor.documentNumber || '-'}</div>
                                </div>
                                <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                                    <div className="text-[9px] uppercase text-gray-400 font-bold mb-0.5">Teléfono</div>
                                    <div className="font-medium text-gray-700 dark:text-gray-300">{gestor.phone || '-'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-50 dark:border-white/5">
                                <button onClick={() => handleOpenModal(gestor, true)} className="flex-1 py-2 rounded-xl text-gray-500 hover:text-blue-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all"><Eye size={14} /> VER</button>
                                <button onClick={() => handleOpenModal(gestor, false)} className="flex-1 py-2 rounded-xl text-gray-500 hover:text-amber-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all"><Pencil size={14} /> EDIT</button>
                                <button onClick={() => toggleStatus(gestor)} className="flex-1 py-2 rounded-xl text-gray-500 hover:text-orange-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all"><Power size={14} /></button>
                                <button onClick={() => handleDelete(gestor._id)} className="flex-1 py-2 rounded-xl text-gray-500 hover:text-red-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                    {gestores.length === 0 && !isLoading && (
                        <div className="p-10 text-center text-gray-400 text-sm italic">Sin gestores</div>
                    )}
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
        </div>
    );
};

export default GestoresManagementView;
