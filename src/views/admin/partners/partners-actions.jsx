import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, UserRoundCheck, Info, Search, Briefcase, Building2, UserCircle2, Handshake, Filter, Eye, Lock, EyeOff, RefreshCw } from 'lucide-react';

import {
    useGetPartnersQuery,
    useDeletePartnerMutation,
    useUpdatePartnerMutation
} from '../../../store/partners';
import { onSetActivePartner } from '../../../store/partners';
import PartnerFormModal from './partner-modal';
import ConfirmModal from '../../../components/shared/ConfirmModal';

const PartnersView = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefetching, setIsRefetching] = useState(false);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', variant: 'danger', onConfirm: null });

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

    // Toggle Visibility (Real implementation)
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

    if (isLoading) return <div className="p-10 text-center text-gray-500 font-black uppercase text-xs animate-pulse">Cargando socios estratégicos...</div>;

    // Estadísticas para el mini panel
    const stats = [
        { label: 'Total Socios', value: partners.length, icon: Handshake, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        { label: 'Empresas', value: partners.filter(p => p.typeLabel === 'Empresa').length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'ONGs / Inst.', value: partners.filter(p => p.typeLabel !== 'Empresa').length, icon: UserCircle2, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { label: 'Nuevos (Mes)', value: Math.min(partners.length, 3), icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
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
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-full pl-11 pr-10 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#018F64]/20 appearance-none cursor-pointer transition-all"
                        >
                            {types.map(type => (
                                <option key={type} value={type} className="bg-white dark:bg-gray-900">
                                    Filtrar: {type}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <Plus size={14} className="rotate-45" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-100 dark:bg-white/5 border-none rounded-full pl-11 pr-5 py-3 text-xs font-medium focus:ring-2 focus:ring-[#018F64]/20 outline-none transition-all dark:text-white"
                        />
                    </div>

                    <button
                        onClick={async () => {
                            setIsRefetching(true);
                            await refetch();
                            setTimeout(() => setIsRefetching(false), 1000);
                        }}
                        className="p-3 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-500 hover:text-[#018F64] shadow-sm hover:shadow-md transition-all"
                        title="Actualizar lista"
                    >
                        <RefreshCw className={isRefetching ? 'animate-spin' : ''} size={20} />
                    </button>
                </div>
            </div>

            {/* GRID DE TARJETAS */}
            {filteredPartners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                    {filteredPartners.map((partner) => (
                        <div
                            key={partner._id}
                            className={`bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border ${partner.isLocked ? 'border-orange-200 dark:border-orange-900/50 bg-orange-50/10' : 'border-gray-100 dark:border-gray-800'} hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden`}
                        >
                            <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
                                {/* Only show Eye if NOT locked */}
                                {!partner.isLocked && (
                                    <button
                                        onClick={() => handleToggleVisibility(partner)}
                                        className={`p-2 bg-gray-100 dark:bg-gray-800 rounded-lg transition-all ${partner.isVisible ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                        title={partner.isVisible ? "Visible en Landing" : "Oculto en Landing"}
                                    >
                                        {partner.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </button>
                                )}

                                <button
                                    onClick={() => handleEdit(partner)}
                                    className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-[#018F64] rounded-lg transition-all"
                                    title="Editar"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(partner._id)}
                                    className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 rounded-lg transition-all"
                                    title="Eliminar"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-white dark:ring-gray-800 overflow-hidden shrink-0 transition-transform duration-500 group-hover:scale-110 ${partner.isLocked ? 'bg-orange-100 text-orange-500' : 'text-white'}`}
                                    style={!partner.isLocked ? {
                                        backgroundColor: partner.mainColor || '#018F64',
                                        boxShadow: `0 10px 20px -5px ${partner.mainColor || '#018F64'}40`
                                    } : {}}
                                >
                                    {partner.isLocked ? (
                                        <Lock size={24} />
                                    ) : (
                                        partner.logo ? (
                                            <img
                                                src={partner.logo}
                                                alt={partner.name}
                                                className="w-full h-full object-contain p-2 bg-white/10"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerText = partner.name?.charAt(0) || 'P';
                                                }}
                                            />
                                        ) : (
                                            partner.name?.charAt(0) || 'P'
                                        )
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight tracking-tight uppercase italic group-hover:text-[#018F64] transition-colors break-words">
                                        {partner.name}
                                    </h3>
                                    {partner.isLocked ? (
                                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mt-2 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                            ⚠️ Datos Incompletos
                                        </span>
                                    ) : (
                                        <span
                                            className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mt-2"
                                            style={{
                                                backgroundColor: `${partner.mainColor || '#018F64'}15`,
                                                color: partner.mainColor || '#018F64'
                                            }}
                                        >
                                            {partner.typeLabel}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Description or Locked Message */}
                            {partner.isLocked ? (
                                <div onClick={() => handleEdit(partner)} className="cursor-pointer">
                                    <p className="text-orange-400 dark:text-orange-300 text-xs font-bold italic mb-6 bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-900/20">
                                        Esta ficha se generó automáticamente. Pulsa editar para completar la información y desbloquear la visibilidad.
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-3 h-12 font-medium italic mb-6">
                                    {partner.description}
                                </p>
                            )}

                            <div className="mt-auto flex justify-between items-center border-t border-gray-50 dark:border-gray-800/50 pt-5">
                                <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-black bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-widest">
                                    <UserRoundCheck size={14} className='text-emerald-500' />
                                    Verificado
                                </span>
                                <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 font-black bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-widest">
                                    <Info size={14} className='text-blue-500' />
                                    {partner.filterType}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center space-y-4">
                    <div className="inline-flex p-6 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 text-gray-300">
                        <Handshake size={48} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-black uppercase text-xs tracking-widest italic">No se encontraron socios estratégicos</p>
                </div>
            )}

            {/* BOTÓN FLOTANTE */}
            <button
                onClick={handleCreate}
                className="fixed bottom-10 right-10 bg-[#018F64] text-white p-5 rounded-full shadow-2xl shadow-[#018F64]/30 hover:bg-[#05835D] hover:scale-110 active:scale-95 transition-all z-50 group flex items-center justify-center border-4 border-white dark:border-gray-950"
            >
                <Plus size={28} strokeWidth={4} />
                <span className="absolute right-full mr-4 px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none translate-x-4 group-hover:translate-x-0 shadow-xl">
                    Añadir Nuevo Socio
                </span>
            </button>

            <PartnerFormModal
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

export default PartnersView;