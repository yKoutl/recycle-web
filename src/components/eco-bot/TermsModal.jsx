import React, { useEffect, useState, useRef } from 'react';
import { X, FileText, Download, Shield, Cookie, Scale, Bot, CheckCircle, Loader } from 'lucide-react';
import logo from '../../assets/Logo Nos Planet.png';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TermsModal = ({ onClose, type = 'web' }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const contentRef = useRef(null);
    const isBot = type === 'bot';

    // CONFIGURACIÓN DE CONTENIDO
    const config = isBot ? {
        titleHeader: "TÉRMINOS DE SERVICIO ECOBOT",
        subHeader: "ASISTENTE VIRTUAL - NOS PLANET SAC",
        fileName: "Terminos_EcoBot_NosPlanet.pdf",
        docCode: "DOC-BOT-2026",
        intro: "Este documento establece las condiciones de uso del asistente virtual EcoBot. Al interactuar con el bot, usted acepta estas condiciones.",
        sections: [
            { title: "1. PROPÓSITO DEL ASISTENTE", icon: Bot, body: "EcoBot es una herramienta educativa e informativa diseñada para orientar sobre prácticas de reciclaje y gestión de residuos. No reemplaza el asesoramiento técnico profesional en situaciones de riesgo." },
            { title: "2. INTERACCIÓN Y USO", icon: CheckCircle, body: "El usuario se compromete a realizar consultas respetuosas. Nos Planet SAC se reserva el derecho de limitar el acceso al bot ante usos abusivos o spam." },
            { title: "3. LIMITACIÓN DE IA", icon: Scale, body: "Las respuestas son generadas por Inteligencia Artificial y pueden contener imprecisiones. Verifique siempre la información crítica con normativas locales vigentes." },
            { title: "4. PRIVACIDAD EN CHAT", icon: Shield, body: "Las conversaciones pueden ser procesadas para mejorar la calidad del servicio. No comparta información personal sensible (DNI, tarjetas, etc.) a través del chat." }
        ]
    } : {
        titleHeader: "TÉRMINOS Y POLÍTICAS WEB",
        subHeader: "SITIO WEB OFICIAL - NOS PLANET SAC",
        fileName: "Legal_Web_NosPlanet.pdf",
        docCode: "DOC-WEB-2026",
        intro: "Bienvenido a la plataforma digital de Nos Planet SAC. A continuación se detallan los términos legales que rigen el uso de este sitio web.",
        sections: [
            { title: "1. TÉRMINOS GENERALES", icon: Scale, body: "El acceso a este sitio web implica la aceptación plena de estas condiciones. El contenido es propiedad intelectual de Nos Planet SAC y está protegido por ley." },
            { title: "2. POLÍTICA DE PRIVACIDAD", icon: Shield, body: "Nos comprometemos a proteger sus datos personales conforme a la Ley de Protección de Datos Personales. Su información de contacto solo se usa para fines autorizados." },
            { title: "3. USO DE COOKIES", icon: Cookie, body: "Este sitio utiliza cookies técnicas y analíticas para optimizar la experiencia de navegación. Al continuar navegando, usted acepta nuestra política de cookies." },
            { title: "4. PROPIEDAD INTELECTUAL", icon: FileText, body: "Queda prohibida la reproducción total o parcial de logos, textos, imágenes y software de este sitio sin autorización expresa y por escrito." }
        ]
    };

    const handleDownload = async () => {
        if (!contentRef.current) return;
        
        try {
            setIsGenerating(true);
            const element = contentRef.current;
            
            // Capturar el elemento visual exacto
            const canvas = await html2canvas(element, {
                scale: 2, // Mejor calidad
                useCORS: true, // Permitir imágenes externas si las hubiera
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            
            // Configurar PDF A4
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Calcular dimensiones para ajustar al ancho del PDF
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / imgHeight;
            const widthInPdf = pdfWidth; 
            const heightInPdf = widthInPdf / ratio;

            // Agregar imagen al PDF
            pdf.addImage(imgData, 'PNG', 0, 0, widthInPdf, heightInPdf);
            
            // Guardar
            pdf.save(config.fileName);
            
        } catch (error) {
            console.error("Error generando PDF:", error);
            alert("Hubo un error al generar el documento. Por favor intente nuevamente.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in printable-modal">
            <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
                
                {/* --- HEADER --- */}
                <div className="bg-gray-900 text-white p-3.5 flex items-center justify-between shadow-lg z-10 w-full">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                            <FileText size={20} className="text-gray-300" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-gray-100 tracking-wide">{config.fileName}</h3>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                <span className={`w-2 h-2 rounded-full ${isBot ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                <span>{isBot ? 'Documentación EcoBot' : 'Legal Sitio Web'}</span>
                                <span className="text-gray-600">•</span>
                                <span>Vista Previa</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className={`
                                bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-semibold tracking-wide 
                                transition-all shadow-lg hover:shadow-green-500/25 flex items-center gap-2 active:scale-95
                                ${isGenerating ? 'opacity-70 cursor-wait' : ''}
                            `}
                        >
                            {isGenerating ? <Loader size={16} className="animate-spin" /> : <Download size={16} />}
                            {isGenerating ? 'GENERANDO...' : 'DESCARGAR PDF'}
                        </button>
                        <div className="h-8 w-px bg-gray-700 mx-2"></div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                        >
                            <X size={22} />
                        </button>
                    </div>
                </div>

                {/* --- CONTENIDO VISUAL (REF para Capture) --- */}
                <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-black/50 p-6 sm:p-10 flex justify-center custom-scrollbar">
                    
                    {/* Elemento a capturar */}
                    <div ref={contentRef} className="bg-white w-full max-w-[21cm] min-h-[29.7cm] shadow-xl p-12 sm:p-16 relative text-gray-800 scale-on-capture origin-top">
                        
                        {/* Marca de Agua Background */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 opacity-[0.04] pointer-events-none grayscale">
                            <img src={logo} alt="" className="w-full" />
                        </div>

                        {/* Encabezado Documento */}
                        <div className="flex justify-between items-end border-b-2 border-green-600 pb-6 mb-10">
                            <img src={logo} alt="Nos Planet Logo" className="w-40 object-contain" />
                            <div className="text-right">
                                <h1 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">{config.titleHeader}</h1>
                                <p className="text-green-700 font-bold text-xs uppercase tracking-widest mt-1">{config.subHeader}</p>
                                <p className="text-gray-400 text-[10px] font-mono mt-2">REF: {config.docCode}</p>
                            </div>
                        </div>

                        {/* Introducción */}
                        <div className="mb-10 p-5 bg-gray-50 border-l-4 border-gray-300 text-sm text-gray-600 italic leading-relaxed text-justify">
                            {config.intro}
                        </div>

                        {/* Secciones Dinámicas */}
                        <div className="space-y-8">
                            {config.sections.map((section, index) => (
                                <section key={index}>
                                    <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-100">
                                        <div className="bg-green-50 p-1.5 rounded text-green-700">
                                            <section.icon size={18} />
                                        </div>
                                        <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">{section.title}</h2>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-7 text-justify pl-1">
                                        {section.body}
                                    </p>
                                </section>
                            ))}
                        </div>

                        {/* Pie de Página Documento */}
                        <div className="mt-24 pt-8 border-t border-gray-200 flex flex-col items-center text-center">
                            <div className="w-full flex justify-center mb-6">
                                <div className="border-2 border-dashed border-gray-300 w-56 h-20 flex items-center justify-center relative rounded-sm">
                                    <span className="absolute -top-2.5 bg-white px-2 text-[10px] text-gray-400 font-bold tracking-widest">SELLO DIGITAL</span>
                                    <img src={logo} alt="" className="h-10 opacity-30 grayscale" />
                                </div>
                            </div>
                            <p className="text-xs font-bold text-gray-800 tracking-wide">NOS PLANET SAC</p>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Av. Los Álamos 123, Lima, Perú</p>
                            <p className="text-[10px] text-green-600/70 mt-4 font-mono">
                                DOCUMENTO GENERADO AUTOMÁTICAMENTE | {new Date().getFullYear()}
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default TermsModal;
