import React, { useState } from 'react';
import {
    CheckCircle2,
    XCircle,
    Clock,
    Trash2,
    MessageSquare,
    User,
    Eye,
    Filter,
    Search,
    RotateCw,
    Star
} from 'lucide-react';
import {
    useGetAllHistoriesQuery,
    useUpdateHistoryStatusMutation,
    useToggleFeaturedHistoryMutation,
    useDeleteHistoryMutation
} from '../../store/eco-histories/ecoHistoriesApi';
import ConfirmModal from '../../components/shared/ConfirmModal';

const EcoHistoriesTable = ({ themeColor }) => {
    const { data: histories = [], isLoading, refetch } = useGetAllHistoriesQuery();
    const [updateStatus] = useUpdateHistoryStatusMutation();
    const [toggleFeatured] = useToggleFeaturedHistoryMutation();
    const [deleteHistory] = useDeleteHistoryMutation();

    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const accent = themeColor || '#018F64';

    // Estados para el Modal de Confirmación
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // Estados para el Modal de Detalles
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState(null);

    const filteredHistories = histories.filter(h => {
        const matchesFilter = filter === 'ALL' || h.status === filter;
        const matchesSearch = h.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateStatus({ id, status: newStatus }).unwrap();
        } catch (err) {
            console.error('Error al actualizar estado:', err);
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedId) return;
        try {
            await deleteHistory(selectedId).unwrap();
        } catch (err) {
            console.error('Error al eliminar:', err);
        }
    };

    const handleViewDetails = (history) => {
        setSelectedHistory(history);
        setIsDetailsOpen(true);
    };

    if (isLoading) return <div className="p-10 text-center text-sm text-gray-400 animate-pulse">Cargando historias...</div>;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-orange-100 text-orange-700 border-orange-200';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'APPROVED': return 'APROBADO';
            case 'REJECTED': return 'RECHAZADO';
            default: return 'PENDIENTE';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle2 size={13} strokeWidth={2} />;
            case 'REJECTED': return <XCircle size={13} strokeWidth={2} />;
            default: return <Clock size={13} strokeWidth={1.75} />;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Eliminar EcoHistoria"
                message="Esta acción no se puede deshacer. ¿Estás seguro de que quieres borrar este testimonio de forma permanente?"
                confirmText="Eliminar Historia"
                type="danger"
            />

            {/* Modal de Detalles */}
            {isDetailsOpen && selectedHistory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="p-6 space-y-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Detalles de la historia
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5 font-mono">ID: {selectedHistory._id}</p>
                                </div>
                                <button
                                    onClick={() => setIsDetailsOpen(false)}
                                    className="p-1.5 bg-gray-100 dark:bg-white/5 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    <XCircle size={18} strokeWidth={1.75} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0`} style={{ backgroundColor: `${accent}15`, color: accent }}>
                                        {selectedHistory.user?.avatarUrl ? (
                                            <img src={selectedHistory.user.avatarUrl} alt="Avatar" className="w-full h-full rounded-xl object-cover" />
                                        ) : (
                                            <User size={20} strokeWidth={1.75} />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{selectedHistory.user?.fullName || 'Anónimo'}</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">{selectedHistory.user?.email || 'Sin correo'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Fecha Registro</label>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                                            <Clock size={13} strokeWidth={1.75} style={{ color: accent }} />
                                            {new Date(selectedHistory.created_at || selectedHistory.createdAt || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Estado Actual</label>
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusStyle(selectedHistory.status)}`}>
                                            {getStatusIcon(selectedHistory.status)}
                                            {getStatusLabel(selectedHistory.status)}
                                        </div>
                                    </div>
                                    {selectedHistory.status === 'REJECTED' && (
                                        <div className="col-span-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center justify-between">
                                            <div>
                                                <label className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-1">Eliminación Definitiva</label>
                                                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                                                    {(() => {
                                                        const rejection = new Date(selectedHistory.updated_at || selectedHistory.updatedAt || Date.now());
                                                        const limit = new Date(rejection.getTime() + 10 * 24 * 60 * 60 * 1000);
                                                        const diff = limit - new Date();
                                                        const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
                                                        const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                                                        return `Quedan ${days} días y ${hours} horas`;
                                                    })()}
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                                                <Trash2 size={18} strokeWidth={2} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                    <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                                        <MessageSquare size={11} strokeWidth={1.75} style={{ color: accent }} /> Mensaje
                                    </label>
                                    <p className="text-gray-600 dark:text-gray-300 italic text-sm leading-relaxed">
                                        "{selectedHistory.message}"
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-white/[0.03] border-t border-gray-100 dark:border-white/5 p-5 flex justify-end">
                            <button
                                onClick={() => setIsDetailsOpen(false)}
                                className="px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 8px 20px ${accent}30` }}>
                        <MessageSquare size={22} strokeWidth={1.75} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            Eco-Historias
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            Modera y destaca los testimonios de impacto ambiental.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Search and Filter ── */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-6 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} strokeWidth={1.75} />
                    <input
                        type="text"
                        placeholder="Buscar por usuario o mensaje..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none transition-all text-gray-900 dark:text-white focus:ring-2"
                        style={{ '--tw-ring-color': `${accent}20` }}
                        onFocus={(e) => e.target.style.borderColor = accent}
                        onBlur={(e) => e.target.style.borderColor = ''}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="md:col-span-4 relative">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <select
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 outline-none appearance-none cursor-pointer"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">TODOS LOS ESTADOS</option>
                        <option value="PENDING">PENDIENTES</option>
                        <option value="APPROVED">APROBADOS</option>
                        <option value="REJECTED">RECHAZADOS</option>
                    </select>
                </div>
                <div className="md:col-span-2 flex justify-end">
                    <button
                        onClick={() => refetch()}
                        className="w-full md:w-auto px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-white transition-all flex items-center justify-center gap-2"
                        title="Actualizar datos"
                    >
                        <RotateCw size={15} strokeWidth={1.75} className={isLoading ? 'animate-spin' : ''} />
                        <span className="md:hidden text-xs font-bold uppercase">Actualizar</span>
                    </button>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="flex items-center justify-end gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 text-blue-600 border border-black/5 dark:border-white/5">
                    <MessageSquare size={11} strokeWidth={2.5} />
                    {histories.length} TOTAL
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-50 dark:bg-orange-500/10 text-orange-600 border border-black/5 dark:border-white/5">
                    <Clock size={11} strokeWidth={2.5} />
                    {histories.filter(h => h.status === 'PENDING').length} PENDIENTES
                </span>
                <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-black/5 dark:border-white/5"
                    style={{ backgroundColor: `${accent}15`, color: accent }}
                >
                    <CheckCircle2 size={11} strokeWidth={2.5} />
                    {histories.filter(h => h.status === 'APPROVED').length} APROBADOS
                </span>
            </div>

            {/* ── Table / Mobile Cards ── */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.03]">
                                <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Usuario</th>
                                <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">EcoHistoria</th>
                                <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Estado</th>
                                <th className="px-6 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04] text-sm">
                            {filteredHistories.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0`} style={{ backgroundColor: `${accent}15`, color: accent }}>
                                                {item.user?.avatarUrl ? (
                                                    <img src={item.user.avatarUrl} className="w-full h-full rounded-xl object-cover" alt="Avatar" />
                                                ) : (
                                                    <User size={16} strokeWidth={1.75} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white leading-none mb-0.5">
                                                    {item.user?.fullName || 'Usuario Anónimo'}
                                                </div>
                                                <div className="text-xs text-gray-400">{item.user?.email || 'S/E'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="flex items-start gap-2">
                                            <MessageSquare size={13} strokeWidth={1.75} className="mt-0.5 shrink-0" style={{ color: accent }} />
                                            <p className="text-gray-500 dark:text-gray-400 italic text-xs line-clamp-3">"{item.message}"</p>
                                        </div>
                                        {item.photoUrl && (
                                            <a href={item.photoUrl} target="_blank" rel="noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium hover:underline" style={{ color: accent }}>
                                                <Eye size={12} strokeWidth={1.75} /> Ver adjunto
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusStyle(item.status)}`}>
                                                {getStatusIcon(item.status)}
                                                {getStatusLabel(item.status)}
                                            </div>
                                            {item.status === 'REJECTED' && (
                                                <div className="text-[10px] font-bold text-red-500/80 flex items-center gap-1 px-1">
                                                    <Clock size={10} />
                                                    {(() => {
                                                        const rejection = new Date(item.updated_at || item.createdAt);
                                                        const limit = new Date(rejection.getTime() + 10 * 24 * 60 * 60 * 1000);
                                                        const diff = limit - new Date();
                                                        const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
                                                        return `Eliminación en ${days} días`;
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-1">
                                            <button onClick={() => handleViewDetails(item)} className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"><Eye size={16} /></button>
                                            {item.status === 'APPROVED' && (
                                                <button onClick={() => toggleFeatured(item._id)} className={`p-2 rounded-lg transition-all ${item.isFeatured ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10'}`}>
                                                    <Star size={16} fill={item.isFeatured ? "currentColor" : "none"} />
                                                </button>
                                            )}
                                            {item.status !== 'APPROVED' && (
                                                <button onClick={() => handleStatusUpdate(item._id, 'APPROVED')} className="p-2 rounded-lg text-gray-400 hover:text-emerald-500 transition-all"><CheckCircle2 size={16} /></button>
                                            )}
                                            {item.status !== 'REJECTED' && (
                                                <button onClick={() => handleStatusUpdate(item._id, 'REJECTED')} className="p-2 rounded-lg text-gray-400 hover:text-red-500 transition-all"><XCircle size={16} /></button>
                                            )}
                                            <button onClick={() => handleDeleteClick(item._id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {filteredHistories.map((item) => (
                        <div key={item._id} className="p-5 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0`} style={{ backgroundColor: `${accent}15`, color: accent }}>
                                        {item.user?.avatarUrl ? (
                                            <img src={item.user.avatarUrl} className="w-full h-full rounded-xl object-cover" alt="Avatar" />
                                        ) : (
                                            <User size={18} />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-gray-900 dark:text-white truncate">{item.user?.fullName || 'Anónimo'}</div>
                                        <div className="text-[10px] text-gray-400 truncate">{item.user?.email || 'Sin correo'}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getStatusStyle(item.status)}`}>
                                        {getStatusLabel(item.status)}
                                    </div>
                                    {item.status === 'REJECTED' && (
                                        <div className="text-[9px] font-bold text-red-500/70 flex items-center gap-1">
                                            <Clock size={9} />
                                            {(() => {
                                                const rejection = new Date(item.updated_at || item.createdAt);
                                                const limit = new Date(rejection.getTime() + 10 * 24 * 60 * 60 * 1000);
                                                const diff = limit - new Date();
                                                const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
                                                return `${days}d para borrar`;
                                            })()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                <p className="text-gray-500 dark:text-gray-400 italic text-xs line-clamp-4">"{item.message}"</p>
                                {item.photoUrl && (
                                    <a href={item.photoUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>
                                        <Eye size={12} /> Ver adjunto
                                    </a>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-50 dark:border-white/5">
                                <button onClick={() => handleViewDetails(item)} className="flex-1 py-2 rounded-xl text-gray-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-[10px] font-black uppercase transition-all hover:text-blue-500"><Eye size={14} /> Detalle</button>
                                {item.status === 'APPROVED' && (
                                    <button onClick={() => toggleFeatured(item._id)} className={`flex-1 py-2 rounded-xl flex justify-center items-center gap-2 text-[10px] font-black uppercase transition-all ${item.isFeatured ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'text-gray-500 bg-gray-50 dark:bg-white/5'}`}>
                                        <Star size={14} fill={item.isFeatured ? "currentColor" : "none"} /> {item.isFeatured ? 'Destacado' : 'Destacar'}
                                    </button>
                                )}
                                {item.status !== 'APPROVED' && (
                                    <button onClick={() => handleStatusUpdate(item._id, 'APPROVED')} className="flex-1 py-2 rounded-xl text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 flex justify-center items-center gap-2 text-[10px] font-black uppercase transition-all"><CheckCircle2 size={14} /> OK</button>
                                )}
                                {item.status !== 'REJECTED' && (
                                    <button onClick={() => handleStatusUpdate(item._id, 'REJECTED')} className="flex-1 py-2 rounded-xl text-red-500 bg-red-50 dark:bg-red-900/20 flex justify-center items-center gap-2 text-[10px] font-black uppercase transition-all"><XCircle size={14} /> NO</button>
                                )}
                                <button onClick={() => handleDeleteClick(item._id)} className="p-2 rounded-xl text-gray-400 bg-gray-50 dark:bg-white/5 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EcoHistoriesTable;
