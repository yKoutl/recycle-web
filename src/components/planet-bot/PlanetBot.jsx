import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { X, Send, Leaf, Info } from 'lucide-react';
import botImage from '../../assets/bot_nos_planet_v1.webp';
import SuggestedQuestions, { QUESTIONS_DATA } from './SuggestedQuestions';
import TermsModal from './TermsModal';

const ECO_TIPS = [
    "💡 ¿Sabías que? Una botella de plástico tarda 500 años en degradarse.",
    "🌿 ¡Reciclar 1 tonelada de papel salva 17 árboles!",
    "🧴 Recuerda lavar y aplastar tus botellas antes de reciclarlas.",
    "🔋 Las pilas nunca van a la basura común, ¡son tóxicas!",
    "🔄 La economía circular ayuda a reducir residuos.",
    "🌍 Pequeñas acciones generan grandes cambios.",
    "🛢️ El aceite usado se puede convertir en biodiesel."
];

const PlanetBot = ({ currentView }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "¡Hola! Soy Planet Bot 🌿. Estoy aquí para ayudarte a reciclar mejor. Selecciona una pregunta de arriba o escribe la tuya.",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isLoading]);

    // Lógica para notificaciones periódicas
    useEffect(() => {
        // En Admin, forzamos que no haya frases/notificaciones
        if (currentView === 'admin') {
            setNotification(null);
            return;
        }

        // Notificación especial para Login
        if (currentView === 'login') {
            setNotification("🔒 Esta área es exclusiva para administradores y funcionarios de Nos Planet SAC.");
            return;
        }

        // Intervalo para mostrar notificaciones cada 12 segundos si el chat está cerrado
        const intervalId = setInterval(() => {
            if (!isOpen && !notification && currentView === 'landing') {
                const randomTip = ECO_TIPS[Math.floor(Math.random() * ECO_TIPS.length)];
                setNotification(randomTip);

                // Ocultar la notificación automáticamente después de 6 segundos
                setTimeout(() => {
                    setNotification(null);
                }, 6000);
            }
        }, 12000); // 12000 ms = 12 segundos

        return () => clearInterval(intervalId);
    }, [isOpen, notification, currentView]);


    const handleSendMessage = async (textOrObj) => {
        let messageText = '';
        let predefinedAnswer = null;

        if (typeof textOrObj === 'object' && textOrObj.question) {
            messageText = textOrObj.question;
            predefinedAnswer = textOrObj.answer;
        } else {
            messageText = textOrObj || input;
        }

        if (!messageText.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: messageText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        if (predefinedAnswer) {
            setTimeout(() => {
                const botMessage = {
                    id: Date.now() + 1,
                    text: predefinedAnswer,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
                setIsLoading(false);
            }, 600);
            return;
        }

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
                throw new Error('API Key no configurada');
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const chat = model.startChat({
                history: messages.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }],
                })).filter((_, index) => index > 0),
            });

            const systemPrompt = `
                Eres Planet Bot, el asistente virtual oficial de NOS PLANET SAC.
                CONTEXTO DE LA EMPRESA:
                - NOS PLANET SAC es una empresa peruana líder en gestión integral de residuos y sostenibilidad.
                - Misión: Promover la economía circular y educar sobre reciclaje.
                - Servicios: Gestión de residuos, puntos de acopio, educación ambiental y consultoría.
                
                TU ROL:
                - Responder dudas sobre reciclaje (colores de tachos: Verde=Aprovechable, Negro=No Aprovechable, Marrón=Orgánico, Rojo=Peligroso).
                - Ser amable, motivador y usar emojis relacionados con la naturaleza.
                - Si te preguntan algo fuera de reciclaje/medio ambiente, redirige el tema cortésmente hacia tu función principal.
                - Respuestas cortas y directas (max 3 oraciones si es posible).
            `;

            const result = await model.generateContent([systemPrompt, ...messages.map(m => `${m.sender}: ${m.text}`), `user: ${messageText}`]);
            const response = await result.response;
            const text = response.text();

            const botMessage = {
                id: Date.now() + 1,
                text: text,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            let errorMessage = "Lo siento, tuve un problema al procesar tu mensaje.";

            if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('limit')) {
                errorMessage = "Lo siento, estamos en actualización o reconstrucción 🛠️. Por favor intenta más tarde.";
            } else if (error.message.includes('API Key')) {
                errorMessage = "⚠️ Error de configuración de sistema.";
            }

            const errorMsg = {
                id: Date.now() + 1,
                text: errorMessage,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {showTerms && <TermsModal type="bot" onClose={() => setShowTerms(false)} />}

            <div className={`fixed z-50 flex flex-col pointer-events-none transition-all duration-500 
                ${currentView === 'admin'
                    ? 'right-6 top-1/2 -translate-y-1/2 items-end'
                    : 'bottom-4 right-4 sm:bottom-6 sm:right-6 items-end'}`}>

                {/* Notificación (Burbuja Flotante) - Estilo Llamativo (Balanceado) */}
                {!isOpen && notification && (
                    <div className="mb-4 mr-2 max-w-xs animate-fade-in origin-bottom-right z-50">
                        <div className={`
                            ${currentView === 'login'
                                ? 'bg-red-500 text-white border-red-400 animate-bounce-soft shadow-red-500/20'
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-green-200 dark:border-green-700 shadow-[0_8px_16px_rgba(0,0,0,0.1)]'}
                            p-3.5 rounded-2xl rounded-tr-none 
                            border
                            relative
                            transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                        `}>
                            <div className="flex gap-2.5 items-start">
                                <div className={`${currentView === 'login' ? 'bg-white/20' : 'bg-green-100 dark:bg-green-900/40'} p-1 rounded-full shrink-0`}>
                                    <span className="text-base">{currentView === 'login' ? '⚠️' : '💡'}</span>
                                </div>
                                <p className="text-sm font-black leading-snug pt-0.5" style={{ textWrap: 'balance' }}>
                                    {notification}
                                </p>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setNotification(null);
                                }}
                                className={`pointer-events-auto absolute -top-3 -right-3 w-8 h-8 ${currentView === 'login' ? 'bg-white text-red-500' : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-300'} rounded-full flex items-center justify-center shadow-lg border border-gray-100 dark:border-gray-700 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-all active:scale-90 group/close z-[60]`}
                                aria-label="Cerrar notificación"
                            >
                                <X size={16} className="group-hover/close:rotate-90 transition-transform" />
                            </button>

                            {/* Triángulo speech bubble */}
                            <div className={`absolute -bottom-1.5 right-5 w-3 h-3 ${currentView === 'login' ? 'bg-red-500 border-red-400' : 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-700'} rotate-45 border-b border-r`}></div>
                        </div>
                    </div>
                )}

                {/* Ventana del Chat */}
                <div
                    className={`
            pointer-events-auto
            mb-4 w-[90vw] sm:w-[380px] max-h-[85vh]
            bg-white dark:bg-gray-900 
            rounded-2xl shadow-2xl 
            border border-green-100 dark:border-green-900
            overflow-hidden flex flex-col
            transition-all duration-300 origin-bottom-right
            ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none h-0 mb-0'}
            `}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 text-white flex items-center justify-between shadow-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center overflow-hidden">
                                    <img src={botImage} alt="Planet Bot" className="w-full h-full object-cover" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-green-600 rounded-full animate-pulse"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight tracking-wide">Planet Bot</h3>
                                <p className="text-[11px] text-green-50 font-medium flex items-center gap-1 opacity-90">
                                    <Leaf size={10} /> Asistente Planetario
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setShowTerms(true)}
                                className="p-1.5 hover:bg-white/20 rounded-full transition-colors active:scale-95 text-white/90 hover:text-white"
                                title="Políticas de Uso"
                            >
                                <Info size={18} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/20 rounded-full transition-colors active:scale-95"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Suggested Questions (Pinned at Top) */}
                    <SuggestedQuestions onSelectQuestion={handleSendMessage} disabled={isLoading} />

                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 dark:bg-gray-950/30 scroll-smooth custom-scrollbar">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`
                    max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed
                    ${msg.sender === 'user'
                                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white rounded-tr-none'
                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-none'}
                    `}
                                >
                                    {msg.text}
                                    <div className={`text-[10px] mt-1.5 opacity-70 flex justify-end ${msg.sender === 'user' ? 'text-green-50' : 'text-gray-400'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full border border-transparent mx-1 focus-within:border-green-500/50 focus-within:shadow-[0_0_0_2px_rgba(34,197,94,0.1)] transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu mensaje..."
                                className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-800 dark:text-gray-100 outline-none placeholder:text-gray-400"
                                disabled={isLoading}
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={isLoading || !input.trim()}
                                className={`
                    p-2.5 rounded-full transition-all duration-200 flex-shrink-0
                    ${input.trim()
                                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-md transform hover:scale-105 active:scale-95'
                                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
                `}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Botón Flotante */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="pointer-events-auto group relative flex items-center justify-center outline-none"
                >
                    <div className={`absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 duration-1000 group-hover:duration-700 
                        ${(isOpen || currentView === 'admin') ? 'hidden' : 'block'}`}></div>
                    <div className={`
            w-14 h-14 sm:w-16 sm:h-16 rounded-full 
            ${currentView === 'admin' ? '' : 'shadow-[0_8px_30px_rgba(0,0,0,0.12)]'}
            flex items-center justify-center transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) cursor-pointer
            bg-gradient-to-tr from-green-500 to-emerald-600 text-white border-4 border-white dark:border-gray-800 z-10
            ${isOpen ? 'rotate-90 scale-90 bg-gray-700' : 'hover:scale-110 hover:-translate-y-1'}
            `}>
                        {isOpen ? (
                            <X size={28} strokeWidth={2.5} />
                        ) : (
                            <div className="w-full h-full relative flex items-center justify-center rounded-full overflow-hidden bg-white">
                                <img
                                    src={botImage}
                                    alt="Chat"
                                    className="w-full h-full object-cover"
                                />
                                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm z-20"></span>
                            </div>
                        )}
                    </div>
                </button>
            </div>
        </>
    );
};

export default PlanetBot;
