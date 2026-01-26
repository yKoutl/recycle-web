import {
    Leaf,
    Recycle,
    Users,
    MapPin
} from 'lucide-react';

export const MOCK_STATS = (t) => [
    { label: t.admin.stats.activeUsers, value: '1,234', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: t.admin.stats.recycled, value: '5,678', icon: Recycle, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: t.admin.stats.points, value: '89', icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    { label: t.admin.stats.programs, value: '12', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
];

export const MOCK_PROGRAMS = (t) => [
    {
        id: 1,
        title: t.programs.items.p1_title,
        description: t.programs.items.p1_desc,
        image: 'https://images.unsplash.com/photo-1562077981-4d7eafd44932?auto=format&fit=crop&q=80&w=800',
        points: 50,
        category: t.programs.categories.plastic
    },
    {
        id: 2,
        title: t.programs.items.p2_title,
        description: t.programs.items.p2_desc,
        image: 'https://images.unsplash.com/photo-1533626904905-cc52fd99285e?auto=format&fit=crop&q=80&w=800',
        points: 30,
        category: t.programs.categories.glass
    },
    {
        id: 3,
        title: t.programs.items.p3_title,
        description: t.programs.items.p3_desc,
        image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800',
        points: 100,
        category: t.programs.categories.ewaste
    },
];

export const MOCK_PARTNERS = (t) => [
    {
        id: 1,
        name: 'Nos Planét',
        category: 'Plataforma',
        logo: 'NP', // Using text for now as placeholder, or icon
        bgHeader: 'bg-emerald-600',
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
        logo: 'YP',
        bgHeader: 'bg-violet-600',
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
        logo: 'BCP',
        bgHeader: 'bg-blue-800',
        stats: { prizes: 2, exchanges: 856 },
        details: {
            desc: 'Descuentos exclusivos en servicios bancarios y bonos de apertura.',
            about: 'El banco líder comprometido con el desarrollo sostenible del país.',
            commitment: 'Inversiones responsables y apoyo a iniciativas de cambio climático.'
        }
    },
    {
        id: 4,
        name: 'EcoTienda',
        category: 'Marketplace',
        logo: 'ET',
        bgHeader: 'bg-green-500',
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
    { id: 1, name: 'Mariana Costa', text: '"Una plataforma increíble. He logrado reducir mis residuos al 50% y además gano recompensas por ello. ¡Totalmente recomendada!"', rating: 5, avatar: 10, likes: 24, liked: false },
    { id: 2, name: 'Juan Perez', text: '"Muy fácil de usar y el servicio de recolección es excelente."', rating: 4, avatar: 12, likes: 12, liked: false },
    { id: 3, name: 'Elena Gomez', text: '"Me encanta la iniciativa de GreenPrint para aprender más."', rating: 5, avatar: 15, likes: 45, liked: false },
];
