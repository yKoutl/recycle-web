import React from 'react';
import { Bell, CheckCircle, XCircle, User, RotateCw, Inbox, Calendar, ArrowRight } from 'lucide-react';

const RequestsList = ({ requests, t, onStatusChange, themeColor }) => {
    const accent = themeColor || '#018F64';
    const stats = [
        { key: 'pending', label: 'Pendientes', icon: Bell, color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-500/10' },
        {
            key: 'approved',
            label: 'Aprobadas',
            icon: CheckCircle,
            color: accent,
            bg: 'bg-gray-100 dark:bg-white/5',
            customBg: { backgroundColor: `${accent}15` }
        },
        { key: 'rejected', label: 'Rechazadas', icon: XCircle, color: '#ef4444', bg: 'bg-red-50 dark:bg-red-500/10' },
    ];

    const [isLoading, setIsLoading] = React.useState(false);
    const pendingCount = requests.filter(r => r.statusKey === 'pending').length;

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 8px 20px ${accent}30` }}>
                        <Inbox size={22} strokeWidth={1.75} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            Bandeja de Solicitudes
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            Revisa y responde a las peticiones de los ciudadanos.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {stats.map(({ key, label, icon: Icon, color, bg, customBg }) => (
                    <div key={key} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-between group hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${bg}`} style={{ color, ...customBg }}>
                                <Icon size={18} strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">{label}</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{requests.filter(r => r.statusKey === key).length}</p>
                            </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight size={14} className="text-gray-300" />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── List/Table Container ── */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Lista de Solicitudes</span>
                        <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-black"
                            style={{ backgroundColor: `${accent}15`, color: accent }}
                        >
                            {pendingCount} NUEVAS
                        </span>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        title="Actualizar"
                    >
                        <RotateCw size={14} strokeWidth={2} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>

                <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {requests.length > 0 ? (
                        requests.map((req) => (
                            <div key={req.id} className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-white/[0.015] transition-colors group">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm`}
                                        style={req.statusKey === 'approved' ? { backgroundColor: `${accent}15`, color: accent } :
                                            req.statusKey === 'rejected' ? { backgroundColor: '#fee2e2', color: '#ef4444' } :
                                                { backgroundColor: '#fef3c7', color: '#f59e0b' }}
                                    >
                                        {req.statusKey === 'approved' ? <CheckCircle size={20} /> : req.statusKey === 'rejected' ? <XCircle size={20} /> : <Bell size={20} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-gray-900 dark:text-white">{req.type}</h4>
                                            <span
                                                className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border`}
                                                style={req.statusKey === 'approved' ? { backgroundColor: `${accent}08`, color: accent, borderColor: `${accent}15` } :
                                                    req.statusKey === 'rejected' ? { backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fee2e2' } :
                                                        { backgroundColor: '#fffbeb', color: '#d97706', borderColor: '#fef3c7' }}
                                            >
                                                {req.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <User size={12} className="text-slate-300 dark:text-slate-600" />
                                                {req.user}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={12} className="text-slate-300 dark:text-slate-600" />
                                                {req.date}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {req.statusKey === 'pending' && (
                                    <div className="flex gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <button
                                            onClick={() => onStatusChange(req.id, 'approved')}
                                            className="px-4 py-2 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all active:scale-95"
                                            style={{ backgroundColor: accent, boxShadow: `0 4px 12px ${accent}30` }}
                                        >
                                            Aprobar
                                        </button>
                                        <button
                                            onClick={() => onStatusChange(req.id, 'rejected')}
                                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 text-[11px] font-black uppercase tracking-wider rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-all active:scale-95"
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center">
                            <p className="text-gray-400 font-medium">No hay solicitudes para mostrar.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestsList;
