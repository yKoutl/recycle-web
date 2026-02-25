import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Tag, Box, Layers, Search, AlertCircle, Award, Gift as GiftIcon, Filter, RotateCw, ArrowRight } from 'lucide-react';

import { useGetRewardsQuery, useDeleteRewardMutation } from '../../../store/rewards';
import { onSetActiveReward } from '../../../store/rewards';
import ConfirmModal from '../../../components/shared/ConfirmModal';

const RewardsList = ({ onOpenModal, themeColor }) => {
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'danger', onConfirm: null });
    const accent = themeColor || '#018F64';

    const { data: rewards = [], isLoading, refetch } = useGetRewardsQuery();
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
        setModalConfig({
            isOpen: true,
            title: '¿Eliminar Premio?',
            message: '¿Estás seguro de eliminar este premio? Esta acción no se puede deshacer.',
            variant: 'danger',
            confirmText: 'Sí, Eliminar',
            onConfirm: async () => {
                await deleteReward(id);
                setModalConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const stats = [
        { label: 'Total', value: rewards.length, icon: GiftIcon, color: '#2563eb', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { label: 'Stock Crítico', value: rewards.filter(r => r.stock < 5).length, icon: AlertCircle, color: '#f97316', bg: 'bg-orange-50 dark:bg-orange-500/10' },
        { label: 'Categorías', value: Math.max(0, categories.length - 1), icon: Layers, color: '#8b5cf6', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 8px 20px ${accent}30` }}>
                        <GiftIcon size={22} strokeWidth={1.75} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            Gestión de Premios
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            Crea y administra las recompensas para tus ciudadanos.
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-md"
                    style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 4px 14px ${accent}40` }}
                >
                    <Plus size={16} strokeWidth={2.5} /> Nuevo premio
                </button>
            </div>

            {/* ── Search and Filter ── */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} strokeWidth={1.75} />
                    <input
                        type="text"
                        placeholder="Buscar premios..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 outline-none appearance-none cursor-pointer hover:border-gray-300 transition-all"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => refetch()}
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
            ) : filteredRewards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRewards.map((reward) => (
                        <div
                            key={reward._id}
                            className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                <button
                                    onClick={() => handleEdit(reward)}
                                    className="p-2 bg-slate-50 dark:bg-white/5 text-gray-400 rounded-lg transition-colors"
                                    style={{ color: accent }}
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(reward._id)}
                                    className="p-2 bg-slate-50 dark:bg-white/5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center text-white shrink-0 shadow-lg`} style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 8px 20px ${accent}40` }}>
                                <Award size={24} />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                {reward.title}
                            </h3>
                            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2 line-clamp-2 font-medium">
                                {reward.description}
                            </p>

                            <div className="mt-8 flex items-center justify-between border-t border-gray-50 dark:border-white/5 pt-5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: accent }}>Puntuación</span>
                                    <span className="text-xl font-black text-gray-900 dark:text-white tabular-nums">{reward.points} <span className="text-[10px] text-gray-400">PTS</span></span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Disponibles</span>
                                    <span className={`text-base font-bold tabular-nums ${reward.stock < 10 ? 'text-orange-500' : 'text-gray-600 dark:text-gray-300'}`}>{reward.stock}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                    <div className="inline-flex p-6 rounded-3xl bg-gray-50 dark:bg-white/5 text-gray-300 mb-4">
                        <GiftIcon size={48} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sin premios</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">No se encontraron premios que coincidan con tu búsqueda.</p>
                </div>
            )}

            <ConfirmModal
                {...modalConfig}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default RewardsList;