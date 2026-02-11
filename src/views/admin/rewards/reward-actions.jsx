import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Tag, Box, Layers, Search, AlertCircle, Award, Gift as GiftIcon, Filter } from 'lucide-react';

import { useGetRewardsQuery, useDeleteRewardMutation } from '../../../store/rewards';
import { onSetActiveReward } from '../../../store/rewards';

const RewardsList = ({ onOpenModal }) => {
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: rewards = [], isLoading } = useGetRewardsQuery();
    const [deleteReward] = useDeleteRewardMutation();

    const categories = ['Todos', ...new Set(rewards.map(r => r.category || 'Sin categoría'))];

    const filteredRewards = rewards.filter(reward => {
        const matchesCategory = selectedCategory === 'Todos' || reward.category === selectedCategory;
        const matchesSearch = reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (reward.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleCreate = () => {
        dispatch(onSetActiveReward(null));
        if (onOpenModal) onOpenModal();
    };

    const handleEdit = (reward) => {
        dispatch(onSetActiveReward(reward));
        if (onOpenModal) onOpenModal();
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este premio?")) {
            await deleteReward(id);
        }
    };

    if (isLoading) return <div className="p-10 text-center text-gray-500">Cargando premios...</div>;

    // Estadísticas para el mini panel
    const stats = [
        { label: 'Total Premios', value: rewards.length, icon: GiftIcon, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Stock Crítico', value: rewards.filter(r => r.stock < 5).length, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        { label: 'Categorías', value: Math.max(0, categories.length - 1), icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { label: 'Pts Promedio', value: rewards.length ? Math.round(rewards.reduce((acc, curr) => acc + (curr.points || 0), 0) / rewards.length) : 0, icon: Award, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
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
                        placeholder="Buscar premios..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-full pl-11 pr-5 py-3 text-xs font-medium focus:ring-2 focus:ring-[#018F64]/20 outline-none transition-all dark:text-white"
                    />
                </div>
            </div>

            {/* GRID DE TARJETAS */}
            {filteredRewards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                    {filteredRewards.map((reward) => (
                        <div
                            key={reward._id}
                            className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute -right-4 -bottom-4 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700 pointer-events-none text-[#018F64]">
                                <GiftIcon size={120} />
                            </div>

                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                <button
                                    onClick={() => handleEdit(reward)}
                                    className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-600 dark:text-gray-300 rounded-xl shadow-lg hover:bg-[#018F64] hover:text-white transition-all"
                                    title="Editar"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(reward._id)}
                                    className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-600 dark:text-gray-300 rounded-xl shadow-lg hover:bg-red-500 hover:text-white transition-all"
                                    title="Eliminar"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <h3 className="text-lg font-black text-gray-900 dark:text-white pr-20 truncate tracking-tight uppercase italic">
                                {reward.title}
                            </h3>

                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-3 line-clamp-2 h-8 font-medium italic">
                                {reward.description}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-2 items-center border-t border-gray-50 dark:border-gray-800/50 pt-5">
                                <span className="flex items-center gap-1.5 font-black bg-[#018F64]/10 dark:bg-[#018F64]/20 px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest text-[#018F64]">
                                    <Tag size={12} strokeWidth={3} />
                                    {reward.points} PTS
                                </span>

                                <span className={`flex items-center gap-1.5 font-black px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest ${reward.stock < 10 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                    }`}>
                                    <Box size={12} strokeWidth={3} />
                                    STOCK: {reward.stock}
                                </span>

                                <span className="flex items-center gap-1.5 font-black bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest text-blue-600">
                                    <Layers size={12} strokeWidth={3} />
                                    {reward.category}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center space-y-4">
                    <div className="inline-flex p-6 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 text-gray-300">
                        <GiftIcon size={48} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-black uppercase text-xs tracking-widest italic">No se encontraron premios</p>
                </div>
            )}

            {/* BOTÓN FLOTANTE (FAB) */}
            <button
                onClick={handleCreate}
                className="fixed bottom-10 right-10 bg-[#018F64] text-white p-5 rounded-full shadow-2xl shadow-[#018F64]/30 hover:bg-[#05835D] hover:scale-110 active:scale-95 transition-all z-50 group flex items-center justify-center border-4 border-white dark:border-gray-950"
            >
                <Plus size={28} strokeWidth={4} />
                <span className="absolute right-full mr-4 px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none translate-x-4 group-hover:translate-x-0 shadow-xl">
                    Crear Nuevo Premio
                </span>
            </button>
        </div>
    );
};

export default RewardsList;