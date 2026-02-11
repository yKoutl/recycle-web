import React from 'react';
import { Smartphone, Download, Sparkles, Trophy, Apple, Play } from 'lucide-react';

const AppDownloadSection = ({ t }) => {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white dark:bg-[#020617] py-24">
            {/* Background "DIFUMINADO" Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Floating Icon Decor */}
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-[#018F64] to-emerald-400 rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 mb-8 animate-bounce-soft">
                        <Smartphone size={40} className="text-white" />
                    </div>

                    {/* Main Title - Impactful & All Caps per request */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-[#018F64] dark:text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">
                            <Sparkles size={14} />
                            <span>EXPERIENCIA COMPLETA</span>
                        </div>

                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9] lg:px-12">
                            DESCARGA LA <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#018F64] to-blue-500">APLICACIÓN</span> <br className="hidden md:block" />
                            PARA VER TODOS <br className="hidden md:block" />
                            LOS <span className="relative">
                                PREMIOS
                                <Trophy className="absolute -top-6 -right-10 text-yellow-500 rotate-12 hidden md:block" size={48} />
                            </span>
                        </h2>
                    </div>

                    {/* Description */}
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Gestiona tus puntos en tiempo real, descubre beneficios exclusivos y únete a la red de reciclaje más grande del país desde tu bolsillo.
                    </p>

                    {/* App Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        {/* App Store */}
                        <button className="group relative w-full sm:w-64 h-20 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-3xl flex items-center px-8 transition-all hover:scale-105 hover:shadow-2xl active:scale-95 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#018F64] to-emerald-400 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-5 transition-opacity"></div>
                            <Apple size={36} className="mr-4" />
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Próximamente en</p>
                                <p className="text-lg font-black leading-none">App Store</p>
                            </div>
                        </button>

                        {/* Google Play */}
                        <button className="group relative w-full sm:w-64 h-20 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-3xl flex items-center px-8 transition-all hover:scale-105 hover:shadow-2xl active:scale-95 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#018F64] to-emerald-400 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-5 transition-opacity"></div>
                            <Play size={32} className="mr-4 fill-current" />
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Consíguelo en</p>
                                <p className="text-lg font-black leading-none">Google Play</p>
                            </div>
                        </button>
                    </div>

                    {/* Floating Elements Mockup (Visual) */}
                    <div className="pt-20 lg:pt-32 relative hidden md:block">
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[1200px] h-64 bg-gradient-to-t from-white dark:from-[#020617] to-transparent z-20"></div>
                        <div className="flex items-end justify-center gap-8 translate-y-20 opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
                            <div className="w-48 h-80 bg-gray-100 dark:bg-gray-800 rounded-t-[3rem] border-x border-t border-gray-200 dark:border-white/10"></div>
                            <div className="w-56 h-96 bg-gray-100 dark:bg-gray-800 rounded-t-[3rem] border-x border-t border-gray-200 dark:border-white/10 translate-y-8"></div>
                            <div className="w-48 h-80 bg-gray-100 dark:bg-gray-800 rounded-t-[3rem] border-x border-t border-gray-200 dark:border-white/10"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce-soft {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .animate-bounce-soft {
                    animation: bounce-soft 4s ease-in-out infinite;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
            `}} />
        </section>
    );
};

export default AppDownloadSection;
