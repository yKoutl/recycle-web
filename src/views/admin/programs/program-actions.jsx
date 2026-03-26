import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, MapPin, Users, Search, Target, Globe, Activity, Layout, Filter, RotateCw, Calendar } from 'lucide-react';
import { useGetProgramsQuery, useDeleteProgramMutation, onSetActiveProgram } from '../../../store/programs';
import ProgramFormModal from './program-modal';
import ConfirmModal from '../../../components/shared/ConfirmModal';

const ProgramsList = ({ themeColor }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'danger', onConfirm: null });
    const accent = themeColor || '#018F64';

    const { data: programs = [], isLoading, refetch } = useGetProgramsQuery();
    const [startDelete] = useDeleteProgramMutation();

    const categories = ['Todos', ...new Set(programs.map(p => p.category || 'Sin categoría'))];

    // 1. CORRECCIÓN EN EL FILTRO (Búsqueda segura)
    const filteredPrograms = programs.filter(program => {
        const matchesCategory = selectedCategory === 'Todos' || program.category === selectedCategory;

        // Obtenemos el nombre de la ubicación de forma segura (soporta objeto o string antiguo)
        const locationName = typeof program.location === 'object'
            ? (program.location?.name || '')
            : (program.location || '');

        const matchesSearch =
            program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (program.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            locationName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDate = !dateFilter || (program.date && program.date.includes(dateFilter));
        return matchesCategory && matchesSearch && matchesDate;
    });

    const handleCreate = () => {
        dispatch(onSetActiveProgram(null));
        setIsModalOpen(true);
    };

    const handleEdit = (program) => {
        dispatch(onSetActiveProgram(program));
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        setModalConfig({
            isOpen: true,
            title: '¿Eliminar Programa?',
            message: '¿Estás seguro de eliminar este programa? Esta acción no se puede deshacer.',
            variant: 'danger',
            confirmText: 'Sí, Eliminar',
            onConfirm: async () => {
                await startDelete(id);
                setModalConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const stats = [
        { label: 'Total', value: programs.length, icon: Layout, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20' },
        { label: 'Participantes', value: programs.reduce((acc, curr) => acc + (curr.participants || 0), 0), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-500/20' },
        {
            label: 'Ubicaciones',
            // Mapeamos a .name para que el Set cuente nombres únicos, no instancias de objetos
            value: new Set(programs.map(p => typeof p.location === 'object' ? p.location?.name : p.location)).size,
            icon: MapPin,
            color: 'text-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-500/10 border-orange-500/20'
        },
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
                        <Target size={22} strokeWidth={1.75} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            Programas de Eco-Acción
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            Administra las iniciativas y programas de reciclaje activos.
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-md"
                    style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 4px 14px ${accent}40` }}
                >
                    <Plus size={16} strokeWidth={2.5} /> Nuevo programa
                </button>
            </div>

            {/* ── Search and Filter ── */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} strokeWidth={1.75} />
                    <input
                        type="text"
                        placeholder="Buscar programas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                        style={{ outline: 'none' }}
                        onFocus={(e) => {
                            e.target.style.borderColor = `${accent}80`;
                            e.target.style.boxShadow = `0 0 0 2px ${accent}20`;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '';
                            e.target.style.boxShadow = '';
                        }}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 outline-none appearance-none cursor-pointer transition-all"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold uppercase text-gray-600 dark:text-gray-300 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => { refetch(); setSearchQuery(''); setDateFilter(''); setSelectedCategory('Todos'); }}
                        className="p-2.5 text-gray-500 hover:text-gray-800 dark:hover:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl transition-all"
                    >
                        <RotateCw size={15} strokeWidth={1.75} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="flex items-center justify-end gap-2">
                {stats.map((stat, i) => (
                    <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${stat.bg} ${stat.color} border border-black/5 dark:border-white/5`}>
                        <stat.icon size={11} strokeWidth={2.5} />
                        {stat.value} {stat.label}
                    </span>
                ))}
            </div>

            {/* ── Grid of Cards ── */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-100 dark:bg-white/5 animate-pulse rounded-3xl" />
                    ))}
                </div>
            ) : filteredPrograms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPrograms.map((program) => (
                        <div key={program._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col">
                            <div className="h-32 w-full overflow-hidden relative bg-slate-100 dark:bg-white/5">
                                {program.imageUrl ? (
                                    <img src={program.imageUrl} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <Activity size={40} />
                                    </div>
                                )}

                                {/* Status Badge explicitly visible */}
                                <div className="absolute top-3 right-3 z-10">
                                    {program.status === 'APPROVED' ? (
                                        <span className="px-2.5 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-white animate-pulse" /> ACTIVO
                                        </span>
                                    ) : program.status === 'REJECTED' ? (
                                        <span className="px-2.5 py-1 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-red-500/30 flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-white" /> RECHAZADO
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-amber-500/30 flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-white animate-bounce" /> PENDIENTE
                                        </span>
                                    )}
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <div className="flex gap-2 w-full justify-between items-center">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/programs/${program._id}`); }}
                                            className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl"
                                        >
                                            Gestionar
                                        </button>
                                        <div className="flex gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); handleEdit(program); }} className="p-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/40 transition-all">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(program._id); }} className="p-2 bg-red-500/20 backdrop-blur-md text-red-200 rounded-lg hover:bg-red-500/40 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() => navigate(`/admin/programs/${program._id}`)}
                                className="p-5 flex-1 flex flex-col cursor-pointer"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                        {program.category || 'PROYECTO'}
                                    </span>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{program.title}</h3>
                                <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-2 mb-4 font-medium leading-relaxed">
                                    {program.description}
                                </p>
                                <div className="mt-auto flex flex-col gap-2 border-t border-gray-50 dark:border-white/5 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                            <MapPin size={12} style={{ color: accent }} />
                                            {/* Renderizado Seguro: Si es objeto mostramos .name, si es string lo mostramos directo */}
                                            {typeof program.location === 'object'
                                                ? (program.location?.name || 'N/A')
                                                : (program.location || 'N/A')
                                            }
                                        </span>
                                        <span className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                            <Users size={12} />
                                            {program.participants || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                    <div className="inline-flex p-6 rounded-3xl bg-gray-50 dark:bg-white/5 text-gray-300 mb-4">
                        <Target size={48} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sin programas</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">No se encontraron programas que coincidan.</p>
                </div>
            )}

            <ProgramFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                themeColor={accent}
            />

            <ConfirmModal
                {...modalConfig}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default ProgramsList;