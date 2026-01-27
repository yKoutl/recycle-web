import React, { useState } from 'react';
import { Globe, ArrowRight, CheckCircle, Recycle, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/shared/Button';
import HeroMockup from './HeroMockup';

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
                        <div className="inline-flex items-center  gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl text-green-300 text-sm border border-white/10 shadow-lg hover:bg-white/20 transition-colors cursor-default">
                            <Globe size={16} /> <span>{t.hero.tag}</span>
                        </div>

                        <h1 className="text-5xl lg:text-6xl uppercase leading-tight tracking-tight text-white">
                            {activeSlide.titlePart1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">{activeSlide.titlePart2}</span>
                        </h1>

                        <p className="text-lg text-gray-200 max-w-lg leading-relaxed">
                            {activeSlide.subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Button onClick={onScrollToPrograms} className="h-14 px-8 text-md shadow-green-900/20">
                                {t.hero.btnPrimary} <ArrowRight size={20} />
                            </Button>
                            <Button variant="outline" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })} className="h-14 px-8 text-md bg-transparent border-white/30 text-white hover:bg-white/10 shadow-sm">
                                {t.hero.btnSecondary}
                            </Button>
                        </div>
                    </div>

                    {/* Hero Mockup - Static Position */}
                    <div className="hidden lg:block relative max-w-md mx-auto">
                        <HeroMockup t={t} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
