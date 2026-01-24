import React from 'react';
import { Globe, ArrowRight, CheckCircle, Recycle, Bell } from 'lucide-react';
import Button from '../../components/shared/Button';

const Hero = ({ onScrollToPrograms, t }) => (
    <div className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-gray-900">
        {/* Background Image with Modern Overlay */}
        <div className="absolute inset-0 z-0">
            <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000"
                alt="Nature Background"
                className="w-full h-full object-cover opacity-60 dark:opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-green-900/30 dark:to-green-950/40" />
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px]"></div>

        <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white space-y-8 animate-in slide-in-from-left duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-green-300 text-sm font-semibold border border-white/10 shadow-lg hover:bg-white/20 transition-colors cursor-default">
                    <Globe size={16} /> <span>{t.hero.tag}</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                    {t.hero.titlePart1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">{t.hero.titlePart2}</span>
                </h1>

                <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                    {t.hero.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Button onClick={onScrollToPrograms} className="h-14 px-8 text-lg shadow-green-900/50">
                        {t.hero.btnPrimary} <ArrowRight size={20} />
                    </Button>
                    <Button variant="outline" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })} className="h-14 px-8 text-lg">
                        {t.hero.btnSecondary}
                    </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                    <div className="group cursor-default">
                        <div className="text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform origin-left">10k+</div>
                        <div className="text-sm text-gray-400 mt-1">{t.hero.stats.users}</div>
                    </div>
                    <div className="group cursor-default">
                        <div className="text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform origin-left">500t</div>
                        <div className="text-sm text-gray-400 mt-1">{t.hero.stats.recycled}</div>
                    </div>
                    <div className="group cursor-default">
                        <div className="text-3xl font-bold text-green-400 group-hover:scale-110 transition-transform origin-left">100%</div>
                        <div className="text-sm text-gray-400 mt-1">{t.hero.stats.commitment}</div>
                    </div>
                </div>
            </div>

            {/* Hero Mockup - Smaller and aligned */}
            <div className="hidden lg:block relative animate-in zoom-in duration-1000 delay-200 max-w-md mx-auto">
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
                                <div className="text-green-100 text-xs">Welcome Back</div>
                                <div className="font-bold text-lg">Carlos Ruiz</div>
                            </div>
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <Bell size={16} />
                            </div>
                        </div>

                        <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm">Activity</h4>
                                <span className="text-[10px] text-green-600 dark:text-green-400 font-bold cursor-pointer hover:underline">View All</span>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-green-100">
                                <div className="bg-green-100 dark:bg-green-900/40 p-2 rounded-full text-green-600 dark:text-green-400 shadow-sm"><CheckCircle size={18} /></div>
                                <div className="flex-1">
                                    <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">Plastics</div>
                                    <div className="text-[10px] text-gray-500 dark:text-gray-400">North Point • 2h ago</div>
                                </div>
                                <div className="font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full text-[10px]">+50 pts</div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-blue-100">
                                <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-full text-blue-600 dark:text-blue-400 shadow-sm"><Recycle size={18} /></div>
                                <div className="flex-1">
                                    <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">Paper</div>
                                    <div className="text-[10px] text-gray-500 dark:text-gray-400">Office • Yesterday</div>
                                </div>
                                <div className="font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-1 rounded-full text-[10px]">+30 pts</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3 text-center">
                            <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="text-xl font-bold text-gray-800 dark:text-white">1,250</div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide">Points</div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="text-xl font-bold text-green-600 dark:text-green-400">Lvl 5</div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wide">Rank</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Hero;
