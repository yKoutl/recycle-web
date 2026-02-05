import React, { useState, useEffect } from 'react';
import { TRANSLATIONS } from './data/translations';
import LandingView from './views/landing/LandingView';
import LoginView from './views/auth/LoginView';
import AdminView from './views/admin/AdminView';
import { onLogin, onLogout } from './store/auth/authSlice';
import { useSelector, useDispatch } from 'react-redux';

const App = () => {
  const [view, setView] = useState('landing'); // 'landing', 'login', 'admin'
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

  if (status === 'authenticated') {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="font-sans text-gray-800 bg-white dark:bg-gray-950 transition-colors duration-500">
          <AdminView t={t} />
          {/* Nota: Ya no pasamos onLogout aquí, AdminView lo maneja internamente */}
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="font-sans text-gray-800 bg-white dark:bg-gray-950 transition-colors duration-500">

        {/* Si isLoginOpen es true, mostramos Login, si no, Landing */}
        {isLoginOpen ? (
          <LoginView
            onLogin={() => {
              // LoginView ya hace el dispatch.
              // Aquí no hace falta hacer nada más, Redux cambiará el 'status' 
              // y el bloque 'A' de arriba se activará solo.
            }}
            onCancel={() => setIsLoginOpen(false)} // Volver al Landing
            t={t}
          />
        ) : (
          <LandingView
            onLoginClick={() => setIsLoginOpen(true)} // Ir al Login
            lang={lang}
            setLang={setLang}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            t={t}
          />
        )}

      </div>
      <EcoBot />
    </div>
  );
};

export default App;