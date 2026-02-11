import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from './data/translations';
import LandingView from './views/landing/LandingView';
import LoginView from './views/auth/LoginView';
import AdminView from './views/admin/AdminView';
import PlanetBot from './components/planet-bot/PlanetBot';
import { onLogin, onLogout } from './store/auth/authSlice';
import { useSelector, useDispatch } from 'react-redux';

const App = () => {
  const [lang, setLang] = useState('es');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  // Helper for translation
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Si hay token guardado, recuperamos la sesión
      dispatch(onLogin({ token, user: { name: 'Admin Recuperado' } }));
    } else {
      // Si no hay token, aseguramos que esté fuera
      dispatch(onLogout());
    }
  }, [dispatch]);

  // Determine current view for PlanetBot
  const currentView = status === 'authenticated' ? 'admin' : (isLoginOpen ? 'login' : 'landing');

  if (status === 'authenticated') {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="font-sans text-gray-800 bg-white dark:bg-gray-950 transition-colors duration-500">
          <AdminView t={t} />
        </div>
        <PlanetBot currentView="admin" />
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="font-sans text-gray-800 bg-white dark:bg-gray-950 transition-colors duration-500">
        {isLoginOpen ? (
          <LoginView
            onLogin={() => {
              // LoginView ya hace el dispatch interno.
              // Redux cambiará el status y se activará el bloque de arriba.
            }}
            onCancel={() => setIsLoginOpen(false)}
            t={t}
          />
        ) : (
          <LandingView
            onLoginClick={() => setIsLoginOpen(true)}
            lang={lang}
            setLang={setLang}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            t={t}
          />
        )}
      </div>
      <PlanetBot currentView={currentView} />
    </div>
  );
};

export default App;