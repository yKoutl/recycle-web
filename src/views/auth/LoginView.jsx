import React, { useState } from 'react';
import { LogIn, XCircle, ArrowRight } from 'lucide-react';
import Button from '../../components/shared/Button';

const LoginView = ({ onLogin, onCancel, t }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === 'admin@recycle.com' && password === 'admin123') {
            onLogin();
        } else {
            setError('Credenciales incorrectas (Usa: admin@recycle.com / admin123)');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 animate-in fade-in">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-green-200/30 dark:bg-green-900/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[80px]"></div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/50 dark:border-gray-800 backdrop-blur-sm">
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
                            className="w-full px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 focus:border-green-500 dark:focus:border-green-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white"
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
                            className="w-full px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 focus:border-green-500 dark:focus:border-green-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full justify-center py-3.5 text-lg shadow-green-200 dark:shadow-none">
                        {t.admin.loginBtn}
                    </Button>
                </form>
                <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
                    <button onClick={onCancel} className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 font-medium flex items-center justify-center gap-2 mx-auto">
                        <ArrowRight size={14} className="rotate-180" /> {t.admin.backBtn}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
