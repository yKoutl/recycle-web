import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Users, Calendar, MapPin, ArrowLeft,
    Play, CheckCircle2, UserCheck, XCircle,
    Search, Filter, MoreVertical, ShieldCheck,
    Clock, Award, Plus, ChevronDown
} from 'lucide-react';
import { useGetProgramByIdQuery } from '../../../store/programs';
import { useGetUsersQuery } from '../../../store/user';
import { motion, AnimatePresence } from 'framer-motion';

const ProgramManagementView = ({ themeColor }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const accent = themeColor || '#018F64';

    // Aquí obtendríamos los datos reales del programa
    const { data: program, isLoading, isError, error } = useGetProgramByIdQuery(id);

    // Mock de participantes (esto vendría de otra query en el futuro)
    const [participants, setParticipants] = useState([
        { id: 1, name: 'Juan Pérez', email: 'juan@demo.com', status: 'INSCRIBED', attended: false, points: 50, avatar: 'JP' },
        { id: 2, name: 'María García', email: 'maria@demo.com', status: 'INSCRIBED', attended: true, points: 50, avatar: 'MG' },
        { id: 3, name: 'Carlos López', email: 'carlos@demo.com', status: 'CANCELLED', attended: false, points: 0, avatar: 'CL' },
        { id: 4, name: 'Ana Martínez', email: 'ana@demo.com', status: 'INSCRIBED', attended: false, points: 50, avatar: 'AM' },
        { id: 5, name: 'Pedro Sánchez', email: 'pedro@demo.com', status: 'INSCRIBED', attended: true, points: 50, avatar: 'PS' },
    ]);

    const [isStarting, setIsStarting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddLeadModal, setShowAddLeadModal] = useState(false);
    const [coordinators, setCoordinators] = useState([
        { name: 'Ricardo Alva', role: 'Coordinador', avatar: 'RA', status: 'Online' },
        { name: 'Sofía Méndez', role: 'Líder de Campo', avatar: 'SM', status: 'Online' },
        { name: 'Mateo Torres', role: 'Facilitador', avatar: 'MT', status: 'Away' },
        { name: 'Lucía Bravo', role: 'Staff Validación', avatar: 'LB', status: 'Online' },
    ]);

    // Obtener usuarios reales para listar gestores
    const { data: usersData = [] } = useGetUsersQuery();
    const gestores = usersData.filter(u => u.role === 'OFFICIAL' || u.role === 'ADMIN');
    const [selectedGestorId, setSelectedGestorId] = useState('');

    const handleAddLead = (e) => {
        e.preventDefault();
        const gestor = gestores.find(g => g._id === selectedGestorId);
        const name = gestor ? gestor.fullName : e.target.name?.value;
        const role = e.target.role.value;

        if (coordinators.length < 6 && name) {
            setCoordinators([...coordinators, {
                name,
                role,
                avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
                status: 'Online'
            }]);
        }
        setShowAddLeadModal(false);
        setSelectedGestorId('');
    };

    const handleToggleAttendance = (participantId) => {
        setParticipants(prev => prev.map(p =>
            p.id === participantId ? { ...p, attended: !p.attended } : p
        ));
    };

    const handleStartProgram = () => {
        setIsStarting(true);
        setTimeout(() => setIsStarting(false), 1500);
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Clock className="animate-spin text-emerald-500" size={40} />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Cargando información del programa...</p>
        </div>
    );

    if (isError) return (
        <div className="p-10 text-center bg-red-50 dark:bg-red-500/5 rounded-[2.5rem] border border-red-100 dark:border-red-500/20">
            <XCircle className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Error al cargar el programa</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium italic">
                {error?.data?.message || 'No se pudo conectar con el servidor o el ID es inválido.'}
            </p>
            <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest">
                Volver
            </button>
        </div>
    );

    const filteredParticipants = participants.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { label: 'Inscritos', value: participants.length, icon: Users, color: '#2563eb', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { label: 'Asistentes', value: participants.filter(p => p.attended).length, icon: UserCheck, color: accent, bg: `${accent}15` },
        { label: 'Cancelados', value: participants.filter(p => p.status === 'CANCELLED').length, icon: XCircle, color: '#ef4444', bg: 'bg-red-50 dark:bg-red-500/10' },
        { label: 'Puntos Totales', value: participants.filter(p => p.attended).reduce((acc, curr) => acc + curr.points, 0), icon: Award, color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* ── Header / Hero Section ── */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 shadow-xl">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
                    <img
                        src={program?.imageUrl}
                        alt=""
                        className="w-full h-full object-cover blur-2xl scale-150"
                    />
                </div>

                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
                    {/* Back Button Overlay */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 p-2.5 rounded-xl bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all shadow-lg md:hidden"
                    >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </button>

                    {/* Program Image Container */}
                    <div className="w-full md:w-56 h-56 rounded-[2.5rem] overflow-hidden shadow-2xl shrink-0 group relative border-4 border-white dark:border-gray-800">
                        {program?.imageUrl ? (
                            <img
                                src={program.imageUrl}
                                alt={program.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-300">
                                <Users size={56} strokeWidth={1} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Info Content */}
                    <div className="flex-1 text-center md:text-left pt-4 md:pt-0">
                        <div className="hidden md:flex items-center gap-2 mb-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#018F64] hover:opacity-70 transition-all bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg"
                            >
                                <ArrowLeft size={12} strokeWidth={3} /> Volver a programas
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                {program?.category || 'PROYECTO'}
                            </span>
                            <span className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                <Calendar size={12} style={{ color: accent }} />
                                {program?.date ? new Date(program.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Sin fecha'}
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-5">
                            {program?.title || 'Cargando título...'}
                        </h2>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium pb-2">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                <MapPin size={16} style={{ color: accent }} />
                                {program?.location || 'Ubicación no especificada'}
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                <Clock size={16} style={{ color: accent }} />
                                {program?.duration || 'Duración no definida'}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                        <button
                            onClick={handleStartProgram}
                            disabled={isStarting}
                            className={`flex items-center justify-center gap-3 px-10 py-5 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl relative overflow-hidden group ${isStarting ? 'opacity-80' : 'hover:opacity-90'}`}
                            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 12px 24px ${accent}40` }}
                        >
                            {isStarting ? (
                                <><Clock size={16} className="animate-spin" /> INICIANDO...</>
                            ) : (
                                <><Play size={18} fill="white" className="group-hover:translate-x-1 transition-transform" /> Iniciar Programa</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Stats Center ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter tabular-nums">{stat.value}</p>
                            </div>
                            <div className={`p-4 rounded-2xl ${i === 1 ? '' : stat.bg}`} style={i === 1 ? { backgroundColor: `${accent}15`, color: accent } : { color: stat.color }}>
                                <stat.icon size={22} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 opacity-5 scale-150 group-hover:rotate-12 transition-transform duration-700">
                            <stat.icon size={80} />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Equipo de Coordinación (Moderadores/Líderes) ── */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-emerald-500" /> Equipo de Coordinación
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 italic">Máx. 6 integrantes por proyecto</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {/* Render existing leads */}
                    {coordinators.map((staff, i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 p-4 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group relative overflow-hidden">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-sm font-black text-white shadow-lg relative" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}>
                                {staff.avatar}
                                <span className={`absolute -top-1 -right-1 w-3 h-3 border-2 border-white dark:border-gray-900 rounded-full ${staff.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-tight truncate w-full text-gray-900 dark:text-white">
                                {staff.name}
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">
                                {staff.role}
                            </p>
                            <button
                                onClick={() => setCoordinators(coordinators.filter((_, idx) => idx !== i))}
                                className="absolute top-2 right-2 p-1 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <XCircle size={12} />
                            </button>
                        </div>
                    ))}

                    {/* Render empty slots */}
                    {Array.from({ length: Math.max(0, 6 - coordinators.length) }).map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            onClick={() => setShowAddLeadModal(true)}
                            className="border-dashed border-2 border-gray-200 dark:border-white/10 p-4 rounded-[2rem] flex flex-col items-center justify-center text-center hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-3 text-gray-300 group-hover:text-emerald-500 transition-colors">
                                <Plus size={20} strokeWidth={3} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-emerald-500 transition-colors">
                                Añadir
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal para añadir (Demo) */}
            <AnimatePresence>
                {showAddLeadModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[3rem] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden"
                        >
                            {/* Decor */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Nuevo Organizador</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Asigna un líder al proyecto</p>
                                </div>
                                <button onClick={() => setShowAddLeadModal(false)} className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-gray-600 dark:hover:text-white transition-all">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddLead} className="space-y-6 relative z-10">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Seleccionar Gestor</label>
                                    <div className="relative group">
                                        <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                        <select
                                            required
                                            value={selectedGestorId}
                                            onChange={(e) => setSelectedGestorId(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-bold text-gray-900 dark:text-white appearance-none cursor-pointer"
                                        >
                                            <option value="">Selecciona un gestor...</option>
                                            {gestores.map(g => (
                                                <option key={g._id} value={g._id}>{g.fullName} ({g.institution || 'Sin Inst.'})</option>
                                            ))}
                                            {gestores.length === 0 && <option disabled>No hay gestores disponibles</option>}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                    </div>
                                    {!selectedGestorId && (
                                        <div className="mt-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest leading-relaxed">
                                                Si no aparece el gestor, asegúrate de que tenga el rol de GESTOR o ADMIN en el sistema.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Rol en este Proyecto</label>
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                        <select name="role" className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-emerald-500/20 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-bold text-gray-900 dark:text-white appearance-none cursor-pointer">
                                            <option value="Coordinador">Coordinador Principal</option>
                                            <option value="Líder de Campo">Líder de Campo</option>
                                            <option value="Facilitador">Facilitador</option>
                                            <option value="Staff Validación">Staff de Validación</option>
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddLeadModal(false)}
                                        className="flex-1 px-8 py-4 rounded-[1.5rem] bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all font-black uppercase tracking-[0.2em] text-[10px]"
                                    >
                                        Cerrar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!selectedGestorId}
                                        className={`flex-1 px-8 py-4 rounded-[1.5rem] text-white shadow-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 ${!selectedGestorId ? 'opacity-50 grayscale' : 'hover:brightness-110'}`}
                                        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)` }}
                                    >
                                        Asignar Líder
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Tablero de Participantes ── */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Lista de Participantes</h3>
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest border border-black/5 dark:border-white/5">
                            {filteredParticipants.length} INSCRITOS
                        </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Buscar alias o correo..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            />
                        </div>
                        <button className="p-2.5 rounded-xl bg-white dark:bg-black/20 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm">
                            <Filter size={16} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto hidden md:block">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-black/20 text-left">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Participante</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 text-center">Estado</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 text-center">Puntos</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 text-right">Asistencia</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                            {filteredParticipants.map((p) => (
                                <tr key={p.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all duration-300">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md shrink-0"
                                                style={{ background: `linear-gradient(135deg, ${accent}${p.id}0, ${accent}cc)`, boxShadow: `0 4px 10px ${accent}20` }}
                                            >
                                                {p.avatar}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{p.name}</p>
                                                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium truncate">{p.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.15em] border ${p.status === 'INSCRIBED'
                                            ? 'bg-blue-50/50 dark:bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            : 'bg-red-50/50 dark:bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {p.status === 'INSCRIBED' ? 'Confirmado' : 'Cancelado'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5 font-black text-gray-700 dark:text-white">
                                            <span className="text-xs">{p.points}</span>
                                            <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">pts</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${p.attended
                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            : 'bg-gray-100 dark:bg-white/5 text-gray-400'
                                            }`}>
                                            {p.attended ? (
                                                <><UserCheck size={14} strokeWidth={2.5} /> Presente</>
                                            ) : (
                                                <><Clock size={14} strokeWidth={2.5} /> Falta</>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleAttendance(p.id)}
                                                className={`p-2 rounded-xl border transition-all active:scale-90 ${p.attended
                                                    ? 'bg-red-50/50 dark:bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white'
                                                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-white/10 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-sm'
                                                    }`}
                                                title={p.attended ? "Cancelar Asistencia" : "Confirmar Asistencia"}
                                            >
                                                {p.attended ? <XCircle size={16} strokeWidth={2.5} /> : <CheckCircle2 size={16} strokeWidth={2.5} />}
                                            </button>
                                            <button className="p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Móvil Layout (Cards) ── */}
                <div className="md:hidden divide-y divide-gray-50 dark:divide-white/[0.03]">
                    {filteredParticipants.map((p) => (
                        <div key={p.id} className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md"
                                        style={{ background: `linear-gradient(135deg, ${accent}${p.id}0, ${accent}cc)` }}
                                    >
                                        {p.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{p.name}</p>
                                        <p className="text-[11px] text-gray-400 font-medium">{p.email}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-300">
                                    <MoreVertical size={16} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${p.status === 'INSCRIBED' ? 'text-blue-500 border-blue-500/20' : 'text-red-500 border-red-500/20'
                                        }`}>
                                        {p.status === 'INSCRIBED' ? 'Conf.' : 'Canc.'}
                                    </span>
                                    <div className="flex items-center gap-1 font-black text-gray-600 dark:text-gray-400 text-[10px]">
                                        <span>{p.points}</span>
                                        <span className="text-[8px] opacity-60 uppercase">pts</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${p.attended ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-100 dark:bg-white/5 text-gray-400'
                                        }`}>
                                        {p.attended ? 'Presente' : 'Falta'}
                                    </div>
                                    <button
                                        onClick={() => handleToggleAttendance(p.id)}
                                        className={`p-2 rounded-xl border transition-all ${p.attended
                                            ? 'bg-red-50/50 text-red-500 border-red-500/20'
                                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-white/10 text-emerald-500'
                                            }`}
                                    >
                                        {p.attended ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredParticipants.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="inline-flex p-6 rounded-3xl bg-gray-50 dark:bg-white/5 text-gray-300 mb-4 ring-8 ring-gray-50/50 dark:ring-white/[0.02]">
                            <Users size={48} strokeWidth={1} />
                        </div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Sin resultados</h3>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 font-medium italic">No se encontró ningún participante que coincida con tu búsqueda.</p>
                    </div>
                )}
            </div>

            {/* ── Security / Admin Info Footer ── */}
            <div className="flex items-center gap-3 p-6 rounded-3xl bg-slate-100/50 dark:bg-[#111827] border border-gray-200 dark:border-white/5">
                <div className="p-2 rounded-xl bg-white dark:bg-gray-800 text-emerald-500 shadow-sm border border-black/5 dark:border-white/5">
                    <ShieldCheck size={18} strokeWidth={2.5} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold italic tracking-tight leading-relaxed">
                    Operación protegida. Como <span className="text-emerald-500 uppercase font-black">Admin de NosPlanet</span>, cada asisencia confirmada se traduce automáticamente en puntos para la billetera del ciudadano.
                </p>
            </div>
        </div>
    );
};

export default ProgramManagementView;
