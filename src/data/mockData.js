import {
    Leaf,
    Recycle,
    Users,
    MapPin
} from 'lucide-react';

import logoYape from '../assets/logo_yape_c.webp';
import logoBCP from '../assets/logo_bpc_c.webp';
import logoNosPlanet from '../assets/logo_nos_planet.webp';
import logoAgroMarket from '../assets/Logo_agromarket.png';

export const MOCK_STATS = (t) => [
    { label: t.admin.stats.activeUsers, value: '1,234', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: t.admin.stats.recycled, value: '5,678', icon: Recycle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: t.admin.stats.points, value: '89', icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { label: t.admin.stats.programs, value: '12', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
];

export const MOCK_PROGRAMS = (t) => [
    {
        id: 1,
        title: 'Reforesta Perú',
        organization: 'Ministerio del Ambiente',
        description: t.programs.items.p1_desc,
        image: 'https://images.unsplash.com/photo-1562077981-4d7eafd44932?auto=format&fit=crop&q=80&w=800',
        ecopoints: 150,
        participants: 1250,
        location: 'Lima, Perú',
        type: 'government', // Blue
        category: t.programs.categories.plastic,
        details: {
            about: 'Programa nacional de reforestación que busca recuperar áreas degradadas mediante la plantación de especies nativas. Cada participante contribuye directamente a la restauración de ecosistemas.',
            objectives: [
                'Plantar 50,000 árboles nativos en áreas deforestadas',
                'Capacitar a comunidades en técnicas de reforestación',
                'Monitorear el crecimiento y desarrollo de las plantaciones',
                'Crear conciencia sobre la importancia de los bosques'
            ],
            activities: [
                'Jornadas de plantación todos los sábados',
                'Talleres de educación ambiental',
                'Mantenimiento de áreas reforestadas',
                'Seguimiento fotográfico del progreso'
            ],
            contact: {
                email: 'reforesta@minam.gob.pe',
                phone: '+51 1 611 6000',
                web: 'www.minam.gob.pe/reforesta'
            }
        }
    },
    {
        id: 2,
        title: 'Limpieza de Playas',
        organization: 'Nos Planet SAC',
        description: t.programs.items.p2_desc,
        image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80&w=800',
        ecopoints: 100,
        participants: 850,
        location: 'Costa Verde',
        type: 'company', // Green #018F64
        category: t.programs.categories.glass,
        details: {
            about: 'Iniciativa comunitaria para la limpieza y conservación de nuestras playas. Únete a nosotros para mantener nuestros océanos libres de plástico y residuos.',
            objectives: [
                'Recolectar 1 tonelada de residuos plásticos',
                'Concientizar a los bañistas sobre la contaminación',
                'Clasificar y reciclar los residuos encontrados'
            ],
            activities: [
                'Limpieza matutina de playas',
                'Charla de seguridad y clasificación',
                'Pesaje y registro de residuos'
            ],
            contact: {
                email: 'limpieza@nosplanet.com',
                phone: '+51 999 888 777',
                web: 'www.nosplanet.com/playas'
            }
        }
    },
    {
        id: 3,
        title: 'Amazonía Verde',
        organization: 'WWF Perú',
        description: t.programs.items.p3_desc,
        image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800',
        ecopoints: 200,
        participants: 2100,
        location: 'Madre de Dios',
        type: 'ong', // Red
        category: t.programs.categories.ewaste,
        details: {
            about: 'Proyecto integral para la protección de la biodiversidad en la Amazonía. Trabajamos con comunidades locales para preservar nuestro patrimonio natural.',
            objectives: [
                'Proteger 100 hectáreas de bosque virgen',
                'Apoyar el desarrollo sostenible local',
                'Investigación de especies en peligro'
            ],
            activities: [
                'Patrullaje y vigilancia forestal',
                'Talleres de artesanía sostenible',
                'Expediciones de investigación'
            ],
            contact: {
                email: 'amazonia@wwf.peru.org',
                phone: '+51 1 222 3333',
                web: 'www.wwf.org.pe'
            }
        }
    },
];

export const MOCK_PARTNERS = (t) => [
    {
        id: 1,
        name: 'Nos Planét',
        category: 'Plataforma',
        logo: logoNosPlanet,
        bgHeader: 'bg-emerald-600',
        hex: '#018F64',
        textColor: 'text-emerald-600',
        stats: { prizes: 1, exchanges: 5234 },
        details: {
            desc: 'Beneficios exclusivos en la plataforma. Suscripciones y más.',
            about: 'Nuestra misión es democratizar el reciclaje y hacer que cada acción cuente. Trabajamos para crear una economía circular donde los residuos se conviertan en recursos.',
            commitment: 'Promovemos el reciclaje inclusivo y la tecnología sostenible en cada paso.'
        }
    },
    {
        id: 2,
        name: 'Yape',
        category: 'Fintech',
        logo: logoYape,
        bgHeader: 'bg-violet-600',
        hex: '#7c3aed',
        textColor: 'text-violet-600',
        stats: { prizes: 2, exchanges: 1245 },
        details: {
            desc: 'Beneficios en recargas y cashback directo. Canjea tus puntos por saldo.',
            about: 'Yape transforma la manera de pagar y ahora también la forma de recompensar tus acciones verdes.',
            commitment: 'Apoyamos la inclusión financiera y ambiental.'
        }
    },
    {
        id: 3,
        name: 'BCP',
        category: 'Banco',
        logo: logoBCP,
        bgHeader: 'bg-blue-800',
        hex: '#1e40af',
        textColor: 'text-blue-800',
        stats: { prizes: 2, exchanges: 856 },
        details: {
            desc: 'Descuentos exclusivos en servicios bancarios y bonos de apertura.',
            about: 'El banco líder comprometido con el desarrollo sostenible del país.',
            commitment: 'Inversiones responsables y apoyo a iniciativas de cambio climático.'
        }
    },
    {
        id: 4,
        name: 'AgroMarket',
        category: 'EcoTienda',
        logo: logoAgroMarket,
        bgHeader: 'bg-green-500',
        hex: '#10b981',
        textColor: 'text-green-500',
        stats: { prizes: 5, exchanges: 310 },
        details: {
            desc: 'Productos ecológicos con descuento especial por tus puntos de reciclaje.',
            about: 'Tu tienda favorita para productos zero-waste y amigables con el planeta.',
            commitment: 'Reducción de huella de carbono en logística y packaging.'
        }
    },
];

export const MOCK_REQUESTS = (t) => [
    { id: 101, user: 'Ana García', type: 'Recolección Domiciliaria', status: t.admin.status.pending, statusKey: 'pending', date: '2023-10-25' },
    { id: 102, user: 'Carlos Ruiz', type: 'Punto Limpio', status: t.admin.status.approved, statusKey: 'approved', date: '2023-10-24' },
    { id: 103, user: 'Empresa XYZ', type: 'Certificación Verde', status: t.admin.status.rejected, statusKey: 'rejected', date: '2023-10-23' },
    { id: 104, user: 'Lucía Méndez', type: 'Recolección Domiciliaria', status: t.admin.status.pending, statusKey: 'pending', date: '2023-10-25' },
];

export const INITIAL_REVIEWS = (t) => [
    { id: 1, name: 'Mariana Costa', text: '"Una plataforma increíble. He logrado reducir mis residuos al 50% y además gano recompensas por ello. ¡Totalmente recomendada!"', rating: 5, avatar: 10, likes: 24, liked: false, level: 'Eco-Guardián' },
    { id: 2, name: 'Juan Perez', text: '"Muy fácil de usar y el servicio de recolección es excelente."', rating: 4, avatar: 12, likes: 12, liked: false, level: 'Eco-Guardián' },
    { id: 3, name: 'Elena Gomez', text: '"Me encanta la iniciativa de GreenPrint para aprender más."', rating: 5, avatar: 15, likes: 45, liked: false, level: 'Eco-Guardián' },
];
