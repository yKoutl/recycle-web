import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Edit2, Trash2, Search, Filter, RotateCw,
    Gift, Box, Layout, ShoppingBag, Handshake,
    Percent, Sparkles, Heart, AlertCircle, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useGetRewardsQuery, useDeleteRewardMutation, onSetActiveReward } from '../../../store/rewards';
import RewardFormModal from './reward-modal';
import ConfirmModal from '../../../components/shared/ConfirmModal';

// Mapeo mejorado para consistencia visual
const CATEGORY_MAP = {
    products: { label: 'Producto', color: '#10b981', icon: ShoppingBag, bg: 'bg-emerald-500/10' },
    partners: { label: 'Convenio', color: '#3b82f6', icon: Handshake, bg: 'bg-blue-500/10' },
    discounts: { label: 'Descuento', color: '#f59e0b', icon: Percent, bg: 'bg-amber-500/10' },
    experiences: { label: 'Experiencia', color: '#8b5cf6', icon: Sparkles, bg: 'bg-purple-500/10' },
    donations: { label: 'Donación', color: '#f43f5e', icon: Heart, bg: 'bg-rose-500/10' },
};

const RewardsList = ({ themeColor }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'danger', onConfirm: null });
    const accent = themeColor || '#018F64';

    const { data: rewards = [], isLoading, refetch } = useGetRewardsQuery();
    const [deleteReward] = useDeleteRewardMutation();

    const categories = ['Todos', ...new Set(rewards.map(r => CATEGORY_MAP[r.category]?.label || 'Otro'))];

    const filteredRewards = rewards.filter(reward => {
        const categoryLabel = CATEGORY_MAP[reward.category]?.label || 'Otro';
        const matchesCategory = selectedCategory === 'Todos' || categoryLabel === selectedCategory;
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
            title: '¿Eliminar Recompensa?',
            message: 'Esta acción quitará el premio del catálogo de la app. Los usuarios ya no podrán canjearlo.',
            variant: 'danger',
            confirmText: 'Sí, Eliminar',
            onConfirm: async () => {
                await deleteReward(id);
                setModalConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const stats = [
        { label: 'Total Premios', value: rewards.length, icon: Gift, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
        { label: 'Stock Global', value: rewards.reduce((acc, curr) => acc + (curr.stock || 0), 0), icon: Box, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { label: 'Costo Promedio', value: rewards.length ? Math.round(rewards.reduce((acc, curr) => acc + curr.points, 0) / rewards.length) : 0, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
                        <Gift size={22} strokeWidth={2} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Catálogo de Recompensas</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Gestiona los premios y beneficios por EcoPuntos.</p>
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
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                    <input
                        type="text"
                        placeholder="Buscar por título o marca..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none transition-all text-gray-900 dark:text-white"
                        onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 2px ${accent}20`; }}
                        onBlur={(e) => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 outline-none cursor-pointer"
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <button onClick={refetch} className="p-2.5 text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl transition-all">
                        <RotateCw size={15} className={isLoading ? 'animate-spin' : ''} />
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

            {/* ── Grid of Reward Cards ── */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 dark:bg-white/5 animate-pulse rounded-3xl" />)}
                </div>
            ) : filteredRewards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRewards.map((reward) => {
                        const cat = CATEGORY_MAP[reward.category] || { label: 'Otro', color: '#64748b', icon: Box, bg: 'bg-slate-500/10' };
                        const isLowStock = reward.stock > 0 && reward.stock < 5;
                        const isOutOfStock = reward.stock <= 0;

                        return (
                            <div key={reward._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col">

                                {/* Imagen con Overlay de Acciones */}
                                <div className="h-32 w-full overflow-hidden relative bg-slate-100 dark:bg-white/5">
                                    {reward.imageUrl ? (
                                        <img src={reward.imageUrl} alt={reward.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <ShoppingBag size={40} />
                                        </div>
                                    )}

                                    {/* Badge de Stock Dinámico */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 shadow-lg ${isOutOfStock ? 'bg-red-500 text-white' :
                                                isLowStock ? 'bg-orange-500 text-white animate-pulse' :
                                                    'bg-emerald-500 text-white'
                                            }`}>
                                            {isOutOfStock ? 'Agotado' : isLowStock ? 'Stock Bajo' : 'Disponible'}
                                        </span>
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <div className="flex gap-2 w-full justify-between items-center">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(reward)} className="p-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/40 transition-all">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(reward._id)} className="p-2 bg-red-500/20 backdrop-blur-md text-red-200 rounded-lg hover:bg-red-500/40 transition-all">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <span className="text-[10px] font-black text-white uppercase bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                                                ID: ...{reward._id.slice(-4)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contenido de la Tarjeta */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border flex items-center gap-1`}
                                            style={{ color: cat.color, backgroundColor: `${cat.color}15`, borderColor: `${cat.color}30` }}>
                                            <cat.icon size={10} /> {cat.label}
                                        </span>
                                        {reward.sponsor && (
                                            <span className="text-[9px] font-bold uppercase text-gray-400">
                                                • {reward.sponsor}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{reward.title}</h3>
                                    <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-2 mb-4 font-medium leading-relaxed">
                                        {reward.description}
                                    </p>

                                    {/* Footer con Costo y Stock */}
                                    <div className="mt-auto flex justify-between items-center border-t border-gray-50 dark:border-white/5 pt-4">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Costo Canje</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-gray-900 dark:text-white">{reward.points}</span>
                                                <span className="text-[9px] font-bold" style={{ color: accent }}>PTS</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Disponibles</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-sm font-black ${isOutOfStock ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {reward.stock}
                                                </span>
                                                <Box size={12} className="text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                    <div className="inline-flex p-6 rounded-3xl bg-gray-50 dark:bg-white/5 text-gray-300 mb-4">
                        <Gift size={48} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Catálogo Vacío</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">No hay recompensas registradas en esta categoría.</p>
                </div>
            )}

            <RewardFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} themeColor={accent} />
            <ConfirmModal {...modalConfig} onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} />
        </div>
    );
};

export default RewardsList;