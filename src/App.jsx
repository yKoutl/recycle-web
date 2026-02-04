import React, { useState } from 'react';
import { TRANSLATIONS } from './data/translations';
import LandingView from './views/landing/LandingView';
import LoginView from './views/auth/LoginView';
import AdminView from './views/admin/AdminView';
import EcoBot from './components/eco-bot/EcoBot';

const App = () => {
  const [view, setView] = useState('landing'); // 'landing', 'login', 'admin'
  const [lang, setLang] = useState('es');
  const [darkMode, setDarkMode] = useState(false);

  // Helper for translation
  const t = TRANSLATIONS[lang];

  return (
    // Wrap entire app in a div that toggles 'dark' class
    <div className={darkMode ? 'dark' : ''}>
      <div className="font-sans text-gray-800 bg-white dark:bg-gray-950 dark:text-gray-100 selection:bg-green-100 dark:selection:bg-green-900 selection:text-green-900 dark:selection:text-green-100 transition-colors duration-500">

        {view === 'landing' && (
          <LandingView
            onLoginClick={() => setView('login')}
            lang={lang}
            setLang={setLang}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            t={t}
          />
        )}

        {view === 'login' && (
          <LoginView
            onLogin={() => setView('admin')}
            onCancel={() => setView('landing')}
            t={t}
          />
        )}

        {view === 'admin' && (
          <AdminView
            onLogout={() => setView('landing')}
            t={t}
          />
        )}

      </div>
      <EcoBot />
    </div>
  );
};

export default App;