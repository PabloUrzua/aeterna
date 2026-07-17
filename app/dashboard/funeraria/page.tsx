"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Building, 
  Users, 
  Settings, 
  FileText, 
  QrCode, 
  Plus, 
  Palette, 
  TrendingUp, 
  ShieldAlert, 
  ExternalLink,
  Laptop,
  CheckCircle,
  Undo
} from "lucide-react";
import { useBranding, presets } from "../../context/BrandingContext";
import confetti from "canvas-confetti";

export default function FunerariaDashboard() {
  const router = useRouter();
  const { config, updateConfig, applyPreset, resetConfig, activePreset } = useBranding();
  
  // Estados locales
  const [createdMemorials, setCreatedMemorials] = useState([
    { id: "m101", name: "Alejandro Valenzuela", dates: "1948 - 2026", status: "Activo", visits: 342, qrCode: "Descargado" },
    { id: "m102", name: "Beatriz Mendoza", dates: "1955 - 2026", status: "Configurando", visits: 12, qrCode: "Pendiente" },
    { id: "m103", name: "Carlos Fuentes", dates: "1939 - 2026", status: "Activo", visits: 128, qrCode: "Impreso" }
  ]);

  const [branches, setBranches] = useState([
    { id: "b1", name: "Sucursal Centro", city: "Santiago", address: "Av. Providencia 1024" },
    { id: "b2", name: "Sucursal Valparaíso", city: "Valparaíso", address: "Condell 450" }
  ]);

  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchCity, setNewBranchCity] = useState("");
  const [newBranchAddress, setNewBranchAddress] = useState("");
  const [dnsStatus, setDnsStatus] = useState<"pending" | "checking" | "verified">("verified");

  // Formulario creación
  const [newName, setNewName] = useState("");
  const [newBirth, setNewBirth] = useState("");
  const [newDeath, setNewDeath] = useState("");
  const [newFamilyEmail, setNewFamilyEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Plantilla de Email (Magic Link)
  const [emailSubject, setEmailSubject] = useState("Acceso a tu Memorial Digital - Aeterna Legacy");
  const [emailGreeting, setEmailGreeting] = useState("Estimada familia Valenzuela,");
  const [emailBody, setEmailBody] = useState("Le enviamos este enlace mágico privado para que puedan administrar, personalizar y compartir el memorial digital de su ser querido. A través de este portal, podrán subir fotografías, mensajes de voz, biografías y configurar su árbol familiar perpetuo.");
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);

  // Período de Reportes
  const [reportPeriod, setReportPeriod] = useState<"7d" | "30d" | "12m">("7d");

  const getChartData = () => {
    if (reportPeriod === "7d") {
      return {
        points: "50,150 150,130 250,140 350,90 450,70 550,40 650,45",
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        visits: [12, 18, 15, 34, 42, 50, 48]
      };
    }
    if (reportPeriod === "30d") {
      return {
        points: "50,140 150,120 250,130 350,80 450,90 550,50 650,40",
        labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"],
        visits: [75, 95, 80, 142, 120, 165]
      };
    }
    return {
      points: "50,150 150,135 250,110 350,90 450,60 550,45 650,30",
      labels: ["Ene", "Mar", "May", "Jul", "Sep", "Nov"],
      visits: [340, 410, 580, 620, 840, 1120]
    };
  };

  const chart = getChartData();

  // Guardar cambio de marca
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleSaveBrandSettings = () => {
    setShowSaveMessage(true);
    confetti({
      particleCount: 20,
      spread: 20,
      colors: [config.primaryColor, "#FFFFFF"]
    });
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 3000);
  };

  const handleCreateMemorial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newFamilyEmail.trim()) return;

    setIsCreating(true);

    setTimeout(() => {
      const newM = {
        id: `m_${Date.now()}`,
        name: newName,
        dates: `${newBirth ? newBirth.split("-")[0] : "????"} - ${newDeath ? newDeath.split("-")[0] : "2026"}`,
        status: "Configurando",
        visits: 0,
        qrCode: "Pendiente"
      };

      setCreatedMemorials(prev => [newM, ...prev]);
      setIsCreating(false);
      setNewName("");
      setNewBirth("");
      setNewDeath("");
      setNewFamilyEmail("");

      confetti({
        particleCount: 25,
        spread: 30,
        colors: [config.primaryColor, "#FAF7F2"]
      });
      alert(`Memorial creado con éxito. Se envió un correo con un Magic Link de acceso administrativo a: ${newFamilyEmail}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans smooth-transition text-xs">
      {/* Header del Portal */}
      <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg tracking-wider font-semibold flex items-center gap-2 group">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[var(--tenant-primary)] group-hover:scale-110 transition-transform duration-500 ease-in-out"
            >
              <path d="M12 2V22M6 8H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {config.name.toUpperCase()}
          </span>
          <span className="px-2 py-0.5 rounded bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)] text-[9px] uppercase tracking-widest font-bold">
            Portal B2B
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-medium text-neutral-600 dark:text-neutral-300">
            {config.logoText}
          </span>
          <button 
            onClick={() => router.push("/dashboard/admin")}
            className="text-[10px] text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
          >
            Súper Admin Panel
          </button>
        </div>
      </header>

      {/* Grid Principal */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-4 gap-8">
        
        {/* Sidebar de navegación */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-4 rounded-xl space-y-1">
            <div className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold px-3 py-2">
              Menú Operador
            </div>
            <button className="w-full text-left px-3 py-2 rounded-lg bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)] font-semibold flex items-center gap-2">
              <Building size={14} /> Panel Principal
            </button>
            <Link 
              href="/memorial/alejandro-valenzuela"
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-between text-neutral-600 dark:text-neutral-400"
            >
              <span className="flex items-center gap-2"><Laptop size={14} /> Ver Memorial Demo</span>
              <ExternalLink size={10} />
            </Link>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h4 className="font-serif text-sm font-semibold mb-2">Estadísticas SaaS</h4>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Memoriales Activos</span>
                <span className="text-xl font-bold font-serif">{createdMemorials.length} / 80</span>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[var(--tenant-primary)] h-full" style={{ width: `${(createdMemorials.length/80)*100}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-800 pt-3">
                <div>
                  <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">Visitas Totales</span>
                  <span className="font-semibold text-sm">482</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">Costo de Software</span>
                  <span className="font-semibold text-sm text-[var(--tenant-primary)]">$399/mes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles de Suscripción SaaS */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h4 className="font-serif text-sm font-semibold mb-1">Suscripción B2B</h4>
            <div className="space-y-2.5 text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Plan Actual:</span>
                <span className="font-bold text-[var(--tenant-primary)]">Growth B2B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Estado:</span>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 text-[8px] font-bold">Activo</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Próximo Pago:</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">15 de Ago, 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Medio de Pago:</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">Visa ending *4242</span>
              </div>
              <div className="flex justify-between items-center border-t border-neutral-200 dark:border-neutral-800 pt-2">
                <span className="text-neutral-400">Límite Sucursales:</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{branches.length} / 5</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Dashboard Principal */}
        <main className="lg:col-span-3 space-y-8">
          
          {/* Módulo de Personalización White Label */}
          <section className="glass-panel p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-1 flex items-center gap-2">
              <Palette size={18} className="text-[var(--tenant-primary)]" />
              Personalización de Marca Blanca (White Label)
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Edita el aspecto visual de tus memoriales públicos. Configura tu logotipo comercial, colores y dominio para mantener la consistencia de tu marca.
            </p>

            {/* Presets rápidos */}
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold block mb-3">Ajustes Rápidos de Marca</span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.keys(presets).map((key) => {
                  const preset = presets[key];
                  return (
                    <button
                      key={key}
                      onClick={() => applyPreset(key as "aeterna" | "lapaz" | "elysium" | "aurora")}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                        activePreset === key 
                          ? "border-[var(--tenant-primary)] bg-[var(--tenant-primary)]/5" 
                          : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-serif font-bold text-xs text-neutral-800 dark:text-neutral-200">{preset.name.split(" ")[1] || preset.name}</span>
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.primaryColor }}></span>
                      </div>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                        {preset.colorMeaning.split(":")[0]}
                      </p>
                      <span className="text-[8px] text-neutral-400 font-mono block mt-auto pt-1.5 border-t border-neutral-100 dark:border-neutral-800/80">
                        {preset.domain}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personalización Manual */}
            <div className="grid md:grid-cols-2 gap-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">Nombre Comercial de la Funeraria</label>
                  <input 
                    type="text" 
                    value={config.name}
                    onChange={(e) => updateConfig({ name: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-xs"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">Dominio Personalizado (White Label)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={config.domain}
                      onChange={(e) => {
                        updateConfig({ domain: e.target.value });
                        setDnsStatus("pending");
                      }}
                      className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 font-mono outline-none text-xs"
                      placeholder="ej. recuerdos.tufuneraria.com"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDnsStatus("checking");
                        setTimeout(() => {
                          setDnsStatus("verified");
                          confetti({
                            particleCount: 15,
                            spread: 30,
                            colors: [config.primaryColor, "#FAF7F2"]
                          });
                        }, 1200);
                      }}
                      disabled={dnsStatus === "checking"}
                      className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-[10px] uppercase tracking-widest font-semibold rounded-lg text-neutral-600 dark:text-neutral-300 transition-colors"
                    >
                      {dnsStatus === "checking" ? "Validando..." : "Validar DNS"}
                    </button>
                  </div>

                  {/* Detalle DNS */}
                  <div className="mt-2.5 p-3 rounded-lg border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-[10px] space-y-2">
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-bold">
                      <span className="text-neutral-400">Instrucciones DNS</span>
                      {dnsStatus === "verified" ? (
                        <span className="text-green-500 font-bold flex items-center gap-1">● Conectado (SSL Activo)</span>
                      ) : dnsStatus === "checking" ? (
                        <span className="text-yellow-500 font-bold flex items-center gap-1">● Validando registros...</span>
                      ) : (
                        <span className="text-red-500 font-bold flex items-center gap-1">● CNAME no detectado</span>
                      )}
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                      Crea un registro CNAME en tu proveedor de hosting o DNS (Cloudflare, GoDaddy, etc.) apuntando a:
                      <code className="block mt-1 font-mono text-[9px] text-[var(--tenant-primary)] bg-white dark:bg-neutral-900 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800">cname.aeterna.app</code>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">Color Principal</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="color" 
                        value={config.primaryColor}
                        onChange={(e) => updateConfig({ primaryColor: e.target.value, primaryColorHover: e.target.value })}
                        className="w-10 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="font-mono text-xs uppercase text-neutral-500">{config.primaryColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">Tipografía</label>
                    <select
                      value={config.fontFamily}
                      onChange={(e) => updateConfig({ fontFamily: e.target.value as "serif" | "sans" })}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 outline-none text-xs"
                    >
                      <option value="serif">Playfair Serif (Clásica)</option>
                      <option value="sans">Geist Sans (Moderna)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleSaveBrandSettings}
                    className="px-6 py-2.5 rounded-full bg-tenant-btn-main text-white hover:opacity-90 font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle size={14} /> Guardar Ajustes de Marca
                  </button>
                  {showSaveMessage && (
                    <span className="text-[10px] text-green-500 font-bold block mt-2">✔ Los estilos White Label han sido aplicados correctamente.</span>
                  )}
                </div>
              </div>

              {/* Vista Previa de Logo */}
              <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/10 flex flex-col justify-center items-center text-center space-y-4">
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Vista Previa de Marca Blanca</span>
                
                <div className="border border-neutral-200 dark:border-neutral-850 p-8 rounded-xl bg-white dark:bg-neutral-950 w-full max-w-xs shadow-inner">
                  <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center border mb-3" style={{ borderColor: config.primaryColor }}>
                    <span className="w-6 h-6 rounded-full" style={{ backgroundColor: config.primaryColor }}></span>
                  </div>
                  <span className="font-serif text-sm font-bold text-neutral-800 dark:text-neutral-100 tracking-wider block">{config.name}</span>
                  <span className="text-[8px] font-mono text-neutral-400 block mt-1">{config.domain}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Listado / Directorio de Memoriales */}
          <section className="glass-panel p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              <FileText size={18} className="text-[var(--tenant-primary)]" />
              Gestión de Memoriales Digitales
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Administra los perfiles conmemorativos creados. Descarga códigos QR para imprimir e integrar en lápidas, recordatorios y urnas.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                    <th className="pb-3 font-semibold">Fallecido</th>
                    <th className="pb-3 font-semibold">Período</th>
                    <th className="pb-3 font-semibold">Estado</th>
                    <th className="pb-3 font-semibold">Visitas</th>
                    <th className="pb-3 font-semibold">Código QR</th>
                    <th className="pb-3 font-semibold text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/80">
                  {createdMemorials.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="py-3.5 font-bold text-neutral-800 dark:text-neutral-100">{m.name}</td>
                      <td className="py-3.5 font-mono text-neutral-500">{m.dates}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          m.status === "Activo" 
                            ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" 
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono">{m.visits}</td>
                      <td className="py-3.5 font-medium text-neutral-600 dark:text-neutral-400">{m.qrCode}</td>
                      <td className="py-3.5 text-right">
                        <Link 
                          href="/memorial/alejandro-valenzuela"
                          className="text-[10px] font-bold text-[var(--tenant-primary)] hover:underline flex items-center justify-end gap-1"
                        >
                          Administrar <ExternalLink size={10} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Reportes y Analíticas de Visitas (SVG charts) */}
          <section className="glass-panel p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold mb-1 flex items-center gap-2">
                  <TrendingUp size={18} className="text-[var(--tenant-primary)]" />
                  Reportes y Analíticas de Tráfico
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed text-[11px]">
                  Monitorea las visitas virtuales recibidas y escaneos de códigos QR en lápidas físicas en tiempo real.
                </p>
              </div>

              {/* Selector de periodo */}
              <div className="flex gap-2">
                {[
                  { id: "7d", label: "7 Días" },
                  { id: "30d", label: "30 Días" },
                  { id: "12m", label: "12 Meses" }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setReportPeriod(p.id as "7d" | "30d" | "12m")}
                    className={`px-3 py-1 rounded-lg border text-[9px] uppercase tracking-widest font-bold transition-all ${
                      reportPeriod === p.id 
                        ? "bg-[var(--tenant-primary)] border-[var(--tenant-primary)] text-[var(--tenant-primary-fg)]" 
                        : "border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-850 bg-white/40 dark:bg-black/20">
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold block mb-1">Visitas Totales</span>
                <span className="text-lg font-serif font-bold text-neutral-800 dark:text-neutral-100">
                  {reportPeriod === "7d" ? "191" : (reportPeriod === "30d" ? "677" : "3,990")}
                </span>
                <span className="text-[8px] text-green-500 font-bold block mt-0.5">↑ +14.2%</span>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-850 bg-white/40 dark:bg-black/20">
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold block mb-1">Escaneos QR</span>
                <span className="text-lg font-serif font-bold text-neutral-800 dark:text-neutral-100">
                  {reportPeriod === "7d" ? "124" : (reportPeriod === "30d" ? "428" : "2,610")}
                </span>
                <span className="text-[8px] text-green-500 font-bold block mt-0.5">↑ +8.5%</span>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-855 bg-white/40 dark:bg-black/20">
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold block mb-1">Tiempo de Permanencia</span>
                <span className="text-lg font-serif font-bold text-neutral-800 dark:text-neutral-100">4:12 min</span>
                <span className="text-[8px] text-neutral-400 block mt-0.5">Promedio global</span>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-855 bg-white/40 dark:bg-black/20">
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold block mb-1">Tasa de Rebote</span>
                <span className="text-lg font-serif font-bold text-neutral-800 dark:text-neutral-100">14.8%</span>
                <span className="text-[8px] text-green-500 font-bold block mt-0.5">Excelente retención</span>
              </div>
            </div>

            {/* SVG area chart representation */}
            <div className="p-5 rounded-xl border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-neutral-950/20">
              <svg viewBox="0 0 700 200" className="w-full h-44 overflow-visible">
                {/* Horizontal grid lines */}
                <line x1="50" y1="30" x2="650" y2="30" stroke="rgba(150,150,150,0.15)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="50" y1="90" x2="650" y2="90" stroke="rgba(150,150,150,0.15)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="50" y1="150" x2="650" y2="150" stroke="rgba(150,150,150,0.25)" strokeWidth="1" />
                
                {/* Area fill under curve */}
                <polygon 
                  points={`50,150 ${chart.points} 650,150`} 
                  fill="rgba(var(--tenant-primary-rgb), 0.08)"
                />

                {/* Line chart */}
                <polyline 
                  fill="none" 
                  stroke="var(--tenant-primary)" 
                  strokeWidth="2.5" 
                  points={chart.points}
                  className="transition-all duration-500 ease-in-out"
                />

                {/* Data points (circles) */}
                {chart.points.split(" ").map((pt, i) => {
                  const [x, y] = pt.split(",");
                  return (
                    <circle 
                      key={i}
                      cx={x} 
                      cy={y} 
                      r="4" 
                      fill="var(--tenant-primary)" 
                      stroke="#FFFFFF" 
                      strokeWidth="1.5" 
                      className="cursor-pointer hover:r-6 transition-all"
                    />
                  );
                })}

                {/* X labels */}
                {chart.labels.map((lbl, i) => {
                  const step = 600 / (chart.labels.length - 1);
                  const x = 50 + i * step;
                  return (
                    <text 
                      key={i} 
                      x={x} 
                      y="175" 
                      textAnchor="middle" 
                      fontSize="9" 
                      fill="#999999" 
                      fontFamily="monospace"
                    >
                      {lbl}
                    </text>
                  );
                })}
              </svg>
            </div>
          </section>


          {/* Formulario Creación de Memorial (SaaS Exequial) */}
          <section className="glass-panel p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              <Plus size={18} className="text-[var(--tenant-primary)]" />
              Crear Nuevo Memorial
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Registra un servicio y genera de inmediato el memorial digital. El sistema enviará una invitación por correo a la familia para que tomen control administrativo colaborativo.
            </p>

            <form onSubmit={handleCreateMemorial} className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">Nombre Completo del Fallecido</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Roberto García Martínez"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">Nacimiento</label>
                    <input 
                      type="date"
                      value={newBirth}
                      onChange={(e) => setNewBirth(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">Fallecimiento</label>
                    <input 
                      type="date"
                      value={newDeath}
                      onChange={(e) => setNewDeath(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block mb-1">Correo del Administrador Familiar</label>
                  <input 
                    type="email"
                    placeholder="familiar@correo.com"
                    value={newFamilyEmail}
                    onChange={(e) => setNewFamilyEmail(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-xs"
                  />
                  <span className="text-[9px] text-neutral-400 mt-1 block">Se le enviará un Magic Link para configurar la privacidad, fotos y relatos familiares.</span>
                </div>

                <button 
                  type="submit"
                  disabled={isCreating}
                  className="w-full py-3.5 rounded-full bg-tenant-btn-main text-white hover:opacity-90 font-bold uppercase tracking-widest transition-colors shadow-sm"
                >
                  {isCreating ? "Creando y Enviando Invitaciones..." : "Registrar Memorial y Enviar Accesos"}
                </button>
              </div>
            </form>

            {/* Plantilla de Email (Magic Link) Editor */}
            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-xs font-bold text-neutral-800 dark:text-neutral-200">Personalizar Invitación por Email (Magic Link)</h3>
                  <p className="text-[10px] text-neutral-400 font-light">Modifica la plantilla de correo predeterminada que reciben las familias al registrar el servicio.</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsEditingTemplate(!isEditingTemplate)}
                  className="px-3.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 font-bold uppercase tracking-widest text-[8px] transition-colors"
                >
                  {isEditingTemplate ? "Cerrar Editor" : "Editar Plantilla"}
                </button>
              </div>

              {isEditingTemplate ? (
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  {/* Inputs */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-1">Asunto del Correo</label>
                      <input 
                        type="text" 
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-1">Saludo Inicial</label>
                      <input 
                        type="text" 
                        value={emailGreeting}
                        onChange={(e) => setEmailGreeting(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-1">Cuerpo de la Carta</label>
                      <textarea 
                        rows={5} 
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2 outline-none text-[11px] resize-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailSubject("Acceso a tu Memorial Digital - Aeterna Legacy");
                        setEmailGreeting("Estimada familia Valenzuela,");
                        setEmailBody("Le enviamos este enlace mágico privado para que puedan administrar, personalizar y compartir el memorial digital de su ser querido. A través de este portal, podrán subir fotografías, mensajes de voz, biografías y configurar su árbol familiar perpetuo.");
                        confetti({
                          particleCount: 15,
                          spread: 25,
                          colors: [config.primaryColor]
                        });
                      }}
                      className="text-[9px] font-bold text-red-500 hover:underline uppercase tracking-wider block"
                    >
                      Reestablecer plantilla por defecto
                    </button>
                  </div>

                  {/* Mail Inbox Live Preview */}
                  <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 space-y-3.5 shadow-sm text-neutral-700 dark:text-neutral-300">
                    <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-bold block border-b border-neutral-100 dark:border-neutral-855 pb-2">Previsualización del Recibido</span>
                    
                    <div className="text-[10px] space-y-1">
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-900 pb-1.5">
                        <span className="text-neutral-400">De:</span>
                        <span className="font-semibold">{config.name} Support &lt;soporte@{config.domain}&gt;</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-900 pb-1.5">
                        <span className="text-neutral-400">Para:</span>
                        <span className="font-semibold font-mono">{newFamilyEmail || "familiar@correo.com"}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-900 pb-1.5">
                        <span className="text-neutral-400">Asunto:</span>
                        <span className="font-semibold text-[var(--tenant-primary)]">{emailSubject}</span>
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] space-y-3 font-serif leading-relaxed text-neutral-600 dark:text-neutral-400">
                      <p className="font-bold">{emailGreeting}</p>
                      <p>{emailBody}</p>
                      <div className="py-2.5 text-center">
                        <span className="inline-block px-5 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold font-sans text-[var(--tenant-primary-fg)] bg-[var(--tenant-primary)] shadow-sm">
                          Configurar Memorial Familiar
                        </span>
                      </div>
                      <p className="text-[9px] font-sans text-neutral-400 text-center">Este Magic Link expira en 7 días y es de un solo uso.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-lg border border-neutral-200/60 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 text-[10px] flex justify-between items-center text-neutral-400">
                  <span>Asunto activo: <strong className="text-neutral-600 dark:text-neutral-200">{emailSubject}</strong></span>
                  <span className="italic">Vista previa oculta. Haz clic en &ldquo;Editar Plantilla&rdquo; para desplegar.</span>
                </div>
              )}
            </div>
          </section>

          {/* Gestión de Sucursales (B2B Multi-Branch) */}
          <section className="glass-panel p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <div className="flex justify-between items-start gap-4 mb-6">
              <div>
                <h2 className="font-serif text-xl font-bold mb-1 flex items-center gap-2">
                  <Building size={18} className="text-[var(--tenant-primary)]" />
                  Gestión de Sucursales (Multi-Branch)
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed text-[11px]">
                  Administra las diferentes ubicaciones físicas de tu funeraria. Cada sucursal puede generar memoriales de forma independiente vinculados a la cuenta principal.
                </p>
              </div>
            </div>

            {/* Listado y Agregar Sucursales */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Sucursales Activas */}
              <div className="md:col-span-2 space-y-3">
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block mb-1">Sucursales Activas</span>
                <div className="grid sm:grid-cols-2 gap-4">
                  {branches.map(branch => (
                    <div key={branch.id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-serif font-bold text-neutral-800 dark:text-neutral-100 text-xs">{branch.name}</span>
                        <span className="px-2 py-0.5 rounded bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)] text-[8px] font-mono font-bold uppercase">{branch.city}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 font-light">{branch.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulario Agregar Sucursal */}
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-neutral-900/30">
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold block mb-3">Agregar Nueva Sucursal</span>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newBranchName.trim()) return;
                    const newB = {
                      id: `b_${Date.now()}`,
                      name: newBranchName,
                      city: newBranchCity || "General",
                      address: newBranchAddress || "Dirección no especificada"
                    };
                    setBranches(prev => [...prev, newB]);
                    setNewBranchName("");
                    setNewBranchCity("");
                    setNewBranchAddress("");
                    confetti({
                      particleCount: 15,
                      spread: 30,
                      colors: [config.primaryColor, "#FAF7F2"]
                    });
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-1">Nombre de Sucursal</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Sucursal Oriente"
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-1">Ciudad</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Concepción"
                        value={newBranchCity}
                        onChange={(e) => setNewBranchCity(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-neutral-400 block mb-1">Dirección</label>
                      <input 
                        type="text" 
                        placeholder="Ej. O'Higgins 34"
                        value={newBranchAddress}
                        onChange={(e) => setNewBranchAddress(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-xs"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-2 rounded-lg bg-tenant-btn-main text-white hover:opacity-90 font-bold text-[10px] uppercase tracking-widest transition-colors shadow-xs"
                  >
                    Registrar Sucursal
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
