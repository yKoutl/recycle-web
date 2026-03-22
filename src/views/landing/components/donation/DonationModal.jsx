import React from 'react';
import { X, Sparkles, ArrowLeft, Heart, CheckCircle, Gift, ArrowRight, User, QrCode, Zap, Lock, Mail, ShieldCheck, Fingerprint, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../../components/shared/Button';

const DonationModal = ({
    isModalOpen,
    setIsModalOpen,
    selectedTier,
    contributionStep,
    setContributionStep,
    isAuthenticated,
    user,
    t,
    navigate,
    countdown,
    successCountdown,
    formatTime,
    isProcessing,
    isSuccess,
    acceptedTerms,
    setAcceptedTerms,
    isPaymentConfirmed,
    payerName,
    setPayerName,
    isPayerSelf,
    setIsPayerSelf,
    handleConfirmContribution,
    handleFinalizePayment
}) => {
    const scrollContainerRef = React.useRef(null);

    React.useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [contributionStep, isSuccess, isProcessing, isModalOpen]);

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[500] flex justify-end overflow-hidden outline-none">
            {/* Backdrop with image like AddCommentModal */}
            <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-start pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1600"
                    alt="Eco Impact"
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.14] scale-105"
                />
                <div className="relative z-10 ml-8 lg:ml-20 max-w-lg p-10 bg-black/50 backdrop-blur-2xl rounded-[3rem] border border-white/10 hidden md:block shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
                    <Sparkles size={44} className="text-emerald-400 mb-8 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" strokeWidth={1.5} />
                    <h3 className="text-2xl lg:text-4xl font-black text-white leading-[1.2] tracking-tighter mb-10 italic drop-shadow-lg">
                        "El cambio no ocurre por casualidad, ocurre por <span className="not-italic text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]">compromiso.</span>"
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-[2px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400/90">
                            Unión por el Planeta
                        </p>
                    </div>
                </div>
                <div
                    className="absolute inset-0 bg-gray-50/40 dark:bg-[#020617]/90 backdrop-blur-md transition-opacity duration-500 pointer-events-auto"
                    onClick={() => setIsModalOpen(false)}
                />
            </div>

            {/* Side Panel Content */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 170 }}
                className={`relative z-10 w-full max-w-xl h-full shadow-[-40px_0_80px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border-l border-white/5
                    bg-gradient-to-br ${selectedTier?.color} ${selectedTier?.darkColor}
                `}
            >
                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none brightness-150 contrast-150"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3e%3cfilter id='noiseFilter'%3e%3cturbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3e%3c/filter%3e%3crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3e%3c/svg%3e")` }}
                />

                {/* Top Controls */}
                <div className="px-10 pt-10 pb-6 flex items-center justify-between z-20">
                    <button
                        onClick={() => {
                            if (contributionStep === 'payment') {
                                setContributionStep('selection');
                            } else {
                                setIsModalOpen(false);
                            }
                        }}
                        className="flex items-center gap-2 group transition-all opacity-40 hover:opacity-100 text-white"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{contributionStep === 'payment' ? 'CAMBIAR PLAN' : 'VOLVER'}</span>
                    </button>
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-white">
                        <Heart size={16} className="opacity-60" />
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex-1 px-12 lg:pl-16 lg:pr-24 flex flex-col justify-start pt-4 lg:pt-8 overflow-y-auto pb-20"
                >
                    {!isAuthenticated ? (
                        <UnauthenticatedStep t={t} selectedTier={selectedTier} navigate={navigate} />
                    ) : contributionStep === 'selection' ? (
                        <TierSelectionStep t={t} user={user} selectedTier={selectedTier} isProcessing={isProcessing} onConfirm={handleConfirmContribution} />
                    ) : (
                        <PaymentStep
                            t={t}
                            user={user}
                            selectedTier={selectedTier}
                            countdown={countdown}
                            formatTime={formatTime}
                            acceptedTerms={acceptedTerms}
                            setAcceptedTerms={setAcceptedTerms}
                            isPaymentConfirmed={isPaymentConfirmed}
                            payerName={payerName}
                            setPayerName={setPayerName}
                            isPayerSelf={isPayerSelf}
                            setIsPayerSelf={setIsPayerSelf}
                            onFinalize={handleFinalizePayment}
                        />
                    )}

                    <div className="py-10 text-center mt-auto border-t border-gray-100 dark:border-white/5">
                        <p className={`text-[10px] font-black uppercase tracking-[0.8em] opacity-40 ${selectedTier?.textColor}`}>RECYCLEAPP</p>
                    </div>
                </div>

                {/* Processing/Success Overlay - Diseño Premium Oscuro Responsive */}
                {(isProcessing || isSuccess) && (
                    <div className="absolute inset-0 z-[100] bg-[#020617]/92 backdrop-blur-2xl flex flex-col items-center justify-center p-6 space-y-8 md:space-y-10 animate-in fade-in duration-500">
                        {/* Efecto de luz radial de fondo - Responsive */}
                        <div className={`absolute w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full blur-[80px] md:blur-[100px] opacity-20 pointer-events-none ${isSuccess ? 'bg-emerald-500' : 'bg-white'}`} />

                        <div className="relative">
                            {isSuccess ? (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-40 animate-pulse" />
                                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)] border-4 border-white/20 relative z-10">
                                        <CheckCircle size={40} className="md:size-[56px] text-white drop-shadow-md" strokeWidth={2.5} />
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="relative flex items-center justify-center">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[3px] border-white/5 border-t-emerald-500 animate-spin" />
                                    <div className={`absolute inset-0 flex items-center justify-center ${selectedTier?.textColor}`}>
                                        {selectedTier && <selectedTier.icon size={28} className="md:size-8 animate-pulse opacity-80" />}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="text-center space-y-3 md:space-y-4 relative z-10 px-4">
                            <motion.h4
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-2xl md:text-3xl font-black tracking-tighter text-white"
                            >
                                {isSuccess ? '¡Eco-Rango Activado!' : 'Vinculando Aporte'}
                            </motion.h4>
                            <motion.p
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-emerald-400/80 leading-relaxed"
                            >
                                {isSuccess ? 'Tus beneficios ya están listos' : 'Finalizando certificación ecológica...'}
                            </motion.p>
                        </div>

                        {isSuccess && successCountdown > 0 && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="absolute bottom-10 md:bottom-20"
                            >
                                <div className="flex items-center gap-3 md:gap-4 px-6 md:px-8 py-3 md:py-3.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl group transition-all hover:bg-white/10">
                                    <div className="relative flex items-center justify-center">
                                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 animate-ping absolute" />
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 relative" />
                                    </div>
                                    <span className="text-[10px] md:text-[11px] font-black text-white/90 tracking-[0.2em] uppercase">
                                        Cerrando en <span className="text-emerald-400 text-sm md:text-base ml-1">{successCountdown}s</span>
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const UnauthenticatedStep = ({ t, selectedTier, navigate }) => (
    <div className="space-y-10 py-4 animate-in fade-in slide-in-from-right-8 duration-700 text-white">
        <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/60">
                    Verificación Segura
                </span>
            </div>

            {/* Header */}
            <div className="space-y-2">
                <h3 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white italic">
                    Hola, Eco-Héroe
                </h3>
                <p className="text-sm font-medium text-emerald-100/40">
                    Inicia sesión para vincular tu nivel {t.donation.tiers[selectedTier?.key]?.title}
                </p>
            </div>
        </div>

        {/* Card */}
        <div className="relative group/card">
            <div className={`absolute -inset-1 bg-gradient-to-br opacity-20 blur-2xl transition duration-1000 group-hover/card:opacity-40
                ${selectedTier?.key === 'hero'
                    ? 'from-emerald-600 to-green-900'
                    : selectedTier?.key === 'growth'
                        ? 'from-teal-400 to-emerald-600'
                        : 'from-lime-400 to-emerald-500'
                }`}
            />

            <div className="relative bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="p-8 space-y-10">

                    {/* Top Info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl">
                                {selectedTier && (
                                    <selectedTier.icon
                                        size={28}
                                        className={selectedTier?.key === 'hero'
                                            ? 'text-indigo-300'
                                            : 'text-emerald-400'}
                                    />
                                )}
                            </div>

                            <div>
                                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">
                                    MEMBRESÍA
                                </p>
                                <p className="text-xl font-black tracking-tight text-white">
                                    {t.donation.tiers[selectedTier?.key]?.title}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">
                                TOTAL
                            </p>
                            <p className={`text-2xl font-black ${selectedTier?.key === 'hero'
                                ? 'text-indigo-300'
                                : 'text-emerald-400'
                                }`}>
                                {t.donation.tiers[selectedTier?.key]?.amount}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Benefits */}
                    <div className="space-y-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
                            SERVICIOS INCLUIDOS
                        </p>

                        <div className="grid gap-4">
                            {selectedTier?.benefits.slice(0, 3).map((b, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 transition-all duration-300 hover:translate-x-1"
                                >
                                    <div className="w-5 h-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                        <CheckCircle size={11} className="text-emerald-300" />
                                    </div>

                                    <span className="text-[13px] font-semibold text-white/80 tracking-tight leading-snug">
                                        {b}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Button */}
                    <div className="pt-4">
                        <button
                            onClick={() => navigate('/auth/login')}
                            className={`w-full h-16 rounded-[2rem] text-[15px] font-black border-none transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 active:scale-95 group
                                ${selectedTier?.key === 'hero'
                                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30'
                                    : 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/30'}
                                text-white hover:scale-[1.05] hover:-translate-y-1 hover:brightness-110`}
                        >
                            Iniciar Sesión para Vincular
                            <ArrowRight
                                size={22}
                                className="transition-transform duration-300 group-hover:translate-x-2"
                                strokeWidth={3}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
const TierSelectionStep = ({ t, user, selectedTier, isProcessing, onConfirm }) => (
    <div className="space-y-10 py-4 animate-in fade-in slide-in-from-right-8 duration-1000">
        <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/60">Verificación Segura</span>
            </div>
            <div className="space-y-2">
                <h3 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white italic">
                    Hola, {user?.fullName?.split(' ')[0]}
                </h3>
                <p className="text-sm font-medium text-emerald-100/40">Estás a un paso de activar tu nivel {t.donation.tiers[selectedTier?.key]?.title}</p>
            </div>
        </div>

        <div className="relative group/card">
            <div className={`absolute -inset-1 bg-gradient-to-br opacity-20 blur-2xl transition duration-1000 group-hover/card:opacity-40
                ${selectedTier?.key === 'hero' ? 'from-emerald-600 to-green-900' :
                    selectedTier?.key === 'growth' ? 'from-teal-400 to-emerald-600' :
                        'from-lime-400 to-emerald-500'}`}
            />

            <div className="relative bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

                <div className="p-8 space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl
                                ${selectedTier?.key === 'starter' ? 'border-emerald-500/30' :
                                    selectedTier?.key === 'hero' ? 'border-indigo-500/30' : ''}
                            `}>
                                {selectedTier && <selectedTier.icon size={28} className={selectedTier?.key === 'hero' ? 'text-indigo-300' : 'text-emerald-400'} />}
                            </div>
                            <div>
                                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">MEMBRESÍA</p>
                                <p className={`text-xl font-black tracking-tight text-white ${selectedTier?.key === 'hero' ? 'text-indigo-200' :
                                    selectedTier?.key === 'starter' ? 'text-emerald-100' : ''}`}>
                                    {t.donation.tiers[selectedTier?.key]?.title}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 mb-1">TOTAL</p>
                            <p className={`text-2xl font-black ${selectedTier?.key === 'hero' ? 'text-indigo-300' : 'text-emerald-400'}`}>{t.donation.tiers[selectedTier?.key]?.amount}</p>
                        </div>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Benefits */}
                    <div className="space-y-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
                            SERVICIOS INCLUIDOS
                        </p>

                        <div className="grid gap-4">
                            {selectedTier?.benefits.slice(0, 3).map((b, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 transition-all duration-300 hover:translate-x-1"
                                >
                                    <div className="w-5 h-5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                        <CheckCircle size={11} className="text-emerald-300" />
                                    </div>

                                    <span className="text-[13px] font-semibold text-white/80 tracking-tight leading-snug">
                                        {b}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className={`w-full h-16 rounded-[2rem] text-[15px] font-black border-none transition-all duration-300 shadow-2xl flex items-center justify-center gap-3 overflow-hidden active:scale-95 group
                                ${selectedTier?.key === 'hero'
                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30 hover:shadow-indigo-500/60'
                                    : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30 hover:shadow-emerald-500/60'}
                                hover:scale-[1.05] hover:-translate-y-1 hover:brightness-110`}
                        >
                            Siguiente Paso
                            <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-2" strokeWidth={3} />
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-3 opacity-20 pb-8">
                    <Lock size={12} className="text-white" />
                    <div className="w-12 h-px bg-white/30" />
                </div>
            </div>
        </div>
    </div>
);

const PaymentStep = ({
    t,
    user,
    selectedTier,
    countdown,
    formatTime,
    acceptedTerms,
    setAcceptedTerms,
    isPaymentConfirmed,
    payerName,
    setPayerName,
    isPayerSelf,
    setIsPayerSelf,
    onFinalize
}) => (
    <div className="space-y-8 py-4 animate-in fade-in slide-in-from-right-8 duration-700">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h3 className="text-3xl font-black text-white italic tracking-tighter">Pagar Eco-Aporte</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/40">Completa tu contribución por QR</p>
            </div>
            <div className="px-4 py-2 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[14px] font-black text-white tabular-nums">{formatTime(countdown)}</span>
            </div>
        </div>

        <div className="relative group/payment">
            <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 blur-2xl opacity-50" />
            <div className="relative bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 space-y-8 overflow-hidden shadow-2xl">
                <div className="space-y-8">
                    <div className="px-5 md:px-8 py-4 md:py-6 bg-white/5 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 space-y-4 transition-all focus-within:border-emerald-500/40 focus-within:bg-white/10 group/input shadow-xl shadow-black/20">
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                    <User size={14} className="text-emerald-400" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[8px] md:text-[9px] font-black text-white/40 uppercase tracking-[0.2em] group-focus-within/input:text-emerald-400 transition-colors leading-none">PAGO POR:</p>
                                    <p className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-tight">TITULAR DE LA OPERACIÓN</p>
                                </div>
                            </div>
                            <div className="flex gap-1.5 p-1 bg-black/40 rounded-xl backdrop-blur-md self-end xs:self-center shrink-0">
                                <button onClick={() => { setIsPayerSelf(true); setPayerName(user?.fullName || ''); }} className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-lg transition-all ${isPayerSelf ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' : 'text-white/20 hover:text-white/40'}`}>TITULAR</button>
                                <button onClick={() => { setIsPayerSelf(false); setPayerName(''); }} className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-lg transition-all ${!isPayerSelf ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' : 'text-white/20 hover:text-white/40'}`}>TERCERO</button>
                            </div>
                        </div>
                        <input type="text" value={payerName} onChange={(e) => { setPayerName(e.target.value); if (isPayerSelf && e.target.value !== user?.fullName) setIsPayerSelf(false); }} placeholder={t.donation.payerPlaceholder} className="w-full bg-transparent border-none p-0 text-base md:text-lg font-black text-white placeholder:text-white/10 focus:ring-0 outline-none pb-1" />
                    </div>

                    <div className="space-y-6">
                        <div className="relative flex justify-center scale-90 sm:scale-100">
                            <div className="relative group/qr-container">
                                <div className="absolute -inset-10 bg-emerald-500/20 rounded-full blur-[60px] opacity-50 animate-pulse" />
                                <div className="relative bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-[1.03] active:scale-95 cursor-pointer">
                                    <QrCode size={140} className="md:size-[180px] text-[#018F64]" />
                                </div>
                            </div>
                        </div>
                        <div className="text-center space-y-4">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-3">DESTINATARIO OFICIAL</p>
                            <h4 className="text-xl md:text-2xl font-black text-white italic tracking-tighter">Nos Planet SAC</h4>
                            <div className="px-6 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/30 inline-flex items-center gap-3">
                                <Zap size={14} className="text-emerald-400 animate-pulse" />
                                <span className="text-lg md:text-xl font-black text-emerald-400 tracking-widest tabular-nums font-mono">982 109 407</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden p-6 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] border border-white/10 group/disclaimer transition-all hover:bg-white/10">
                        <p className="text-[11px] font-medium text-emerald-50/70 leading-relaxed pr-8" dangerouslySetInnerHTML={{ __html: t.donation.paymentNotice }} />
                    </div>
                </div>

                <div className="pt-4 space-y-6 border-t border-white/5">
                    <label className="flex items-center gap-3 cursor-pointer group/terms">
                        <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="sr-only" />
                        <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${acceptedTerms ? 'bg-emerald-500 border-emerald-500' : 'bg-transparent border-white/20'}`}>{acceptedTerms && <CheckCircle size={14} className="text-white" />}</div>
                        <span className="text-[10px] font-bold text-white/50">Acepto los términos y condiciones.</span>
                    </label>
                    <button
                        onClick={onFinalize}
                        disabled={!acceptedTerms || isPaymentConfirmed}
                        className={`w-full h-16 rounded-[2rem] text-[15px] font-black transition-all duration-300 shadow-2xl flex items-center justify-center gap-3
                            ${acceptedTerms && !isPaymentConfirmed ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                    >
                        {isPaymentConfirmed ? "Procesando..." : "Finalizar y Activar"}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default DonationModal;
