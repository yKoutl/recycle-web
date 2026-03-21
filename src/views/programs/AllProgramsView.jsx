import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';

import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProgramCard from '../../components/cards/ProgramCard';
import ProgramModal from '../../components/modals/ProgramModal';
import { useGetPublicProgramsQuery } from '../../store/programs';

const AllProgramsView = ({ lang, setLang, darkMode, setDarkMode, t, isAuthenticated, user, onLogout }) => {
    const navigate = useNavigate();
    const { data: programs = [], isLoading } = useGetPublicProgramsQuery();
    const [selectedProgram, setSelectedProgram] = useState(null);

    return (
        <>
            <Navbar
                lang={lang}
                setLang={setLang}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                t={t}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={onLogout}
                forceScrolled
            />

            <main className="pt-32 pb-20 min-h-screen bg-[#FEFDFB] dark:bg-[#020617] transition-colors duration-500">
                <section className="container mx-auto px-6">
                    <div className="mb-12">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#018F64] hover:text-[#017856] transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Volver al inicio
                        </button>
                    </div>

                    <div className="rounded-[2rem] border border-gray-100 dark:border-white/10 p-8 lg:p-12 bg-white/80 dark:bg-white/5 backdrop-blur-sm mb-12">
                        <div className="flex items-center gap-3 mb-5">
                            <Compass size={18} className="text-[#018F64]" />
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#018F64]">Catalogo de Programas</p>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
                            Ver todos los programas
                        </h1>
                        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-3xl text-lg">
                            Esta es una pagina de demostracion para explorar todas las iniciativas activas publicadas desde el backend.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div key={item} className="h-[540px] rounded-[3rem] bg-gray-100 dark:bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : programs.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                            {programs.map((program) => {
                                const userId = user?._id || user?.uid || user?.sub;
                                const isJoined = isAuthenticated && program?.participantList?.includes(userId);
                                return (
                                    <div key={program._id || program.id} onClick={() => setSelectedProgram(program)} className="cursor-pointer">
                                        <ProgramCard program={program} t={t} isFocused={false} isJoined={isJoined} />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-24 rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10 bg-white dark:bg-white/5">
                            <Sparkles size={34} className="mx-auto mb-4 text-[#018F64]" />
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">No hay programas activos</h2>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">Cuando el admin publique programas en el backend apareceran aqui automaticamente.</p>
                        </div>
                    )}
                </section>
            </main>

            <Footer t={t} />

            <ProgramModal
                program={selectedProgram}
                isOpen={!!selectedProgram}
                onClose={() => setSelectedProgram(null)}
                isAuthenticated={isAuthenticated}
                user={user}
                t={t}
            />
        </>
    );
};

export default AllProgramsView;
