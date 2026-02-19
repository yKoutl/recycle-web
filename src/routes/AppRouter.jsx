import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TRANSLATIONS } from '../data/translations';
import { PrivateRoute, PublicRoute } from './NavigationGuards';
import { Loader2 } from 'lucide-react';

// Vistas Lazy Loading
const LandingView = lazy(() => import('../views/landing/LandingView'));
const EcoHistoriesView = lazy(() => import('../views/ecohistories/EcoHistoriesView'));
const LoginView = lazy(() => import('../views/auth/LoginView'));
const AdminView = lazy(() => import('../views/admin/dashboard/AdminView'));


// Componente de Carga
const PageLoader = () => (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#020617] flex flex-col items-center justify-center transition-colors duration-300">
        <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-gray-100 dark:border-gray-800 border-t-[#018F64] dark:border-t-[#B0EEDE] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={24} className="text-[#018F64] dark:text-[#B0EEDE] animate-pulse" />
            </div>
        </div>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.3em] text-[#018F64] dark:text-[#B0EEDE] animate-pulse">
            Cargando...
        </p>
    </div>
);

const AppRouter = ({ lang, setLang, darkMode, setDarkMode, onLogout, showBot, setShowBot }) => {
    const t = TRANSLATIONS[lang];
    const { status, user } = useSelector((state) => state.auth);

    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Rutas Públicas (Landing) */}
                <Route path="/eco-historias" element={
                    <EcoHistoriesView
                        lang={lang}
                        setLang={setLang}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        t={t}
                        isAuthenticated={status === 'authenticated'}
                        user={user}
                        onLogout={onLogout}
                    />
                } />

                <Route path="/" element={
                    <LandingView
                        lang={lang}
                        setLang={setLang}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        t={t}
                        isAuthenticated={status === 'authenticated'}
                        user={user}
                        onLogout={onLogout}
                    />
                } />

                {/* Rutas de Autenticación (Solo si no estás logueado) */}
                <Route element={<PublicRoute />}>
                    <Route path="/auth/login" element={<LoginView t={t} />} />
                </Route>

                {/* Rutas Privadas (Admin y Funcionario) */}
                <Route element={<PrivateRoute allowedRoles={['ADMIN', 'OFFICIAL']} />}>
                    <Route path="/admin/*" element={
                        <AdminView
                            t={t}
                            darkMode={darkMode}
                            setDarkMode={setDarkMode}
                            lang={lang}
                            setLang={setLang}
                            showBot={showBot}
                            setShowBot={setShowBot}
                        />
                    } />
                </Route>

                {/* Redirección por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRouter;
