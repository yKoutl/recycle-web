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
    if (!token) {
      dispatch(onLogout());
      setActiveView('landing');
    }
  }, [token, dispatch]);

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

  // Determine current view for PlanetBot
  const botContext = activeView === 'admin' ? 'admin' : (activeView === 'login' ? 'login' : 'landing');

  // RENDER LOGIC
  const renderCurrentView = () => {
    if (status === 'authenticated' && activeView === 'admin') {
      return (
        <AdminView
          t={t}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onBackToLanding={() => setActiveView('landing')}
        />
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
          if (status === 'authenticated') {
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
      <div className="font-sans text-gray-800 bg-white dark:bg-gray-950 transition-colors duration-500">
        {renderCurrentView()}
      </div>
      <PlanetBot currentView={botContext} />
    </div>
  );
};

export default App;