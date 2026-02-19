import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Componente para proteger rutas privadas.
 * @param {Array} allowedRoles - Roles que tienen acceso a la ruta (opcional).
 */
export const PrivateRoute = ({ allowedRoles = [] }) => {
    const { status, user } = useSelector(state => state.auth);

    if (status === 'checking') return null; // O un loader premium

    // Si no está autenticado, mandarlo al login
    if (status === 'not-authenticated') {
        return <Navigate to="/auth/login" />;
    }

    // Si hay roles definidos, verificar si el usuario tiene permiso
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role?.toUpperCase())) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

/**
 * Componente para evitar que usuarios logueados vuelvan al login.
 */
export const PublicRoute = () => {
    const { status, user } = useSelector(state => state.auth);

    if (status === 'authenticated') {
        const dashboardRoles = ['ADMIN', 'OFFICIAL'];
        if (dashboardRoles.includes(user?.role?.toUpperCase())) {
            return <Navigate to="/admin/dashboard" />;
        }
        return <Navigate to="/" />;
    }

    return <Outlet />;
};
