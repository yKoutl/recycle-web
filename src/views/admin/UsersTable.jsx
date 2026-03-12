import React, { useState } from 'react';
import { Search, RotateCw, User, Mail, Shield, Eye, Trash2, Power, Users, Filter } from 'lucide-react';
import { useGetUsersQuery } from '../../store/user/usersApi';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const UsersTable = ({ t, themeColor }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterRole, setFilterRole] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const accent = themeColor || '#018F64';

    const [isLoading, setIsLoading] = useState(false);
    const { data: users = [], isLoading: isLoadingUsers, error, refetch } = useGetUsersQuery();

    const handleRefresh = () => {
        setIsLoading(true);
        refetch(); // Llamada real si es persistente
        setTimeout(() => setIsLoading(false), 800);
    };

    const filteredUsers = (users || []).filter(u => {
        const matchesSearch = u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'ALL' || u.role === filterRole;
        const matchesStatus = filterStatus === 'ALL' || (filterStatus === 'ACTIVE' ? u.isActive : !u.isActive);
        return matchesSearch && matchesRole && matchesStatus;
    });

    const activeCount = filteredUsers.filter(u => u.isActive).length;

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte Detallado');

        // --- 1. CONFIGURACIÓN DE COLUMNAS ---
        worksheet.columns = [
            { header: 'Nombre Completo', key: 'name', width: 25 },
            { header: 'Correo Electrónico', key: 'email', width: 30 },
            { header: 'Teléfono', key: 'phone', width: 15 },
            { header: 'Total Kg', key: 'total_kg', width: 12 },
            { header: 'Puntos', key: 'points', width: 12 },
            { header: 'Plástico (Kg)', key: 'p_kg', width: 15 },
            { header: 'Plástico (Unid)', key: 'p_u', width: 15 },
            { header: 'Vidrio (Kg)', key: 'v_kg', width: 15 },
            { header: 'Vidrio (Unid)', key: 'v_u', width: 15 },
            { header: 'Metal (Kg)', key: 'm_kg', width: 15 },
            { header: 'Metal (Unid)', key: 'm_u', width: 15 },
            { header: 'Papel (Kg)', key: 'pa_kg', width: 15 },
            { header: 'Papel (Unid)', key: 'pa_u', width: 15 },
        ];

        // --- 2. TÍTULO Y LOGOTIPO TEXTUAL ---
        worksheet.mergeCells('A1:M2');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = 'NOS PLANÉT SAC - DASHBOARD DE GESTIÓN AMBIENTAL';
        titleCell.font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: 'FFFFFF' } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '31253B' } };

        // --- 3. SECCIÓN DE RESUMEN (KPIs) ---
        const totalKgGlobal = filteredUsers.reduce((sum, u) => sum + (u.recyclingStats?.total_kg || 0), 0);
        const totalPointsGlobal = filteredUsers.reduce((sum, u) => sum + (u.current_points || 0), 0);

        worksheet.mergeCells('A4:C4');
        worksheet.getCell('A4').value = `Reporte generado: ${new Date().toLocaleString()}`;
        worksheet.getCell('A4').font = { italic: true, size: 10 };

        // Cuadros de Resumen
        const summaryRow = worksheet.addRow([]); // Espacio
        const kpiRow = worksheet.addRow(['RESUMEN GENERAL', '', 'USUARIOS', filteredUsers.length, 'TOTAL KG', totalKgGlobal.toFixed(2), 'TOTAL PUNTOS', totalPointsGlobal]);

        kpiRow.eachCell((cell, colNumber) => {
            if (colNumber % 2 !== 0) { // Etiquetas
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E8F5F1' } };
                cell.font = { bold: true, color: { argb: '018F64' } };
            }
            cell.border = { outline: true, top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });

        worksheet.addRow([]); // Espacio antes de la tabla

        // --- 4. CABECERAS AGRUPADAS (Fila Superior de Categorías) ---
        // Unimos celdas para categorías de reciclaje
        const groupHeader = worksheet.addRow(['', '', '', '', '', 'PLÁSTICO', '', 'VIDRIO', '', 'METAL', '', 'PAPEL', '']);
        groupHeader.font = { bold: true, color: { argb: 'FFFFFF' } };
        groupHeader.alignment = { horizontal: 'center' };

        // Estilo para los grupos
        const groupColors = ['FF3B82F6', 'FF10B981', 'FFF59E0B', 'FFEF4444']; // Colores de tus categorías
        [6, 8, 10, 12].forEach((col, idx) => {
            worksheet.mergeCells(groupHeader.number, col, groupHeader.number, col + 1);
            const cell = worksheet.getCell(groupHeader.number, col);
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: groupColors[idx].replace('#', '') } };
        });

        // --- 5. CABECERA DE LA TABLA REAL ---
        const headerRow = worksheet.addRow([
            'Nombre', 'Email', 'Teléfono', 'Total Kg', 'Puntos',
            'Kg', 'Unid', 'Kg', 'Unid', 'Kg', 'Unid', 'Kg', 'Unid'
        ]);

        headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '018F64' } };
            cell.font = { color: { argb: 'FFFFFF' }, bold: true };
            cell.alignment = { horizontal: 'center' };
        });

        // --- 6. AGREGAR DATOS CON ESTILO ---
        filteredUsers.forEach((u, index) => {
            const row = worksheet.addRow([
                u.fullName,
                u.email,
                u.phone || '---',
                (u.recyclingStats?.total_kg || 0).toFixed(2),
                u.current_points || 0,
                u.recyclingStats?.by_category?.plastic?.kg || 0,
                u.recyclingStats?.by_category?.plastic?.units || 0,
                u.recyclingStats?.by_category?.glass?.kg || 0,
                u.recyclingStats?.by_category?.glass?.units || 0,
                u.recyclingStats?.by_category?.metal?.kg || 0,
                u.recyclingStats?.by_category?.metal?.units || 0,
                u.recyclingStats?.by_category?.paper?.kg || 0,
                u.recyclingStats?.by_category?.paper?.units || 0,
            ]);

            // Zebra Striping (Color intercalado)
            if (index % 2 === 0) {
                row.eachCell((cell) => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F9FAFB' } };
                });
            }

            // Bordes y Alineación
            row.eachCell((cell) => {
                cell.border = { top: { style: 'thin', color: { argb: 'E5E7EB' } }, bottom: { style: 'thin', color: { argb: 'E5E7EB' } } };
                cell.alignment = { vertical: 'middle' };
            });

            // Resaltar puntos altos
            if ((u.current_points || 0) > 1000) {
                row.getCell(5).font = { bold: true, color: { argb: 'B45309' } }; // Color ámbar
            }
        });

        // --- 7. FINALIZACIÓN Y DESCARGA ---
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `NosPlanet_Reporte_Pro_${new Date().getTime()}.xlsx`);
    };
    const exportToPDF = () => {
        const doc = new jsPDF();

        // Título del Reporte
        doc.setFontSize(18);
        doc.setTextColor(accent); // Usamos tu color verde corporativo
        doc.text('Nos Planét SAC - Reporte de Usuarios', 14, 22);

        // Fecha de generación
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 30);

        // Configuración de la tabla
        const tableColumn = ["Nombre", "Email", "Peso (kg)", "Unidades", "Puntos"];
        const tableRows = filteredUsers.map(u => [
            u.fullName,
            u.email,
            u.recyclingStats?.total_kg || 0,    // 🚨 Datos reales del nuevo esquema
            u.recyclingStats?.total_units || 0, // 🚨 Datos reales
            u.current_points || 0               // 🚨 Puntos acumulados
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 35,
            theme: 'grid',
            headStyles: { fillColor: accent },
        });

        doc.save(`Reporte_NosPlanet_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, boxShadow: `0 8px 20px ${accent}30` }}>
                        <Users size={22} strokeWidth={1.75} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            Gestión de Usuarios
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            Administra todos los usuarios registrados en la plataforma.
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Search & Filter Toggle ── */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} strokeWidth={1.75} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none transition-all text-gray-900 dark:text-white"
                        style={{
                            outline: 'none',
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = accent;
                            e.target.style.boxShadow = `0 0 0 4px ${accent}15`;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '';
                            e.target.style.boxShadow = '';
                        }}
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2.5 rounded-xl border transition-all ${showFilters ? 'bg-gray-100 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}
                    title="Filtros"
                >
                    <Filter size={15} strokeWidth={1.75} />
                </button>
                <button
                    onClick={handleRefresh}
                    className="p-2.5 text-gray-500 hover:text-gray-800 dark:hover:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl transition-all"
                    title="Actualizar"
                >
                    <RotateCw size={15} strokeWidth={1.75} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </div>
            <div className="flex items-center justify-between">

                {/* ── Animated Filter Panel ── */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0 m-0'}`}
                >
                    <div className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rol</label>
                            <div className="flex flex-wrap gap-2">
                                {['ALL', 'ADMIN', 'MANAGER', 'USER'].map(role => (
                                    <button
                                        key={role}
                                        onClick={() => setFilterRole(role)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filterRole === role ? 'text-white border-transparent' : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                        style={filterRole === role ? { backgroundColor: accent, boxShadow: `0 4px 12px ${accent}30` } : {}}
                                    >
                                        {role === 'ALL' ? 'Todos' : role === 'ADMIN' ? 'Admin' : role === 'MANAGER' ? 'Gestores' : 'Usuarios'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</label>
                            <div className="flex flex-wrap gap-2">
                                {['ALL', 'ACTIVE', 'INACTIVE'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filterStatus === status ? 'text-white border-transparent' : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                        style={filterStatus === status ? { backgroundColor: accent, boxShadow: `0 4px 12px ${accent}30` } : {}}
                                    >
                                        {status === 'ALL' ? 'Todos' : status === 'ACTIVE' ? 'Activos' : 'Inactivos'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Action bar ── */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={exportToExcel}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-green-600 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl transition-all text-xs font-bold"
                        >
                            Exportar Excel
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-white hover:bg-red-600 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl transition-all text-xs font-bold"
                        >
                            Exportar PDF
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {filteredUsers.length} total
                        </span>
                        <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-black/5 dark:border-white/5"
                            style={{ backgroundColor: `${accent}15`, color: accent }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                            {activeCount} activos
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Table / Mobile Cards ── */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-white/5" style={{ background: `linear-gradient(to right, ${accent}10, ${accent}05)` }}>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Usuario</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Rol</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-center">Estado</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                            {filteredUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50/70 dark:hover:bg-white/[0.025] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ring-4 ring-slate-50 dark:ring-white/5 shadow-md shadow-gray-200/50 dark:shadow-none"
                                                style={{ backgroundColor: accent }}
                                            >
                                                {(u.fullName?.[0] || 'U').toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">{u.fullName}</div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <Mail size={11} strokeWidth={1.75} />
                                                    {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${u.role === 'ADMIN' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-500/20' :
                                            u.role === 'MANAGER' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/20' :
                                                'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
                                            }`}>
                                            {u.role === 'ADMIN' ? 'ADMINISTRADOR' : u.role === 'MANAGER' ? 'GESTOR' : 'ECO-HÉROE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.recyclingStats?.total_kg || 0} kg / {u.recyclingStats?.total_units || 0} unid.
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                                                <Eye size={16} strokeWidth={1.75} />
                                            </button>
                                            <button className="p-2 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all">
                                                <Power size={16} strokeWidth={1.75} />
                                            </button>
                                            <button className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                                <Trash2 size={16} strokeWidth={1.75} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {filteredUsers.map((u) => (
                        <div key={u._id} className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
                                        style={{ backgroundColor: accent }}
                                    >
                                        {(u.fullName?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white text-base">{u.fullName}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                            <Mail size={11} />
                                            {u.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1.5">
                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${u.role === 'ADMIN' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-500/20' :
                                        u.role === 'OFFICIAL' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/20' :
                                            'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
                                        }`}>
                                        {u.role === 'ADMIN' ? 'ADMINISTRADOR' : u.role === 'OFFICIAL' ? 'GESTOR' : 'ECO-HÉROE'}
                                    </span>
                                    {u.isActive ? (
                                        <span
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border border-black/5 dark:border-white/5"
                                            style={{ backgroundColor: `${accent}15`, color: accent }}
                                        >
                                            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accent }} /> Activo
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 text-[9px] font-bold">
                                            <span className="w-1 h-1 rounded-full bg-gray-400" /> Inactivo
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50 dark:border-white/5">
                                <button className="flex-1 py-2 rounded-xl text-gray-500 hover:text-blue-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all">
                                    <Eye size={14} /> VER
                                </button>
                                <button className="flex-1 py-2 rounded-xl text-gray-500 hover:text-orange-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all">
                                    <Power size={14} /> ESTADO
                                </button>
                                <button className="flex-1 py-2 rounded-xl text-gray-500 hover:text-red-500 bg-gray-50 dark:bg-white/5 flex justify-center items-center gap-2 text-xs font-bold transition-all">
                                    <Trash2 size={14} /> BORRAR
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UsersTable;
