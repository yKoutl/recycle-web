import React, { useState } from 'react';
import { TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import ProgramCard from '../../components/cards/ProgramCard';
import ProgramModal from '../../components/modals/ProgramModal';
import { MOCK_PROGRAMS } from '../../data/mockData';

const ProgramsSection = ({ t }) => {
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [hoveredCardId, setHoveredCardId] = useState(null);

    return (
        <section id="programs" className="pt-16 pb-32 relative overflow-hidden bg-[#FEFDFB] dark:bg-[#020617] transition-colors duration-500">
            {/* Architectural Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

            {/* Soft Ambient Accents */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
            <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-[#B0EEDE]/10 rounded-full blur-[150px] pointer-events-none opacity-50" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                    <div className="max-w-3xl space-y-8">
                        <div className="inline-block">
                            <div className="flex items-center gap-3">
                                <p className="text-[10px] font-black text-[#018F64] dark:text-[#10B981] uppercase tracking-[0.4em]">NUESTROS PROGRAMAS</p>
                                <div className="w-16 h-[2px] bg-gradient-to-r from-[#018F64] to-transparent dark:from-[#10B981]" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tighter">
                                {t.programs.title.split(' ')[0]} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#018F64] to-[#10B981] dark:from-[#10B981] dark:to-[#B0EEDE]">
                                    {t.programs.title.split(' ').slice(1).join(' ')}
                                </span>
                            </h2>
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 text-xl font-medium leading-relaxed max-w-xl border-l-2 border-emerald-500/20 pl-6">
                            {t.programs.subtitle}
                        </p>
                    </div>

                    <div className="hidden lg:block pb-10">
                        <button className="flex items-center gap-6 group relative">
                            <div className="absolute -inset-4 bg-emerald-500/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-[#018F64] dark:text-[#10B981]">Explorar Todos</span>
                            <div className="w-16 h-16 rounded-full border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-[#018F64] group-hover:text-white group-hover:border-[#018F64] transition-all duration-700">
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
                    {MOCK_PROGRAMS(t).map((program, idx) => {
                        const isHovered = hoveredCardId === program.id;
                        const isSomethingHovered = hoveredCardId !== null && hoveredCardId !== program.id;

                        return (
                            <div
                                key={program.id}
                                onClick={() => setSelectedProgram(program)}
                                onMouseEnter={() => setHoveredCardId(program.id)}
                                onMouseLeave={() => setHoveredCardId(null)}
                                className={`cursor-pointer h-full transition-all duration-700 
                                    ${isSomethingHovered ? 'opacity-30 blur-[2px] scale-95 grayscale-[0.3]' : 'opacity-100 blur-0 scale-100'} 
                                    ${isHovered ? 'z-20' : 'z-10'}
                                    animate-in fade-in slide-in-from-bottom-20`}
                                style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
                            >
                                <ProgramCard program={program} t={t} isFocused={isHovered} />
                            </div>
                        );
                    })}
                </div>

                {/* Mobile Call to Action */}
                <div className="mt-20 text-center lg:hidden">
                    <button className="inline-flex items-center gap-4 px-10 py-5 bg-[#018F64] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-emerald-900/30 active:scale-95 transition-all">
                        <span>Ver todos los programas</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Modal Integration */}
            <ProgramModal
                program={selectedProgram}
                isOpen={!!selectedProgram}
                onClose={() => setSelectedProgram(null)}
            />
        </section>
    );
};

export default React.memo(ProgramsSection);
