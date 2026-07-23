"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Settings, 
  Plus, 
  Upload, 
  UserPlus, 
  Lock, 
  Eye, 
  Trash2,
  CheckCircle,
  FolderHeart,
  LogOut,
  ChevronRight,
  QrCode,
  LayoutGrid,
  Undo,
  ShieldAlert,
  Layers,
  Building
} from "lucide-react";
import QrCodeGenerator from "../../../components/QrCodeGenerator";
import confetti from "canvas-confetti";
import { useBranding } from "../../context/BrandingContext";

interface Memorial {
  id: string;
  slug: string;
  name: string;
  birthDate: string;
  deathDate: string;
  biography: string;
  mainImage: string;
  coverImage: string;
  isPrivate: boolean;
  password?: string | null;
  tenantName?: string;
}

export default function UserDashboard({ switchRole, originalRole }: { switchRole?: (role: string) => void, originalRole?: string | null } = {}) {
  const router = useRouter();
  const { config } = useBranding();
  const [session, setSession] = useState<{ email: string; role: string } | null>(null);

  // Memorials List
  const [memorials, setMemorials] = useState<Memorial[]>([
    {
      id: "demo-slug-alejandro",
      slug: "alejandro-valenzuela",
      name: "Alejandro Valenzuela García",
      birthDate: "1948-05-14",
      deathDate: "2026-06-10",
      biography: "Profesor principal y de filosofía en el Liceo de Valparaíso. Amaba el mar, la literatura clásica y los debates dominicales. Siempre creyó que dudar es el origen de la sabiduría y que la juventud debía cuestionar todo.",
      mainImage: "https://picsum.photos/id/93/2000/1200",
      coverImage: "https://picsum.photos/id/93/2000/1200",
      isPrivate: false,
      tenantName: "Funeraria del Valle"
    }
  ]);

  // Selected memorial for editing
  const [selectedId, setSelectedId] = useState<string>("demo-slug-alejandro");
  const [activeTab, setActiveTab] = useState<"list" | "edit" | "upload" | "collage" | "invites" | "qr">("list");

  // Form states for creating new memorial
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newBirth, setNewBirth] = useState("");
  const [newDeath, setNewDeath] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newIsPrivate, setNewIsPrivate] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Edit states
  const [editName, setEditName] = useState("");
  const [editBirth, setEditBirth] = useState("");
  const [editDeath, setEditDeath] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editIsPrivate, setEditIsPrivate] = useState(false);
  const [editPassword, setEditPassword] = useState("");

  // Upload states
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState<"PHOTO" | "VIDEO" | "STORY" | "AUDIO">("PHOTO");
  const [uploadContent, setUploadContent] = useState("");
  const [uploadFileUrl, setUploadFileUrl] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Invite states
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRelation, setInviteRelation] = useState("Amigo/a");
  const [inviteRole, setInviteRole] = useState("CONTRIBUTOR");
  const [invitedMembers, setInvitedMembers] = useState([
    { email: "marta@correo.com", relation: "Hija", role: "ADMIN", status: "Aceptado" },
    { email: "sofia.v@correo.com", relation: "Nieta", role: "CONTRIBUTOR", status: "Pendiente" }
  ]);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [accessRequests, setAccessRequests] = useState([
    { email: "carlos.perez@correo.com", relation: "Sobrino" },
    { email: "familia.rojas@correo.com", relation: "Amigos de la familia" }
  ]);

  const handleAcceptRequest = (email: string, relation: string) => {
    setAccessRequests(prev => prev.filter(req => req.email !== email));
    setInvitedMembers(prev => [...prev, { email, relation, role: "VISITOR", status: "Aceptado" }]);
  };

  const handleRejectRequest = (email: string) => {
    setAccessRequests(prev => prev.filter(req => req.email !== email));
  };

  useEffect(() => {
    // Load session from localStorage
    const saved = localStorage.getItem("user_session");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTimeout(() => setSession(parsed), 0);
    } else {
      // Set a default admin session for demo purposes
      const def = { email: "familiar@aeterna.app", role: "ADMIN" };
      setTimeout(() => setSession(def), 0);
      localStorage.setItem("user_session", JSON.stringify(def));
    }

    // Load memorials from local storage if available
    const savedMems = localStorage.getItem("aeterna_memorials");
    if (savedMems) {
      let parsedMems = JSON.parse(savedMems);
      const activeId = localStorage.getItem("active_memorial_id");
      
      setTimeout(() => {
        // Filter by user if not Supreme Admin
        const sessStr = localStorage.getItem("user_session");
        if (sessStr) {
          const s = JSON.parse(sessStr);
          if (s.email !== "cjxd123@gmail.com") {
             parsedMems = parsedMems.filter((m: any) => m.createdBy === s.email);
          }
        }
        
        setMemorials(parsedMems);
        
        if (parsedMems.length > 0) {
          const activeMem = parsedMems.find((m: any) => m.id === activeId) || parsedMems[0];
          setSelectedId(activeMem.id);
          setEditName(activeMem.name);
          setEditBirth(activeMem.birthDate);
          setEditDeath(activeMem.deathDate);
          setEditBio(activeMem.biography);
          setEditIsPrivate(activeMem.isPrivate);
          setEditPassword(activeMem.password || "");
        }
      }, 0);
    }
  }, []);

  const activeMemorial = memorials.find(m => m.id === selectedId) || memorials[0];

  const handleSelectMemorial = (id: string) => {
    setSelectedId(id);
    const mem = memorials.find(m => m.id === id);
    if (mem) {
      setEditName(mem.name);
      setEditBirth(mem.birthDate);
      setEditDeath(mem.deathDate);
      setEditBio(mem.biography);
      setEditIsPrivate(mem.isPrivate);
      setEditPassword(mem.password || "");
      setActiveTab("edit");
    }
  };

  const saveToLocalStorage = (updated: Memorial[]) => {
    setMemorials(updated);
    localStorage.setItem("aeterna_memorials", JSON.stringify(updated));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) return;

    const slugified = newSlug.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    const created: Memorial = {
      id: `m-${Date.now()}`,
      slug: slugified,
      name: newName,
      birthDate: newBirth,
      deathDate: newDeath,
      biography: newBio,
      mainImage: "https://picsum.photos/id/93/2000/1200",
      coverImage: "https://picsum.photos/id/93/2000/1200",
      isPrivate: newIsPrivate,
      password: newPassword || null
    };

    const nextMemorials = [...memorials, created];
    saveToLocalStorage(nextMemorials);
    setSelectedId(created.id);

    // Call API route in background
    try {
      await fetch("/api/memorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(created)
      });
    } catch (e) {
      console.warn("DB offline, saved locally", e);
    }

    // Reset fields
    setNewName("");
    setNewSlug("");
    setNewBirth("");
    setNewDeath("");
    setNewBio("");
    setNewIsPrivate(false);
    setNewPassword("");

    confetti({
      particleCount: 40,
      spread: 60,
      colors: ["#1F2937", "#9CA3AF"],
    });

    setActiveTab("edit");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = memorials.map(m => {
      if (m.id === selectedId) {
        return {
          ...m,
          name: editName,
          birthDate: editBirth,
          deathDate: editDeath,
          biography: editBio,
          isPrivate: editIsPrivate,
          password: editPassword || null
        };
      }
      return m;
    });

    saveToLocalStorage(updated);
    
    confetti({
      particleCount: 20,
      spread: 40,
      colors: ["#1F2937", "#E5E7EB"],
    });

    alert("Memorial actualizado con éxito.");
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este memorial permanentemente?")) {
      const filtered = memorials.filter(m => m.id !== id);
      saveToLocalStorage(filtered);
      if (filtered.length > 0) {
        setSelectedId(filtered[0].id);
      }
    }
  };

  const handleUploadMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const memoryPayload = {
      memorialId: selectedId,
      authorName: session?.email.split("@")[0] || "Administrador",
      authorRelation: session?.role === "ADMIN" ? "Administrador" : "Familiar",
      title: uploadTitle,
      type: uploadType,
      content: uploadContent,
      fileUrl: uploadFileUrl || null
    };

    try {
      await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memoryPayload)
      });
    } catch (err) {
      console.warn("DB connection warning, proceeding mock-wise", err);
    }

    setUploadSuccess(true);
    setUploadTitle("");
    setUploadContent("");
    setUploadFileUrl("");

    confetti({
      particleCount: 25,
      spread: 35,
      colors: ["#1F2937", "#10B981"],
    });

    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newInvite = {
      email: inviteEmail,
      relation: inviteRelation,
      role: inviteRole,
      status: "Pendiente"
    };

    setInvitedMembers(prev => [...prev, newInvite]);
    setInviteEmail("");
    setInviteSuccess(true);

    confetti({
      particleCount: 15,
      spread: 20,
      colors: ["#1F2937"],
    });

    setTimeout(() => setInviteSuccess(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#FCFBFA] font-sans text-[#111111] text-sm relative overflow-x-hidden">
      
      {/* Global Fixed Background Image */}
      <div className="fixed top-0 left-0 w-full h-full -z-20 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://picsum.photos/id/93/2000/1200" 
          alt="Paisaje de fondo" 
          className="w-full h-full object-cover opacity-15 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[#FCFBFA]/85"></div>
      </div>
      
      {/* Header Dashboard */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200/50 px-4 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[var(--tenant-primary)] group-hover:scale-110 transition-transform duration-500 ease-in-out"
            >
              <path d="M12 2V22M6 8H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-serif text-base tracking-[0.2em] font-semibold uppercase text-[#111111]">
              {config.name ? config.name.toUpperCase() : "AETERNA"}
            </span>
          </Link>
          <span className="w-[1px] h-3 bg-stone-200 " />
          <span className="px-2 py-0.5 rounded bg-neutral-100 text-base uppercase tracking-widest font-bold text-neutral-500">
            Panel de Control
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="font-medium text-neutral-600 block">
              {session?.email}
            </span>
            <span className="text-base uppercase tracking-widest text-neutral-500 font-bold block">
              Acceso: {session?.role === "ADMIN" ? "Administrador" : "Colaborador"}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-neutral-100 :bg-neutral-850 rounded-full text-neutral-500 hover:text-neutral-600 :text-white transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Grid Principal Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid lg:grid-cols-4 gap-5 md:p-8">
        
        {/* Sidebar Nav */}
        <aside className="lg:col-span-1 space-y-6">
          {originalRole === "ADMIN" && (
            <div className="bg-white/80 backdrop-blur-sm border border-stone-200/60 p-4 rounded-xl space-y-1 mb-6">
              <div className="text-xs md:text-sm uppercase tracking-widest text-neutral-500 font-bold px-3 py-2">
                Consola Central
              </div>
              <button 
                onClick={() => switchRole?.("ADMIN")} 
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center gap-2 text-neutral-600 dark:text-neutral-400 smooth-transition"
              >
                <Layers size={14} /> Panel de Control
              </button>
              <button 
                onClick={() => switchRole?.("FUNERARIA")} 
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center gap-2 text-neutral-600 dark:text-neutral-400 smooth-transition"
              >
                <Building size={14} /> Portal Funerarias
              </button>
              <button 
                className="w-full text-left px-3 py-2 rounded-lg bg-[var(--tenant-primary, #14B8A6)]/10 text-[var(--tenant-primary, #14B8A6)] font-semibold flex items-center gap-2"
              >
                <Users size={14} /> Gestión Global de Perfiles
              </button>
            </div>
          )}

          {originalRole === "FUNERARIA" && (
            <div className="bg-white/80 backdrop-blur-sm border border-stone-200/60 p-4 rounded-xl space-y-1 mb-6">
              <button onClick={() => switchRole?.("FUNERARIA")} className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center gap-2 text-neutral-600 dark:text-neutral-400 font-bold">
                <Undo size={14} /> Volver a mi Funeraria
              </button>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-sm border border-stone-200/60 p-5 rounded-2xl shadow-2xs space-y-4">
            <div className="text-sm uppercase tracking-widest text-neutral-500 font-bold px-2.5">
              Gestión
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("list")}
                className={`w-full text-left px-3 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${
                  activeTab === "list" 
                    ? "bg-[#967B62] text-white " 
                    : "text-neutral-500 hover:bg-stone-50 :bg-neutral-850"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FolderHeart size={14} /> Mis Memoriales
                </span>
                <ChevronRight size={10} className="opacity-50" />
              </button>

              {activeMemorial && (
                <>
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`w-full text-left px-3 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${
                      activeTab === "edit" 
                        ? "bg-[#967B62] text-white " 
                        : "text-neutral-500 hover:bg-stone-50 :bg-neutral-850"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Settings size={14} /> Editar Información
                    </span>
                    <ChevronRight size={10} className="opacity-50" />
                  </button>

                  <button
                    onClick={() => setActiveTab("upload")}
                    className={`w-full text-left px-3 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${
                      activeTab === "upload" 
                        ? "bg-[#967B62] text-white " 
                        : "text-neutral-500 hover:bg-stone-50 :bg-neutral-850"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Upload size={14} /> Subir Recuerdos
                    </span>
                    <ChevronRight size={10} className="opacity-50" />
                  </button>

                  <button
                    onClick={() => setActiveTab("collage")}
                    className={`w-full text-left px-3 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${
                      activeTab === "collage" 
                        ? "bg-[#967B62] text-white " 
                        : "text-neutral-500 hover:bg-stone-50 :bg-neutral-850"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <LayoutGrid size={14} /> Crear Collage
                    </span>
                    <ChevronRight size={10} className="opacity-50" />
                  </button>



                  <button
                    onClick={() => setActiveTab("qr")}
                    className={`w-full text-left px-3 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${
                      activeTab === "qr" 
                        ? "bg-[#967B62] text-white " 
                        : "text-neutral-500 hover:bg-stone-50 :bg-neutral-850"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Plus size={14} /> Descargar QR
                    </span>
                    <ChevronRight size={10} className="opacity-50" />
                  </button>
                </>
              )}
            </nav>
          </div>

          {activeMemorial && (
            <div className="bg-white/80 backdrop-blur-sm border border-stone-200/60 p-5 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-200 p-0.5 mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={activeMemorial.mainImage}
                  alt={activeMemorial.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-base uppercase tracking-widest text-neutral-500 font-bold block">Memorial Activo</span>
                <span className="font-semibold block truncate">{activeMemorial.name}</span>
                <Link
                  href={`/memorial/${activeMemorial.slug}`}
                  target="_blank"
                  className="text-sm text-neutral-500 hover:text-[#111111] :text-white underline font-semibold flex items-center justify-center gap-1 mt-1"
                >
                  Ver Vista Pública <Eye size={10} />
                </Link>
              </div>
            </div>
          )}
        </aside>

        {/* Central Display */}
        <main className="lg:col-span-3 space-y-8 text-left">
          
          {/* TAB 1: Memorials List & Create Form */}
          {activeTab === "list" && (
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm border border-stone-200/60 p-5 md:p-8 rounded-2xl shadow-2xs space-y-6">
                <h3 className="font-serif text-lg font-normal text-[#111111] flex items-center gap-2">
                  <FolderHeart size={18} className="text-neutral-500" />
                  Tus Memoriales Creados
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  {memorials.map((mem) => (
                    <div 
                      key={mem.id}
                      className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                        selectedId === mem.id 
                          ? "border-[#967B62] bg-neutral-50/50 " 
                          : "border-stone-200/60 bg-white hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200/40 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={mem.mainImage} alt={mem.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-serif font-bold text-[#111111] text-sm">{mem.name}</h4>
                          <span className="text-sm font-mono text-neutral-500 block">{mem.birthDate} - {mem.deathDate}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 pt-3 border-t border-stone-100 text-base">
                        <button
                          onClick={() => handleSelectMemorial(mem.id)}
                          className="font-semibold text-neutral-500 hover:text-[#111111] :text-white flex items-center gap-1"
                        >
                          <Settings size={12} /> Gestionar
                        </button>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => { handleSelectMemorial(mem.id); setActiveTab("qr"); }}
                            className="font-semibold text-[#967B62] hover:text-[#7D654E] flex items-center gap-1"
                          >
                            <QrCode size={12} /> Compartir QR
                          </button>
                          <Link 
                            href={`/memorial/${mem.slug}`}
                            target="_blank"
                            className="font-semibold text-neutral-500 hover:text-[#111111] :text-white flex items-center gap-1"
                          >
                            <Eye size={12} /> Ver
                          </Link>
                          {memorials.length > 1 && (
                            <button
                              onClick={() => handleDelete(mem.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create Memorial Form */}
              <div className="bg-white/80 backdrop-blur-sm border border-stone-200/60 p-5 md:p-8 rounded-2xl shadow-2xs">
                <div className="space-y-1.5 mb-6">
                  <h3 className="font-serif text-lg font-normal text-[#111111] flex items-center gap-2">
                    <Plus size={18} className="text-neutral-500" />
                    Crear Nuevo Memorial
                  </h3>
                  <p className="text-base text-neutral-500 max-w-md">
                    Crea un nuevo espacio memorial digital privado. Podrás configurarlo, invitar a familiares y rellenar recuerdos más tarde.
                  </p>
                </div>

                <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm uppercase tracking-widest text-neutral-500 font-bold block mb-1">Nombre Completo</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Alejandro Valenzuela García"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        required
                        className="w-full bg-white border border-stone-200/80 rounded-lg px-3 py-3 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-sm uppercase tracking-widest text-neutral-500 font-bold block mb-1">Enlace / Slug personalizado</label>
                      <div className="flex items-center">
                        <span className="px-2 py-3 bg-stone-100 border border-r-0 border-stone-200/80 rounded-l-lg text-neutral-500 font-mono text-sm">
                          /memorial/
                        </span>
                        <input 
                          type="text" 
                          placeholder="alejandro-valenzuela"
                          value={newSlug}
                          onChange={(e) => setNewSlug(e.target.value)}
                          required
                          className="w-full bg-white border border-stone-200/80 rounded-r-lg px-3 py-3 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm uppercase tracking-widest text-neutral-500 font-bold block mb-1">Nacimiento</label>
                        <input 
                          type="date" 
                          value={newBirth}
                          onChange={(e) => setNewBirth(e.target.value)}
                          className="w-full bg-white border border-stone-200/80 rounded-lg px-2 py-3 outline-none text-neutral-600 "
                        />
                      </div>
                      <div>
                        <label className="text-sm uppercase tracking-widest text-neutral-500 font-bold block mb-1">Fallecimiento</label>
                        <input 
                          type="date" 
                          value={newDeath}
                          onChange={(e) => setNewDeath(e.target.value)}
                          className="w-full bg-white border border-stone-200/80 rounded-lg px-2 py-3 outline-none text-neutral-600 "
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 flex flex-col justify-between">
                    <div>
                      <label className="text-sm uppercase tracking-widest text-neutral-500 font-bold block mb-1">Biografía Corta</label>
                      <textarea 
                        rows={4}
                        placeholder="Una breve descripción sobre su vida, virtudes, pasiones..."
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                        className="w-full bg-white border border-stone-200/80 rounded-xl px-3 py-3 outline-none resize-none"
                      ></textarea>
                    </div>

                    <div className="space-y-2 border-t border-stone-100 pt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={newIsPrivate}
                          onChange={(e) => setNewIsPrivate(e.target.checked)}
                          className="w-3.5 h-3.5 accent-neutral-800 border-neutral-300 rounded"
                        />
                        <span className="text-base text-neutral-500 font-semibold flex items-center gap-1">
                          <Lock size={10} /> Hacer memorial privado (acceso restringido)
                        </span>
                      </label>
                      
                      {newIsPrivate && (
                        <input 
                          type="password"
                          placeholder="Clave de acceso general (opcional)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full max-w-xs bg-white border border-stone-200/80 rounded-lg px-3 py-1.5 outline-none"
                        />
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-[#967B62] text-white hover:bg-[#7D654E] :bg-neutral-200 text-base uppercase tracking-widest font-bold transition-colors shadow-xs"
                    >
                      Registrar Memorial
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: Edit Info Form */}
          {activeTab === "edit" && activeMemorial && (
            <div className="bg-white/80 backdrop-blur-sm border border-stone-200/60 p-5 md:p-8 rounded-2xl shadow-2xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="font-serif text-lg font-normal text-[#111111] flex items-center gap-2">
                  <Settings size={18} className="text-neutral-500" />
                  Editar Datos de {activeMemorial.name}
                </h3>
              </div>

              <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm uppercase tracking-widest text-neutral-500 font-bold block mb-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full bg-white border border-stone-200/80 rounded-lg px-3 py-3 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm uppercase tracking-widest text-neutral-500 font-bold block mb-1">Nacimiento</label>
                      <input 
                        type="text" 
                        value={editBirth}
                        onChange={(e) => setEditBirth(e.target.value)}
                        className="w-full bg-white border border-stone-200/80 rounded-lg px-2 py-3 outline-none text-neutral-600 "
                      />
                    </div>
                    <div>
                      <label className="text-sm uppercase tracking-widest text-neutral-500 font-bold block mb-1">Fallecimiento</label>
                      <input 
                        type="text" 
                        value={editDeath}
                        onChange={(e) => setEditDeath(e.target.value)}
                        className="w-full bg-white border border-stone-200/80 rounded-lg px-2 py-3 outline-none text-neutral-600 "
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    <label className="text-sm uppercase tracking-widest text-neutral-500 font-bold block mb-1">Biografía</label>
                    <textarea 
                      rows={5}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full bg-white border border-stone-200/80 rounded-xl px-3 py-3 outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2 border-t border-stone-100 pt-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={editIsPrivate}
                        onChange={(e) => setEditIsPrivate(e.target.checked)}
                        className="w-3.5 h-3.5 accent-neutral-800 border-neutral-300 rounded"
                      />
                      <span className="text-base text-neutral-500 font-semibold flex items-center gap-1">
                        <Lock size={10} /> Hacer memorial privado (acceso restringido)
                      </span>
                    </label>
                    
                    {editIsPrivate && (
                      <input 
                        type="password"
                        placeholder="Definir contraseña general"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="w-full max-w-xs bg-white border border-stone-200/80 rounded-lg px-3 py-1.5 outline-none"
                      />
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-[#967B62] text-white hover:bg-[#7D654E] :bg-neutral-200 text-base uppercase tracking-widest font-bold transition-colors shadow-xs"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>

              {/* GESTIÓN DE ACCESOS Y SOLICITUDES INTEGRADA EN EL PERFIL */}
              <div className="mt-12 pt-8 border-t border-stone-200/60 space-y-8">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-normal text-[#111111] flex items-center gap-2">
                    <UserPlus size={18} className="text-neutral-500" />
                    Gestión de Accesos al Perfil
                  </h3>
                  <p className="text-base text-neutral-500">
                    Controla y diferencia quién tiene acceso concedido y quién ha solicitado unirse a este memorial.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5 md:p-8">
                  {/* Solicitudes Pendientes */}
                  <div className="space-y-4">
                    <span className="text-sm uppercase tracking-widest text-neutral-500 font-bold block mb-2">
                      Nuevas Solicitudes ({accessRequests.length})
                    </span>
                    {accessRequests.length === 0 ? (
                      <p className="text-base text-neutral-400 italic">No hay solicitudes pendientes.</p>
                    ) : (
                      <div className="space-y-3">
                        {accessRequests.map((req, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-stone-200/60 bg-white shadow-xs">
                            <span className="font-semibold block text-[#111111]">{req.email}</span>
                            <span className="text-sm text-neutral-500 block mb-3">Vínculo indicado: {req.relation}</span>
                            <div className="flex gap-2">
                              <button onClick={() => handleAcceptRequest(req.email, req.relation)} className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm md:text-base font-bold uppercase tracking-wider rounded">Aceptar</button>
                              <button onClick={() => handleRejectRequest(req.email)} className="flex-1 py-1.5 bg-stone-100 hover:bg-red-50 text-neutral-600 hover:text-red-600 text-sm md:text-base font-bold uppercase tracking-wider rounded transition-colors">Rechazar</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Accesos Concedidos */}
                  <div className="space-y-4">
                    <span className="text-sm uppercase tracking-widest text-neutral-500 font-bold block mb-2">
                      Accesos Concedidos
                    </span>
                    <div className="space-y-3">
                      {invitedMembers.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-stone-200/60 bg-stone-50/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                          <div>
                            <span className="font-semibold block text-sm text-[#111111]">{item.email}</span>
                            <span className="text-sm md:text-base text-neutral-500 uppercase tracking-wide">
                              {item.relation} • {item.status}
                            </span>
                          </div>
                          <button
                            onClick={() => setInvitedMembers(prev => prev.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:underline text-sm font-semibold"
                          >
                            Revocar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Upload Memories */}
          {activeTab === "upload" && activeMemorial && (
            <div className="bg-white/80 backdrop-blur-sm border border-stone-200/60 p-5 md:p-8 rounded-2xl shadow-2xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="font-serif text-lg font-normal text-[#111111] flex items-center gap-2">
                  <Upload size={18} className="text-neutral-500" />
                  Añadir Recuerdos Multimedia a {activeMemorial.name}
                </h3>
              </div>

              <form onSubmit={handleUploadMemory} className="grid md:grid-cols-2 gap-4 md:p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-base uppercase tracking-widest text-neutral-500 block mb-1">Título del recuerdo</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Tarde de música clásica en casa"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      required
                      className="w-full bg-white border border-stone-200/80 rounded-lg px-3.5 py-3 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-base uppercase tracking-widest text-neutral-500 block mb-1">Tipo de recuerdo</label>
                    <select 
                      value={uploadType}
                      onChange={(e) => setUploadType(e.target.value as "PHOTO" | "VIDEO" | "STORY" | "AUDIO")}
                      className="w-full bg-white border border-stone-200/80 rounded-lg px-3 py-3 outline-none text-[#111111] "
                    >
                      <option value="PHOTO">Fotografía</option>
                      <option value="VIDEO">Video conmemorativo</option>
                      <option value="STORY">Relato escrito / Anécdota</option>
                      <option value="AUDIO">Archivo de audio / Nota de voz</option>
                    </select>
                  </div>

                  {uploadType !== "STORY" && (
                    <div>
                      <label className="text-base uppercase tracking-widest text-neutral-500 block mb-1">
                        URL del Archivo Multimedia (o Simulado)
                      </label>
                      <input 
                        type="text" 
                        placeholder={uploadType === "PHOTO" ? "https://images.unsplash.com/... o vacío para simular" : "Enlace al video / audio"}
                        value={uploadFileUrl}
                        onChange={(e) => setUploadFileUrl(e.target.value)}
                        className="w-full bg-white border border-stone-200/80 rounded-lg px-3.5 py-3 outline-none font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    <label className="text-base uppercase tracking-widest text-neutral-500 block mb-1">Descripción o Contenido Escrito</label>
                    <textarea 
                      rows={5}
                      placeholder="Escribe la historia o añade detalles adicionales..."
                      value={uploadContent}
                      onChange={(e) => setUploadContent(e.target.value)}
                      className="w-full bg-white border border-stone-200/80 rounded-xl px-3 py-3 outline-none resize-none font-sans"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-lg bg-[#967B62] text-white hover:bg-[#7D654E] :bg-neutral-200 text-base uppercase tracking-widest font-bold transition-colors shadow-xs"
                    >
                      Subir al Memorial
                    </button>
                    
                    {uploadSuccess && (
                      <span className="text-base text-green-500 font-semibold flex items-center gap-1">
                        <CheckCircle size={12} /> Guardado con éxito
                      </span>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3.5: Collage Creator */}
          {activeTab === "collage" && activeMemorial && (
            <div className="bg-white/80 backdrop-blur-sm border border-stone-200/60 p-5 md:p-8 rounded-2xl shadow-2xs space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="font-serif text-lg font-normal text-[#111111] flex items-center gap-2">
                  <LayoutGrid size={18} className="text-[#967B62]" />
                  Crear Collage de Fotos para {activeMemorial.name}
                </h3>
                <p className="text-base text-neutral-500 mt-2">
                  Sube múltiples fotos a la vez para generar automáticamente un hermoso collage en la galería del memorial.
                </p>
              </div>

              <div className="border-2 border-dashed border-stone-200 rounded-2xl p-12 text-center hover:bg-stone-50/50 transition-colors cursor-pointer group" onClick={async () => {
                const demoPhotos = [
                  "https://picsum.photos/id/93/2000/1200",
                  "https://picsum.photos/id/93/2000/1200",
                  "https://picsum.photos/id/93/2000/1200",
                  "https://picsum.photos/id/93/2000/1200",
                  "https://picsum.photos/id/93/2000/1200"
                ];
                
                for (let i = 0; i < demoPhotos.length; i++) {
                  await fetch("/api/memories", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      memorialId: selectedId,
                      authorName: session?.email.split("@")[0] || "Familiar",
                      authorRelation: "Familia",
                      title: `Recuerdo ${i+1}`,
                      type: "PHOTO",
                      content: "Un momento inolvidable.",
                      fileUrl: demoPhotos[i]
                    })
                  }).catch(() => {});
                }
                
                confetti({
                  particleCount: 50,
                  spread: 80,
                  colors: ["#967B62", "#E5E7EB", "#111111"],
                });
                alert("¡Collage creado! Las fotos se han subido con éxito. Puedes verlas en la Vista Pública del memorial.");
              }}>
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={24} className="text-[#967B62]" />
                </div>
                <h4 className="font-semibold text-[#111111] mb-1">Arrastra y suelta tus fotos aquí</h4>
                <p className="text-base text-neutral-500 mb-4">o haz clic para explorar tus archivos (Simulación: clic para autogenerar)</p>
                <span className="px-4 py-3 bg-[#967B62] text-white text-base uppercase tracking-widest font-bold rounded-lg shadow-xs inline-block">
                  Seleccionar Múltiples Archivos
                </span>
              </div>
            </div>
          )}



          {/* TAB 5: QR Code Generator */}
          {activeTab === "qr" && activeMemorial && (
            <div className="max-w-md mx-auto">
              <QrCodeGenerator 
                url={`${typeof window !== "undefined" ? window.location.origin : ""}/memorial/${activeMemorial.slug}`} 
                name={activeMemorial.name} 
              />
            </div>
          )}

        </main>
      </div>

      {/* Ambient footer */}
      <footer className="py-12 border-t border-stone-200/40 text-center text-base text-neutral-500 font-mono">
        <p>Aeterna Memorial Platform © 2026. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}
