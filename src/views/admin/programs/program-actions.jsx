import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, MapPin, Users, Search, Target, Globe, Activity, Layout, Filter } from 'lucide-react';

import { useGetProgramsQuery, useDeleteProgramMutation } from '../../../store/programs';
import { onSetActiveProgram } from '../../../store/programs';
import ProgramFormModal from './program-modal';
import ConfirmModal from '../../../components/shared/ConfirmModal';

const ProgramsList = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'danger', onConfirm: null });

    const { data: programs = [], isLoading } = useGetProgramsQuery();
    const [startDelete] = useDeleteProgramMutation();

    const categories = ['Todos', ...new Set(programs.map(p => p.category || 'Sin categoría'))];

    const filteredPrograms = programs.filter(program => {
        const matchesCategory = selectedCategory === 'Todos' || program.category === selectedCategory;
        const matchesSearch = program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (program.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (program.location || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
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

    if (isLoading) return <div className="p-10 text-center text-gray-500">Cargando programas...</div>;

    // Estadísticas para el mini panel
    const stats = [
        { label: 'Total Programas', value: programs.length, icon: Layout, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { label: 'Participantes', value: programs.reduce((acc, curr) => acc + (curr.participants || 0), 0), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Ubicaciones', value: new Set(programs.map(p => p.location)).size, icon: MapPin, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        { label: 'Impacto Global', value: '+45%', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    ];

    return (
        <div className="space-y-10 animate-fade-in relative min-h-[50vh]">

            {/* MINI PANEL DE ESTADÍSTICAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white/80 dark:bg-gray-900/40 backdrop-blur-xl p-5 rounded-3xl border border-gray-100 dark:border-white/5 flex items-center gap-4 transition-all hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-none">
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">{stat.label}</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white tabular-nums">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* BARRA DE FILTROS Y BÚSQUEDA */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/50 dark:bg-gray-900/20 p-4 rounded-[2rem] border border-gray-100 dark:border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-full pl-11 pr-10 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#018F64]/20 appearance-none cursor-pointer transition-all"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="bg-white dark:bg-gray-900">
                                    Filtrar: {cat}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <Plus size={14} className="rotate-45" />
                        </div>
                    </div>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar programas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-full pl-11 pr-5 py-3 text-xs font-medium focus:ring-2 focus:ring-[#018F64]/20 outline-none transition-all dark:text-white"
                    />
                </div>
            </div>

            {/* GRID DE TARJETAS */}
            {filteredPrograms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                    {filteredPrograms.map((program) => (
                        <div key={program._id} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col h-full">

                            {/* Imagen de portada */}
                            <div className="h-40 w-full overflow-hidden relative">
                                {program.imageUrl ? (
                                    <img src={program.imageUrl} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-tr from-emerald-100 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center text-[#018F64]">
                                        <Activity size={40} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <span className="text-white text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2">
                                        <Target size={12} /> Ver detalles del programa
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white pr-4 truncate tracking-tight uppercase italic">
                                        {program.title}
                                    </h3>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0 shrink-0">
                                        <button onClick={() => handleEdit(program)} className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg shadow-sm hover:bg-[#018F64] hover:text-white transition-all">
                                            <Edit2 size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(program._id)} className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg shadow-sm hover:bg-red-500 hover:text-white transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 h-8 font-medium italic mb-6">
                                    {program.description}
                                </p>

                                <div className="mt-auto flex justify-between items-center border-t border-gray-50 dark:border-gray-800/50 pt-4">
                                    <span className="flex items-center gap-1.5 text-[#018F64] font-black bg-[#018F64]/10 dark:bg-[#018F64]/20 px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-widest">
                                        <MapPin size={12} strokeWidth={3} />
                                        {program.location}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                        <Users size={12} />
                                        {program.participants} Participantes
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center space-y-4">
                    <div className="inline-flex p-6 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 text-gray-300">
                        <Activity size={48} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-black uppercase text-xs tracking-widest italic">No se encontraron programas</p>
                </div>
            )}

            {/* BOTÓN FLOTANTE */}
            <button
                onClick={handleCreate}
                className="fixed bottom-10 right-10 bg-[#018F64] text-white p-5 rounded-full shadow-2xl shadow-[#018F64]/30 hover:bg-[#05835D] hover:scale-110 active:scale-95 transition-all z-50 group flex items-center justify-center border-4 border-white dark:border-gray-950"
            >
                <Plus size={28} strokeWidth={4} />
                <span className="absolute right-full mr-4 px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none translate-x-4 group-hover:translate-x-0 shadow-xl">
                    Crear Nuevo Programa
                </span>
            </button>

            <ProgramFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <ConfirmModal
                {...modalConfig}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default ProgramsList;