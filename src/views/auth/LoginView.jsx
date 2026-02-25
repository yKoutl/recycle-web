import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, onLogin as setAuthCredentials } from '../../store/auth';

// Sub-components
import LoginStatusModal from './components/LoginStatusModal';
import LoginRoleSelection from './components/LoginRoleSelection';
import LoginForm from './components/LoginForm';

const LoginView = ({ t }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginApi] = useLoginMutation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginStatus, setLoginStatus] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [step, setStep] = useState('select-role');
    const [selectedRole, setSelectedRole] = useState(null);
    const [isChangingState, setIsChangingState] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        { id: 0, image: '/src/assets/hero_nature_v2.png' },
        { id: 1, image: '/src/assets/hero_environment.jpg' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 10000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const bubbles = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 40 + 20}px`,
        animationDuration: `${Math.random() * 10 + 15}s`,
        animationDelay: `${Math.random() * 10}s`,
    })), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginStatus('loading');
        setStatusMessage('Verificando identidad...');

        try {
            const result = await loginApi({ email, password }).unwrap();

            // --- NUEVA VALIDACIÓN DE SEGURIDAD ---
            const userData = result.user || result;
            const dbRole = userData?.role?.toUpperCase();

            // Mapeo de UI Roles a DB Roles
            const roleMapping = {
                'admin': ['ADMIN'],
                'gestor': ['OFFICIAL'],
                'ecoheroe': ['USER', 'VOLUNTEER'] // Asumiendo estos roles para usuarios normales
            };

            const allowedRoles = roleMapping[selectedRole] || [];

            if (!allowedRoles.includes(dbRole)) {
                setLoginStatus('error');
                setStatusMessage(`Acceso no autorizado: Tu cuenta no tiene permisos para el portal de ${selectedRole}.`);
                return; // Detenemos el login aunque la contraseña sea correcta
            }
            // -------------------------------------

            await new Promise(resolve => setTimeout(resolve, 800));

            setLoginStatus('success');
            setStatusMessage('¡Bienvenido de nuevo!');

            setTimeout(() => {
                const token = result.access_token || result.token;
                dispatch(setAuthCredentials({ user: userData, token }));

                navigate(['ADMIN', 'OFFICIAL'].includes(dbRole) ? '/admin/dashboard' : '/');
            }, 2000);

        } catch (err) {
            setLoginStatus('error');
            const errorMsg = err.data?.message || 'Credenciales inválidas';
            setStatusMessage(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
            setTimeout(() => setLoginStatus(null), 3500);
        }
    };

    const handleRoleSelect = (roleId) => {
        setIsChangingState(true);
        setTimeout(() => {
            setSelectedRole(roleId);
            setStep('login-form');
            setIsChangingState(false);
        }, 500);
    };

    return (
        <div className="h-screen w-full bg-[#070707] relative overflow-hidden font-outfit selection:bg-[#018F64]/30">
            <LoginStatusModal loginStatus={loginStatus} statusMessage={statusMessage} selectedRole={selectedRole} setLoginStatus={setLoginStatus} />

            {/* --- BACKGROUND IMAGE (DESKTOP) --- */}
            <div className={`hidden md:block absolute top-0 w-1/2 h-full z-10 transition-all duration-1000 ease-[cubic-bezier(0.645,0.045,0.355,1)] overflow-hidden ${step === 'select-role' ? 'left-1/2' : 'left-0'}`}>
                {slides.map((slide, index) => (
                    <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}>
                        <img src={slide.image} alt="Background" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#070707]" />
                    </div>
                ))}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center select-none z-20">
                    <h2 className="text-5xl font-black text-white uppercase tracking-tight leading-none mb-4">RECYCLE<span className="text-[#018F64]">APP</span></h2>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.6em]">NOS PLANET 2026</p>
                </div>
            </div>

            {/* --- CONTENT CAPA --- */}
            <div className={`absolute top-0 w-full md:w-1/2 h-full z-20 flex flex-col items-center justify-center p-6 sm:p-10 transition-all duration-1000 ease-[cubic-bezier(0.645,0.045,0.355,1)] ${step === 'select-role' ? 'left-0' : 'md:left-1/2'}`}>
                <div className={`w-full max-w-lg transition-all duration-500 ${isChangingState ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
                    {step === 'select-role' ? (
                        <LoginRoleSelection onRoleSelect={handleRoleSelect} navigate={navigate} />
                    ) : (
                        <LoginForm
                            email={email} setEmail={setEmail}
                            password={password} setPassword={setPassword}
                            showPassword={showPassword} setShowPassword={setShowPassword}
                            selectedRole={selectedRole} loginStatus={loginStatus}
                            handleBackToSelect={() => { setIsChangingState(true); setTimeout(() => { setStep('select-role'); setIsChangingState(false); }, 500); }}
                            handleSubmit={handleSubmit}
                        />
                    )}
                </div>
            </div>

            {/* BACKGROUND BUBBLES */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                {bubbles.map((b) => (
                    <div key={b.id} className="absolute top-0 rounded-full bg-[#018F64] animate-float-up" style={{ left: b.left, width: b.width, height: b.width, animationDuration: b.animationDuration, animationDelay: b.animationDelay }} />
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float-up { 0% { transform: translateY(110vh) scale(0.5); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: translateY(-20vh) scale(1.2); opacity: 0; } }
                .animate-float-up { animation: float-up linear infinite; }
            `}} />
        </div>
    );
};

export default LoginView;
