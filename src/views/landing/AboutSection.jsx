import React, { useState, useRef, useEffect } from 'react';
import { Apple, Play, Heart, Sparkles, Leaf, TrendingUp } from 'lucide-react';
import qrImage from '../../assets/QR_NOS_PLANET.webp';
import logoNosPlanet from '../../assets/logo_nos_planet.webp';

const AboutSection = ({ t }) => {
    const [isPhoneHovered, setIsPhoneHovered] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [showDownloadOverlay, setShowDownloadOverlay] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    // Scroll Detection for internal phone content
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const isAtBottom = scrollHeight - scrollTop <= clientHeight + 5;
        if (isAtBottom) {
            setShowDownloadOverlay(true);
        } else {
            setShowDownloadOverlay(false);
        }
    };

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xRot = ((y / rect.height) - 0.5) * -30;
        const yRot = ((x / rect.width) - 0.5) * 30;

        setRotation({ x: xRot, y: yRot });
    };

    const handleMouseLeave = () => {
        setIsPhoneHovered(false);
        setRotation({ x: 0, y: 0 });
    };

    return (
        <section id="about" className="pt-24 pb-12 relative overflow-hidden bg-[#FEFDFB] dark:bg-[#020617] transition-colors duration-500">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mb-12 lg:mb-16 space-y-8 relative z-50 ml-auto text-right">
                    <div className="flex items-center gap-3 justify-end">
                        <div className="w-16 h-[2px] bg-gradient-to-l from-[#018F64] to-transparent dark:from-[#10B981]" />
                        <p className="text-[10px] font-black text-[#018F64] dark:text-[#10B981] uppercase tracking-[0.4em]">NUESTRO ENFOQUE</p>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tighter">
                        CONSTRUYENDO UN <span className="text-emerald-500 italic relative">FUTURO<span className="absolute -bottom-1 left-0 w-full h-1 bg-emerald-500/10 rounded-full" /></span> <br /> CIRCULAR Y SOSTENIBLE.
                    </h2>
                </div>

                <div className="relative">
                    <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-center relative z-20">
                        <div
                            ref={containerRef}
                            className="relative flex justify-center items-center perspective-3000 py-6 lg:py-8 lg:order-1 -translate-y-4 lg:-translate-y-48"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setIsPhoneHovered(true)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className={`absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none transition-all duration-1000 ${isPhoneHovered ? 'opacity-100' : 'opacity-0'}`} />
                            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-8 bg-gray-900/40 dark:bg-black/95 blur-2xl rounded-full transition-all duration-700 ${isPhoneHovered ? 'scale-150 opacity-90 blur-[50px] translate-y-8' : 'scale-100 opacity-40'}`} />

                            <div
                                onClick={() => setIsFlipped(!isFlipped)}
                                className="relative shrink-0 w-[260px] h-[520px] lg:w-[310px] lg:h-[620px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] preserve-3d cursor-pointer z-[60]"
                                style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y + (isFlipped ? 180 : 0)}deg)` }}
                            >
                                {/* FRONT FACE */}
                                <div className="absolute inset-0 bg-gray-950 rounded-[3.5rem] border-[7px] border-white/10 p-3.5 backface-hidden overflow-hidden shadow-[0_80px_180px_-40px_rgba(0,0,0,1)]">
                                    <div className="absolute inset-x-0 inset-y-0 rounded-[3rem] border-t-2 border-l-2 border-white/10 pointer-events-none z-40" />
                                    <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_0_100px_rgba(0,0,0,1)] pointer-events-none z-30" />

                                    <div className="h-full w-full relative bg-[#00A884] rounded-[2.8rem] overflow-hidden">
                                        <div
                                            ref={scrollContainerRef}
                                            onScroll={handleScroll}
                                            className={`h-full w-full flex flex-col relative overflow-y-auto scrollbar-hide font-sans select-none scroll-smooth pointer-events-auto z-10 transition-all duration-700 ${showDownloadOverlay ? 'blur-md scale-95 opacity-50' : ''}`}
                                        >
                                            <div className="p-6 pt-10 space-y-6 relative z-10">
                                                <div className="flex items-center justify-between">
                                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                                                        <div className="w-5 h-0.5 bg-white mb-1.5 shadow-[0_4px_0_white,0_-4px_0_white]" />
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden shadow-xl">
                                                        <img src="https://i.pravatar.cc/100?img=11" alt="avatar" className="w-full h-full object-cover" />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <p className="text-[11px] font-bold text-white/90">Hola, Juan David</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center text-white shadow-lg">
                                                            <Heart size={18} fill="currentColor" />
                                                        </div>
                                                        <h5 className="text-2xl font-black text-white leading-none tracking-tight">Tienda de Premios</h5>
                                                    </div>
                                                    <p className="text-[10px] font-black text-yellow-300/90 tracking-widest uppercase">Canjea tus EcoPuntos</p>
                                                </div>

                                                <div className="bg-white/95 backdrop-blur-xl rounded-[2.2rem] p-5 shadow-2xl space-y-4">
                                                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                        <div className="w-4 h-4 rounded bg-emerald-600 flex items-center justify-center text-white">
                                                            <Leaf size={10} />
                                                        </div>
                                                        Tus EcoPuntos
                                                    </div>
                                                    <div className="flex items-center justify-center gap-3 py-1">
                                                        <Leaf size={22} className="text-emerald-500 fill-emerald-500 animate-pulse" />
                                                        <span className="text-4xl font-black text-emerald-800 tracking-tighter">330</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="px-6 flex gap-3 mt-1 relative z-10">
                                                <div className="px-4 py-2.5 rounded-full bg-emerald-800 text-white text-[10px] font-black flex items-center gap-2 shadow-lg border border-white/10">
                                                    <Heart size={12} fill="currentColor" /> Todos
                                                </div>
                                                <div className="px-4 py-2.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black flex items-center gap-2 border border-white/20">
                                                    <TrendingUp size={12} /> Convenios
                                                </div>
                                            </div>

                                            <div className="mt-8 space-y-6 pb-20 relative z-10">
                                                <div className="mx-4 bg-white rounded-[2.5rem] p-5 space-y-4 shadow-xl border border-gray-100">
                                                    <div className="h-40 rounded-[2rem] overflow-hidden relative">
                                                        <img src="https://plus.unsplash.com/premium_photo-1664527305901-db3d4e724d15?w=600&q=75&auto=format&fit=crop" className="w-full h-full object-cover" alt="product" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-lg font-black text-gray-900 italic">Botella Reutilizable</p>
                                                        <button className="w-full py-3 bg-[#00A884] text-white text-[10px] font-black rounded-xl">250 pts</button>
                                                    </div>
                                                </div>
                                                <div className="mx-4 bg-white rounded-[2.5rem] p-5 space-y-4 shadow-xl border border-gray-100">
                                                    <div className="h-40 rounded-[2rem] overflow-hidden relative">
                                                        <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=75&auto=format&fit=crop" className="w-full h-full object-cover" alt="taller" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-lg font-black text-gray-900 italic">Talleres Municipales</p>
                                                        <button className="w-full py-3 bg-red-500 text-white text-[10px] font-black rounded-xl">280 pts</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 2. FIXED OVERLAY MESSAGE (outside scroll but inside screen) */}
                                        <div className={`absolute inset-0 z-50 flex items-center justify-center p-8 text-center transition-all duration-700 bg-emerald-900/40 backdrop-blur-xl ${showDownloadOverlay ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                                            <div className="space-y-8">
                                                {/* BRANDED LOGO PROPOSAL */}
                                                <div className="w-24 h-24 bg-white rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl animate-bounce-soft border-4 border-emerald-500/20 p-4">
                                                    <img src={logoNosPlanet} alt="NOS PLANET" className="w-full h-full object-contain" />
                                                </div>

                                                <div className="space-y-4">
                                                    <h3 className="text-2xl md:text-3xl font-black text-white leading-[0.9] uppercase tracking-tighter">
                                                        DESCARGA LA <br />
                                                        <span className="text-yellow-400 italic">APLICACIÓN</span> <br />
                                                        PARA VER TODOS <br />
                                                        LOS PREMIOS
                                                    </h3>
                                                    <p className="text-[10px] font-black text-emerald-50/70 leading-relaxed max-w-[200px] mx-auto uppercase tracking-wider">
                                                        Gestiona tus puntos en tiempo real con <span className="text-white">NOS PLANET</span>.
                                                    </p>
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <div className="group/app w-full px-6 py-4 bg-white text-emerald-900 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-transform active:scale-95">
                                                        <Play size={16} fill="currentColor" />
                                                        <span className="text-[11px] font-black tracking-widest leading-none">PLAY STORE</span>
                                                    </div>
                                                    <div className="group/app w-full px-6 py-4 bg-black/40 border border-white/20 text-white rounded-2xl flex items-center justify-center gap-3 backdrop-blur-md shadow-xl transition-transform active:scale-95">
                                                        <Apple size={18} fill="currentColor" />
                                                        <span className="text-[11px] font-black tracking-widest leading-none">APP STORE</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Physical Detail: Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-8 bg-gray-950 rounded-b-[1.5rem] z-50 flex items-center justify-center border-x border-b border-white/5">
                                        <div className="w-10 h-1 bg-white/5 rounded-full" />
                                    </div>
                                </div>

                                {/* BACK FACE */}
                                <div className="absolute inset-0 bg-gray-950 rounded-[3.5rem] border-[7px] border-white/10 overflow-hidden backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 shadow-[0_80px_180px_-40px_rgba(0,0,0,1)]">
                                    <div className="relative z-10 flex flex-col items-center space-y-8 max-w-xs px-6">
                                        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                                            <Leaf size={48} className="fill-emerald-500/10" />
                                        </div>
                                        <div className="text-center space-y-2">
                                            <h4 className="text-3xl font-black text-white tracking-[0.2em] uppercase italic leading-none">NOS PLANET</h4>
                                            <div className="w-12 h-1 bg-emerald-500 mx-auto rounded-full" />
                                        </div>
                                        <p className="text-xl font-medium text-emerald-100/90 text-center italic leading-relaxed">
                                            "Transformamos tus residuos en oportunidades para un mundo mejor."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE: MASTER PANEL */}
                        <div className="relative h-full lg:order-2">
                            <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 rounded-[3rem] p-6 lg:p-8 shadow-xl backdrop-blur-md relative overflow-hidden group/card">
                                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                                    style={{ backgroundImage: `linear-gradient(#00CC88 1px, transparent 1px), linear-gradient(90deg, #00CC88 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

                                <div className="relative space-y-6">
                                    <div className="space-y-1.5">
                                        <h3 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white uppercase italic leading-none tracking-tight">Nuestro Propósito</h3>
                                        <div className="w-16 h-1 bg-yellow-400 rounded-full mb-1 shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                                        <p className="text-sm font-bold text-gray-500 dark:text-gray-300/80 leading-relaxed max-w-xl">
                                            {t.about.subtitle}
                                        </p>
                                    </div>

                                    <div className="relative group/ecosystem">
                                        <div className="absolute -inset-10 bg-emerald-500/20 blur-[120px] opacity-0 group-hover/ecosystem:opacity-100 transition duration-1000" />
                                        <div className="relative bg-gray-950 dark:bg-black/60 rounded-[2.8rem] p-5 lg:p-8 overflow-hidden border border-white/10 shadow-2xl backdrop-blur-2xl">
                                            <div className="flex flex-col xl:flex-row items-center gap-10 relative z-10">
                                                <div className="flex-1 space-y-8 text-center xl:text-left">
                                                    <div className="space-y-4">
                                                        <h4 className="text-4xl lg:text-6xl font-black text-white leading-[0.85] tracking-tight uppercase italic">
                                                            Tu App <br /> de <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]">Vida</span>
                                                        </h4>
                                                        <p className="text-[13px] font-bold text-white/60 leading-relaxed italic max-w-sm mx-auto xl:mx-0">
                                                            Transformamos el reciclaje en una experiencia digital de alto impacto. Gestión inteligente desde tu dispositivo.
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-row items-center justify-center xl:justify-start gap-4">
                                                        {[
                                                            { icon: Apple, label: 'App Store', sub: 'Descargar', size: 20 },
                                                            { icon: Play, label: 'Google Play', sub: 'Obtener', size: 18 }
                                                        ].map((btn, i) => (
                                                            <div key={i} className="relative group/btn px-6 py-4 bg-white/5 hover:bg-emerald-500 text-white hover:text-emerald-950 border border-white/10 rounded-2xl shadow-2xl transition-all duration-500 cursor-pointer flex items-center gap-3 overflow-hidden group/btn">
                                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                                                <btn.icon size={btn.size} fill="currentColor" />
                                                                <div className="text-left leading-none">
                                                                    <p className="text-[8px] font-black opacity-50 uppercase tracking-tighter">{btn.label}</p>
                                                                    <p className="text-[11px] font-black uppercase tracking-tight">{btn.sub}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="relative shrink-0 group/qr-box z-20">
                                                    <div className="relative p-5 bg-black/10 backdrop-blur-sm rounded-[2rem] border border-emerald-500/30 overflow-hidden">
                                                        <div
                                                            className={`absolute inset-x-0 h-[2px] bg-emerald-400 shadow-[0_0_15px_#10b981] top-0 pointer-events-none z-30 ${isVisible ? 'animate-[scan_6s_linear_infinite]' : 'opacity-0'}`}
                                                            style={{ animationPlayState: isVisible ? 'running' : 'paused' }}
                                                        />
                                                        <div className="bg-white p-2 rounded-xl text-center flex items-center justify-center">
                                                            <img
                                                                src={qrImage}
                                                                alt="QR NOS PLANET"
                                                                className="w-[120px] h-[120px] lg:w-[140px] lg:h-[140px] object-contain"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan {
                    0%, 100% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .perspective-3000 { perspective: 3000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                @keyframes bounce-soft {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-soft { animation: bounce-soft 3s ease-in-out infinite; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </section >
    );
};

export default React.memo(AboutSection);
