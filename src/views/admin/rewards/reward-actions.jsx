import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Plus, Edit2, Trash2, Layers, Search, AlertCircle,
    Award, Gift as GiftIcon, Filter, RotateCw, Box,
    Handshake, ShoppingBag, Percent, Sparkles, Heart
} from 'lucide-react';

import { useGetRewardsQuery, useDeleteRewardMutation } from '../../../store/rewards';
import { onSetActiveReward } from '../../../store/rewards';
import ConfirmModal from '../../../components/shared/ConfirmModal';
import RewardFormModal from './reward-modal';

// Mapeo basado en tu RewardCategory Enum
const CATEGORY_MAP = {
    partners: { label: 'Convenios', color: '#3b82f6', icon: Handshake, bg: 'bg-blue-50 dark:bg-blue-500/10' },
    products: { label: 'Productos', color: '#10b981', icon: ShoppingBag, bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    discounts: { label: 'Descuentos', color: '#f59e0b', icon: Percent, bg: 'bg-amber-50 dark:bg-amber-500/10' },
    experiences: { label: 'Experiencias', color: '#8b5cf6', icon: Sparkles, bg: 'bg-purple-50 dark:bg-purple-500/10' },
    donations: { label: 'Donaciones', color: '#f43f5e', icon: Heart, bg: 'bg-rose-50 dark:bg-rose-500/10' },
};

const RewardsList = ({ themeColor }) => {
    const dispatch = useDispatch();
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'danger' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const accent = themeColor || '#018F64';
    const { data: rewards = [], isLoading, refetch } = useGetRewardsQuery();
    const [deleteReward] = useDeleteRewardMutation();

    const filteredRewards = rewards.filter(reward => {
        const matchesCategory = selectedCategory === 'ALL' || reward.category === selectedCategory;
        const matchesSearch = reward.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (reward.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleCreate = () => {
        dispatch(onSetActiveReward(null));
        setIsModalOpen(true);
    };

    const handleEdit = (reward) => {
        dispatch(onSetActiveReward(reward));
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        setModalConfig({
            isOpen: true,
            title: 'Eliminar Recompensa',
            message: '¿Estás seguro? Esta acción es irreversible.',
            onConfirm: async () => {
                await deleteReward(id);
                setModalConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 rounded-[1.5rem] text-white shadow-2xl"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                        <GiftIcon size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Premios & Recompensas</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Gestiona convenios, productos y donaciones disponibles.</p>
                    </div>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-3 px-6 py-3 text-white rounded-[1.25rem] font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                    style={{ background: accent }}
                >
                    <Plus size={20} strokeWidth={3} />
                    <span>Nuevo Premio</span>
                </button>
            </div>

            {/* ── Filtros ── */}
            <div className="bg-white dark:bg-gray-900/50 p-4 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar premios..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-sm"
                        style={{ outline: 'none' }}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                    <button
                        onClick={() => setSelectedCategory('ALL')}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === 'ALL' ? 'bg-gray-900 text-white' : 'bg-gray-50 dark:bg-white/5 text-gray-400'}`}
                    >
                        Todos
                    </button>
                    {Object.entries(CATEGORY_MAP).map(([key, data]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${selectedCategory === key ? 'text-white' : 'text-gray-400 bg-gray-50 dark:bg-white/5'}`}
                            style={selectedCategory === key ? { backgroundColor: data.color } : {}}
                        >
                            <data.icon size={14} />
                            {data.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Grid ── */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-80 bg-gray-100 dark:bg-white/5 animate-pulse rounded-[2.5rem]" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRewards.map((reward) => {
                        const cat = CATEGORY_MAP[reward.category] || { label: reward.category, color: '#94a3b8', icon: Box, bg: 'bg-slate-50' };
                        return (
                            <div key={reward._id} className="group bg-white dark:bg-gray-900 rounded-[2.5rem] p-7 shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-2xl transition-all duration-500">

                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl ${cat.bg}`} style={{ color: cat.color }}>
                                        <cat.icon size={24} />
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                        <button onClick={() => handleEdit(reward)} className="p-2.5 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-blue-500 rounded-xl transition-colors">
                                            <Edit2 size={15} />
                                        </button>
                                        <button onClick={() => handleDelete(reward._id)} className="p-2.5 bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 rounded-xl transition-colors">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border"
                                            style={{ color: cat.color, borderColor: `${cat.color}30`, backgroundColor: `${cat.color}10` }}>
                                            {cat.label}
                                        </span>
                                        {reward.partnerType && (
                                            <span className="text-[9px] font-bold uppercase text-gray-400">
                                                • {reward.partnerType}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                        {reward.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-2 font-medium">
                                        {reward.description}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Costo</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-gray-900 dark:text-white">{reward.points}</span>
                                            <span className="text-xs font-bold" style={{ color: accent }}>PTS</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</span>
                                        <span className={`text-lg font-black ${reward.stock < 5 ? 'text-orange-500 animate-pulse' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {reward.stock}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <RewardFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} themeColor={accent} />
            <ConfirmModal {...modalConfig} onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} />
        </div>
    );
};

export default RewardsList;