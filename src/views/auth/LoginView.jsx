import React, { useState, useEffect } from 'react';
import { LogIn, XCircle, ArrowRight } from 'lucide-react';
import Button from '../../components/shared/Button';

// NOTA: Asegúrate de que estas rutas sean correctas o importa las imágenes arriba
// import heroNature from '../../assets/hero_nature_v2.png';

const LoginView = ({ onLogin, onCancel, t }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // 1. Configuración del Slider (Solo necesitamos ID e Imagen para el fondo)
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 0,
            image: '/src/assets/hero_nature_v2.png', // O usa imports si prefieres
        },
        {
            id: 1,
            image: '/src/assets/hero_environment.jpg',
        }
    ];

    // 2. Auto-play (Efecto de rotación cada 10 segundos)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 8000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === 'admin@recycle.com' && password === 'admin123') {
            onLogin();
        } else {
            setError('Credenciales incorrectas (Usa: admin@recycle.com / admin123)');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-stone-900 dark:bg-gray-950 transition-colors duration-500">

            {/* --- 3. FONDO ANIMADO (SLIDER) --- */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 z-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={slide.image}
                        alt="Background"
                        className="w-full h-full object-cover opacity-100 transition-opacity duration-500"
                    />
                    {/* Overlay Gradiente Adaptativo */}
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-stone-900/20 dark:from-gray-950/95 dark:via-gray-900/80 dark:to-gray-900/40" />
                </div>
            ))}
            {/* ------------------------------- */}

            {/* Login Card (z-10 para estar encima del fondo) */}
            <div className="bg-white/90 dark:bg-gray-900/90 p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/50 dark:border-gray-800 backdrop-blur-md animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-10">
                    <div className="inline-flex bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900 dark:to-gray-800 p-5 rounded-2xl mb-6 text-green-600 dark:text-green-400 shadow-inner">
                        <LogIn size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t.admin.portalTitle}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">{t.admin.portalSubtitle}</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-6 flex items-center gap-3 animate-in shake">
                        <XCircle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.admin.emailLabel}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-3 focus:ring-green-300 dark:focus:ring-green-900/30 focus:border-green-500 dark:focus:border-green-500 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="admin@recycle.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.admin.passLabel}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-3 focus:ring-green-300 dark:focus:ring-green-900/30 focus:border-green-500 dark:focus:border-green-500 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-1/2 justify-center mx-auto py-3.5 text-md shadow-green-200 dark:shadow-none">
                        {t.admin.loginBtn}
                    </Button>
                </form>
                <div className="mt-8 text-start border-t border-gray-200/50 dark:border-gray-800 pt-6">
                    <button onClick={onCancel} className="text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium flex items-center justify-center gap-2 mx-auto transition-colors">
                        <ArrowRight size={14} className="rotate-180" /> {t.admin.backBtn}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginView;