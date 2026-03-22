import React, { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Users, Calendar, MapPin, ArrowLeft,
    Play, CheckCircle2, UserCheck, XCircle,
    Search, Filter, MoreVertical, ShieldCheck,
    Clock, Award, Plus, ChevronDown, MessageSquare, Trash2,
    Camera, Image as ImageIcon, Smartphone, Zap, Map as MapIcon,
    Settings, Eye, UserMinus, Mail, User
} from 'lucide-react';
import { useGetProgramByIdQuery, useUpdateProgramMutation } from '../../../store/programs';
import { useGetUsersQuery } from '../../../store/user';
import { useGetCoordinatorsQuery } from '../../../store/coordinators/coordinatorsApi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const ProgramManagementView = ({ themeColor }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const isCoordinator = user?.role?.toUpperCase() === 'COORDINATOR';
    const { data: program, isLoading, isError, error } = useGetProgramByIdQuery(id);
    const [updateProgram] = useUpdateProgramMutation();
    const accent = program?.accentColor || themeColor || '#018F64';
    const { data: usersData = [] } = useGetUsersQuery();

    const managerId = program?.managedBy || (user?.role === 'MANAGER' ? user?._id || user?.uid : null);

    const { data: allCoordinators = [] } = useGetCoordinatorsQuery(managerId, {
        skip: !managerId
    });

    const [isStarting, setIsStarting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddLeadModal, setShowAddLeadModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState('Coordinador');
    const [selectedCoordinatorId, setSelectedCoordinatorId] = useState('');
    const [isCoordSelectOpen, setIsCoordSelectOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);

    // Tab States
    const [activeTab, setActiveTab] = useState('participants');
    const [evidences, setEvidences] = useState([]);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Memoized Data (Source of Truth)
    const realParticipants = useMemo(() => {
        if (!program?.participantList || !usersData.length) return [];
        return usersData.filter(u =>
            Array.isArray(program.participantList) && program.participantList.includes(u._id)
        ).map(u => ({
            id: u._id,
            _id: u._id,
            name: u.fullName,
            email: u.email,
            username: u.username || u.email.split('@')[0],
            status: 'INSCRIBED',
            attended: Array.isArray(program.attendedList) && program.attendedList.includes(u._id),
            points: program?.points || 0,
            phone: u.phone || 'N/A',
            registerDate: u.createdAt ? new Date(u.createdAt).toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Reciente',
            avatar: u.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        }));
    }, [program, usersData]);

    const realCoordinators = useMemo(() => {
        if (!allCoordinators.length || !id) return [];
        return allCoordinators.filter(c =>
            (c.programs?.some(p => p === id || p._id === id)) ||
            (Array.isArray(program?.coordinatorList) && program.coordinatorList.includes(c._id))
        ).map(c => ({
            id: c._id,
            _id: c._id,
            name: c.fullName,
            role: 'Coordinador',
            avatar: c.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
            status: c.isActive ? 'Online' : 'Offline'
        }));
    }, [allCoordinators, id, program?.coordinatorList]);

    // Handlers
    const handleAddLead = async (e) => {
        if (e) e.preventDefault();
        const coord = allCoordinators.find(c => c._id === selectedCoordinatorId);
        if (!coord) return;

        let newList;
        const currentList = Array.isArray(program?.coordinatorList) ? [...program.coordinatorList] : [];
        if (editingIndex !== null) {
            currentList[editingIndex] = selectedCoordinatorId;
            newList = currentList;
        } else if (currentList.length < 6) {
            newList = [...currentList, selectedCoordinatorId];
        } else {
            return;
        }

        try {
            await updateProgram({
                id,
                coordinatorList: newList
            }).unwrap();
            setShowAddLeadModal(false);
            setEditingIndex(null);
            setSelectedCoordinatorId('');
        } catch (err) {
            console.error("Error al persistir coordinadores:", err);
        }
    };

    const handleRemoveLead = async (indexToRemove) => {
        const currentList = Array.isArray(program?.coordinatorList) ? [...program.coordinatorList] : [];
        const newList = currentList.filter((_, i) => i !== indexToRemove);

        try {
            await updateProgram({
                id,
                coordinatorList: newList
            }).unwrap();
            setShowAddLeadModal(false);
            setEditingIndex(null);
        } catch (err) {
            console.error("Error al quitar coordinador:", err);
        }
    };

    const handleToggleAttendance = async (participantId) => {
        const currentAttended = Array.isArray(program?.attendedList) ? [...program.attendedList] : [];
        let newList;

        if (currentAttended.includes(participantId)) {
            newList = currentAttended.filter(id => id !== participantId);
        } else {
            newList = [...currentAttended, participantId];
        }

        try {
            await updateProgram({ id, attendedList: newList }).unwrap();
            // Si el modal de detalles está abierto para este usuario, actualizar el estado local
            if (viewingUser && viewingUser.id === participantId) {
                setViewingUser(prev => ({ ...prev, attended: !prev.attended }));
            }
        } catch (err) {
            console.error("Error al marcar asistencia:", err);
        }
    };

    const handleRemoveParticipant = async (participantId) => {
        if (!window.confirm("¿Seguro que deseas eliminar a este participante del programa?")) return;

        const currentList = Array.isArray(program?.participantList) ? [...program.participantList] : [];
        const newList = currentList.filter(id => id !== participantId);

        const currentAttended = Array.isArray(program?.attendedList) ? [...program.attendedList] : [];
        const newAttended = currentAttended.filter(id => id !== participantId);

        try {
            await updateProgram({
                id,
                participantList: newList,
                attendedList: newAttended
            }).unwrap();
            setViewingUser(null);
        } catch (err) {
            console.error("Error al eliminar participante:", err);
        }
    };

    const openEditModal = (idx) => {
        const coordId = program.coordinatorList?.[idx];
        if (!coordId) return;
        setEditingIndex(idx);
        setSelectedCoordinatorId(coordId);
        setSelectedRole('Coordinador');
        setShowAddLeadModal(true);
    };

    const startCamera = async () => {
        setCapturedImage(null);
        setShowCameraModal(true);
        try {
            setTimeout(async () => {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 300);
        } catch (err) {
            console.error("Error al acceder a la cámara:", err);
            alert("No se pudo acceder a la cámara.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setShowCameraModal(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setCapturedImage(dataUrl);

            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
        }
    };

    const saveEvidence = () => {
        if (capturedImage) {
            setEvidences(prev => [{
                id: Date.now(),
                url: capturedImage,
                date: new Date().toISOString(),
                location: program?.location || 'Ubicación actual',
                user: user?.fullName || 'Coordinador'
            }, ...prev]);
            setCapturedImage(null);
            setShowCameraModal(false);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Clock className="animate-spin text-emerald-500" size={40} />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Cargando información del programa...</p>
        </div>
    );

    if (isError) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
                <XCircle size={32} />
            </div>
            <h2 className="text-xl font-bold dark:text-white">Error al cargar programa</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">{error?.data?.message || 'No se pudo conectar con el servidor'}</p>
            <button onClick={() => navigate('/admin/programs')} className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest">
                Volver a la lista
            </button>
        </div>
    );

    const filteredParticipants = realParticipants.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { label: 'Inscritos', value: realParticipants.length, icon: Users, color: '#2563eb', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { label: 'Asistentes', value: realParticipants.filter(p => p.attended).length, icon: UserCheck, color: accent, bg: `${accent}15` },
        { label: 'Puntos Totales', value: realParticipants.reduce((acc, curr) => acc + curr.points, 0), icon: Award, color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-500/10' },
        { label: 'Procesados', value: 0, icon: CheckCircle2, color: '#018F64', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header / Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 shadow-xl">
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
                    {program?.imageUrl && <img src={program.imageUrl} alt="" className="w-full h-full object-cover blur-2xl scale-150" />}
                </div>

                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
                    <button onClick={() => navigate(-1)} className="absolute top-6 left-6 p-2.5 rounded-xl bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all shadow-lg md:hidden">
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </button>

                    <div className="w-full md:w-56 h-56 rounded-[2.5rem] overflow-hidden shadow-2xl shrink-0 group relative border-4 border-white dark:border-gray-800">
                        {program?.imageUrl ? (
                            <img src={program.imageUrl} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-300">
                                <Users size={56} strokeWidth={1} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <div className="flex-1 text-center md:text-left pt-4 md:pt-0">
                        <div className="hidden md:flex items-center gap-2 mb-4">
                            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#018F64] hover:opacity-70 transition-all bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg">
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

                    {!isCoordinator && (
                        <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
                            <button
                                onClick={() => { setIsStarting(true); setTimeout(() => setIsStarting(false), 1500); }}
                                disabled={isStarting}
                                className="flex items-center justify-center gap-3 px-10 py-5 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl relative overflow-hidden group disabled:opacity-80"
                                style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 12px 24px ${accent}40` }}
                            >
                                {isStarting ? <><Clock size={16} className="animate-spin" /> INICIANDO...</> : <><Play size={18} fill="white" className="group-hover:translate-x-1 transition-transform" /> Iniciar Programa</>}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Center */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 p-5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter tabular-nums">{stat.value}</p>
                            </div>
                            <div className={`p-4 rounded-2xl`} style={{ backgroundColor: stat.bg.includes('#') ? stat.bg : (stat.bg.startsWith('bg') ? '' : stat.bg), color: stat.color }}>
                                <stat.icon size={22} strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-1 p-1 bg-gray-100/50 dark:bg-white/5 rounded-2xl w-fit mx-auto md:mx-0">
                <button onClick={() => setActiveTab('participants')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'participants' ? 'bg-white dark:bg-gray-800 text-emerald-500 shadow-sm border border-black/5' : 'text-gray-400 hover:text-gray-600'}`}><Users size={14} /> Participantes</button>
                <button onClick={() => setActiveTab('evidence')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'evidence' ? 'bg-white dark:bg-gray-800 text-emerald-500 shadow-sm border border-black/5' : 'text-gray-400 hover:text-gray-600'}`}><Camera size={14} /> Evidencias Celular</button>
            </div>

            {activeTab === 'participants' ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Coordination Team */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-500" /> Equipo de Coordinación</h3>
                            <span className="text-[10px] font-bold text-gray-400 italic">Máx. 6 integrantes por proyecto</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[...Array(6)].map((_, i) => {
                                const staff = realCoordinators[i];
                                if (staff) {
                                    return (
                                        <div key={`lead-${i}`} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 p-4 py-6 rounded-[2.5rem] shadow-sm flex flex-col items-center text-center group relative hover:-translate-y-1 transition-all">
                                            <div className="w-16 h-16 rounded-[1.8rem] flex items-center justify-center mb-4 text-xl font-black text-white shadow-2xl group-hover:rotate-6 transition-transform" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>{staff.avatar}</div>
                                            <p className="text-[11px] font-black uppercase tracking-tight truncate w-full px-2 text-gray-900 dark:text-white">{staff.name}</p>
                                            <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-1 shrink-0">{staff.role}</p>
                                            {!isCoordinator && (
                                                <button onClick={() => openEditModal(i)} className="absolute top-3 right-3 p-2 bg-emerald-500/10 text-emerald-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-white">
                                                    <Settings size={14} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                }
                                if (!isCoordinator) {
                                    return (
                                        <button key={`empty-${i}`} onClick={() => { setEditingIndex(null); setShowAddLeadModal(true); }} className="h-full min-h-[160px] rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-white/5 flex flex-col items-center justify-center p-4 hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all group active:scale-95">
                                            <div className="p-4 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-600 rounded-2xl group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all shadow-sm"><Plus size={24} strokeWidth={3} /></div>
                                        </button>
                                    );
                                }
                                return (
                                    <div key={`empty-hidden-${i}`} className="h-full min-h-[160px] rounded-[2.5rem] border-2 border-dotted border-gray-100 dark:border-white/5 flex flex-col items-center justify-center p-4 opacity-30 select-none">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-300">Vacante</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Participant Table */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Lista de Participantes</h3>
                                <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest border border-black/5 dark:border-white/5">{filteredParticipants.length} INSCRITOS</span>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-64">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input type="text" placeholder="Buscar participante..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-black/20 text-left">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Participante</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 text-center">Estado</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 text-center">Asistencia</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                                    {filteredParticipants.map((p) => (
                                        <tr key={p.id} className="group hover:bg-slate-50/30 dark:hover:bg-white/[0.01] transition-all duration-300">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md shrink-0" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>{p.avatar}</div>
                                                    <div>
                                                        <p className="text-[13px] font-bold text-gray-900 dark:text-white uppercase transition-colors group-hover:text-emerald-500">{p.name}</p>
                                                        <p className="text-[11px] text-gray-400 font-medium">{p.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-[0.15em] border ${p.status === 'INSCRIBED' ? 'bg-blue-50/50 dark:bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-red-50/50 dark:bg-red-500/10 text-red-500 border-red-500/20'}`}>{p.status === 'INSCRIBED' ? 'Confirmado' : 'Cancelado'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button onClick={() => handleToggleAttendance(p.id)} className={`px-4 py-2 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${p.attended ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-400 font-bold border-transparent'}`}>
                                                    {p.attended ? 'Presente' : 'Falta'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => setViewingUser(p)} className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all" title="Ver detalles"><Eye size={16} /></button>
                                                    {!isCoordinator && (
                                                        <button onClick={() => handleRemoveParticipant(p.id)} className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Quitar del programa"><UserMinus size={16} /></button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-12 border border-blue-500/10 shadow-xl text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
                        <div className="inline-flex p-6 rounded-[2rem] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 mb-6 shadow-sm"><Smartphone size={32} strokeWidth={1.5} /></div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Registro de Evidencias</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto mt-2 leading-relaxed">Captura fotos en tiempo real del progreso del programa para validación de NosPlanet.</p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button onClick={startCamera} className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"><Camera size={18} /> Activar Cámara</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals Portals */}
            {viewingUser && createPortal(
                <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setViewingUser(null)}>
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-[#0f172a] w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: accent }} />
                        <button onClick={() => setViewingUser(null)} className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-all"><XCircle size={22} /></button>

                        <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
                            <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white shadow-2xl shrink-0" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                                {viewingUser.avatar}
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{viewingUser.name}</h3>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-medium mt-1">
                                    <Mail size={14} style={{ color: accent }} /> {viewingUser.email}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                                    <User size={12} strokeWidth={3} style={{ color: accent }} /> @{viewingUser.username}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="p-5 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-black/5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Asistencia Actual</p>
                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-black uppercase ${viewingUser.attended ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {viewingUser.attended ? 'PRESENTE' : 'FALTA'}
                                    </span>
                                    <button onClick={() => handleToggleAttendance(viewingUser.id)} className={`p-2 rounded-lg transition-all ${viewingUser.attended ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}>
                                        {viewingUser.attended ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-black/5">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Puntos Programa</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">{viewingUser.points}</p>
                            </div>
                            <div className="p-5 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border border-black/5 col-span-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Registro en NosPlanet</p>
                                        <p className="text-[13px] font-bold text-gray-700 dark:text-gray-200">{viewingUser.registerDate}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Teléfono</p>
                                        <p className="text-[13px] font-bold text-gray-700 dark:text-gray-200">{viewingUser.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => handleRemoveParticipant(viewingUser.id)} className="flex-1 py-5 bg-red-50 dark:bg-red-500/5 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2">
                                <UserMinus size={16} /> Eliminar del Programa
                            </button>
                            <button onClick={() => setViewingUser(null)} className="flex-1 py-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">Regresar</button>
                        </div>
                    </motion.div>
                </div>,
                document.body
            )}

            {showAddLeadModal && createPortal(
                <div className="fixed inset-0 z-[99999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowAddLeadModal(false)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#0f172a] w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[450px]" onClick={e => e.stopPropagation()}>
                        <div className="hidden md:flex w-32 shrink-0 items-center justify-center relative overflow-hidden" style={{ backgroundColor: accent }}>
                            <div className="absolute inset-0 opacity-20 bg-black/40" />
                            <span className="absolute -rotate-90 text-[10px] font-black uppercase tracking-[0.5em] text-white/60 whitespace-nowrap">NOS PLANET TEAM</span>
                        </div>
                        <div className="flex-1 p-8 md:p-12 relative">
                            <button onClick={() => setShowAddLeadModal(false)} className="absolute top-8 right-8 text-gray-400 hover:text-red-500 transition-all"><XCircle size={22} /></button>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Vincular Coordinador</h3>
                            <div className="mt-10 space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Seleccionar Integrante</label>
                                    <div className="relative">
                                        <div onClick={() => setIsCoordSelectOpen(!isCoordSelectOpen)} className="w-full flex items-center justify-between px-8 py-5 rounded-[1.5rem] bg-gray-50 dark:bg-white/5 border-2 border-transparent hover:border-emerald-500 cursor-pointer transition-all shadow-sm">
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                                {selectedCoordinatorId ? allCoordinators.find(c => c._id === selectedCoordinatorId)?.fullName : 'Escoge un coordinador...'}
                                            </span>
                                            <ChevronDown size={16} className={`transition-transform duration-300 ${isCoordSelectOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                        {isCoordSelectOpen && (
                                            <div className="absolute z-[100] left-0 right-0 mt-3 bg-white dark:bg-gray-800 border border-black/5 rounded-[1.5rem] shadow-2xl overflow-y-auto max-h-48 custom-scrollbar">
                                                {allCoordinators.map(c => (
                                                    <div key={c._id} onClick={() => { setSelectedCoordinatorId(c._id); setIsCoordSelectOpen(false); }} className="px-8 py-4 text-sm font-black uppercase text-gray-700 dark:text-gray-300 hover:bg-emerald-600 hover:text-white cursor-pointer transition-colors border-b border-black/5 last:border-0">{c.fullName}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 flex flex-col sm:flex-row gap-4">
                                {editingIndex !== null && <button onClick={() => handleRemoveLead(editingIndex)} className="px-8 py-5 rounded-2xl text-[10px] font-black text-red-500 uppercase border border-red-100 tracking-[0.2em] hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center gap-2"><Trash2 size={16} /> Quitar</button>}
                                <button onClick={() => { setShowAddLeadModal(false); setEditingIndex(null); }} className="flex-1 px-8 py-5 bg-gray-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl text-gray-500 transition-all">Cancelar</button>
                                <button onClick={handleAddLead} disabled={!selectedCoordinatorId} className="flex-[1.5] px-8 py-5 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 transition-all active:scale-95" style={{ backgroundColor: accent }}>{editingIndex !== null ? 'Guardar Cambios' : 'Vincular Ahora'}</button>
                            </div>
                        </div>
                    </motion.div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ProgramManagementView;
