"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Settings, 
  FileText, 
  QrCode, 
  Upload, 
  UserPlus, 
  Lock, 
  Download, 
  Sparkles,
  ExternalLink,
  CheckCircle,
  FolderOpen,
  Undo
} from "lucide-react";
import { 
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useBranding } from "../../context/BrandingContext";
import confetti from "canvas-confetti";

export default function FamiliaDashboard({ switchRole, originalRole }: { switchRole?: (role: string) => void, originalRole?: string | null }) {
  const router = useRouter();
  const { config } = useBranding();
  
  // Miembros de la familia
  const [isPet, setIsPet] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([
    { id: "f1", name: "Marta Valenzuela", role: "Administrador", relation: "Hija", email: "marta@correo.com" },
    { id: "f2", name: "Alejandro Valenzuela Hijo", role: "Administrador", relation: "Hijo", email: "alejandro.hijo@correo.com" },
    { id: "f3", name: "Sofía Valenzuela", role: "Colaborador", relation: "Nieta", email: "sofia.v@correo.com" }
  ]);

  // Estados para Árbol Genealógico
  const [treeNodes, setTreeNodes] = useState([
    { id: "tn1", name: "Roberto Valenzuela", relation: "Padre", life: "1918 - 1992" },
    { id: "tn2", name: "Elena Díaz", relation: "Madre", life: "1922 - 2005" },
    { id: "tn3", name: "Laura Muñoz", relation: "Cónyuge", life: "Activa" },
    { id: "tn4", name: "Marta Valenzuela", relation: "Hija", life: "Activa" },
    { id: "tn5", name: "Alejandro Hijo", relation: "Hijo", life: "Activo" },
    { id: "tn6", name: "Sofía Valenzuela", relation: "Nieta", life: "Activa" }
  ]);
  const [nodeName, setNodeName] = useState("");
  const [nodeRelation, setNodeRelation] = useState("Hijo/a");
  const [nodeLife, setNodeLife] = useState("");
  const [nodeSuccess, setNodeSuccess] = useState(false);

  // Estados para Línea de Tiempo
  const [timelineEvents, setTimelineEvents] = useState([
    { id: "te1", year: "1948", title: "Nacimiento en Valparaíso", desc: "Llegada al mundo el 14 de Mayo." },
    { id: "te2", year: "1972", title: "Licenciatura en Filosofía", desc: "Comienza su vocación docente." },
    { id: "te3", year: "1974", title: "Matrimonio con Laura", desc: "Unión de la familia Valenzuela Muñoz." }
  ]);
  const [eventYear, setEventYear] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventSuccess, setEventSuccess] = useState(false);

  // Backup progress modal
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  // Invitación form
  const [inviteName, setInviteName] = useState("");
  const [inviteRelation, setInviteRelation] = useState("Hijo/a");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Colaborador");
  const [showInviteSuccess, setShowInviteSuccess] = useState(false);

  // Subida de recuerdos
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState<"photo" | "story" | "audio">("photo");
  const [uploadText, setUploadText] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Ajustes de privacidad
  const [privacyLevel, setPrivacyLevel] = useState("public"); // public, private, password
  const [privacySuccess, setPrivacySuccess] = useState(false);

  // Biografía
  const [bioText, setBioText] = useState("");
  const [bioSuccess, setBioSuccess] = useState(false);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    const newMember = {
      id: `f_${Date.now()}`,
      name: inviteName,
      role: inviteRole,
      relation: inviteRelation,
      email: inviteEmail
    };

    setFamilyMembers(prev => [...prev, newMember]);
    setInviteName("");
    setInviteEmail("");
    setShowInviteSuccess(true);
    
    confetti({
      particleCount: 15,
      spread: 20,
      colors: [config.primaryColor]
    });

    setTimeout(() => {
      setShowInviteSuccess(false);
    }, 3000);
  };

  const handleUploadMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setUploadSuccess(true);
    setUploadTitle("");
    setUploadText("");

    confetti({
      particleCount: 20,
      spread: 30,
      colors: [config.primaryColor, "#FFFFFF"]
    });

    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  };

  const handleSavePrivacy = () => {
    setPrivacySuccess(true);
    setTimeout(() => setPrivacySuccess(false), 3000);
  };

  const handleDownloadBackup = () => {
    setShowBackupModal(true);
    setBackupProgress(0);
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          confetti({
            particleCount: 30,
            spread: 40,
            colors: [config.primaryColor, "#FAF7F2"]
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans smooth-transition text-sm md:text-base">
      {/* Navbar familiar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg tracking-wider font-semibold flex items-center gap-2 group">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[var(--tenant-primary)] group-hover:scale-110 transition-transform duration-500 ease-in-out"
            >
              <path d="M12 2v20M6 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {config.name ? config.name.toUpperCase() : "AMULEY FAMILIA"}
          </span>
          <span className="px-2 py-0.5 rounded bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)] text-xs md:text-sm uppercase tracking-widest font-bold">
            Consola del Memorial
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/memorial/alejandro-valenzuela"
            className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300 hover:text-[var(--tenant-primary)] transition-colors"
          >
            Ver Memorial <ExternalLink size={12} />
          </Link>
          {originalRole === "ADMIN" && (
            <button 
              onClick={() => switchRole?.("ADMIN")}
              className="text-xs md:text-sm text-neutral-400 hover:text-[var(--tenant-primary)] dark:hover:text-white transition-colors flex items-center gap-1 ml-4 border-l border-neutral-200 dark:border-neutral-800 pl-4"
            >
              <Undo size={12} /> Volver a Admin
            </button>
          )}
        </div>
      </header>

      {/* Grid Principal */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 grid lg:grid-cols-4 gap-5 md:p-8">
        
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          
          {/* Tarjeta del Memorial Administrado */}
          <div className="glass-panel p-4 md:p-6 rounded-xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[var(--tenant-primary)]/40 p-0.5 mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" 
                alt="Fallecido"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <span className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 font-bold block">Memorial Administrado</span>
              <span className="text-xs md:text-sm text-neutral-400 font-mono">1948 - 2026</span>
              <button 
                onClick={() => setIsPet(!isPet)} 
                className="mt-3 px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs text-neutral-500 hover:text-[var(--tenant-primary)] transition-colors w-full border border-transparent hover:border-[var(--tenant-primary)]/30"
              >
                {isPet ? "🐾 Modo Mascota Activo" : "👤 Modo Persona Activo"}
              </button>
            </div>
          </div>

          {/* Colaboradores Activos */}
          <div className="glass-panel p-4 md:p-6 rounded-xl space-y-4">
            <h4 className="font-serif text-sm font-semibold mb-2 flex items-center gap-1.5"><Users size={14} /> Círculo Familiar</h4>
            <div className="space-y-3">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 text-xs md:text-sm border-b border-neutral-100 dark:border-neutral-800/80 pb-2 last:border-0 last:pb-0">
                  <div>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">{member.name}</span>
                    <span className="text-neutral-400 italic font-light">{member.relation} • {member.email}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-[8px] font-bold text-neutral-500">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Código QR del Memorial */}
          <div className="glass-panel p-4 md:p-6 rounded-xl space-y-4 text-center">
            <h4 className="font-serif text-sm font-semibold mb-1 flex items-center justify-center gap-1.5"><QrCode size={14} /> Acceso QR</h4>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">Código QR oficial del memorial. Imprímelo o compártelo para dar acceso directo al perfil de Alejandro.</p>
            <div className="w-28 h-28 mx-auto bg-white rounded-lg p-2.5 flex items-center justify-center border border-neutral-200 dark:border-neutral-850 shadow-inner">
              <QRCodeCanvas 
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/memorial/alejandro-valenzuela`} 
                size={90} 
                level="H" 
                includeMargin={false} 
                className="w-full h-full object-contain"
              />
            </div>
            <a 
              href="/memorial/alejandro-valenzuela"
              target="_blank"
              className="text-xs md:text-sm font-bold text-[var(--tenant-primary)] hover:underline block"
            >
              ver memorial activo
            </a>
          </div>

          {/* Respaldos (Exportar) */}
          <div className="glass-panel p-4 md:p-6 rounded-xl space-y-4 text-center">
            <h4 className="font-serif text-sm font-semibold mb-1 flex items-center justify-center gap-1.5"><Download size={14} /> Preservación</h4>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">Genera un archivo comprimido .ZIP con todas las fotos, audios de voz originales y condolencias escritas del memorial.</p>
            <button 
              onClick={handleDownloadBackup}
              className="w-full py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-xs md:text-sm uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-1"
            >
              <Download size={10} /> Descargar Copia de Respaldo
            </button>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="lg:col-span-3 space-y-8">
          
          {/* Editar Biografía Principal */}
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              <FileText size={18} className="text-[var(--tenant-primary)]" />
              Biografía Principal
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Escribe la historia de vida, semblanza o biografía principal que se mostrará de forma destacada en el perfil público del memorial.
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setBioSuccess(true);
                confetti({
                  particleCount: 20,
                  spread: 30,
                  colors: [config.primaryColor, "#FFFFFF"]
                });
                setTimeout(() => setBioSuccess(false), 3000);
              }}
              className="space-y-4"
            >
              <div>
                <textarea 
                  rows={8} 
                  placeholder="Nacido en Valparaíso, dedicó su vida a la educación y a su familia..."
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 outline-none text-sm md:text-base resize-none leading-relaxed"
                ></textarea>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-tenant-btn-main text-white hover:opacity-90 font-bold uppercase tracking-widest transition-colors shadow-xs"
                >
                  Guardar Biografía
                </button>
                {bioSuccess && (
                  <span className="text-xs md:text-sm text-green-500 font-semibold flex items-center gap-1">
                    <CheckCircle size={11} /> Biografía actualizada correctamente
                  </span>
                )}
              </div>
            </form>
          </section>

          {/* Subir Recuerdos desde el Panel */}
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-1 flex items-center gap-2">
              <Upload size={18} className="text-[var(--tenant-primary)]" />
              Publicar Nuevo Aporte en el Memorial
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Sube contenido multimedia o escribe anécdotas de forma directa en el tapiz del homenajeado.
            </p>

            <form onSubmit={handleUploadMemory} className="grid md:grid-cols-2 gap-4 md:p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Título del recuerdo</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Graduación universitaria"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                  />
                </div>
                
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Tipo de Recuerdo</label>
                  <select 
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as "photo" | "story" | "audio")}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 outline-none text-sm md:text-base text-neutral-800 dark:text-neutral-200"
                  >
                    <option value="photo">Fotografía familiar</option>
                    <option value="story">Relato escrito / Anécdota</option>
                    <option value="audio">Archivo de voz conmemorativo</option>
                  </select>
                </div>

                {(uploadType === "photo" || uploadType === "audio") && (
                  <div 
                    onClick={() => {
                      confetti({
                        particleCount: 15,
                        spread: 25,
                        colors: ["#BCA380"]
                      });
                      alert(`Explorador de archivos abierto. Selecciona tu archivo ${uploadType === "photo" ? "JPG/PNG" : "MP3/WAV"}.`);
                    }}
                    className="p-5 border-2 border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-white/20 dark:bg-black/10 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:border-[var(--tenant-primary)] group h-32"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">
                      {uploadType === "photo" ? "📸" : "🎙️"}
                    </span>
                    <span className="text-xs md:text-sm font-bold text-neutral-600 dark:text-neutral-300 mt-2 block">
                      Arrastra y suelta tu archivo aquí
                    </span>
                    <span className="text-[8px] text-neutral-400 mt-1 block">
                      O haz clic para explorar en tu equipo (Máx. 15MB)
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Relato o descripción corta</label>
                  <textarea 
                    rows={6} 
                    placeholder="Escribe la historia o añade detalles adicionales..."
                    value={uploadText}
                    onChange={(e) => setUploadText(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2 outline-none text-sm md:text-base resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-full bg-tenant-btn-main text-white hover:opacity-90 font-bold uppercase tracking-widest transition-colors shadow-xs"
                  >
                    Subir al Memorial
                  </button>
                  {uploadSuccess && (
                    <span className="text-xs md:text-sm text-green-500 font-semibold flex items-center gap-1">
                      <CheckCircle size={11} /> Recuerdo guardado correctamente en el tapiz familiar
                    </span>
                  )}
                </div>
              </div>
            </form>
          </section>

          {/* Invitar a Familiares (Colaborativo) */}
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              <UserPlus size={18} className="text-[var(--tenant-primary)]" />
              Invitar a un Miembro de la Familia
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Envía invitaciones para que otros familiares colaboren. Los administradores pueden moderar comentarios y editar; los colaboradores solo pueden subir sus propios recuerdos sin borrar los ajenos.
            </p>

            <form onSubmit={handleSendInvite} className="grid md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  placeholder="Ej. Sofía Valenzuela"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 outline-none text-sm md:text-base"
                />
              </div>

              <div>
                <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Parentesco</label>
                <select 
                  value={inviteRelation}
                  onChange={(e) => setInviteRelation(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 outline-none text-sm md:text-base"
                >
                  {isPet ? (
                    <>
                      <option value="Dueño/a">Dueño/a</option>
                      <option value="Familia">Familia</option>
                      <option value="Veterinario/a">Veterinario/a</option>
                    </>
                  ) : (
                    <>
                      <option value="Hijo/a">Hijo/a</option>
                      <option value="Cónyuge">Cónyuge</option>
                      <option value="Hermano/a">Hermano/a</option>
                      <option value="Nieto/a">Nieto/a</option>
                      <option value="Amigo/a">Amigo/a</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  placeholder="familiar@correo.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 outline-none text-sm md:text-base"
                />
              </div>

              <div>
                <button 
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-tenant-btn-main text-white hover:opacity-90 font-bold uppercase tracking-widest transition-colors shadow-sm"
                >
                  Enviar Acceso
                </button>
              </div>
            </form>
            {showInviteSuccess && (
              <span className="text-xs md:text-sm text-green-500 font-bold block mt-3">
                ✔ Invitación enviada con éxito. El familiar recibirá un Magic Link para unirse como {inviteRole}.
              </span>
            )}
          </section>

          {/* Ajustes de Privacidad del Memorial */}
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              <Lock size={18} className="text-[var(--tenant-primary)]" />
              Privacidad y Control de Accesos
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Ajusta la visibilidad pública de este memorial. Puedes restringirlo solo a familiares con link mágico o requerir contraseña general al escanear el QR.
            </p>

            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <label className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${privacyLevel === "public" ? "border-[var(--tenant-primary)] bg-[var(--tenant-primary)]/5" : "border-neutral-200 dark:border-neutral-800"}`}>
                  <input 
                    type="radio" 
                    name="privacy" 
                    value="public" 
                    checked={privacyLevel === "public"}
                    onChange={() => setPrivacyLevel("public")}
                    className="sr-only" 
                  />
                  <div>
                    <span className="font-serif font-bold text-sm md:text-base block mb-1">Público General</span>
                    <span className="text-xs md:text-sm text-neutral-400 font-light block leading-relaxed">Cualquier persona que escanee el código QR o acceda al subdominio puede ver el memorial.</span>
                  </div>
                </label>

                <label className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${privacyLevel === "private" ? "border-[var(--tenant-primary)] bg-[var(--tenant-primary)]/5" : "border-neutral-200 dark:border-neutral-800"}`}>
                  <input 
                    type="radio" 
                    name="privacy" 
                    value="private" 
                    checked={privacyLevel === "private"}
                    onChange={() => setPrivacyLevel("private")}
                    className="sr-only" 
                  />
                  <div>
                    <span className="font-serif font-bold text-sm md:text-base block mb-1">Privado Familiar</span>
                    <span className="text-xs md:text-sm text-neutral-400 font-light block leading-relaxed">Sólo las personas explícitamente invitadas por correo pueden ver o interactuar con el memorial.</span>
                  </div>
                </label>

                <label className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between transition-all ${privacyLevel === "password" ? "border-[var(--tenant-primary)] bg-[var(--tenant-primary)]/5" : "border-neutral-200 dark:border-neutral-800"}`}>
                  <input 
                    type="radio" 
                    name="privacy" 
                    value="password" 
                    checked={privacyLevel === "password"}
                    onChange={() => setPrivacyLevel("password")}
                    className="sr-only" 
                  />
                  <div>
                    <span className="font-serif font-bold text-sm md:text-base block mb-1">Acceso por Clave</span>
                    <span className="text-xs md:text-sm text-neutral-400 font-light block leading-relaxed">El visitante debe ingresar un código o contraseña general definida por la familia al escanear el QR.</span>
                  </div>
                </label>
              </div>

              {privacyLevel === "password" && (
                <div className="mt-4 max-w-sm">
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Contraseña de acceso general</label>
                  <input 
                    type="password" 
                    placeholder="Contraseña del memorial"
                    defaultValue="valenzuela2026"
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                  />
                </div>
              )}

            </div>
          </section>

          {/* Gestión del Árbol Genealógico / Huellas */}
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              {isPet ? "🐾 Álbum de Huellas y Amigos" : "🌳 Gestión del Árbol Genealógico"}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              {isPet 
                ? "Agrega a los compañeros de juegos y familiares humanos de tu mascota para construir su red de amigos."
                : "Agrega familiares directos y define su parentesco para que se muestren en la pestaña gráfica de Árbol Genealógico del memorial de Alejandro."
              }
            </p>

            <div className="grid md:grid-cols-3 gap-4 md:p-6">
              {/* Formulario Agregar Nodo */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!nodeName.trim()) return;
                  const newN = {
                    id: `tn_${Date.now()}`,
                    name: nodeName,
                    relation: nodeRelation,
                    life: nodeLife || "Activo/a"
                  };
                  setTreeNodes(prev => [...prev, newN]);
                  setNodeName("");
                  setNodeLife("");
                  setNodeSuccess(true);
                  confetti({
                    particleCount: 20,
                    spread: 40,
                    colors: [config.primaryColor, "#FAF7F2"]
                  });
                  setTimeout(() => setNodeSuccess(false), 3000);
                }}
                className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-neutral-900/30 space-y-4"
              >
                <span className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 font-bold block mb-1">Conectar Familiar</span>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Roberto Valenzuela"
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-sm md:text-base"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Parentesco</label>
                    <select
                      value={nodeRelation}
                      onChange={(e) => setNodeRelation(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-sm md:text-base"
                    >
                      {isPet ? (
                        <>
                          <option value="Padre/Madre Humano">Padre/Madre Humano</option>
                          <option value="Hermano/a Peludo">Hermano/a Peludo</option>
                          <option value="Compañero/a de juegos">Compañero/a de juegos</option>
                          <option value="Veterinario/a">Veterinario/a</option>
                        </>
                      ) : (
                        <>
                          <option value="Padre">Padre</option>
                          <option value="Madre">Madre</option>
                          <option value="Cónyuge">Cónyuge</option>
                          <option value="Hijo/a">Hijo/a</option>
                          <option value="Nieto/a">Nieto/a</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Período de Vida</label>
                    <input 
                      type="text" 
                      placeholder="Ej. 1948 - 2026"
                      value={nodeLife}
                      onChange={(e) => setNodeLife(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-sm md:text-base"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full py-2 rounded-lg bg-tenant-btn-main text-white hover:opacity-90 font-bold text-xs md:text-sm uppercase tracking-widest transition-colors shadow-xs"
                >
                  Conectar al Árbol
                </button>
                {nodeSuccess && (
                  <span className="text-xs md:text-sm text-green-500 font-semibold block mt-2">✔ Familiar agregado correctamente</span>
                )}
              </form>

              {/* Lista Nodos Vinculados */}
              <div className="md:col-span-2 space-y-3">
                <span className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 font-bold block mb-1">Conexiones Familiares Registradas</span>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {treeNodes.map(node => (
                    <div key={node.id} className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                      <div>
                        <span className="font-serif font-bold text-neutral-800 dark:text-neutral-100 block text-sm md:text-base">{node.name}</span>
                        <span className="text-xs md:text-sm text-neutral-400 font-light block">{node.relation} • {node.life}</span>
                      </div>
                      <button 
                        onClick={() => setTreeNodes(prev => prev.filter(n => n.id !== node.id))}
                        className="text-xs md:text-sm text-red-500 hover:underline font-semibold"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Gestión de Hitos / Línea de Vida */}
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              ⏳ {isPet ? "Mejores Momentos (Línea de Vida)" : "Creador de Línea de Vida (Hitos)"}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              {isPet
                ? "Agrega los momentos más divertidos y entrañables en la vida de tu mascota. Se mostrarán cronológicamente."
                : "Agrega hitos históricos clave en la vida del ser querido. Se mostrarán ordenados cronológicamente en el memorial público."}
            </p>

            <div className="grid md:grid-cols-3 gap-4 md:p-6">
              {/* Formulario Agregar Evento */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!eventTitle.trim() || !eventYear.trim()) return;
                  const newEv = {
                    id: `te_${Date.now()}`,
                    year: eventYear,
                    title: eventTitle,
                    desc: eventDesc || "Hito familiar importante"
                  };
                  setTimelineEvents(prev => [...prev, newEv].sort((a,b) => parseInt(a.year) - parseInt(b.year)));
                  setEventTitle("");
                  setEventYear("");
                  setEventDesc("");
                  setEventSuccess(true);
                  confetti({
                    particleCount: 20,
                    spread: 40,
                    colors: [config.primaryColor, "#FAF7F2"]
                  });
                  setTimeout(() => setEventSuccess(false), 3000);
                }}
                className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-neutral-900/30 space-y-4"
              >
                <span className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 font-bold block mb-1">Registrar Nuevo Hito</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Año</label>
                    <input 
                      type="number" 
                      placeholder="1974"
                      value={eventYear}
                      onChange={(e) => setEventYear(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-sm md:text-base"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Título del Hito</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Graduación"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-sm md:text-base"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Descripción del acontecimiento</label>
                  <textarea 
                    placeholder="Describe los detalles de este hito..."
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2 outline-none text-sm md:text-base resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full py-2 rounded-lg bg-tenant-btn-main text-white hover:opacity-90 font-bold text-xs md:text-sm uppercase tracking-widest transition-colors shadow-xs"
                >
                  Registrar Hito
                </button>
                {eventSuccess && (
                  <span className="text-xs md:text-sm text-green-500 font-semibold block mt-2">✔ Hito agregado con éxito</span>
                )}
              </form>

              {/* Lista Eventos Registrados */}
              <div className="md:col-span-2 space-y-3">
                <span className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 font-bold block mb-1">Línea de Tiempo Configurada</span>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {timelineEvents.map(ev => (
                    <div key={ev.id} className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 flex justify-between items-start gap-4">
                      <div className="flex gap-3 items-start">
                        <span className="font-mono text-sm md:text-base font-bold text-[var(--tenant-primary)] bg-[var(--tenant-primary)]/10 px-2 py-0.5 rounded">{ev.year}</span>
                        <div>
                          <span className="font-bold text-sm md:text-base text-neutral-800 dark:text-neutral-100 block">{ev.title}</span>
                          <p className="text-xs md:text-sm text-neutral-400 font-light mt-0.5 leading-relaxed">{ev.desc}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setTimelineEvents(prev => prev.filter(e => e.id !== ev.id))}
                        className="text-xs md:text-sm text-red-500 hover:underline font-semibold"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Mejora a Premium (B2C) */}
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left mt-6 bg-gradient-to-r from-[var(--tenant-primary)]/5 to-transparent">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2 text-[var(--tenant-primary)]">
                  <Sparkles size={20} />
                  Desbloquea el Memorial Premium
                </h2>
                <p className="text-neutral-600 dark:text-neutral-300 font-light leading-relaxed mb-4">
                  Haz que este espacio sea verdaderamente único. Al cambiar al plan Premium obtienes:
                </p>
                <ul className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[var(--tenant-primary)]" />
                    <strong>Dominio Personalizado</strong> (ej: www.alejandro-valenzuela.cl)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[var(--tenant-primary)]" />
                    <strong>Subida ilimitada</strong> de fotos y videos en alta definición
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[var(--tenant-primary)]" />
                    <strong>Libro de condolencias físico</strong> impreso y enviado a domicilio
                  </li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xl text-center w-full md:w-72">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-2">Pago Único</span>
                <span className="font-serif text-4xl font-bold text-neutral-800 dark:text-neutral-100 block mb-4">$45.000<span className="text-sm font-sans text-neutral-400 font-normal"> CLP</span></span>
                <button className="w-full py-3 rounded-full bg-[var(--tenant-primary)] text-white hover:opacity-90 font-bold text-xs md:text-sm uppercase tracking-widest transition-transform hover:scale-105 shadow-md shadow-[var(--tenant-primary)]/30">
                  Mejorar a Premium
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Modal de Progreso de Copia de Seguridad */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl max-w-sm w-full p-5 md:p-8 border border-neutral-200 dark:border-neutral-800 shadow-2xl relative text-center">
            <h3 className="font-serif text-sm font-bold mb-2 text-neutral-800 dark:text-neutral-100">Generando Copia de Seguridad</h3>
            <p className="text-xs md:text-sm text-neutral-400 mb-6">Estamos recopilando todos los archivos de audio, fotos originales en alta definición, relatos y cartas familiares.</p>
            
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden mb-3">
              <div className="bg-[var(--tenant-primary)] h-full transition-all duration-200" style={{ width: `${backupProgress}%` }}></div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 text-xs md:text-sm text-neutral-400 font-mono mb-6">
              <span>{backupProgress === 100 ? "Compresión completa" : "Comprimiendo archivos..."}</span>
              <span className="font-bold">{backupProgress}%</span>
            </div>

            {backupProgress === 100 ? (
              <button 
                onClick={() => setShowBackupModal(false)}
                className="w-full py-2.5 rounded-full bg-tenant-btn-main text-white hover:opacity-90 text-xs md:text-sm uppercase tracking-widest font-semibold transition-colors"
              >
                Cerrar y Descargar .ZIP
              </button>
            ) : (
              <button 
                disabled
                className="w-full py-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-400 text-xs md:text-sm uppercase tracking-widest font-semibold cursor-not-allowed"
              >
                Generando archivo...
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
