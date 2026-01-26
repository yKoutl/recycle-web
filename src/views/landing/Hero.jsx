import React, { useState } from 'react';
import { Globe, ArrowRight, CheckCircle, Recycle, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/shared/Button';

const Hero = ({ onScrollToPrograms, t }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Slide Configuration
    const slides = [
        {
            id: 0,
            image: '/src/assets/hero_nature_v2.png',
            titlePart1: t.hero.titlePart1,
            titlePart2: t.hero.titlePart2,
            subtitle: t.hero.subtitle
        },
        {
            id: 1,
            image: '/src/assets/hero_environment.jpg',
            titlePart1: 'Transforma tus',
            titlePart2: 'residuos en valor',
            subtitle: 'La economía circular comienza contigo. Descubre cómo cada acción cuenta para transformar nuestro planeta.'
        }
    ];

    // Auto-play
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const activeSlide = slides[currentSlide];

    return (
        <div className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-stone-900 dark:bg-gray-950 transition-colors duration-500">
            {/* Background Image with Transition */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 z-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        src={slide.image}
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-100 transition-opacity duration-500"
                    />
                    {/* Adaptive Overlay: Warm Dark (Day) vs Cool Dark (Night) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-stone-900/20 dark:from-gray-950/95 dark:via-gray-900/80 dark:to-gray-900/40" />
                </div>
            ))}

            {/* Floating Shapes */}
            <div className={`absolute top-20 right-20 w-96 h-96 bg-green-500/20 rounded-full blur-[100px] animate-pulse transition-all duration-1000 ${currentSlide === 1 ? 'left-20 bg-blue-500/10' : ''}`}></div>

            {/* Dots Navigation (Right Side) */}
            <div className="absolute right-8 bottom-10 z-30 flex gap-3 md:flex-col md:top-1/2 md:bottom-auto md:-translate-y-1/2">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-500 ${currentSlide === index
                            ? 'bg-green-500 scale-125 ring-4 ring-green-500/20'
                            : 'bg-white/30 hover:bg-green-500/50'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Section - Fixed Position, Animates on Change */}
                    <div
                        key={currentSlide}
                        className="space-y-8 animate-in slide-in-from-left fade-in duration-700"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-green-300 text-sm font-semibold border border-white/10 shadow-lg hover:bg-white/20 transition-colors cursor-default">
                            <Globe size={16} /> <span>{t.hero.tag}</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-white">
                            {activeSlide.titlePart1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">{activeSlide.titlePart2}</span>
                        </h1>

                        <p className="text-xl text-gray-200 max-w-lg leading-relaxed font-medium">
                            {activeSlide.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Button onClick={onScrollToPrograms} className="h-14 px-8 text-lg shadow-xl shadow-green-900/20">
                                {t.hero.btnPrimary} <ArrowRight size={20} />
                            </Button>
                            <Button variant="outline" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })} className="h-14 px-8 text-lg bg-transparent border-white/30 text-white hover:bg-white/10 shadow-sm">
                                {t.hero.btnSecondary}
                            </Button>
                        </div>
                    </div>

                    {/* Hero Mockup - Static Position */}
                    <div className="hidden lg:block relative animate-in zoom-in fade-in duration-1000 delay-200 max-w-md mx-auto">
                        <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-700 group">
                            {/* Mockup Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                </div>
                                <div className="text-white/50 text-[10px] font-mono">dashboard.exe</div>
                            </div>

                            {/* App Interface Mockup */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-inner transition-colors duration-500">
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-5 text-white flex justify-between items-center">
                                    <div>
                                        <div className="text-green-100 text-xs">{t.hero.dashboard_mock.welcome}</div>
                                        <div className="font-bold text-lg">Carlos Ruiz</div>
                                    </div>
                                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                        <Bell size={16} />
                                    </div>
                                </div>

                                <div className="p-5 space-y-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{t.hero.dashboard_mock.activity}</h4>
                                        <span className="text-[10px] text-green-600 dark:text-green-400 font-bold cursor-pointer hover:underline">{t.hero.dashboard_mock.viewAll}</span>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-green-100">
                                        <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full text-green-600 dark:text-green-400 shadow-sm"><CheckCircle size={18} /></div>
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">{t.hero.dashboard_mock.plastic}</div>
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400">North Point • {t.hero.dashboard_mock.time1}</div>
                                        </div>
                                        <div className="font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full text-[10px]">+50 {t.programs.points}</div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-blue-100">
                                        <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full text-blue-600 dark:text-blue-400 shadow-sm"><Recycle size={18} /></div>
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">{t.hero.dashboard_mock.paper}</div>
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400">Office • {t.hero.dashboard_mock.time2}</div>
                                        </div>
                                        <div className="font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-full text-[10px]">+30 {t.programs.points}</div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-900 p-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3 text-center">
                                    <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <div className="text-xl font-bold text-gray-800 dark:text-white">1,250</div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide">{t.hero.dashboard_mock.points}</div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                        <div className="text-xl font-bold text-green-600 dark:text-green-400">Lvl 5</div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide">{t.hero.dashboard_mock.rank}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
