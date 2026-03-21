import React, { useState, useCallback } from 'react';
import { Share2, Target, Linkedin, Twitter, Facebook, Users, Briefcase, Code, ChevronLeft, X, MessageCircle, Mail, Github } from 'lucide-react';

const ImpactSection = ({ t }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTeamOpen, setIsTeamOpen] = useState(false);
    const [teamCategory, setTeamCategory] = useState(null);

    const mainMetric = {
        value: '100%',
        label: 'Compromiso Real',
        desc: 'Cada acción cuenta. No somos solo números, somos una comunidad de agentes de cambio moviéndose bajo un solo propósito: transformar el mañana hoy.'
    };

    const teamData = {
        management: [
            {
                name: 'Lina Ruiz',
                role: 'CEO & Founder',
                label: 'Liderazgo Estratégico',
                img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
                bio: 'Visión integral para transformar la sostenibilidad en una ventaja competitiva de alto impacto.',
                socials: [{ type: 'gmail', icon: Mail, color: 'hover:text-red-500' }]
            },
            {
                name: 'German Arquinigo',
                role: 'Operations Manager',
                label: 'Liderazgo Estratégico',
                img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
                bio: 'Especialista en cumplimiento legal y optimización de procesos industriales sostenibles.',
                socials: [{ type: 'gmail', icon: Mail, color: 'hover:text-red-500' }]
            }
        ],
        dev: [
            {
                name: 'Raul Quintana',
                role: 'Technology and Innovation Manager',
                label: 'Desarrollo Tecnológico',
                img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
                bio: 'Líder técnico enfocado en soluciones disruptivas y arquitectura de software escalable.',
                socials: [
                    { type: 'gmail', icon: Mail, color: 'hover:text-red-500' },
                    { type: 'github', icon: Github, color: 'hover:text-gray-900 dark:hover:text-white' }
                ]
            },
            {
                name: 'Juan Huayta',
                role: 'Software Development Manager',
                label: 'Desarrollo Tecnológico',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
                bio: 'Gestión de equipos de desarrollo y entrega de soluciones tecnológicas de alta calidad.',
                socials: [
                    { type: 'gmail', icon: Mail, color: 'hover:text-red-500' },
                    { type: 'github', icon: Github, color: 'hover:text-gray-900 dark:hover:text-white' }
                ]
            }
        ]
    };

    const sideStats = [
        { label: 'Gestión Eficiente', value: '85%', color: 'from-emerald-400 to-emerald-600' },
        { label: 'Agua Protegida', value: '12M L', color: 'from-blue-400 to-blue-600' },
        { label: 'CO2 Mitigado', value: '450T', color: 'from-yellow-400 to-amber-600' }
    ];

    const shareOptions = [
        { name: 'WhatsApp', icon: MessageCircle, color: 'text-green-600 dark:text-green-500', bg: 'bg-green-50 dark:bg-green-500/10', url: 'https://api.whatsapp.com/send?text=Mira el impacto real que estamos generando en Nos Planet: https://nosplanet.com' },
        { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700 dark:text-blue-500', bg: 'bg-blue-50 dark:bg-blue-600/10', url: 'https://www.linkedin.com/sharing/share-offsite/?url=https://nosplanet.com' },
        { name: 'Facebook', icon: Facebook, color: 'text-blue-800 dark:text-blue-400', bg: 'bg-indigo-50 dark:bg-blue-800/10', url: 'https://www.facebook.com/sharer/sharer.php?u=https://nosplanet.com' },
        { name: 'Twitter', icon: Twitter, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-500/10', url: 'https://twitter.com/intent/tweet?url=https://nosplanet.com&text=Impacto real con Nos Planet' }
    ];

    return (
        <section className="relative py-24 lg:py-32 bg-[#FEFDFB] dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00A884]/10 dark:bg-[#00A884]/20 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative group lg:order-1">
                        <div className="absolute -inset-4 rounded-[4rem] border-2 border-emerald-500/10 bg-emerald-500/5 dark:bg-transparent dark:border-emerald-500/20 animate-spin-slower pointer-events-none" />
                        <div className="relative bg-white dark:bg-[#0a0c10] border border-gray-100 dark:border-white/10 rounded-[3.5rem] p-10 lg:p-12 overflow-hidden shadow-2xl backdrop-blur-3xl transform transition-transform duration-700 group-hover:scale-[1.01]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
                            <div className="relative z-10 space-y-10">
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-inner text-emerald-500">
                                        <Target size={32} />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-emerald-500/60 tracking-widest uppercase">Propósito Vital</div>
                                        <div className="text-4xl font-black text-gray-900 dark:text-white uppercase">{mainMetric.value}</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">{mainMetric.label}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{mainMetric.desc}</p>
                                </div>
                                <div className="pt-6 border-t border-gray-100 dark:border-white/10 flex flex-col sm:flex-row items-center gap-4">
                                    <button onClick={() => setIsModalOpen(true)} className="flex-1 px-6 py-4.5 bg-emerald-600 dark:bg-emerald-500/10 text-white dark:text-emerald-400 border-none dark:border dark:border-emerald-400/20 font-black text-[10px] rounded-2xl tracking-[0.2em] shadow-xl transition-all hover:brightness-110 active:scale-95 flex items-center justify-center gap-2">
                                        <Share2 size={16} /> COMPARTIR COMPROMISO
                                    </button>
                                    <button onClick={() => setIsTeamOpen(true)} className="flex-1 px-6 py-4.5 group/btn relative overflow-hidden bg-gray-950 dark:bg-white text-white dark:text-gray-950 font-black text-[10px] rounded-2xl tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-2">
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500" />
                                        <Users size={16} /> VER EQUIPO
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 lg:order-2">
                        <h2 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[0.85] tracking-tighter uppercase">
                            NUESTRA CIENCIA <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-500 dark:from-emerald-400 dark:via-teal-300 dark:to-blue-400">ES TU ACCIÓN.</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg lg:text-xl font-medium leading-relaxed max-w-lg">
                            Más allá de métricas genéricas, en <span className="text-emerald-600 dark:text-white font-bold">NOS PLANET</span> transformamos cada residuo en un dato tangible de esperanza. La tecnología solo es la herramienta; el motor eres tú.
                        </p>
                        <div className="flex flex-wrap gap-10 pt-4">
                            {sideStats.map((stat, i) => (
                                <div key={i} className="space-y-1">
                                    <div className={`text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>{stat.value}</div>
                                    <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {isTeamOpen && (
                <div className="fixed inset-0 z-[120] flex justify-end">
                    <div className="absolute inset-0 bg-gray-950/40 dark:bg-gray-950/80 backdrop-blur-sm transition-opacity" onClick={() => { setIsTeamOpen(false); setTeamCategory(null); }} />
                    <div className="relative w-full max-w-2xl bg-white dark:bg-[#080a0f] h-full shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-2xl animate-slide-in-right p-8 lg:p-12 overflow-y-auto flex flex-col border-l border-gray-100 dark:border-white/5">
                        <div className="flex justify-between items-center mb-16">
                            <div className="space-y-1">
                                {teamCategory ? (
                                    <button onClick={() => setTeamCategory(null)} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                                        <ChevronLeft size={14} /> Volver
                                    </button>
                                ) : (
                                    <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.3em]">Cerebros por el Cambio</div>
                                )}
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
                                    {teamCategory === 'management' ? 'Gestión & CEO' : teamCategory === 'dev' ? 'Desarrollo' : 'Nuestro Equipo'}
                                </h3>
                            </div>
                            <button onClick={() => { setIsTeamOpen(false); setTeamCategory(null); }} className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-white transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        {!teamCategory ? (
                            <div className="flex-1 grid md:grid-cols-2 gap-8 items-center content-center animate-water-reveal">
                                <button onClick={() => setTeamCategory('management')} className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 p-10 flex flex-col items-center justify-center text-center space-y-6 hover:border-emerald-500/30 transition-all duration-700 shadow-xl hover:shadow-2xl dark:hover:bg-emerald-500/10">
                                    <div className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                        <Briefcase size={36} />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none block">CEO Y<br />GESTIÓN</span>
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Liderazgo Estratégico</p>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                </button>
                                <button onClick={() => setTeamCategory('dev')} className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 p-10 flex flex-col items-center justify-center text-center space-y-6 hover:border-blue-500/30 transition-all duration-700 shadow-xl hover:shadow-2xl dark:hover:bg-blue-500/10">
                                    <div className="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                                        <Code size={36} />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none block">EQUIPO DE<br />DESARROLLO</span>
                                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Ingeniería Circular</p>
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 grid gap-8 content-center animate-water-reveal">
                                {teamData[teamCategory].map((member, i) => (
                                    <div key={i} className="relative group/card flex flex-col sm:flex-row items-center gap-8 p-8 rounded-[3rem] bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 hover:border-emerald-500/20 dark:hover:bg-white/[0.06] transition-all duration-700 hover:scale-[1.02] shadow-lg hover:shadow-xl">
                                        <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white dark:border-emerald-500/20 relative shrink-0 shadow-2xl">
                                            <img src={member.img} alt={member.name} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-1000" />
                                        </div>
                                        <div className="text-center sm:text-left space-y-3">
                                            <div>
                                                <div className="text-emerald-600 dark:text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-1">{member.label}</div>
                                                <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">{member.name}</h4>
                                                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">{member.role}</div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed max-w-sm">{member.bio}</p>
                                            <div className="flex gap-4 justify-center sm:justify-start pt-2">
                                                {member.socials.map((social, idx) => (
                                                    <div key={idx} className={`w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 ${social.color} hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer`}>
                                                        <social.icon size={18} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-auto pt-10 text-center text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em]">Nos Planet © 2026 • Tecnología Regenerativa</div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-gray-950/40 dark:bg-gray-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-white dark:bg-[#0a0c10] border border-gray-100 dark:border-white/10 rounded-[3rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-3xl animate-scale-in">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-white transition-all">
                            <X size={20} />
                        </button>
                        <div className="text-center space-y-2 mb-12">
                            <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.3em] mb-1">Nos Planet Impact</div>
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">Comparte<br />Compromiso</h3>
                            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pt-2">Inspira a otros con Nos Planet</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {shareOptions.map((social) => (
                                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className={`group flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 transition-all duration-500 ${social.bg} ${social.color} hover:scale-[1.05] hover:shadow-xl`}>
                                    <social.icon size={32} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform duration-500" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{social.name}</span>
                                </a>
                            ))}
                        </div>
                        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5 text-center"><p className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em]">Tecnología por la Regeneración</p></div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin-slower { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slower { animation: spin-slower 30s linear infinite; }
                @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
                .animate-slide-in-right { animation: slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes scale-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
                .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes water-reveal { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-water-reveal { animation: water-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            ` }} />
        </section>
    );
};

export default React.memo(ImpactSection);
