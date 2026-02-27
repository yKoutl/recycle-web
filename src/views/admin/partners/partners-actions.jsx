import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, UserRoundCheck, Info, Search, Briefcase, Building2, UserCircle2, Handshake, Filter, Eye, Lock, EyeOff, RefreshCw, RotateCw } from 'lucide-react';

import {
    useGetPartnersQuery,
    useDeletePartnerMutation,
    useUpdatePartnerMutation
} from '../../../store/partners';
import { onSetActivePartner } from '../../../store/partners';
import PartnerFormModal from './partner-modal';
import ConfirmModal from '../../../components/shared/ConfirmModal';

const PartnersView = ({ themeColor }) => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'danger', onConfirm: null });
    const accent = themeColor || '#018F64';

    const { data: partners = [], isLoading, refetch } = useGetPartnersQuery();
    const [deletePartner] = useDeletePartnerMutation();
    const [updatePartner] = useUpdatePartnerMutation();

    const types = ['Todos', ...new Set(partners.map(p => p.typeLabel || 'Empresa'))];

    const filteredPartners = partners.filter(partner => {
        const matchesType = selectedType === 'Todos' || partner.typeLabel === selectedType;
        const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (partner.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    const handleCreate = () => {
        dispatch(onSetActivePartner(null));
        setIsModalOpen(true);
    };

    const handleEdit = (partner) => {
        dispatch(onSetActivePartner(partner));
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        setModalConfig({
            isOpen: true,
            title: '¿Eliminar Socio?',
            message: '¿Estás seguro de eliminar este socio estratégico? Esta acción no se puede deshacer.',
            variant: 'danger',
            confirmText: 'Sí, Eliminar',
            onConfirm: async () => {
                await deletePartner(id);
                setModalConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleToggleVisibility = async (partner) => {
        if (partner.isLocked) return;
        try {
            await updatePartner({
                id: partner._id,
                isVisible: !partner.isVisible
            }).unwrap();
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    const stats = [
        { label: 'Socios', value: partners.length, icon: Handshake, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
        { label: 'Empresas', value: partners.filter(p => p.typeLabel === 'Empresa').length, icon: Building2, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { label: 'Inactivos', value: partners.filter(p => !p.isVisible).length, icon: EyeOff, color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-500/10' },
    ];

    if (isLoading) return <div className="p-10 text-center animate-pulse text-gray-400">Cargando socios...</div>;

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 8px 20px ${accent}30` }}>
                        <Handshake size={22} strokeWidth={1.75} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            Aliados Estratégicos
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            Gestiona las empresas y organizaciones vinculadas al proyecto.
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-md"
                    style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 4px 14px ${accent}40` }}
                >
                    <Plus size={16} strokeWidth={2.5} /> Nuevo aliado
                </button>
            </div>

            {/* ── Search and Filter Row ── */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} strokeWidth={1.75} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o descripción..."
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
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 outline-none appearance-none cursor-pointer hover:border-gray-300 transition-all"
                        >
                            {types.map(type => (
                                <option key={type} value={type}>{type}</option>
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

            {/* ── Grid of Partners ── */}
            {filteredPartners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPartners.map((partner) => (
                        <div
                            key={partner._id}
                            className={`bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border ${partner.isLocked ? 'border-orange-200 dark:border-orange-900/40 bg-orange-50/10' : 'border-gray-100 dark:border-white/5'} hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden flex flex-col`}
                        >
                            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                {!partner.isLocked && (
                                    <button
                                        onClick={() => handleToggleVisibility(partner)}
                                        className={`p-2 rounded-lg transition-all bg-slate-50 dark:bg-white/5 ${partner.isVisible ? 'text-blue-500' : 'text-gray-400'}`}
                                    >
                                        {partner.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </button>
                                )}
                                <button onClick={() => handleEdit(partner)} className="p-2 bg-slate-50 dark:bg-white/5 text-gray-400 rounded-lg transition-colors" style={{ color: accent }}>
                                    <Edit2 size={14} />
                                </button>
                                <button onClick={() => handleDelete(partner._id)} className="p-2 bg-slate-50 dark:bg-white/5 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg overflow-hidden shrink-0 shadow-lg ${partner.isLocked ? 'bg-orange-100 text-orange-500' : 'text-white'}`}
                                    style={!partner.isLocked ? { backgroundColor: partner.mainColor || accent, boxShadow: `0 8px 16px ${(partner.mainColor || accent)}30` } : {}}
                                >
                                    {partner.isLocked ? <Lock size={20} /> : (
                                        partner.logo ? (
                                            <img src={partner.logo} className="w-full h-full object-contain p-2" alt={partner.name} />
                                        ) : partner.name?.charAt(0)
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white truncate tracking-tight">{partner.name}</h3>
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 inline-block bg-gray-100 dark:bg-white/5 text-gray-500">
                                        {partner.typeLabel}
                                    </span>
                                </div>
                            </div>

                            {partner.isLocked ? (
                                <p className="text-orange-500 dark:text-orange-300 text-[10px] font-bold italic mb-4 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/20">
                                    ⚠️ Ficha incompleta. Editar para desbloquear.
                                </p>
                            ) : (
                                <p className="text-gray-400 dark:text-gray-500 text-xs line-clamp-2 mb-4 font-medium italic h-8">
                                    {partner.description}
                                </p>
                            )}

                            <div className="mt-auto flex justify-between items-center border-t border-gray-50 dark:border-white/5 pt-4">
                                <span
                                    className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest"
                                    style={{ color: accent }}
                                >
                                    <UserRoundCheck size={12} /> Verificado
                                </span>
                                <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                                    {partner.filterType}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                    <div className="inline-flex p-6 rounded-3xl bg-gray-50 dark:bg-white/5 text-gray-300 mb-4">
                        <Handshake size={48} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sin aliados</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">No se encontraron socios que coincidan.</p>
                </div>
            )}

            <PartnerFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} themeColor={accent} />
            <ConfirmModal {...modalConfig} onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} />
        </div>
    );
};

export default PartnersView;