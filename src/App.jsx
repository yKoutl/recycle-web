import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import PlanetBot from './components/planet-bot/PlanetBot';
import { onLogin, onLogout, useCheckStatusQuery } from './store/auth';
import { useSelector, useDispatch } from 'react-redux';

const App = () => {
  const [lang, setLang] = useState('es');
  const [darkMode, setDarkMode] = useState(false);
  const [showBot, setShowBot] = useState(true);

  const dispatch = useDispatch();
  const location = useLocation();
  const { status } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  // Recuperar datos reales del usuario si hay token al recargar
  const { data: userData, isSuccess, isError, refetch } = useCheckStatusQuery(token, {
    skip: !token,
    refetchOnMountOrArgChange: true // Forzar comprobación al cambiar de usuario
  });

  // Sincronizar estado de Redux con el backend
  useEffect(() => {
    if (isSuccess && userData && token) {
      // Solo actualizamos si el usuario actual es diferente para evitar bucles
      // O si no hay usuario en el estado
      // Verificamos si realmente necesitamos actualizar
      dispatch(onLogin({
        token,
        user: userData.user || userData
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
  const isLoginPage = location.pathname.includes('/auth/login');
  const isAdminPage = location.pathname.includes('/admin');
  const botContext = isAdminPage ? 'admin' : (isLoginPage ? 'login' : 'landing');

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="font-sans text-gray-800 bg-white dark:bg-gray-950 transition-colors duration-500 min-h-screen">
        <AppRouter
          lang={lang}
          setLang={setLang}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={handleLogout}
          showBot={showBot}
          setShowBot={setShowBot}
        />
      </div>

      {!isLoginPage && showBot && <PlanetBot currentView={botContext} />}
    </div>
  );
};

export default App;