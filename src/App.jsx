import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from './data/translations';
import LandingView from './views/landing/LandingView';
import LoginView from './views/auth/LoginView';
import AdminView from './views/admin/dashboard/AdminView';
import PlanetBot from './components/planet-bot/PlanetBot';
import { onLogin, onLogout, useCheckStatusQuery } from './store/auth';
import { useSelector, useDispatch } from 'react-redux';

const App = () => {
  const [lang, setLang] = useState('es');
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'admin' | 'login'

  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  // Recuperar datos reales del usuario si hay token
  const { data: userData, isSuccess, isError } = useCheckStatusQuery(undefined, {
    skip: !token
  });

  // Helper for translation
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (!token && status !== 'checking') {
      dispatch(onLogout());
      if (activeView === 'admin') {
        setActiveView('landing');
      }
    }
  }, [token, dispatch, status, activeView]);

  useEffect(() => {
    if (isSuccess && userData && token) {
      dispatch(onLogin({
        token,
        user: userData.user || userData
      }));
    }
  }, [isSuccess, userData, token, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(onLogout());
      setActiveView('landing');
    }
  }, [isError, dispatch]);

  // Manejar redirecciones de vista basadas en estado de autenticación
  useEffect(() => {
    // Si ya estamos autenticados y estamos en login, ir a admin automáticamente
    if (status === 'authenticated' && activeView === 'login') {
      setActiveView('admin');
    }

    // Si estamos en admin pero no hay token y no se está verificando, volver a landing
    if (activeView === 'admin' && !token && status === 'not-authenticated') {
      setActiveView('landing');
    }

    // Si el chequeo falla, asegurarse de no quedarse en admin
    if (activeView === 'admin' && isError) {
      setActiveView('landing');
    }
  }, [status, activeView, token, isError]);

  // Determine current view for PlanetBot
  const botContext = activeView === 'admin' ? 'admin' : (activeView === 'login' ? 'login' : 'landing');

  // RENDER LOGIC
  const renderCurrentView = () => {
    // Si queremos ir al admin, verificamos estado
    if (activeView === 'admin') {
      if (status === 'authenticated') {
        return (
          <AdminView
            t={t}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onBackToLanding={() => setActiveView('landing')}
          />
        );
      }

      // Si estamos verificando, mostramos un loader premium
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 font-sans p-8">
          <div className="w-24 h-24 mb-8 relative">
            <div className="absolute inset-0 border-8 border-[#018F64]/20 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-[#018F64] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic text-center animate-pulse">
            Accediendo al <span className="text-[#018F64]">Portal</span>
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">Verificando credenciales de seguridad...</p>
        </div>
      );
    }

    if (activeView === 'login') {
      return (
        <LoginView
          onLogin={() => setActiveView('admin')}
          onCancel={() => setActiveView('landing')}
          t={t}
        />
      );
    }

    return (
      <LandingView
        onLoginClick={() => {
          // Si hay token o ya está autenticado, vamos directo al admin
          if (status === 'authenticated' || token) {
            setActiveView('admin');
          } else {
            setActiveView('login');
          }
        }}
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        t={t}
        isAuthenticated={status === 'authenticated'}
      />
    );
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="font-sans text-gray-800 bg-white dark:bg-gray-950 transition-colors duration-500 min-h-screen">
        {renderCurrentView()}
      </div>
      <PlanetBot currentView={botContext} />
    </div>
  );
};

export default App;