"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Building, 
  Users, 
  Activity, 
  Database, 
  TrendingUp, 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  Layers, 
  CheckCircle,
  FileText
} from "lucide-react";
import { useBranding, presets } from "../../context/BrandingContext";
import confetti from "canvas-confetti";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { config } = useBranding();

  // Local state for tenant lists (populated initially with presets)
  const [tenants, setTenants] = useState([
    { id: "t1", name: "Aeterna Default", domain: "memoriales.aeterna.app", plan: "Enterprise", status: "Activo", memorials: 1420, date: "2026-01-10" },
    { id: "t2", name: "Funeraria La Paz", domain: "memoriales.funerarialapaz.cl", plan: "Growth B2B", status: "Activo", memorials: 832, date: "2026-02-15" },
    { id: "t3", name: "Elysium Gardens", domain: "legado.elysiumgardens.com", plan: "Growth B2B", status: "Activo", memorials: 642, date: "2026-03-20" },
    { id: "t4", name: "Memorial Aurora", domain: "recuerdos.auroramemorial.mx", plan: "Essential B2B", status: "Activo", memorials: 211, date: "2026-04-05" },
  ]);

  const [logs, setLogs] = useState([
    { time: "14:24:02", type: "info", msg: "Tenant 'Funeraria La Paz' creó memorial 'Beatriz Mendoza'" },
    { time: "14:21:40", type: "success", msg: "Tenant 'Elysium Gardens' vinculó dominio 'legado.elysiumgardens.com'" },
    { time: "14:15:10", type: "info", msg: "Usuario 'marta@correo.com' subió audio conmemorativo a memorial 'Alejandro Valenzuela'" },
    { time: "14:05:22", type: "system", msg: "Sistema: Copia de seguridad programada de base de datos finalizada con éxito" },
    { time: "13:58:12", type: "warning", msg: "Intento fallido de login desde IP 192.168.1.120 (3 reintentos superados)" }
  ]);

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);

  const triggerBackup = () => {
    setIsBackingUp(true);
    setBackupSuccess(false);
    
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupSuccess(true);
      confetti({
        particleCount: 30,
        spread: 40,
        colors: [config.primaryColor, "#FAF7F2"]
      });
      
      const newLog = {
        time: new Date().toTimeString().split(" ")[0],
        type: "system",
        msg: "Super Admin: Copia de seguridad forzada realizada manualmente"
      };
      setLogs(prev => [newLog, ...prev]);

      setTimeout(() => setBackupSuccess(false), 3000);
    }, 1500);
  };

  const handleToggleStatus = (id: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === "Activo" ? "Suspendido" : "Activo";
        
        const newLog = {
          time: new Date().toTimeString().split(" ")[0],
          type: nextStatus === "Suspendido" ? "warning" : "success",
          msg: `Super Admin: Cambió estado de tenant '${t.name}' a ${nextStatus}`
        };
        setLogs(l => [newLog, ...l]);
        
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans smooth-transition text-xs">
      {/* Header Portal */}
      <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg tracking-wider font-semibold">
            AE<span className="text-[var(--tenant-primary)]">T</span>ERNA
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-purple-600/10 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 text-[9px] uppercase tracking-widest font-bold flex items-center gap-1">
            <Shield size={10} /> Super Admin
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-medium text-neutral-600 dark:text-neutral-300">
            Control de Plataforma Global
          </span>
          <button 
            onClick={() => router.push("/")}
            className="text-[10px] text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Grid Principal */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Navegación Super Admin */}
          <div className="glass-panel p-4 rounded-xl space-y-1">
            <div className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold px-3 py-2">
              Consola Central
            </div>
            <button className="w-full text-left px-3 py-2 rounded-lg bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)] font-semibold flex items-center gap-2">
              <Layers size={14} /> Panel de Control
            </button>
            <Link 
              href="/dashboard/funeraria"
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center gap-2 text-neutral-600 dark:text-neutral-400"
            >
              <Building size={14} /> Portal Funerarias
            </Link>
            <Link 
              href="/dashboard/familia"
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center gap-2 text-neutral-600 dark:text-neutral-400"
            >
              <Users size={14} /> Portal Familias
            </Link>
          </div>

          {/* Operaciones del Sistema */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h4 className="font-serif text-sm font-semibold mb-2 flex items-center gap-1.5"><Database size={14} /> Infraestructura</h4>
            <div className="space-y-3">
              <button 
                onClick={triggerBackup}
                disabled={isBackingUp}
                className="w-full py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 text-[9px] uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={10} className={isBackingUp ? "animate-spin" : ""} />
                {isBackingUp ? "Respaldando..." : "Respaldar DB Prisma"}
              </button>
              {backupSuccess && (
                <span className="text-[9px] text-green-500 font-semibold text-center block">
                  ✔ Copia de seguridad guardada en S3/R2
                </span>
              )}

              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3 space-y-2 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Servidor API:</span>
                  <span className="text-green-500 font-bold">Online (99.98%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Uso de CPU:</span>
                  <span className="text-neutral-700 dark:text-neutral-300 font-mono">14.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Latencia DB:</span>
                  <span className="text-neutral-700 dark:text-neutral-300 font-mono">4.8ms</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Panel Central */}
        <main className="lg:col-span-3 space-y-8">
          {/* Métricas Globales */}
          <section className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold block mb-1">M.R.R. Global</span>
              <span className="text-xl font-bold font-serif text-neutral-800 dark:text-neutral-100 flex items-center gap-1">
                $32,450 <TrendingUp size={14} className="text-green-500" />
              </span>
              <span className="text-[8px] text-neutral-400 mt-1 block">+12% este mes</span>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold block mb-1">Funerarias SaaS</span>
              <span className="text-xl font-bold font-serif text-neutral-800 dark:text-neutral-100">
                {tenants.length} Registradas
              </span>
              <span className="text-[8px] text-neutral-400 mt-1 block">100% marca blanca activa</span>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold block mb-1">Memoriales Totales</span>
              <span className="text-xl font-bold font-serif text-neutral-800 dark:text-neutral-100">
                {tenants.reduce((acc, curr) => acc + curr.memorials, 0)} Activos
              </span>
              <span className="text-[8px] text-neutral-400 mt-1 block">Custodia perpetua activa</span>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold block mb-1">Tasa de Churn</span>
              <span className="text-xl font-bold font-serif text-neutral-800 dark:text-neutral-100">
                0.8%
              </span>
              <span className="text-[8px] text-green-500 mt-1 block font-bold">Excelente retención</span>
            </div>
          </section>

          {/* Directorio de Funerarias */}
          <section className="glass-panel p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
              <Building size={18} className="text-[var(--tenant-primary)]" />
              Directorio de Clientes B2B SaaS
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                    <th className="pb-3 font-semibold">Funeraria</th>
                    <th className="pb-3 font-semibold">Dominio White Label</th>
                    <th className="pb-3 font-semibold">Plan SaaS</th>
                    <th className="pb-3 font-semibold">Memoriales</th>
                    <th className="pb-3 font-semibold">Estado</th>
                    <th className="pb-3 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/80">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="py-3.5 font-bold text-neutral-800 dark:text-neutral-100">{t.name}</td>
                      <td className="py-3.5 font-mono text-[10px] text-neutral-500">{t.domain}</td>
                      <td className="py-3.5 font-medium text-neutral-600 dark:text-neutral-400">{t.plan}</td>
                      <td className="py-3.5 font-mono">{t.memorials}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${t.status === "Activo" ? "bg-emerald-800/10 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-2.5">
                        <button 
                          onClick={() => handleToggleStatus(t.id)}
                          className={`text-[10px] font-semibold hover:underline ${t.status === "Activo" ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"}`}
                        >
                          {t.status === "Activo" ? "Suspender" : "Reactivar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Historial de Auditoría / Logs en Tiempo Real */}
          <section className="glass-panel p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              <Activity size={18} className="text-[var(--tenant-primary)]" />
              Logs de Auditoría y Seguridad
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Monitoreo en tiempo real de actividades críticas en la infraestructura SaaS y acciones de White Label realizadas por los administradores de funerarias.
            </p>

            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-[10px] space-y-2.5 max-h-[220px] overflow-y-auto pr-2 shadow-inner">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-3 leading-relaxed border-b border-neutral-100 dark:border-neutral-800/60 pb-2 last:border-0 last:pb-0">
                  <span className="text-neutral-400 shrink-0">[{log.time}]</span>
                  <span className={`px-1.5 py-0.2 rounded text-[8px] uppercase tracking-wider font-bold shrink-0 ${
                    log.type === "success" 
                      ? "bg-emerald-800/10 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                      : log.type === "warning"
                        ? "bg-amber-600/10 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                        : log.type === "system"
                          ? "bg-purple-600/10 text-purple-700 dark:bg-purple-955/20 dark:text-purple-400"
                          : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-neutral-700 dark:text-neutral-300">{log.msg}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
