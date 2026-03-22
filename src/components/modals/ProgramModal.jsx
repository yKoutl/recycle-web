import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Building2, Star, Phone, Mail, Globe, Heart, ArrowLeft, Sparkles, Quote, Calendar, Copy, Check, Target, LogIn, Lock, Users2, Loader2 } from 'lucide-react';
import { useJoinProgramMutation } from '../../store/programs/programsApi';

const mapOrganizationTypeToUiType = (organizationType) => {
    switch (organizationType) {
        case 'ESTADO':
            return 'government';
        case 'NOS_PLANET':
            return 'company';
        case 'ONG':
            return 'ong';
        default:
            return 'company';
    }
};

const ProgramModal = ({ program, isOpen, onClose, isAuthenticated, user, t }) => {
    const navigate = useNavigate();
    const [hoveredContact, setHoveredContact] = useState('email');
    const [copySuccess, setCopySuccess] = useState(false);
    const [joinProgram, { isLoading: isJoining }] = useJoinProgramMutation();
    const [joinStatus, setJoinStatus] = useState(null); // 'success', 'error'

    const userId = user?._id || user?.uid || user?.sub;
    const isAlreadyJoined = isAuthenticated && program?.participantList?.includes(userId);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleJoin = async () => {
        if (!isAuthenticated) {
            navigate('/auth/login');
            return;
        }

        if (isAlreadyJoined) return;

        try {
            await joinProgram(program._id || program.id).unwrap();
            setJoinStatus('success');
            setTimeout(() => setJoinStatus(null), 3000);
        } catch (err) {
            setJoinStatus('error');
            console.error("Error joining program:", err);
            setTimeout(() => setJoinStatus(null), 3000);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = ''; };
        }
    }, [isOpen]);

    if (!isOpen || !program) return null;

    const programType = program.type || mapOrganizationTypeToUiType(program.organizationType);
    const image = program.imageUrl || program.image;
    const points = Number(program.points ?? program.ecopoints ?? 0);
    const description = program.description || program.details?.about || 'Programa ambiental activo.';
    const objectives = program.objectives || program.details?.objectives || [];
    const activities = program.activities || program.details?.activities || [];
    const contact = program.contact || program.details?.contact || {};
    const website = contact.website || contact.web || '';
    const indications = program.indications || 'Pronto el gestor añadirá indicaciones específicas para este programa.';

    const contactEntries = [
        { id: 'email', icon: Mail, value: contact.email || '', href: contact.email ? `mailto:${contact.email}` : undefined },
        { id: 'phone', icon: Phone, value: contact.phone || '', href: contact.phone ? `tel:${contact.phone}` : undefined },
        { id: 'web', icon: Globe, value: website, href: website ? (website.startsWith('http') ? website : `https://${website}`) : undefined }
    ].filter((item) => item.value);

    const displayedContactValue =
        hoveredContact === 'email' ? (contact.email || '') :
            hoveredContact === 'phone' ? (contact.phone || '') :
                website;

    const getTypeStyles = (type) => {
        switch (type) {
            case 'government': return { label: 'ESTADO PERUANO', accent: '#3B82F6', text: 'text-blue-500', bg: 'bg-blue-500/10' };
            case 'company': return { label: 'PROPIO / NOS PLANET', accent: '#10B981', text: 'text-emerald-500', bg: 'bg-emerald-500/10' };
            case 'ong': return { label: 'ORGANIZACIÓN SOCIAL', accent: '#F43F5E', text: 'text-rose-500', bg: 'bg-rose-500/10' };
            default: return { label: 'PROGRAMA ACTIVO', accent: '#64748b', text: 'text-slate-500', bg: 'bg-slate-500/10' };
        }
    };

    const config = getTypeStyles(programType);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-end overflow-hidden outline-none">
            {/* Global backdrop: covers entire app and applies blur */}
            <div
                className="fixed inset-0 z-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* 1. BACKDROP & VISUAL AREA (Left Side) */}
            <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-start pointer-events-none">
                <div className="absolute inset-0 bg-gray-900 transition-opacity duration-700 animate-in fade-in">
                    <img
                        src={image}
                        alt={program.title}
                        className="w-full h-full object-cover opacity-40 scale-105 transition-transform duration-[3s] animate-pulse-slow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 ml-8 lg:ml-20 max-w-lg hidden lg:block animate-in slide-in-from-left-20 duration-1000">
                    <div className="space-y-6">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl inline-flex items-center gap-3">
                            <Sparkles size={18} className={config.text} />
                            <span className="text-xs font-black text-white uppercase tracking-[0.3em]">{config.label}</span>
                        </div>

                        <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                            {program.title.split(' ')[0]} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#B0EEDE]" style={{ backgroundImage: `linear-gradient(to right, ${config.accent}, #B0EEDE)` }}>
                                {program.title.split(' ').slice(1).join(' ')}
                            </span>
                        </h2>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-3 rounded-[2rem] border border-white/10">
                                <Users2 size={24} className={config.text} />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black text-white leading-none">+{program.participants}</span>
                                    <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mt-1">Participantes reales</span>
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest max-w-[120px] leading-tight">ECO-HÉROES SUMANDO IMPACTO</p>
                        </div>
                    </div>
                </div>

                {/* previously had an inner backdrop here; replaced by the global fixed backdrop above */}
            </div>

            {/* 2. LATERAL SIDE PANEL (Right Side) */}
            <div className="relative z-[100] w-full max-w-2xl bg-[#FCFDFD] dark:bg-[#0f172a] h-screen shadow-[-40px_0_100px_rgba(0,0,0,0.3)] animate-slide-in-right flex flex-col">
                <div className="absolute top-0 bottom-0 -left-[63px] w-[64px] pointer-events-none hidden lg:block overflow-hidden">
                    <svg width="64" height="100%" viewBox="0 0 64 1024" preserveAspectRatio="none" className="block translate-x-[1px]">
                        <path
                            d="M64 0C64 0 0 150 0 512C0 874 64 1024 64 1024V0Z"
                            fill="currentColor"
                            className="text-[#FCFDFD] dark:text-[#0f172a]"
                        />
                    </svg>
                </div>

                <div className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none hidden lg:flex border-l border-gray-100 dark:border-white/5">
                    <p className="whitespace-nowrap rotate-90 text-[10px] font-black text-gray-200 dark:text-gray-800 uppercase tracking-[0.6em]">
                        RECYCLEAPP • PROGRAMA DE IMPACTO AMBIENTAL
                    </p>
                </div>

                <div className="px-8 lg:px-12 pt-12 pb-8 flex items-center justify-between z-20 shrink-0">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-3 text-gray-400 dark:text-gray-500 hover:text-[#018F64] transition-all group outline-none"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">VOLVER</span>
                    </button>
                    <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-100 dark:border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-sm lg:mr-8">
                        <Star size={18} className="fill-[#F59E0B] text-[#F59E0B]" />
                        <span className="text-sm font-black text-gray-900 dark:text-white">+{points} PUNTOS</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-8 lg:px-20 pb-20 space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
                            {program.title}
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${config.accent}20`, color: config.accent }}>
                                <Building2 size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">ORGANIZADOR</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{program.organization}</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <Quote size={40} className="absolute -top-4 -left-4 text-emerald-500/10" />
                        <p className="text-xl lg:text-2xl font-serif font-medium text-gray-600 dark:text-gray-300 leading-relaxed italic pl-6 border-l-4" style={{ borderColor: `${config.accent}40` }}>
                            {description}
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white">OBJETIVOS</h4>
                                <div className="w-12 h-[2px]" style={{ backgroundColor: config.accent }} />
                            </div>
                            <ul className="space-y-6">
                                {objectives.map((obj, i) => (
                                    <li key={i} className="flex gap-4 group">
                                        <div className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 transition-transform group-hover:scale-150" style={{ backgroundColor: config.accent }} />
                                        <span className="text-base font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                                            {obj}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-[2px]" style={{ backgroundColor: config.accent }} />
                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white">ACTIVIDADES</h4>
                            </div>
                            <div className="space-y-4">
                                {activities.map((act, i) => (
                                    <div key={i} className="p-4 rounded-[1.5rem] bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100/50 dark:border-white/5 flex items-center gap-5 group hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-500">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/5 transition-transform group-hover:scale-110">
                                            <Calendar size={20} style={{ color: config.accent }} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-tight">
                                            {act}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* INDICACIONES PARA USUARIOS UNIDOS */}
                    {isAlreadyJoined && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            <div className="flex items-center gap-4">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">INDICACIONES DEL PROGRAMA</h4>
                                <div className="flex-1 h-[2px] bg-emerald-500/10" />
                                <Sparkles size={16} className="text-emerald-500" />
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 relative overflow-hidden group">
                                <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
                                <div className="relative z-10 flex gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-500/30 flex items-center justify-center shrink-0 shadow-sm">
                                        <Target size={22} className="text-emerald-500" />
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Pasos a seguir:</p>
                                        <p className="text-lg lg:text-xl font-medium text-gray-700 dark:text-gray-200 leading-relaxed font-serif italic">
                                            "{indications}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-[#018F64] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group" style={{ backgroundColor: config.accent }}>
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative z-10 space-y-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-200 mb-2">PARTICIPA HOY</p>
                                <h4 className="text-3xl font-black leading-tight tracking-tighter italic">Transforma tu impacto ambiental con nosotros.</h4>
                            </div>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    {contactEntries.map((item) => (
                                        <a
                                            key={item.id}
                                            href={item.href}
                                            target={item.id === 'web' ? "_blank" : undefined}
                                            rel={item.id === 'web' ? 'noreferrer' : undefined}
                                            onMouseEnter={() => setHoveredContact(item.id)}
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${hoveredContact === item.id
                                                ? 'bg-white text-[#018F64] scale-110 shadow-lg'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                                }`}
                                            style={{ color: hoveredContact === item.id ? config.accent : 'white' }}
                                        >
                                            <item.icon size={24} />
                                        </a>
                                    ))}
                                </div>

                                <div className="min-h-[70px] flex items-center">
                                    {hoveredContact && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300 w-full bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 flex items-center justify-between gap-4 group/display">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-1 opacity-60">
                                                    {hoveredContact === 'email' ? 'Correo Electrónico' : hoveredContact === 'phone' ? 'Teléfono Celular' : 'Sitio Web'}
                                                </p>
                                                <p className="text-sm font-bold text-white break-all">
                                                    {displayedContactValue}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(displayedContactValue)}
                                                className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 scale-90 group-hover/display:scale-100 ${copySuccess
                                                    ? 'bg-emerald-400 text-[#018F64]'
                                                    : 'bg-white/10 text-white hover:bg-white hover:text-[#018F64]'
                                                    }`}
                                                style={{ color: copySuccess ? config.accent : 'white', backgroundColor: copySuccess ? 'white' : 'rgba(255,255,255,0.1)' }}
                                            >
                                                {copySuccess ? <Check size={20} /> : <Copy size={20} />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleJoin}
                                    disabled={isJoining || joinStatus === 'success' || (isAuthenticated && isAlreadyJoined)}
                                    className="w-full py-5 bg-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-70 disabled:translate-y-0"
                                    style={{ color: config.accent }}
                                >
                                    {isJoining ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (isAuthenticated && isAlreadyJoined) || joinStatus === 'success' ? (
                                        <>
                                            <span>¡YA ESTÁS UNIDO!</span>
                                            <Check size={20} />
                                        </>
                                    ) : !isAuthenticated ? (
                                        <>
                                            <span>INICIAR SESIÓN</span>
                                            <Lock size={18} />
                                        </>
                                    ) : (
                                        <>
                                            <span>UNIRME AHORA</span>
                                            <Heart size={18} className="fill-current" />
                                        </>
                                    )}
                                </button>
                                {joinStatus === 'error' && (
                                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest text-center mt-3 animate-bounce">
                                        Error al unirse. Inténtalo de nuevo.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-8 text-center mt-auto border-t border-gray-100 dark:border-white/5 shrink-0">
                    <p className="text-[10px] font-black text-gray-200 dark:text-gray-800 uppercase tracking-[1em] lg:mr-10">NOS PLANET</p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${config.accent};
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${config.accent};
                    background-clip: padding-box;
                }
                @keyframes slide-in-right {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.05); opacity: 0.5; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
            `}} />

        </div >,
        document.body
    );
};

export default ProgramModal;
