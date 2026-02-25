import { UserPlus, Award, Rocket } from 'lucide-react';

export const getDonationTiers = () => [
    {
        id: 'starter',
        icon: UserPlus,
        key: 'starter',
        color: 'from-[#052E16] via-[#064E3B] to-[#065F46]',
        darkColor: 'dark:from-[#020617] dark:via-[#052E16] dark:to-[#064E3B]',
        textColor: 'text-white',
        btnColor: 'bg-emerald-600 text-white',
        glow: 'shadow-emerald-900/40',
        benefits: [
            'Acceso al canal exclusivo de Eco-Socios',
            'Insignia digital básica en tu perfil',
            'Reporte mensual de impacto educativo'
        ]
    },
    {
        id: 'growth',
        icon: Award,
        key: 'growth',
        color: 'from-[#042F2E] to-[#0D9488]',
        darkColor: 'dark:from-[#020617] dark:to-[#134E4A]',
        textColor: 'text-white',
        btnColor: 'bg-teal-500 text-white',
        glow: 'shadow-teal-500/10',
        benefits: [
            'Todos los beneficios de Eco-Socio',
            'Prioridad en eventos de limpieza masiva',
            'Descuentos exclusivos en marcas eco-aliadas',
            'Mención especial en el muro de impacto'
        ]
    },
    {
        id: 'hero',
        icon: Rocket,
        key: 'hero',
        color: 'from-[#1E1B4B] via-[#4338CA] to-[#701A75]',
        darkColor: 'dark:from-[#020617] dark:via-[#1E1B4B] dark:to-[#4C1D95]',
        textColor: 'text-white',
        btnColor: 'bg-indigo-600 text-white',
        glow: 'shadow-indigo-500/40',
        benefits: [
            'Todos los beneficios de Eco-Embajador',
            'Mesa de co-creación tecnológica trimestral',
            'Kit físico de bienvenida (Eco-Box)',
            'Insignia de Visionario de Oro'
        ]
    }
];
