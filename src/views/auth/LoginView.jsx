import React, { useState, useEffect, useMemo } from 'react';
import { LogIn, XCircle, ArrowRight } from 'lucide-react';
import Button from '../../components/shared/Button'; // Asumo que este botón acepta className

const LoginView = ({ onLogin, onCancel, t }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // 1. Configuración del Slider
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 0,
            image: '/src/assets/hero_nature_v2.png',
        },
        {
            id: 1,
            image: '/src/assets/hero_environment.jpg',
        }
    ];

    // 2. Auto-play
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 10000);
        return () => clearInterval(interval);
    }, [slides.length]);

    // 3. Bubbles Configuration
    const bubbles = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 50 + 20}px`,
            height: `${Math.random() * 50 + 20}px`,
            animationDuration: `${Math.random() * 10 + 15}s`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: Math.random() * 0.3 + 0.1
        }));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === 'admin@recycle.com' && password === 'admin123') {
            onLogin();
        } else {
            setError('Credenciales incorrectas (Usa: admin@recycle.com / admin123)');
        }
    };

    // Estilos comunes para los inputs para mantener consistencia con App.js
    const inputClasses = `
        w-full px-4 py-3 
        rounded-xl outline-none 
        border border-gray-200 dark:border-gray-700 
        bg-gray-50/50 dark:bg-gray-800/50 
        text-gray-900 dark:text-white 
        placeholder-gray-400 dark:placeholder-gray-500
        transition-all duration-500 
        focus:bg-white dark:focus:bg-gray-800
        focus:border-green-500 dark:focus:border-green-400
        focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/40
    `;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-stone-900 dark:bg-gray-950 transition-colors duration-500">

            {/* --- FONDO ANIMADO --- */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 z-0 transition-opacity duration-2000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        src={slide.image}
                        alt="Background"
                        className="w-full h-full object-cover opacity-100 transition-opacity duration-500 blur-sm scale-105"
                    />
                    {/* Overlay: Mantiene el estilo oscuro pero permite ver la imagen */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/50 to-stone-900/30 dark:from-gray-950/90 dark:via-gray-900/50 dark:to-gray-900/30" />
                </div>
            ))}

            {/* --- BUBBLES --- */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {bubbles.map((bubble) => (
                    <div
                        key={bubble.id}
                        className="absolute top-0 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-float-up"
                        style={{
                            left: bubble.left,
                            width: bubble.width,
                            height: bubble.width, // Make it a perfect circle
                            animationDuration: bubble.animationDuration,
                            animationDelay: bubble.animationDelay,
                            opacity: bubble.opacity
                        }}
                    />
                ))}
            </div>

            {/* --- LOGIN CARD --- */}
            <div className="bg-white/95 dark:bg-gray-900/90 p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/50 dark:border-gray-800 backdrop-blur-md animate-in fade-in zoom-in duration-500">

                {/* Header Icon & Title */}
                <div className="text-center mb-8">

                    <h2 className="text-3xl text-gray-900 dark:text-white tracking-tight">{t.admin.portalTitle}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{t.admin.portalSubtitle}</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 flex items-center gap-3 animate-in shake border border-red-100 dark:border-red-900/50">
                        <XCircle size={18} /> {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                            {t.admin.emailLabel}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClasses}
                            placeholder="admin@recycle.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                            {t.admin.passLabel}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClasses}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Botón con transición y colores ajustados */}
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 mt-2 text-base font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-500 rounded-xl shadow-lg shadow-green-600/20 transition-all duration-300 transform active:scale-[0.98]"
                    >
                        {t.admin.loginBtn}
                    </button>
                </form>

                {/* Back Button */}
                <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
                    <button
                        onClick={onCancel}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 font-medium flex items-center justify-center gap-2 mx-auto transition-colors duration-300"
                    >
                        <ArrowRight size={14} className="rotate-180" /> {t.admin.backBtn}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginView;