import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Recycle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Lottie from 'lottie-react';
import recycleAnimation from '../../assets/Recycle.json';
import logoNosPlanet from '../../assets/reciclaje.png'; // Assuming this exists or using a substitute

const HeroMockup = ({ t }) => {
    const [screen, setScreen] = useState('loading'); // loading, login, dashboard

    // Better effect logic for sequencing
    useEffect(() => {
        if (screen === 'loading') {
            // 4 seconds loading screen
            const timer = setTimeout(() => setScreen('login'), 3000);
            return () => clearTimeout(timer);
        }
        if (screen === 'login') {
            // 5 seconds login screen
            const timer = setTimeout(() => setScreen('dashboard'), 3000);
            return () => clearTimeout(timer);
        }
    }, [screen]);

    const LoadingScreen = () => (
        <div className="absolute inset-0 bg-[#018f64] flex flex-col items-center justify-center z-30 transition-opacity duration-1000 animate-in fade-in">
            <div className="w-48 h-48 mb-2">
                <Lottie animationData={recycleAnimation} loop={true} />
            </div>
            <span className="text-white font-medium tracking-widest text-lg">Cargando...</span>
        </div>
    );

    const LoginScreen = () => (
        <div className="absolute inset-0 bg-[#b1eedc] flex flex-col z-20 transition-opacity duration-1000 animate-in slide-in-from-right">
            {/* Header / Illustration Area */}
            <div className="h-[40%] flex items-end justify-center pb-0 mb-[-20px] z-10">
                <div className="relative">
                    <img src={logoNosPlanet} alt="App Logo" className=" object-contain mb-[-4px] " />
                </div>
            </div>

            {/* Form Container */}
            <div className="flex-1 bg-[#018f64] rounded-t-[30px] px-6 pt-8 pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <h3 className="text-black text-xl font-bold mb-6">Inicia Sesión</h3>

                {/* Inputs */}
                <div className="space-y-4 mb-6">
                    <div className="bg-[#B7ECDD] rounded-xl flex items-center px-4 h-12 shadow-inner">
                        <Mail size={20} className="text-black/60 mr-3" />
                        <div className="h-2 w-24 bg-black/10 rounded-full"></div> {/* Fake text */}
                    </div>
                    <div className="bg-[#B7ECDD] rounded-xl flex items-center px-4 h-12 shadow-inner justify-between">
                        <div className="flex items-center">
                            <Lock size={20} className="text-black/60 mr-3" />
                            <div className="h-2 w-16 bg-black/10 rounded-full"></div> {/* Fake dots */}
                        </div>
                        <EyeOff size={20} className="text-black/60" />
                    </div>
                    <div className="w-full flex justify-end">
                        <div className="h-2 w-32 bg-black/20 rounded-full"></div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                    <div className="bg-[#31253B] rounded-xl h-12 flex items-center justify-center shadow-lg">
                        <span className="text-white font-medium">Iniciar Sesión</span>
                    </div>
                    <div className="bg-[#00C7A1] rounded-xl h-12 flex items-center justify-center shadow-lg">
                        <span className="text-black font-medium">Google</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative w-full max-w-sm mx-auto">
            {/* Device Frame */}
            <div className="relative z-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-3 border border-white/20 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-700 group">

                {/* Mockup Header/notch area simulation */}
                <div className="flex justify-between items-center mb-3 px-2">
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                    </div>
                    <div className="text-white/30 text-[10px] font-mono tracking-wider">app_simulation.exe</div>
                </div>

                {/* App Screen Container - Auto height based on content to prevent "too long" look */}
                <div className="relative bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-inner h-auto min-h-[500px]">

                    {/* Screen Content State Machine */}
                    {screen === 'loading' && <LoadingScreen />}
                    {screen === 'login' && <LoginScreen />}

                    {/* DASHBOARD (Default/Base Layer) */}
                    <div className={`h-full flex flex-col transition-all duration-500 transform ${screen === 'dashboard' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 origin-center'}`}>
                        {/* Dashboard Header */}
                        <div className="bg-[image:var(--gradient-primary)] p-6 pt-8 text-white flex justify-between items-start rounded-b-[2rem] shadow-md z-10">
                            <div>
                                <div className="text-white/80 text-xs mb-1 font-medium">{t.hero.dashboard_mock.welcome}</div>
                                <div className="font-bold text-2xl tracking-tight">Carlos Ruiz</div>
                            </div>
                            <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm border border-white/10">
                                <Bell size={18} />
                            </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="p-5 space-y-4 overflow-hidden relative">
                            {/* Activity Header */}
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{t.hero.dashboard_mock.activity}</h4>
                                <span className="text-[10px] text-[color:var(--text-primary-day)] dark:text-[color:var(--text-primary)] font-bold cursor-pointer hover:underline bg-[color:var(--card-accent)] dark:bg-[color:var(--card-accent)] px-2 py-1 rounded-full">{t.hero.dashboard_mock.viewAll}</span>
                            </div>

                            {/* List Items */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <div className="bg-white/50 dark:bg-black/20 p-2.5 rounded-full text-[color:var(--text-primary-day)] dark:text-[color:var(--text-primary)] shadow-sm"><CheckCircle size={20} /></div>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">{t.hero.dashboard_mock.plastic}</div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">North Point • 2h</div>
                                    </div>
                                    <div className="font-bold text-[color:var(--text-primary-day)] dark:text-[color:var(--text-primary)] bg-[color:var(--card-accent)] dark:bg-[color:var(--card-accent)] px-2.5 py-1 rounded-full text-[10px] shadow-sm">+50 pts</div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <div className="bg-blue-100 dark:bg-blue-900/40 p-2.5 rounded-full text-blue-600 dark:text-blue-400 shadow-sm"><Recycle size={20} /></div>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800 dark:text-gray-200 text-sm">{t.hero.dashboard_mock.paper}</div>
                                        <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Office • 5h</div>
                                    </div>
                                    <div className="font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2.5 py-1 rounded-full text-[10px] shadow-sm">+30 pts</div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3 text-center mt-2">
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm">
                                    <div className="text-2xl font-black text-gray-800 dark:text-white">1,250</div>
                                    <div className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">{t.hero.dashboard_mock.points}</div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm">
                                    <div className="text-2xl font-black text-[color:var(--text-primary-day)] dark:text-[color:var(--text-primary)]">Lvl 5</div>
                                    <div className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">{t.hero.dashboard_mock.rank}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ambient Glow behind the phone */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-green-500/20 to-blue-500/20 rounded-[3rem] blur-2xl -z-10 animate-pulse"></div>
        </div>
    );
};

export default HeroMockup;
