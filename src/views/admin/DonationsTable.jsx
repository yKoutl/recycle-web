import React, { useState, useMemo } from 'react';
import {
    CreditCard,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    TrendingUp,
    ShieldCheck,
    Calendar,
    User,
    ChevronDown,
    ChevronUp,
    History,
    AlertCircle,
    Eye,
    Receipt,
    Wallet,
    Ban,
    Mail,
    RefreshCw
} from 'lucide-react';
import {
    useGetDonationsQuery,
    useApproveDonationMutation,
    useRejectDonationMutation
} from '../../store/donations/donationsApi';
import StatusModal from '../../components/shared/StatusModal';

const DonationsTable = ({ t, themeColor }) => {
    const { data: donations = [], isLoading, refetch } = useGetDonationsQuery();
    const [approveDonation] = useApproveDonationMutation();
    const [rejectDonation] = useRejectDonationMutation();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [tierFilter, setTierFilter] = useState('ALL');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedUsers, setExpandedUsers] = useState(new Set());
    const [actionStatus, setActionStatus] = useState(null);
    const [viewingDetail, setViewingDetail] = useState(null); // { type: 'USER' | 'PAYMENT', data: object }

    const accentColor = themeColor || '#018F64';

    const handleAction = async (id, actionType) => {
        const msg = actionType === 'approve' ? 'Actualizando a Aprobado...' : 'Actualizando a Observado...';
        setActionStatus({ type: 'loading', message: msg });

        try {
            if (actionType === 'approve') {
                await approveDonation(id).unwrap();
                setActionStatus({ type: 'success', message: '¡Estado actualizado con éxito!' });
            } else {
                await rejectDonation(id).unwrap();
                setActionStatus({ type: 'success', message: 'La operación ha sido observada.' });
            }
            setTimeout(() => setActionStatus(null), 2000);
            refetch();
        } catch (error) {
            setActionStatus({ type: 'error', message: 'Error al actualizar el estado.' });
            setTimeout(() => setActionStatus(null), 3000);
        }
    };

    const handleSendThankYouEmail = (userName, email) => {
        if (!email) {
            setActionStatus({ type: 'error', message: 'El usuario no tiene correo registrado.' });
            setTimeout(() => setActionStatus(null), 3000);
            return;
        }
        const subject = encodeURIComponent('¡Gracias por tu aporte a Nos Planet!');
        const body = encodeURIComponent(`Hola ${userName},\n\nQueremos agradecerte de todo corazón por tu aporte. Gracias a personas como tú, seguimos impulsando el reciclaje y la educación ambiental.\n\n¡Eres un verdadero Eco-Héroe!\n\nSaludos,\nEl equipo de Nos Planet.`);
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };

    const toggleExpand = (userId) => {
        const newExpanded = new Set(expandedUsers);
        if (newExpanded.has(userId)) {
            newExpanded.delete(userId);
        } else {
            newExpanded.add(userId);
        }
        setExpandedUsers(newExpanded);
    };

    const getStatusTheme = (status) => {
        switch (status) {
            case 'APPROVED':
                return {
                    bg: 'bg-emerald-500/10',
                    text: 'text-emerald-500',
                    border: 'border-emerald-500/20',
                    label: 'Aprobado'
                };
            case 'PENDING':
                return {
                    bg: 'bg-amber-500/10',
                    text: 'text-amber-500',
                    border: 'border-amber-500/20',
                    label: 'Pendiente'
                };
            case 'REJECTED':
                return {
                    bg: 'bg-rose-500/10',
                    text: 'text-rose-500',
                    border: 'border-rose-500/20',
                    label: 'Observado'
                };
            default:
                return {
                    bg: 'bg-slate-500/10',
                    text: 'text-slate-400',
                    border: 'border-slate-500/10',
                    label: status
                };
        }
    };

    const getTierTheme = (tier) => {
        if (!tier) return { bg: 'bg-slate-100 dark:bg-white/5', text: 'text-slate-400', label: 'Ninguno' };
        const t = tier.toUpperCase();
        if (t === 'STARTER' || t === 'ECO_SOCIO') return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', label: 'Eco-Socio' };
        if (t === 'GROWTH' || t === 'ECO_EMBAJADOR') return { bg: 'bg-teal-500/10', text: 'text-teal-500', border: 'border-teal-500/20', label: 'Eco-Embajador' };
        if (t === 'HERO' || t === 'ECO_VISIONARIO') return { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500/20', label: 'Eco-Visionario' };
        return { bg: 'bg-slate-100 dark:bg-white/5', text: 'text-slate-400', label: tier };
    };

    const groupedData = useMemo(() => {
        const filtered = donations.filter(don => {
            // Auto-eliminar (hacer invisible) si está observado por más de 4 días
            if (don.status === 'REJECTED') {
                const updatedDate = new Date(don.updatedAt || don.createdAt);
                const daysDiff = (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24);
                if (daysDiff > 4) return false;
            }

            const matchesSearch =
                don.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                don.payerName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || don.status === statusFilter;
            const matchesTier = tierFilter === 'ALL' ||
                (don.tier?.toUpperCase() === tierFilter) ||
                (tierFilter === 'ECO_SOCIO' && don.tier?.toUpperCase() === 'STARTER') ||
                (tierFilter === 'ECO_EMBAJADOR' && don.tier?.toUpperCase() === 'GROWTH') ||
                (tierFilter === 'ECO_VISIONARIO' && don.tier?.toUpperCase() === 'HERO');
            const donDate = new Date(don.createdAt);
            const matchesDateFrom = !dateFrom || donDate >= new Date(dateFrom);
            const matchesDateTo = !dateTo || donDate <= new Date(dateTo + 'T23:59:59');
            return matchesSearch && matchesStatus && matchesTier && matchesDateFrom && matchesDateTo;
        });

        const groups = {};

        const normalizeName = (name) => {
            if (!name) return 'anonymous';
            return name.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, ' ') // Quitar espacios dobles
                .trim();
        };

        filtered.forEach(don => {
            // Prioridad 1: ID de usuario (si existe)
            // Prioridad 2: Nombre normalizado
            const userId = don.user?._id;
            const userName = don.user?.fullName || don.payerName || 'Anónimo';
            const normalizedName = normalizeName(userName);

            // Buscamos si ya existe un grupo para este ID o para este Nombre
            const groupKey = userId || normalizedName;

            if (!groups[groupKey]) {
                groups[groupKey] = {
                    userData: don.user || {
                        fullName: userName,
                        isAnonymous: !don.user
                    },
                    history: [],
                    stats: { totalApprovedAmount: 0, pendingCount: 0, approvedCount: 0, rejectedCount: 0 }
                };
            }

            // Si este registro tiene objeto de usuario y el grupo actual no, lo actualizamos
            if (don.user && groups[groupKey].userData.isAnonymous) {
                groups[groupKey].userData = { ...don.user, isAnonymous: false };
            }

            groups[groupKey].history.push(don);
            if (don.status === 'APPROVED') {
                groups[groupKey].stats.totalApprovedAmount += (don.amount || 0);
                groups[groupKey].stats.approvedCount++;
            } else if (don.status === 'PENDING') {
                groups[groupKey].stats.pendingCount++;
            } else if (don.status === 'REJECTED') {
                groups[groupKey].stats.rejectedCount++;
            }
        });

        // Una última pasada para unificar grupos que tengan el mismo nombre normalizado pero distinto ID
        const unifiedGroups = {};
        Object.values(groups).forEach(group => {
            const key = normalizeName(group.userData.fullName);
            if (!unifiedGroups[key]) {
                unifiedGroups[key] = group;
            } else {
                // Fusionamos historial y stats
                unifiedGroups[key].history = [...unifiedGroups[key].history, ...group.history];
                unifiedGroups[key].stats.totalApprovedAmount += group.stats.totalApprovedAmount;
                unifiedGroups[key].stats.pendingCount += group.stats.pendingCount;
                unifiedGroups[key].stats.approvedCount += group.stats.approvedCount;
                unifiedGroups[key].stats.rejectedCount += group.stats.rejectedCount;
                // Si este tiene usuario real, nos quedamos con sus datos
                if (!group.userData.isAnonymous) unifiedGroups[key].userData = group.userData;
            }
        });

        return Object.values(unifiedGroups).sort((a, b) => b.stats.pendingCount - a.stats.pendingCount);
    }, [donations, searchTerm, statusFilter, tierFilter, dateFrom, dateTo]);

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`, boxShadow: `0 8px 20px ${accentColor}30` }}>
                        <CreditCard size={20} strokeWidth={2} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Donaciones</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Gestión de aportes por usuario</p>
                    </div>
                </div>

                <div className="relative w-full sm:w-auto min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                        type="text"
                        placeholder="BUSCAR USUARIO..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-2xl text-[11px] font-bold uppercase tracking-widest outline-none shadow-sm focus:border-slate-300 dark:focus:border-white/20 transition-all text-gray-900 dark:text-white placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-1">
                {[
                    { label: 'Pendientes', val: donations.filter(d => d.status === 'PENDING').length, col: 'text-amber-500', icon: Clock },
                    { label: 'Confirmados', val: donations.filter(d => d.status === 'APPROVED').length, col: 'text-emerald-500', icon: CheckCircle2 },
                    { label: 'En espera', val: `S/ ${donations.filter(d => d.status === 'PENDING').reduce((acc, curr) => acc + (curr.amount || 0), 0)}`, col: 'text-slate-500 dark:text-white', icon: Wallet },
                    { label: 'Recaudado', val: `S/ ${donations.filter(d => d.status === 'APPROVED').reduce((acc, curr) => acc + (curr.amount || 0), 0)}`, col: 'text-emerald-600', icon: TrendingUp },
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-2">{s.label}</p>
                        <div className="flex items-center justify-between">
                            <span className={`text-xl font-black tabular-nums ${s.col}`}>{s.val}</span>
                            <s.icon size={16} className="text-slate-200 dark:text-white/10" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Controls - Modern Segmented Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 py-4 px-1">
                <div className="bg-slate-100/80 dark:bg-white/[0.03] p-1.5 rounded-[1.5rem] flex flex-wrap sm:flex-nowrap items-center gap-1 backdrop-blur-md border border-gray-100 dark:border-white/5 shadow-inner">
                    {[
                        { id: 'ALL', label: 'TODOS', icon: Filter },
                        { id: 'PENDING', label: 'PENDIENTE', icon: Clock },
                        { id: 'APPROVED', label: 'APROBADO', icon: CheckCircle2 },
                        { id: 'REJECTED', label: 'OBSERVADO', icon: AlertCircle }
                    ].map((st) => {
                        const Icon = st.icon;
                        const isActive = statusFilter === st.id;
                        return (
                            <button
                                key={st.id}
                                onClick={() => setStatusFilter(st.id)}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.05em] transition-all duration-300 relative active:scale-95 ${isActive
                                        ? 'bg-white dark:bg-white text-slate-900 shadow-[0_8px_20px_rgba(0,0,0,0.1)] scale-[1.02]'
                                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10 hover:scale-[1.02] hover:-translate-y-0.5'
                                    }`}
                            >
                                <Icon size={14} className={isActive ? 'text-indigo-500' : ''} />
                                {st.label}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-3 px-8 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 active:scale-95 ${showFilters
                        ? 'bg-slate-900 text-white shadow-xl hover:bg-slate-800 ring-4 ring-slate-900/10'
                        : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-0.5 hover:scale-105 hover:bg-white dark:hover:bg-white/10'
                        }`}
                >
                    <Filter size={14} className={showFilters ? 'animate-pulse' : ''} />
                    <span>{showFilters ? 'Ocultar Filtros' : 'Más Filtros'}</span>
                </button>
            </div>

            {showFilters && (
                <div className="bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
                    {[
                        { label: 'Membresía', value: tierFilter, setter: setTierFilter, type: 'select' },
                        { label: 'Desde', value: dateFrom, setter: setDateFrom, type: 'date' },
                        { label: 'Hasta', value: dateTo, setter: setDateTo, type: 'date' }
                    ].map((f, idx) => (
                        <div key={idx} className="space-y-2.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 dark:text-slate-200 ml-1">{f.label}</label>
                            {f.type === 'select' ? (
                                <select
                                    className="w-full bg-slate-100 dark:bg-white/10 px-4 py-3.5 rounded-2xl text-[12px] font-black uppercase outline-none border border-transparent focus:border-slate-300 dark:focus:border-white/30 transition-all text-gray-900 dark:text-white cursor-pointer"
                                    value={f.value}
                                    onChange={e => f.setter(e.target.value)}
                                >
                                    <option value="ALL">TODOS LOS NIVELES</option>
                                    <option value="ECO_SOCIO">ECO-SOCIO</option>
                                    <option value="ECO_EMBAJADOR">ECO-EMBAJADOR</option>
                                    <option value="ECO_VISIONARIO">ECO-VISIONARIO</option>
                                </select>
                            ) : (
                                <input
                                    type="date"
                                    className="w-full bg-slate-100 dark:bg-white/10 px-4 py-3.5 rounded-2xl text-[12px] font-black outline-none border border-transparent focus:border-slate-300 dark:focus:border-white/30 transition-all text-gray-900 dark:text-white"
                                    value={f.value}
                                    onChange={e => f.setter(e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* List Section */}
            <div className="space-y-3">
                {isLoading ? (
                    <div className="py-20 text-center text-slate-400 font-black uppercase tracking-widest text-[10px] animate-pulse">Cargando información...</div>
                ) : groupedData.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 p-20 rounded-[3rem] border border-gray-100 dark:border-white/10 text-center shadow-sm">
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No se encontraron registros</p>
                    </div>
                ) : (
                    groupedData.map((group) => {
                        const isExpanded = expandedUsers.has(group.userData._id);
                        return (
                            <div key={group.userData._id || 'anon'} className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm transition-all duration-300">
                                <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-5 w-full sm:w-auto">
                                        <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-xl relative shrink-0" style={{ backgroundColor: accentColor }}>
                                            {group.userData.fullName?.[0] || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-gray-900 dark:text-white text-lg uppercase tracking-tight truncate flex items-center gap-2">
                                                {group.userData.fullName}
                                                {group.userData.isAnonymous && (
                                                    <span className="text-[8px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10 tracking-widest">INVITADO</span>
                                                )}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest border border-amber-500/10">
                                                    {group.stats.pendingCount} PENDIENTES
                                                </span>
                                                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/10">
                                                    {group.stats.approvedCount} APROBADOS
                                                </span>
                                                <span className="ml-2 text-[10px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                                                    S/ {group.stats.totalApprovedAmount} CONFIRMADO
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setViewingDetail({ type: 'USER', data: group })}
                                            className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                                            title="Ver perfil de usuario"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleSendThankYouEmail(group.userData.fullName, group.userData.email)}
                                            className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                            title="Enviar correo de agradecimiento"
                                        >
                                            <Mail size={18} />
                                        </button>
                                        <button
                                            onClick={() => toggleExpand(group.userData._id)}
                                            className={`h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 ${isExpanded
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl'
                                                : 'bg-slate-50 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                                }`}
                                        >
                                            {isExpanded ? 'CERRAR' : 'DETALLES'}
                                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-gray-50 dark:border-white/5 bg-slate-50/20 dark:bg-transparent overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-[10px]">
                                                <thead>
                                                    <tr className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">
                                                        <th className="px-8 py-5">INFORMACIÓN</th>
                                                        <th className="px-8 py-5 text-center">MONTO</th>
                                                        <th className="px-8 py-5 text-center">RANGO</th>
                                                        <th className="px-8 py-5 text-center">ESTADO</th>
                                                        <th className="px-8 py-5 text-right">GESTIONAR</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                                                    {group.history.map((don) => {
                                                        const theme = getStatusTheme(don.status);
                                                        const tierTheme = getTierTheme(don.tier);
                                                        return (
                                                            <tr key={don._id} className="group transition-all">
                                                                <td className="px-8 py-6">
                                                                    <div className="flex items-center gap-3">
                                                                        <button
                                                                            onClick={() => setViewingDetail({ type: 'PAYMENT', data: don })}
                                                                            className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-indigo-500 transition-all"
                                                                            title="Ver detalle de pago"
                                                                        >
                                                                            <Eye size={16} />
                                                                        </button>
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <span className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{don.payerName || 'PAGO DESCONOCIDO'}</span>
                                                                            <span className="text-[9px] text-slate-500 font-black uppercase">{new Date(don.createdAt).toLocaleDateString()}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6 text-center font-black text-gray-900 dark:text-white text-xs tabular-nums">
                                                                    S/ {don.amount}
                                                                </td>
                                                                <td className="px-8 py-6 text-center">
                                                                    <span className={`px-3 py-1.5 rounded-lg font-black uppercase tracking-tighter border transition-colors ${tierTheme.bg} ${tierTheme.text} ${tierTheme.border || 'border-transparent'}`}>
                                                                        {tierTheme.label}
                                                                    </span>
                                                                </td>
                                                                <td className="px-8 py-6 text-center">
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <span className={`px-3 py-1.5 rounded-full font-black uppercase tracking-[0.1em] border ${theme.bg} ${theme.text} ${theme.border}`}>
                                                                            {theme.label}
                                                                        </span>
                                                                        {don.status === 'REJECTED' && (
                                                                            <span className="text-[8px] font-black text-rose-500/60 uppercase tracking-widest">
                                                                                Se eliminará en {Math.max(0, 4 - Math.floor((Date.now() - new Date(don.updatedAt || don.createdAt).getTime()) / (1000 * 60 * 60 * 24)))} días
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-6 text-right">
                                                                    <div className="flex justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform">
                                                                        {don.status !== 'REJECTED' && (
                                                                            <button
                                                                                onClick={() => handleAction(don._id, 'reject')}
                                                                                className="px-4 py-2 rounded-xl text-slate-400 hover:text-rose-500 font-black uppercase tracking-widest transition-colors flex items-center gap-1.5"
                                                                            >
                                                                                {don.status === 'APPROVED' && <RefreshCw size={12} className="animate-spin-slow" />} OBSERVAR
                                                                            </button>
                                                                        )}
                                                                        {don.status !== 'APPROVED' && (
                                                                            <button
                                                                                onClick={() => handleAction(don._id, 'approve')}
                                                                                className="px-5 py-2.5 rounded-xl text-white font-black uppercase tracking-widest shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                                                                                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
                                                                            >
                                                                                {don.status === 'REJECTED' && <RefreshCw size={12} />} CONFIRMAR
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {viewingDetail && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">
                                    {viewingDetail.type === 'USER' ? 'Perfil del Usuario' : 'Detalle del Pago'}
                                </h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                                    {viewingDetail.type === 'USER' ? 'Resumen Académico y de Aportes' : 'Información de Transacción'}
                                </p>
                            </div>
                            <button onClick={() => setViewingDetail(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-slate-400 transition-all">
                                <Ban size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            {viewingDetail.type === 'USER' ? (
                                <>
                                    {/* USER PROFILE VIEW */}
                                    <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5">
                                        <div className="w-20 h-20 rounded-[1.5rem] bg-indigo-500 text-white flex items-center justify-center text-3xl font-black shadow-xl mb-4">
                                            {viewingDetail.data.userData.fullName?.[0]}
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                            {viewingDetail.data.userData.fullName}
                                        </h3>
                                        <p className="text-sm font-bold text-indigo-500 lowercase">{viewingDetail.data.userData.email || 'Sin correo registrado'}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-emerald-500/5 p-5 rounded-3xl border border-emerald-500/10">
                                            <p className="text-[9px] font-black uppercase text-emerald-600 tracking-widest mb-1">Total Aprobado</p>
                                            <p className="text-2xl font-black text-emerald-600">S/ {viewingDetail.data.stats.totalApprovedAmount}</p>
                                        </div>
                                        <div className="bg-amber-500/5 p-5 rounded-3xl border border-amber-500/10">
                                            <p className="text-[9px] font-black uppercase text-amber-600 tracking-widest mb-1">Pendientes</p>
                                            <p className="text-2xl font-black text-amber-600">{viewingDetail.data.stats.pendingCount}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Estadísticas de Actividad</p>
                                        <div className="divide-y divide-gray-100 dark:divide-white/5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                            <div className="p-4 flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-slate-400 uppercase">Donaciones Totales</span>
                                                <span className="text-gray-900 dark:text-white">{viewingDetail.data.history.length}</span>
                                            </div>
                                            <div className="p-4 flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-slate-400 uppercase">Aportes Aprobados</span>
                                                <span className="text-emerald-500">{viewingDetail.data.stats.approvedCount}</span>
                                            </div>
                                            <div className="p-4 flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-slate-400 uppercase">Aportes Observados</span>
                                                <span className="text-rose-500">{viewingDetail.data.stats.rejectedCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* PAYMENT DETAIL VIEW */}
                                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Pagador / Usuario</p>
                                                <p className="text-sm font-black text-gray-900 dark:text-white uppercase truncate">
                                                    {viewingDetail.data.payerName || viewingDetail.data.user?.fullName}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                <Mail size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Correo Electrónico</p>
                                                <p className="text-sm font-black text-gray-900 dark:text-white lowercase truncate">
                                                    {viewingDetail.data.user?.email || 'No disponible'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-indigo-500/5 p-5 rounded-3xl border border-indigo-500/10 text-center">
                                            <p className="text-[9px] font-black uppercase text-indigo-500 tracking-widest mb-1 text-center">Monto del Pago</p>
                                            <p className="text-2xl font-black text-indigo-500">S/ {viewingDetail.data.amount}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-3xl border border-gray-100 dark:border-white/5 text-center">
                                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1 text-center">Fecha de Pago</p>
                                            <p className="text-sm font-black text-gray-900 dark:text-white uppercase">
                                                {new Date(viewingDetail.data.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Referencia de Pago</p>
                                        <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-2xl">
                                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">ID de Operación</p>
                                            <p className="text-[11px] font-black text-gray-900 dark:text-white tracking-widest truncate uppercase">
                                                {viewingDetail.data.transactionId || 'Sin ID registrado'}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-6 bg-slate-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/10">
                            <button
                                onClick={() => setViewingDetail(null)}
                                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                            >
                                ENTENDIDO
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {actionStatus && (
                <StatusModal
                    status={actionStatus.type}
                    message={actionStatus.message}
                />
            )}
        </div>
    );
};

export default DonationsTable;
