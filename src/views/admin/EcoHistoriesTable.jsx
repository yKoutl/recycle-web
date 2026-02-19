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

const EcoHistoriesTable = ({ t }) => {
    const { data: histories = [], isLoading, refetch } = useGetAllHistoriesQuery();
    const [updateStatus] = useUpdateHistoryStatusMutation();
    const [toggleFeatured] = useToggleFeaturedHistoryMutation();
    const [deleteHistory] = useDeleteHistoryMutation();

    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

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

    if (isLoading) return <div className="p-10 text-center animate-pulse font-black uppercase tracking-widest text-[#018F64]">Cargando Historias...</div>;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-orange-100 text-orange-700 border-orange-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle2 size={14} />;
            case 'REJECTED': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <div className="space-y-6">
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
                    <div className="bg-white dark:bg-[#111827] rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-300">
                        <div className="p-8 space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">
                                        Detalles de la <span className="text-[#018F64]">Historia</span>
                                    </h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {selectedHistory._id}</p>
                                </div>
                                <button
                                    onClick={() => setIsDetailsOpen(false)}
                                    className="p-2 bg-gray-100 dark:bg-white/5 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#018F64]/10 flex items-center justify-center text-[#018F64]">
                                        {selectedHistory.user?.avatarUrl ? (
                                            <img src={selectedHistory.user.avatarUrl} alt="Avatar" className="w-full h-full rounded-xl object-cover" />
                                        ) : (
                                            <User size={24} />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{selectedHistory.user?.fullName || 'Anónimo'}</h4>
                                        <p className="text-xs font-medium text-gray-500">{selectedHistory.user?.email || 'Sin correo'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Fecha</label>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                            <Clock size={14} className="text-[#018F64]" />
                                            {new Date(selectedHistory.createdAt || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Estado</label>
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(selectedHistory.status)}`}>
                                            {getStatusIcon(selectedHistory.status)}
                                            {selectedHistory.status}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <label className="text-[10px] font-black text-[#018F64] uppercase tracking-widest block mb-3 flex items-center gap-2">
                                        <MessageSquare size={12} /> Mensaje
                                    </label>
                                    <p className="text-gray-600 dark:text-gray-300 italic font-medium leading-relaxed">
                                        "{selectedHistory.message}"
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-black/20 p-6 flex justify-end">
                            <button
                                onClick={() => setIsDetailsOpen(false)}
                                className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold uppercase tracking-widest text-xs hover:transform hover:scale-105 active:scale-95 transition-all shadow-lg"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">
                        Moderación de <span className="text-[#018F64]">EcoHistorias</span>
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">Gestiona y aprueba los testimonios de la comunidad.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => refetch()}
                        className="p-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-xl text-gray-500 hover:text-[#018F64] hover:border-[#018F64]/30 transition-all shadow-sm group active:scale-95"
                        title="Actualizar datos"
                    >
                        <RotateCw size={18} className="group-active:rotate-180 transition-transform duration-500" />
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar mensaje..."
                            className="pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-xl text-sm outline-none focus:border-[#018F64] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-xl text-sm outline-none cursor-pointer"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">Todos</option>
                        <option value="PENDING">Pendientes</option>
                        <option value="APPROVED">Aprobados</option>
                        <option value="REJECTED">Rechazados</option>
                    </select>
                </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-950/40 backdrop-blur-xl rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-xl shadow-gray-200/20 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Usuario</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">EcoHistoria</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5 text-[13px]">
                            {filteredHistories.map((item) => (
                                <tr key={item._id} className="hover:bg-white dark:hover:bg-white/5 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#018F64]/10 flex items-center justify-center text-[#018F64] font-black">
                                                {item.user?.avatarUrl ? (
                                                    <img src={item.user.avatarUrl} className="w-full h-full rounded-xl object-cover" alt="Avatar" />
                                                ) : (
                                                    <User size={18} />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">
                                                    {item.user?.fullName || 'Usuario Anónimo'}
                                                </div>
                                                <div className="text-[10px] text-gray-400 font-bold">{item.user?.email || 'S/E'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 max-w-xs">
                                        <div className="flex items-start gap-2">
                                            <MessageSquare size={14} className="mt-1 text-[#018F64] shrink-0" />
                                            <p className="text-gray-600 dark:text-gray-400 italic line-clamp-3">"{item.message}"</p>
                                        </div>
                                        {item.photoUrl && (
                                            <a href={item.photoUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black text-[#018F64] uppercase hover:underline">
                                                <Eye size={12} /> Ver adjunto
                                            </a>
                                        )}
                                    </td>
                                    <td className="p-6">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                                            {getStatusIcon(item.status)}
                                            {item.status}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex justify-end gap-2 text-right">
                                            <button
                                                onClick={() => handleViewDetails(item)}
                                                className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                title="Ver Detalles"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {item.status === 'APPROVED' && (
                                                <button
                                                    onClick={() => toggleFeatured(item._id)}
                                                    className={`p-2.5 rounded-xl transition-all shadow-sm ${item.isFeatured ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600'}`}
                                                    title={item.isFeatured ? "Quitar de destacados" : "Destacar en Landing"}
                                                >
                                                    <Star size={18} fill={item.isFeatured ? "currentColor" : "none"} />
                                                </button>
                                            )}
                                            {item.status !== 'APPROVED' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(item._id, 'APPROVED')}
                                                    className="p-2.5 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-sm"
                                                    title="Aprobar"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                            )}
                                            {item.status !== 'REJECTED' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(item._id, 'REJECTED')}
                                                    className="p-2.5 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Rechazar"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteClick(item._id)}
                                                className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/20 transition-all shadow-sm"
                                                title="Eliminar permanentemente"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EcoHistoriesTable;
