import React from 'react';
import { Globe, Heart, Sparkles as SparkleIcon } from 'lucide-react';
import Button from '../../components/shared/Button';

const Sparkles = () => (
    <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {/* Large Stars */}
        <svg className="absolute top-10 right-[10%] w-12 h-12 text-green-400/60 dark:text-emerald-300/50 animate-bounce" style={{ animationDuration: '3s' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>
        <svg className="absolute top-40 right-[5%] w-8 h-8 text-green-300/50 dark:text-emerald-200/40 animate-pulse" style={{ animationDuration: '4s' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>
        <svg className="absolute bottom-20 right-[15%] w-10 h-10 text-green-500/40 dark:text-emerald-400/30 animate-ping-once" style={{ animationDuration: '5s', animationIterationCount: 'infinite' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>

        {/* Small Dots */}
        <div className="absolute top-20 right-[20%] w-2 h-2 bg-green-200 dark:bg-emerald-100 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
        <div className="absolute top-60 right-[8%] w-1.5 h-1.5 bg-green-400 dark:bg-emerald-300 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-[2%] w-3 h-3 bg-green-300/40 dark:bg-emerald-200/30 rounded-full blur-sm"></div>
        <div className="absolute bottom-40 right-[12%] w-2 h-2 bg-green-100 dark:bg-emerald-50 rounded-full animate-bounce" style={{ animationDuration: '4s' }}></div>

        {/* Extra distant stars */}
        <svg className="absolute top-1/4 right-[25%] w-4 h-4 text-green-200/30 dark:text-emerald-100/20 animate-pulse" style={{ animationDuration: '6s' }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>
    </div>
);

const AboutSection = ({ t }) => (
    <section className="py-24 bg-gradient-to-br from-[#018F64] to-[#015C42] dark:bg-gradient-to-br dark:from-emerald-950 dark:via-green-950 dark:to-gray-950 relative overflow-hidden transition-colors duration-500 text-white">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none"></div>
        <Sparkles />

        <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div>
                    <span className="text-green-200 dark:text-emerald-400 font-bold tracking-wider uppercase text-sm mb-2 block animate-pulse">{t.about.tag}</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight text-white dark:text-white drop-shadow-md">{t.about.title}</h2>
                    <p className="text-green-50/90 dark:text-gray-300 text-lg leading-relaxed mb-8">
                        {t.about.subtitle}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 mb-8">
                        <div className="bg-[#D5F6ED] dark:bg-emerald-900/40 backdrop-blur-md border border-white/20 dark:border-emerald-500/30 p-6 rounded-2xl shadow-xl hover:bg-[#c2f0e4] dark:hover:bg-white/20 transition-all duration-300 group">
                            <div className="text-[#018F64] dark:text-emerald-400 mb-3 drop-shadow transition-transform group-hover:scale-110"><Globe size={32} strokeWidth={1.5} /></div>
                            <h4 className="font-bold text-xl mb-2 text-gray-800 dark:text-white">{t.about.global.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-emerald-100/70 leading-snug">{t.about.global.desc}</p>
                        </div>
                        <div className="bg-[#D5F6ED] dark:bg-emerald-900/40 backdrop-blur-md border border-white/20 dark:border-emerald-500/30 p-6 rounded-2xl shadow-xl hover:bg-[#c2f0e4] dark:hover:bg-white/20 transition-all duration-300 group">
                            <div className="text-[#018F64] dark:text-emerald-400 mb-3 drop-shadow transition-transform group-hover:scale-110"><Heart size={32} strokeWidth={1.5} /></div>
                            <h4 className="font-bold text-xl mb-2 text-gray-800 dark:text-white">{t.about.passion.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-emerald-100/70 leading-snug">{t.about.passion.desc}</p>
                        </div>
                    </div>

                    <Button className="bg-white text-[#018F64] hover:bg-green-50 shadow-lg shadow-black/10 px-8 py-4 font-bold text-lg rounded-full dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400 transition-transform hover:-translate-y-1">{t.about.btn}</Button>
                </div>
                <div className="grid grid-cols-2 gap-8 relative px-4">
                    {/* Image 1: Top Left */}
                    <img
                        src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=400"
                        className="rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500 object-cover h-48 w-full rotate-2 hover:rotate-0"
                        alt="Team work"
                    />
                    {/* Image 2: Top Right - Offset */}
                    <img
                        src="https://images.unsplash.com/photo-1591522810850-58128c5fb089?auto=format&fit=crop&q=80&w=400"
                        className="rounded-2xl shadow-lg transform translate-y-8 hover:translate-y-6 hover:scale-105 transition-transform duration-500 object-cover h-48 w-full -rotate-2 hover:rotate-0"
                        alt="Community recycling"
                    />
                    {/* Image 3: Bottom Left - Offset */}
                    <img
                        src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=400"
                        className="rounded-2xl shadow-lg transform -translate-y-4 hover:-translate-y-6 hover:scale-105 transition-transform duration-500 object-cover h-48 w-full -rotate-1 hover:rotate-0"
                        alt="Recycling bin"
                    />
                    {/* Image 4: Bottom Right */}
                    <img
                        src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=400"
                        className="rounded-2xl shadow-lg transform translate-y-4 hover:translate-y-2 hover:scale-105 transition-transform duration-500 object-cover h-48 w-full rotate-1 hover:rotate-0"
                        alt="Nature forest"
                    />

                    {/* Extra decoration behind images */}
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-200/20 dark:bg-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
                </div>
            </div>
        </div>
    </section>
);

export default AboutSection;
