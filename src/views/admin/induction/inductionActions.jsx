import React, { useState, useEffect } from 'react';
import {
    PlayCircle, CheckCircle2, XCircle, Clock, Trash2, Video,
    Eye, Filter, Search, RotateCw, Award, Trophy, Tag, Plus
} from 'lucide-react';

import InductionModal from './inductionModal';
import { useGetInductionsQuery, useDeleteInductionMutation, useUpdateInductionMutation } from '../../../store/induction';

import ConfirmModal from '../../../components/shared/ConfirmModal';

const InductionTable = ({ themeColor }) => {
    // 2. Usar los hooks reales
    const { data: inductions = [], isLoading, refetch } = useGetInductionsQuery();
    const [updateInduction] = useUpdateInductionMutation();
    const [deleteInduction, deleteResult] = useDeleteInductionMutation();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const accent = themeColor || '#018F64';

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedInduction, setSelectedInduction] = useState(null);

    // 3. Efecto para cerrar el modal tras eliminar con éxito
    useEffect(() => {
        if (deleteResult.isSuccess) {
            setIsConfirmOpen(false);
            setSelectedId(null);
        }
    }, [deleteResult.isSuccess]);

    const filteredData = inductions.filter(item => {
        const matchesFilter = filter === 'ALL' || item.category === filter;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getYoutubeThumbnail = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
        }
        return null;
    };

    // 4. Actualizar la función para usar updateInduction
    const handleToggleActive = async (id, currentStatus) => {
        try {
            // Enviamos el ID y el nuevo estado (isActive)
            await updateInduction({ id, isActive: !currentStatus }).unwrap();
        } catch (err) {
            console.error('Error al cambiar estado:', err);
        }
    };

    const getCategoryStyles = (cat) => {
        const styles = {
            'Tutorial': { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-200' },
            'Reciclaje': { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-200' },
            'Eco-Tips': { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-200' },
            'Premios': { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-200' }
        };
        return styles[cat] || { bg: 'bg-gray-500/10', text: 'text-gray-600', border: 'border-gray-200' };
    };

    if (isLoading) return <div className="p-10 text-center text-sm text-gray-400 animate-pulse">Cargando inducciones...</div>;

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                // 5. Llamada al mutation de eliminar
                onConfirm={async () => {
                    try {
                        await deleteInduction(selectedId).unwrap();
                    } catch (e) {
                        console.error("Error al eliminar:", e);
                    }
                }}
                title="Eliminar Inducción"
                message="¿Estás seguro de eliminar este contenido educativo? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                variant="danger"
                isLoading={deleteResult.isLoading}
            />

            {/* Modal de Detalles */}
            {isDetailsOpen && selectedInduction && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 dark:border-white/10 animate-in zoom-in-95">
                        <div className="relative aspect-video bg-black">
                            {/* Aquí podrías renderizar un iframe de YouTube o Video Player */}
                            {/* Reemplaza la sección del video en el modal por esta */}
                            <div className="relative aspect-video bg-black group cursor-pointer overflow-hidden">
                                {selectedInduction.videoUrl && getYoutubeThumbnail(selectedInduction.videoUrl) ? (
                                    <>
                                        {/* Imagen de Portada de YouTube */}
                                        <img
                                            src={getYoutubeThumbnail(selectedInduction.videoUrl)}
                                            alt="Thumbnail"
                                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Botón de Play Estilizado */}
                                        <a
                                            href={selectedInduction.videoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/40 transition-all">
                                                <PlayCircle size={40} className="text-white fill-white/20" />
                                            </div>
                                        </a>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-white/50">
                                        <Video size={48} className="animate-pulse" />
                                    </div>
                                )}

                                {/* Badge de duración flotante */}
                                <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/70 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10">
                                    {selectedInduction.duration}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedInduction.title}</h3>
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-2 ${getCategoryStyles(selectedInduction.category).bg} ${getCategoryStyles(selectedInduction.category).text}`}>
                                        {selectedInduction.category}
                                    </span>
                                </div>
                                <button onClick={() => setIsDetailsOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400">
                                    <XCircle size={20} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{selectedInduction.description}</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-center">
                                    <Trophy size={16} className="mx-auto mb-1 text-amber-500" />
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Eco-puntos</p>
                                    <p className="text-xl font-black text-black dark:text-emerald-400 tabular-nums">
                                        {selectedInduction.ecoPoints || 0}
                                    </p>
                                </div>

                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-center">
                                    <Clock size={16} className="mx-auto mb-1 text-emerald-500" />
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Duración</p>
                                    <p className="text-lg font-black text-gray-800 dark:text-white">{selectedInduction.duration}</p>
                                </div>

                            </div>
                            <div className="pt-2">
                                <a
                                    href={selectedInduction.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl"
                                >
                                    Abrir enlace del video <PlayCircle size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: accent }}>
                        <PlayCircle size={22} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inducciones</h2>
                        <p className="text-sm text-gray-500">Gestiona el contenido educativo del proyecto Recycle.</p>
                    </div>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 rounded-xl text-white font-bold text-sm flex items-center gap-2 transition-transform active:scale-95" style={{ background: accent }}>
                    <Plus size={18} /> Nueva Inducción
                </button>

                <InductionModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    themeColor={themeColor}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-6 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                        type="text"
                        placeholder="Buscar inducción..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:ring-2"
                        style={{ '--tw-ring-color': `${accent}20` }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="md:col-span-4 relative">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <select
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold uppercase"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">Todas las Categorías</option>
                        <option value="Tutorial">Tutoriales</option>
                        <option value="Reciclaje">Reciclaje</option>
                        <option value="Eco-Tips">Eco-Tips</option>
                        <option value="Premios">Premios</option>
                    </select>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-100 dark:border-white/5">
                        <tr className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                            <th className="px-6 py-4">Título e Info</th>
                            <th className="px-6 py-4">Categoría</th>
                            <th className="px-6 py-4">Recompensas (XP)</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                        {filteredData.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500">
                                            <Video size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white">{item.title}</div>
                                            <div className="text-[10px] text-gray-400 flex items-center gap-2">
                                                <Clock size={10} /> {item.duration} • <Eye size={10} /> {item.views} vistas
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border ${getCategoryStyles(item.category).bg} ${getCategoryStyles(item.category).text} ${getCategoryStyles(item.category).border}`}>
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">+{item.ecoPoints || 0}</span>
                                        <Trophy size={12} className="text-amber-500" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleActive(item._id, item.isActive)}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all border ${item.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                                    >
                                        {item.isActive ? 'Activo' : 'Inactivo'}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-1">
                                        <button onClick={() => { setSelectedInduction(item); setIsDetailsOpen(true); }} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"><Eye size={16} /></button>
                                        <button onClick={() => { setSelectedId(item._id); setIsConfirmOpen(true); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InductionTable;