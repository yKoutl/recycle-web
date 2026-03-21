import { BarChart3, Users2, MapPin, Bell, Clock, Star, Info, LayoutGrid, ShieldAlert, LogOut, MessageCircle, Mail, Activity } from 'lucide-react';
import { useGetProgramsQuery } from '../../../store/programs';
import { useGetCoordinatorsQuery } from '../../../store/coordinators/coordinatorsApi';
import { useGetUsersQuery } from '../../../store/user';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

const ManagerDashboard = ({ t, themeColor, user, onLogout }) => {
    const navigate = useNavigate();
    const roleColor = themeColor || '#018F64';

    // Datos
    const { data: programs = [], isLoading: programsLoading } = useGetProgramsQuery();
    const { data: team = [] } = useGetCoordinatorsQuery(user?._id, { skip: !user?._id });

    const isAssigned = (p) => {
        if (!user) return false;
        const uid = (user._id || user.uid || user.id)?.toString();
        const programId = (p._id || p.id)?.toString();

        if (!uid || !programId) return false;

        // 1. Campos directos en el programa (Incluyendo el nuevo coordinatorList)
        const isDirectOwner = (
            p.managerId?.toString() === uid ||
            p.manager?.toString() === uid ||
            p.owner?.toString() === uid ||
            p.coordinatorId?.toString() === uid ||
            p.managedBy?.toString() === uid ||
            (Array.isArray(p.coordinatorList) && p.coordinatorList.some(id => {
                const targetId = (typeof id === 'object' ? id?._id : id)?.toString();
                return targetId === uid;
            }))
        );

        // 2. Verificar si el ID del programa está en la lista del usuario (fallback)
        const inUserList = Array.isArray(user.programs) && user.programs.some(pId => {
            const targetPId = (typeof pId === 'object' ? pId?._id : pId)?.toString();
            return targetPId === programId;
        });

        return isDirectOwner || inUserList;
    };

    const assignedPrograms = programs.filter(p => isAssigned(p));
    const totalAssigned = assignedPrograms.length;
    const totalParticipants = assignedPrograms.reduce((acc, p) => acc + (Number(p.participants) || 0), 0);
    const finishedPrograms = assignedPrograms.filter(p => p.status === 'finished' || p.isFinished === true || p.isActive === false).length;
    const ecoPoints = assignedPrograms.reduce((acc, p) => acc + (Number(p.ecopoints || p.points) || 0), 0);
    const newMembers = (team || []).filter(m => {
        if (!m.createdAt) return false;
        return (Date.now() - new Date(m.createdAt).getTime()) <= (1000 * 60 * 60 * 24 * 7); // 7 días
    }).length;

    // Métricas por mes (mock)
    const metricsByMonth = [
        { month: 'Ene', value: 45 },
        { month: 'Feb', value: 52 },
        { month: 'Mar', value: 38 },
        { month: 'Abr', value: 65 },
        { month: 'May', value: 48 },
        { month: 'Jun', value: 72 },
    ];

    // Top: programas con más participantes
    const topPrograms = assignedPrograms.slice().sort((a, b) => {
        const da = Number(b.participants) || 0;
        const db = Number(a.participants) || 0;
        return da - db;
    }).slice(0, 3);

    // Pie: últimos 3 programas creados (por fecha) — mostrar participantes
    const last3ByCreated = programs.slice().sort((a, b) => {
        const da = new Date(a.createdAt || a.date || 0).getTime();
        const db = new Date(b.createdAt || b.date || 0).getTime();
        return db - da;
    }).slice(0, 3);

    const pieData = last3ByCreated.map((p, i) => ({
        label: p.title || `Programa ${p.id || p._id || i + 1}`,
        value: Number(p.participants) || 0,
        color: ['#10b981', '#06b6d4', '#8b5cf6'][i % 3]
    }));

    const { data: allUsers = [] } = useGetUsersQuery();
    const manager = allUsers.find(u => u._id === user?.managerId);

    const hasNoPosition = !user?.position || user?.position?.trim() === '';
    const userRole = user?.role?.toUpperCase();
    const isSpecialRole = userRole === 'ADMIN' || userRole === 'MANAGER';

    // El modal de "Perfil Pendiente" solo aplica para coordinadores base sin asignaciones
    const showNoProgramsModal = !isSpecialRole && userRole === 'COORDINATOR' && !programsLoading && (totalAssigned === 0 && hasNoPosition);

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {showNoProgramsModal && createPortal(
                <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500 p-4">
                    <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-[2.5rem] p-8 text-center shadow-[0_32px_128px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden group">
                        {/* Background Decoration */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 blur-[100px] opacity-10 transition-all group-hover:opacity-20"
                            style={{ background: roleColor }}
                        />

                        <div className="relative z-10 space-y-6">
                            <div
                                className="w-16 h-16 rounded-[1.5rem] mx-auto flex items-center justify-center text-white rotate-12 group-hover:rotate-0 transition-all duration-700 shadow-2xl"
                                style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}dd)` }}
                            >
                                <ShieldAlert size={32} strokeWidth={1.5} className="drop-shadow-lg" />
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                                    Perfil pendiente
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-[11px] font-medium max-w-xs mx-auto leading-relaxed italic">
                                    ¡Hola, <span className="font-bold text-gray-900 dark:text-white">{user?.fullName?.split(' ')[0]}</span>! <br />
                                    Aún no hay programas asignados para ti, ni tampoco un cargo. Consulte con su gestor para cualquier información.
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-white/[0.03] rounded-[1.5rem] p-6 text-left border border-black/5 dark:border-white/5 shadow-inner">
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4 flex items-center gap-2">
                                    <Clock size={12} /> Supervisor Asignado
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-sm font-bold text-slate-400">
                                        {(manager?.fullName?.[0] || 'G').toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{manager?.fullName || 'Raul Quintana'}</p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Gestor Regional</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                const email = (manager?.email || 'soporte@nosplanet.com').toLowerCase();
                                                navigator.clipboard.writeText(email);
                                            }}
                                            className="w-9 h-9 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-90 transition-all flex items-center justify-center text-emerald-600 group/mail relative"
                                            title="Copiar Correo"
                                        >
                                            <Mail size={16} strokeWidth={2.5} />
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-[9px] font-black uppercase rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                Copiar Correo
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onLogout}
                                className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-black/10 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <LogOut size={14} /> Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Header Dashboard */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                            <Star size={18} fill="currentColor" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                            Dashboard
                        </h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium ml-1">
                        Hola, {user?.fullName?.split(' ')[0]}. Tienes <span className="text-emerald-500 font-bold">{totalAssigned} programas</span> activos.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/[0.05] border border-black/5 dark:border-white/10 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-slate-50 transition-all shadow-sm">
                        <Clock size={14} /> Historial
                    </button>
                    <button
                        style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}dd)`, boxShadow: `0 8px 16px ${roleColor}25` }}
                        className="flex items-center gap-2 px-4 py-2 text-white rounded-xl text-xs font-bold shadow-lg hover:opacity-90 transition-all active:scale-95"
                    >
                        <LayoutGrid size={14} /> Vista General
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-black/5 dark:border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full flex items-center justify-center">
                        <MapPin size={24} className="opacity-20 text-emerald-500 translate-x-4 -translate-y-4" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Puntos Totales</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">{ecoPoints}</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/5 w-fit px-2.5 py-1 rounded-full border border-emerald-500/10">
                        +12.5% <span className="opacity-50 font-medium">este mes</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-black/5 dark:border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full flex items-center justify-center">
                        <Users2 size={24} className="opacity-20 text-orange-500 translate-x-4 -translate-y-4" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Participantes</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">{totalParticipants}</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-orange-500 bg-orange-500/5 w-fit px-2.5 py-1 rounded-full border border-orange-500/10">
                        {newMembers} nuevos <span className="opacity-50 font-medium whitespace-nowrap">esta semana</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-black/5 dark:border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full flex items-center justify-center">
                        <Activity size={24} className="opacity-20 text-purple-500 translate-x-4 -translate-y-4" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Programas Finalizados</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">{finishedPrograms}</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-purple-500 bg-purple-500/5 w-fit px-2.5 py-1 rounded-full border border-purple-500/10">
                        85% <span className="opacity-50 font-medium">de meta cumplida</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-black/5 dark:border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full flex items-center justify-center">
                        <MessageCircle size={24} className="opacity-20 text-blue-500 translate-x-4 -translate-y-4" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Solicitas Pendientes</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">12</p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-blue-500 bg-blue-500/5 w-fit px-2.5 py-1 rounded-full border border-blue-500/10">
                        Ver todo <span className="opacity-50 font-medium ml-0.5">→</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Stats Chart */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Impacto Mensual</h3>
                            <p className="text-[10px] text-slate-400 font-medium">Puntos ambientales generados</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl">
                            <BarChart3 size={18} className="text-emerald-500" />
                        </div>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-1 mt-4">
                        {metricsByMonth.map((item, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                <div
                                    className="w-full rounded-xl transition-all duration-1000 group cursor-pointer relative"
                                    style={{
                                        height: `${item.value}%`,
                                        background: i === 5 ? `linear-gradient(to top, ${roleColor}, ${roleColor}cc)` : 'rgba(16, 185, 129, 0.1)',
                                        border: i === 5 ? 'none' : '1px solid rgba(16, 185, 129, 0.1)'
                                    }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                                        {item.value}K
                                    </div>
                                </div>
                                <span className="text-[9px] font-black uppercase text-slate-400">{item.month}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Cards / Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-black/5 dark:border-white/5 shadow-sm flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500"><Info size={16} /></div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white font-black">Programas Top</h4>
                        </div>
                        <div className="space-y-4 flex-1">
                            {topPrograms.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-[1.5rem] bg-slate-50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-900 dark:text-white shadow-sm shrink-0">{i + 1}</div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{p.title}</p>
                                    </div>
                                    <span className="text-[10px] font-black text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg shrink-0">{p.participants}</span>
                                </div>
                            ))}
                            {topPrograms.length === 0 && (
                                <p className="text-[10px] text-slate-400 italic text-center py-4">Sin programas registrados</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-900 dark:bg-white rounded-[2.5rem] p-6 shadow-2xl flex flex-col justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 dark:text-slate-900/40">Soporte NosPlanet</p>
                            <h4 className="text-xl font-black text-white dark:text-slate-900 tracking-tight">¿Necesitas Ayuda?</h4>
                        </div>
                        <p className="text-[11px] font-medium text-white/60 dark:text-slate-900/60 leading-relaxed mb-6">
                            Nuestro equipo está disponible para ayudarte con cualquier duda técnica.
                        </p>
                        <button
                            onClick={() => window.open(`mailto:soporte@nosplanet.com?subject=Ayuda Coordinador - ${user?.fullName}`)}
                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
                        >
                            <Mail size={14} /> Contactar Soporte
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
