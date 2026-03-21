import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import i18n from './i18n';
import { onLogin, onLogout, useCheckStatusQuery } from './store/auth';
import { useDispatch } from 'react-redux';

const PlanetBot = React.lazy(() => import('./components/planet-bot/PlanetBot'));

const App = () => {
  const [lang, setLang] = useState(localStorage.getItem('app_lang') || 'es');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('app_darkMode') === 'true');
  const [themeColor, setThemeColor] = useState(localStorage.getItem('app_themeColor') || '#018F64');
  const [showBot, setShowBot] = useState(true);

  // Persistir preferencias
  useEffect(() => {
    localStorage.setItem('app_lang', lang);
    try { i18n.changeLanguage(lang); } catch (e) { }
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('app_darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('app_themeColor', themeColor);
    // Actualizar variable CSS global para que todo use el color elegido
    document.documentElement.style.setProperty('--primary-accent', themeColor);
  }, [themeColor]);

  const dispatch = useDispatch();
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Recuperar datos reales del usuario si hay token al recargar
  const { data: userData, isSuccess, isError } = useCheckStatusQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true // Forzar comprobación al cambiar de usuario
  });

  // Sincronizar estado de Redux con el backend
  useEffect(() => {
    if (isSuccess && userData && token) {
      const user = userData.user || userData;

      // Establecer color por defecto según rol si no hay uno guardado
      if (!localStorage.getItem('app_themeColor')) {
        const roleDefault = user.role?.toUpperCase() === 'COORDINATOR' ? '#6439FF' :
          (user.role?.toUpperCase() === 'MANAGER' ? '#f97316' : '#018F64');
        setThemeColor(roleDefault);
      }

      dispatch(onLogin({
        token,
        user
      }));
    }
  }, [isSuccess, userData, token, dispatch]);

  // Manejar errores de token expirado o inválido
  useEffect(() => {
    if (isError) {
      dispatch(onLogout());
    }
  }, [isError, dispatch]);

  const handleLogout = () => {
    dispatch(onLogout());
  };

  // Contexto para el Bot
  const isAuthPage = location.pathname.includes('/auth');
  const isAdminPage = location.pathname.includes('/admin');
  const botContext = isAdminPage ? 'admin' : (isAuthPage ? 'login' : 'landing');

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="font-sans text-gray-800 bg-white dark:bg-gray-950 transition-colors duration-500 min-h-screen">
        <AppRouter
          lang={lang}
          setLang={setLang}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          themeColor={themeColor}
          setThemeColor={setThemeColor}
          onLogout={handleLogout}
          showBot={showBot}
          setShowBot={setShowBot}
        />
      </div>

      {!isAuthPage && showBot && (
        <React.Suspense fallback={null}>
          <PlanetBot currentView={botContext} />
        </React.Suspense>
      )}
    </div>
  );
};

export default App;