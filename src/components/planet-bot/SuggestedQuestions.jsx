import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const QUESTIONS_DATA = [
    { question: "¿Qué materiales se pueden reciclar? ♻️", answer: "En general puedes reciclar: Plásticos (PET, HDPE), Papel y Cartón (limpios), Vidrio, y Metales (aluminio, conservas). Recuerda que deben estar limpios y secos." },
    { question: "¿Cómo reciclar botellas de plástico? 🧴", answer: "1. Vacía el líquido. 2. Enjuaga ligeramente (ahorra agua). 3. Aplasta la botella para reducir volumen. 4. Tapa y deposita en el contenedor correcto." },
    { question: "¿Qué hago con el aceite usado? 🛢️", answer: "Nunca lo tires por el desagüe. Déjalo enfriar, guárdalo en una botella de plástico cerrada y llévalo a un punto de acopio autorizado de Nos Planet." },
    { question: "¿Cómo separar mis residuos? 🗑️", answer: "Usa 4 tachos básicos: Verde (Aprovechables: papel, plástico, vidrio, metal), Marrón (Orgánicos: cáscaras, restos de fruta), Negro (No aprovechables: servilletas sucias, cartón con grasa), Rojo (Peligrosos: pilas, mascarillas)." },
    { question: "¿Dónde reciclar pilas? 🔋", answer: "Las pilas son residuos peligrosos. No las tires a la basura común. Júntalas en una botella plástica y busca nuestros contenedores especiales para pilas." },
    { question: "¿Qué es la economía circular? 🔄", answer: "Es un modelo donde reducimos, reusamos y reciclamos materiales e insumos todas las veces posibles para crear un valor añadido y disminuir los residuos al mínimo." },
    { question: "¿Qué hace NOS PLANET SAC? 🌿", answer: "Somos una empresa dedicada a la gestión integral de residuos sólidos, promoviendo la sostenibilidad y el cuidado del medio ambiente a través de soluciones de reciclaje innovadoras." }
];

const SuggestedQuestions = ({ onSelectQuestion, disabled }) => {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 200;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="w-full bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 p-2 relative group">

            {/* Left Arrow */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 p-1 rounded-full shadow-md border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                disabled={disabled}
            >
                <ChevronLeft size={16} className="text-green-600 dark:text-green-400" />
            </button>

            {/* Right Arrow */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 p-1 rounded-full shadow-md border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                disabled={disabled}
            >
                <ChevronRight size={16} className="text-green-600 dark:text-green-400" />
            </button>

            <div
                ref={scrollContainerRef}
                className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x px-6"
            >
                {QUESTIONS_DATA.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelectQuestion(item)}
                        disabled={disabled}
                        className="
              snap-start
              whitespace-nowrap flex-shrink-0
              px-3 py-1.5 
              bg-white dark:bg-gray-800 
              border border-green-200 dark:border-green-800 
              rounded-full 
              text-xs font-medium text-green-700 dark:text-green-300 
              hover:bg-green-50 dark:hover:bg-green-900/30 
              active:scale-95 transition-all duration-200 
              shadow-sm hover:shadow-md
            "
                    >
                        {item.question}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SuggestedQuestions;
