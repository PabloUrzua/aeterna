"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  User,
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
  ChevronRight,
  RefreshCw,
  Menu,
  X,
  XCircle,
  Info,
  LogOut,
  Undo,
  Mail,
  Heart,
  Shield,
  Calendar,
  Clock,
  MapPin,
  Flower2,
  Eye,
  Plus,
  AlertCircle
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useBranding } from "../../context/BrandingContext";
import confetti from "canvas-confetti";
import { createClient } from "@/utils/supabase/client";

export default function FamiliaDashboard({ switchRole, originalRole }: { switchRole?: (role: string) => void, originalRole?: string | null }) {
  const router = useRouter();
  const { config } = useBranding();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<{ email: string; role: string } | null>(null);
  const [memberSince, setMemberSince] = useState("");

  // Estados de "Gestión de Accesos Familiares" (Real via Supabase)
  const [accessRequests, setAccessRequests] = useState<any[]>([]);
  const [familyMembersList, setFamilyMembersList] = useState<any[]>([]);
  const [myInvitations, setMyInvitations] = useState<any[]>([]);
  const [isLoadingAccess, setIsLoadingAccess] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user_session");
    let currentSession = null;
    if (saved) {
      currentSession = JSON.parse(saved);
      setSession(currentSession);
    }
    const regDate = localStorage.getItem("amuley_user_registered");
    if (regDate) setMemberSince(regDate);
    
    fetchFamilyAccesses(currentSession);

    const supabase = createClient();
    const channel = supabase
      .channel('family_accesses_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_accesses' }, () => {
        fetchFamilyAccesses(currentSession);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFamilyAccesses = async (currentSession: any) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('family_accesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn("Could not fetch family_accesses (Table might not exist yet).");
        return;
      }

      if (data) {
        setAccessRequests(data.filter(d => d.status === 'pending'));
        setFamilyMembersList(data.filter(d => d.status === 'accepted' || d.status === 'invited'));
        if (currentSession?.email) {
          setMyInvitations(data.filter(d => d.status === 'invited' && d.email.toLowerCase() === currentSession.email.toLowerCase()));
        }
      }
    } catch (err: any) {
      console.warn("Exception fetching family accesses:", err.message);
    } finally {
      setIsLoadingAccess(false);
    }
  };

  const getInitials = (email: string) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };
  
  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return d.toLocaleDateString('es-ES', options);
  };
  
  // Miembros de la familia
  const [isPet, setIsPet] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([
    { id: "f1", name: "Marta Valenzuela", role: "Administrador", relation: "Hija", email: "marta@correo.com" },
    { id: "f2", name: "Alejandro Valenzuela Hijo", role: "Administrador", relation: "Hijo", email: "alejandro.hijo@correo.com" },
    { id: "f3", name: "Sofía Valenzuela", role: "Colaborador", relation: "Nieta", email: "sofia.v@correo.com" }
  ]);

  // Extra states for unified User/Familia dashboard
  const [invitedMemorials, setInvitedMemorials] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<{name: string; date: string; status: string}[]>([]);

  const handleRemoveMember = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('family_accesses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFamilyMembersList(prev => prev.filter(m => m.id !== id));
      showToast("Acceso de familiar eliminado", "success");
    } catch (err: any) {
      showToast(`Error al eliminar: ${err.message}`, "error", "Error");
    }
  };

  const handleAcceptRequest = async (req: any) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('family_accesses')
        .update({ status: 'accepted' })
        .eq('id', req.id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setAccessRequests(prev => prev.filter(r => r.id !== req.id));
        setFamilyMembersList(prev => [data[0], ...prev]);
        showToast("Solicitud aceptada. Acceso concedido.", "success");
      }
    } catch (err: any) {
      showToast(`Error al aceptar: ${err.message}`, "error", "Error");
    }
  };

  const handleDenyRequest = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('family_accesses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAccessRequests(prev => prev.filter(r => r.id !== id));
      showToast("Solicitud denegada.", "info");
    } catch (err: any) {
      showToast(`Error al denegar: ${err.message}`, "error", "Error");
    }
  };

  const handleAcceptInvitation = async (req: any) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('family_accesses')
        .update({ status: 'accepted' })
        .eq('id', req.id);

      if (error) throw error;
      
      showToast("¡Has aceptado la invitación a la familia!", "success");
      
      // Reload page to re-evaluate role
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      showToast(`Error al aceptar invitación: ${err.message}`, "error", "Error");
    }
  };

  const handleDenyInvitation = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('family_accesses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMyInvitations(prev => prev.filter(r => r.id !== id));
      showToast("Has rechazado la invitación.", "info");
    } catch (err: any) {
      showToast(`Error al rechazar invitación: ${err.message}`, "error", "Error");
    }
  };


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

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{title?: string; text: string; type: "success" | "error" | "info"} | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "info", title?: string) => {
    setToastMessage({ text, type, title });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Memorial Edit State
  const [isEditingMemorial, setIsEditingMemorial] = useState(false);
  const [profileName, setProfileName] = useState("Alejandro Valenzuela");
  const [profileBirth, setProfileBirth] = useState("1948");
  const [profileDeath, setProfileDeath] = useState("2026");
  const [profileLocation, setProfileLocation] = useState("Valparaíso, Chile");
  const [profileSuccess, setProfileSuccess] = useState(false);

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

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('family_accesses')
        .insert([
          { email: inviteEmail.trim(), status: 'invited', role: inviteRole }
        ])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        showToast("Invitación enviada correctamente", "success");
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
      }
    } catch (err: any) {
      showToast(`Error al enviar invitación: ${err.message}`, "error", "Error");
    }
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

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/login");
  };

  return (
    <div className="min-h-screen font-sans smooth-transition text-sm md:text-base" style={{background: "linear-gradient(135deg, #FAF7F4 0%, #F0E8E0 40%, #E8DDD4 100%)"}}>
      {/* Header Premium */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-[#967B62]/10 shadow-[0_2px_20px_rgba(150,123,98,0.08)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-[#967B62]/40 [transform:translateZ(0)]">
              <img src="/logo.png" alt="Amuley" className="w-full h-full object-cover scale-[1.6]" />
            </div>
            <div className="flex flex-col border-l border-stone-200 pl-3 md:pl-4">
              <span className="font-serif text-lg md:text-xl tracking-[0.2em] font-bold uppercase text-[#967B62] leading-none mb-1">
                AMULEY
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold">Consola del Memorial</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 bg-stone-50/80 px-3.5 py-2 rounded-xl border border-stone-200/60">
              <Mail size={13} className="text-[#967B62]" />
              <span className="max-w-[180px] truncate">{session ? session.email : "Cargando..."}</span>
            </div>

            {originalRole === "ADMIN" && (
              <button 
                onClick={() => switchRole?.("ADMIN")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:bg-neutral-100 border border-neutral-200 transition-all"
              >
                <Undo size={13} /> Volver a Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 border border-red-100 transition-all duration-200"
            >
              <LogOut size={13} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-7">
        
        {!isEditingMemorial && (
          <>
            {/* Hero Banner Premium */}
        <section className="relative overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(150,123,98,0.15)]">
          <div
            className="h-44 md:h-52 relative"
            style={{background: "linear-gradient(135deg, #5C3D2A 0%, #8A6A52 30%, #B89A80 65%, #967B62 100%)"}}
          >
            {/* Orbes decorativos */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20" style={{background: "radial-gradient(circle, #fff 0%, transparent 70%)"}}></div>
            <div className="absolute -bottom-10 left-1/3 w-72 h-36 rounded-full opacity-10" style={{background: "radial-gradient(circle, #fff 0%, transparent 70%)"}}></div>
            <div className="absolute top-6 right-24 w-2 h-2 bg-white/50 rounded-full"></div>
            <div className="absolute top-12 right-40 w-1 h-1 bg-white/70 rounded-full"></div>
            <div className="absolute top-4 right-32 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
            <div className="absolute bottom-8 left-16 w-1 h-1 bg-white/40 rounded-full"></div>
            <div className="absolute top-8 left-48 w-1.5 h-1.5 bg-white/25 rounded-full"></div>
            {/* Label */}
            <div className="absolute top-6 left-8 md:left-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white/80 text-[10px] uppercase tracking-[0.25em] font-bold">
                <Shield size={9} /> Tu Espacio
              </span>
            </div>
            <button
              onClick={() => router.push("/solicitar-memorial")}
              className="absolute top-5 right-5 md:top-6 md:right-8 flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-white/30 active:scale-[0.98] transition-all duration-300 border border-white/30 shadow-lg"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Solicitar Memorial</span>
              <span className="sm:hidden">Solicitar</span>
            </button>
          </div>

          {/* Contenido solapado */}
          <div className="bg-white px-8 md:px-12 pb-8 -mt-20 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div
                className="w-28 h-28 md:w-32 md:h-32 rounded-[22px] flex items-center justify-center text-white text-4xl md:text-5xl font-bold font-serif border-[4px] border-white z-10 shadow-[0_10px_40px_rgba(150,123,98,0.35)]"
                style={{background: "linear-gradient(145deg, #7A5A42, #967B62, #B89A80)"}}
              >
                {session ? getInitials(session.email) : "U"}
              </div>
              <div className="flex-1 pb-1">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1a1208] leading-tight">
                  {session ? session.email.split("@")[0].charAt(0).toUpperCase() + session.email.split("@")[0].slice(1) : "Cargando..."}
                </h1>
                <p className="text-[11px] text-[#967B62] mt-1.5 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                  <Shield size={10} />
                  {originalRole === "ADMIN" ? "Súper Administrador" : originalRole === "FAMILIA" ? "Administrador del Memorial" : "Usuario Visitante"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5 mt-5">
              <div className="inline-flex items-center gap-2 text-xs text-neutral-500 bg-stone-50 border border-stone-100 px-4 py-2.5 rounded-xl">
                <Calendar size={12} className="text-[#967B62]" />
                <span>Miembro desde <strong className="text-neutral-700">{memberSince ? formatDate(memberSince) : "hoy"}</strong></span>
              </div>
              <div className="inline-flex items-center gap-2 text-xs text-neutral-500 bg-stone-50 border border-stone-100 px-4 py-2.5 rounded-xl">
                <Mail size={12} className="text-[#967B62]" />
                <span>{session ? session.email : "Cargando..."}</span>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl">
                <Sparkles size={12} />
                Cuenta Activa
              </div>
            </div>
          </div>
        </section>

        {/* Estadísticas Rápidas - Glassmorphism vibrante */}
        <div className="grid grid-cols-3 gap-4">
          <div
            className="relative overflow-hidden rounded-2xl p-5 cursor-default hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 shadow-md hover:shadow-xl"
            style={{background: "linear-gradient(145deg, #967B62 0%, #7A5A42 100%)"}}
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10"></div>
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/5"></div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
              <Heart size={18} className="text-white" fill="rgba(255,255,255,0.3)" />
            </div>
            <p className="text-3xl font-bold text-white font-serif leading-none">
              {(originalRole === "ADMIN" || originalRole === "FAMILIA") ? "1" : "0"}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-white/65 font-bold mt-1.5">
              {(originalRole === "ADMIN" || originalRole === "FAMILIA") ? "Memorial" : "Memoriales"}
            </p>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl p-5 cursor-default hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 shadow-md hover:shadow-xl"
            style={{background: "linear-gradient(145deg, #1a8a56 0%, #116038 100%)"}}
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10"></div>
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/5"></div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
              <Sparkles size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-white font-serif leading-none">Activo</p>
            <p className="text-[10px] uppercase tracking-widest text-white/65 font-bold mt-1.5">Estado</p>
          </div>

          <div
            className="relative overflow-hidden rounded-2xl p-5 cursor-default hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 shadow-md hover:shadow-xl flex flex-col justify-between"
            style={{background: "linear-gradient(145deg, #2d6abf 0%, #1a4080 100%)"}}
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10"></div>
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/5"></div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
              <Mail size={18} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-white font-serif leading-none">{myInvitations.length}</p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-white/65 font-bold mt-1.5 truncate">Invitaciones</p>
          </div>
        </div>

        {/* Memoriales Administrados */}
        {(originalRole === "ADMIN" || originalRole === "FAMILIA") && (
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#967B62]/10 flex items-center justify-center">
                <Flower2 size={15} className="text-[#967B62]" />
              </div>
              <h2 className="font-serif text-lg font-semibold text-[#1a1208]">Memoriales Administrados</h2>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold bg-stone-100 px-3 py-1.5 rounded-full">1 activo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 group border border-stone-100">
              {/* Imagen grande con overlay */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80"
                  alt="Alejandro Valenzuela"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0" style={{background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"}}></div>
                
                {/* Badge tipo/modo */}
                <div className="absolute top-4 left-4">
                  <button
                    onClick={() => setIsPet(!isPet)}
                    className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full text-[10px] text-white hover:bg-black/60 font-bold transition-all duration-200 border border-white/15 active:scale-95"
                  >
                    {isPet ? "🐾 Mascota" : "👤 Persona"}
                  </button>
                </div>
                
                {/* Botón de ver memorial flotante */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    href="/memorial/alejandro-valenzuela"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-full text-[10px] text-[#967B62] font-bold hover:bg-white transition-all"
                  >
                    <ExternalLink size={10} /> Ver Memorial
                  </Link>
                </div>

                {/* Info del fallecido */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-serif text-2xl font-bold drop-shadow-lg">{profileName}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-white/70 text-xs flex items-center gap-1">
                      <Calendar size={10} /> {profileBirth} — {profileDeath}
                    </span>
                    <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                    <span className="text-white/70 text-xs">{profileLocation}</span>
                  </div>
                </div>
              </div>

              {/* Panel de acciones */}
              <div className="p-5">
                {/* Mini stats */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="text-center p-2 bg-stone-50 rounded-xl">
                    <p className="text-base font-bold text-[#967B62] font-serif">{familyMembers.length}</p>
                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Familia</p>
                  </div>
                  <div className="text-center p-2 bg-emerald-50 rounded-xl">
                    <p className="text-base font-bold text-emerald-600 font-serif">24</p>
                    <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Fotos</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-xl col-span-1 flex flex-col items-center justify-center">
                    <a href="/memorial/alejandro-valenzuela" target="_blank" className="flex flex-col items-center gap-0.5">
                      <QrCode size={14} className="text-blue-600" />
                      <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">QR</p>
                    </a>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-xl col-span-1 flex flex-col items-center justify-center">
                    <button onClick={handleDownloadBackup} className="flex flex-col items-center gap-0.5">
                      <Download size={14} className="text-purple-600" />
                      <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">ZIP</p>
                    </button>
                  </div>
                </div>

                {/* Botón principal */}
                {(originalRole === "ADMIN" || originalRole === "FAMILIA") ? (
                  <button
                    onClick={() => setIsEditingMemorial(true)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white text-xs uppercase tracking-[0.15em] font-bold active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-lg hover:brightness-110"
                    style={{background: "linear-gradient(135deg, #967B62 0%, #7D654E 100%)"}}
                  >
                    <Settings size={14} />
                    Administrar Memorial
                  </button>
                ) : (
                  <Link
                    href="/memorial/alejandro-valenzuela"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white text-xs uppercase tracking-[0.15em] font-bold active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-lg hover:brightness-110"
                    style={{background: "linear-gradient(135deg, #967B62 0%, #7D654E 100%)"}}
                  >
                    <ExternalLink size={14} />
                    Ver Memorial
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
        )}



        {/* Invitaciones Recibidas (Solo Visitantes) */}
        {(originalRole !== "ADMIN" && originalRole !== "FAMILIA") && myInvitations.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-5">
              <Mail size={18} className="text-[#967B62]" />
              <h2 className="font-serif text-lg font-semibold text-[#111]">Invitaciones a Familias</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {myInvitations.map(inv => (
                <div key={inv.id} className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm">
                  <p className="text-sm text-neutral-600 mb-4">
                    Has sido invitado a unirte como <strong className="text-[#111]">{inv.role}</strong>.
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleAcceptInvitation(inv)}
                      className="flex-1 py-2.5 bg-[#967B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#856b54] transition-colors"
                    >
                      Aceptar
                    </button>
                    <button 
                      onClick={() => handleDenyInvitation(inv.id)}
                      className="flex-1 py-2.5 bg-neutral-100 text-neutral-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gestión de Accesos Familiares */}
        {(originalRole === "ADMIN" || originalRole === "FAMILIA") && (
        <section className="mt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-2">
              <UserPlus size={18} className="text-[#967B62]" />
              <h2 className="font-serif text-lg font-semibold text-[#111]">Gestión de Accesos Familiares</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna Izquierda: Solicitudes de Acceso */}
            <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm flex flex-col">
              <h3 className="text-sm uppercase tracking-widest text-neutral-400 font-bold mb-4 flex items-center gap-2">
                <Mail size={16} />
                Propuestas de Acceso (Pendientes)
              </h3>
              
              {isLoadingAccess ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#967B62] mb-4"></div>
                  <p className="text-sm">Cargando solicitudes...</p>
                </div>
              ) : accessRequests.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                  <Mail size={24} className="mb-2 opacity-50" />
                  <p className="text-sm">No hay solicitudes pendientes.</p>
                </div>
              ) : (
                <div className="space-y-3 flex-1">
                  {accessRequests.map(req => (
                    <div key={req.id} className="bg-stone-50 border border-stone-200/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#111] break-all">{req.email}</p>
                        <p className="text-xs text-neutral-500 mt-1">Solicitó unirse el: {formatDate(req.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleAcceptRequest(req)}
                          className="px-3 py-1.5 bg-[#967B62] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#856b54] transition-colors"
                        >
                          Aceptar
                        </button>
                        <button 
                          onClick={() => handleDenyRequest(req.id)}
                          className="px-3 py-1.5 bg-neutral-200 text-neutral-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-300 transition-colors"
                        >
                          Denegar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Columna Derecha: Familiares con Acceso */}
            <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm flex flex-col">
              <h3 className="text-sm uppercase tracking-widest text-neutral-400 font-bold mb-4 flex items-center gap-2">
                <Shield size={16} />
                Familiares con Acceso
              </h3>

              <form onSubmit={handleSendInvite} className="flex flex-col gap-2 mb-6">
                <p className="text-xs text-neutral-500 font-medium">Invitar a un familiar al memorial:</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    required
                    placeholder="Correo electrónico del familiar..."
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1 min-w-0 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#967B62]"
                  />
                  <button type="submit" className="shrink-0 px-4 py-2 bg-[#967B62] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#856b54] transition-colors whitespace-nowrap">
                    Invitar
                  </button>
                </div>
              </form>

              {isLoadingAccess ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#967B62] mb-4"></div>
                  <p className="text-sm">Cargando familiares...</p>
                </div>
              ) : familyMembersList.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                  <UserPlus size={24} className="mb-2 opacity-50" />
                  <p className="text-sm">No hay familiares con acceso aún.</p>
                </div>
              ) : (
                <div className="space-y-3 flex-1 max-h-[300px] overflow-y-auto pr-2">
                  {familyMembersList.map(member => (
                    <div key={member.id} className="bg-stone-50 border border-stone-200/60 rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#967B62]/10 flex items-center justify-center text-[#967B62] font-bold text-xs shrink-0">
                          {getInitials(member.email)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#111] break-all leading-tight mb-1">
                            {member.email} {member.email === session?.email && <span className="text-[9px] text-[#967B62] font-bold ml-1">(Tú)</span>}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                            {member.role} {member.status === 'invited' && <span className="text-amber-500 ml-1">(Pendiente)</span>}
                          </p>
                        </div>
                      </div>
                      {member.email !== session?.email && (
                        <button 
                          onClick={() => handleRemoveMember(member.id)}
                          className="shrink-0 text-red-400 hover:text-red-600 transition-colors p-1 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider whitespace-nowrap"
                          title={member.status === 'invited' ? "Cancelar Invitación" : "Eliminar"}
                        >
                          <XCircle size={14} /> {member.status === 'invited' ? "Cancelar" : "Eliminar"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
        )}
        </>
        )}

        {/* Herramientas de Edición */}
        {isEditingMemorial && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsEditingMemorial(false)}
                  className="p-2.5 rounded-xl hover:bg-white/60 bg-white/40 border border-stone-200 text-[#967B62] transition-all shadow-sm"
                >
                  <Undo size={18} />
                </button>
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#111]">Administrando Memorial</h2>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mt-1">
                    {profileName} • {profileBirth}-{profileDeath}
                  </p>
                </div>
              </div>
              
              <Link
                href="/memorial/alejandro-valenzuela"
                target="_blank"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-[#967B62] hover:bg-white transition-all"
              >
                <ExternalLink size={14} />
                Ver Vista Pública
              </Link>
            </div>

            {/* Editar Perfil Principal */}
            <section className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/60 shadow-sm text-left">
              <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
                <User size={18} className="text-[#967B62]" />
                Perfil del Fallecido
              </h2>
              <p className="text-neutral-500 font-light leading-relaxed mb-6 text-sm">
                Actualiza la información básica que aparecerá en la cabecera del memorial público.
              </p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setProfileSuccess(true);
                  confetti({ particleCount: 30, spread: 40, colors: ["#967B62"] });
                  setProfileDeath("1996");
                  setTimeout(() => setProfileSuccess(false), 3000);
                }}
                className="space-y-5"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Selector de Foto */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div 
                      className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-stone-100 shadow-md relative group cursor-pointer"
                      onClick={() => {
                        confetti({ particleCount: 15, spread: 25, colors: ["#967B62"] });
                        showToast("Explorador de archivos abierto. Selecciona una nueva foto JPG/PNG.", "info", "Subir Foto");
                      }}
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80" 
                        alt="Foto Principal" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                        <Upload size={20} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Cambiar Foto</span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Foto Principal</span>
                  </div>

                  {/* Campos de texto */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Nombre Completo</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#967B62]/20 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Lugar de Origen</label>
                      <input
                        type="text"
                        value={profileLocation}
                        onChange={(e) => setProfileLocation(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#967B62]/20 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Año de Nacimiento</label>
                      <input
                        type="text"
                        value={profileBirth}
                        onChange={(e) => setProfileBirth(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#967B62]/20 transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Año de Fallecimiento</label>
                      <input
                        type="text"
                        value={profileDeath}
                        onChange={(e) => setProfileDeath(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#967B62]/20 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#967B62] text-white text-xs font-bold uppercase tracking-[0.15em] hover:brightness-110 active:scale-[0.98] transition-all shadow-md"
                  >
                    {profileSuccess ? <CheckCircle size={15} /> : <Settings size={15} />}
                    {profileSuccess ? "Guardado" : "Guardar Perfil"}
                  </button>
                </div>
              </form>
            </section>
          
          {/* Editar Biografía Principal */}
          <section className="bg-white p-5 md:p-8 rounded-3xl border border-stone-200/60 shadow-sm text-left">
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

          {/* Familiares e Invitados */}
          <section className="bg-white p-5 md:p-8 rounded-3xl border border-stone-200/60 shadow-sm text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
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
                      showToast(`Explorador de archivos abierto. Selecciona tu archivo ${uploadType === "photo" ? "JPG/PNG" : "MP3/WAV"}.`, "info", "Subir Archivo");
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
          <section className="bg-white p-5 md:p-8 rounded-3xl border border-stone-200/60 shadow-sm text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              <UserPlus size={18} className="text-[var(--tenant-primary)]" />
              Invitar a un Miembro de la Familia
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Envía invitaciones para que otros familiares colaboren. Los administradores pueden moderar comentarios y editar; los colaboradores solo pueden subir sus propios recuerdos sin borrar los ajenos.
            </p>

            {/* Lista de Miembros Actuales */}
            <div className="mb-8 space-y-3 bg-neutral-50/50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
              <h3 className="font-serif text-sm font-semibold mb-3 text-neutral-800 dark:text-neutral-200">Miembros Actuales del Círculo</h3>
              {familyMembers.map((member) => (
                <div key={member.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 text-xs md:text-sm border-b border-neutral-200/60 dark:border-neutral-800 pb-3 last:border-0 last:pb-0">
                  <div>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">{member.name}</span>
                    <span className="text-neutral-500 font-light">{member.relation} • {member.email}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${member.role === 'Administrador' ? 'bg-[#967B62]/10 text-[#967B62]' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>

            <h3 className="font-serif text-sm font-semibold mb-3 text-neutral-800 dark:text-neutral-200">Invitar Nuevo Miembro</h3>
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

          {/* Aportes en el Memorial */}
          <section className="bg-white p-5 md:p-8 rounded-3xl border border-stone-200/60 shadow-sm text-left">
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

          {/* Árbol Genealógico */}
          <section className="bg-white p-5 md:p-8 rounded-3xl border border-stone-200/60 shadow-sm text-left">
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

          {/* Línea de Tiempo */}
          <section className="bg-white p-5 md:p-8 rounded-3xl border border-stone-200/60 shadow-sm text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              ⏳ {isPet ? "Mejores Momentos (Línea de Vida)" : "Creador de Línea de Vida (Hitos)"}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              {isPet
                ? "Agrega los momentos más divertidos y entrañables en la vida de tu mascota. Se mostrarán cronológicamente."
                : "Agrega hitos históricos clave en la vida del ser querido. Se mostrarán ordenados cronológicamente en el memorial público."}
            </p>

            <div className="grid md:grid-cols-12 gap-6 md:p-6">
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
                className="md:col-span-5 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-neutral-900/30 space-y-4"
              >
                <span className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 font-bold block mb-1">Registrar Nuevo Hito</span>
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-1">
                    <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Año</label>
                    <input 
                      type="number" 
                      placeholder="1974"
                      value={eventYear}
                      onChange={(e) => setEventYear(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 outline-none text-sm md:text-base"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Título del Hito</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Graduación"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 outline-none text-sm md:text-base"
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
              <div className="md:col-span-7 space-y-3">
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
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={`flex items-start gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md min-w-[300px] max-w-[400px] ${
            toastMessage.type === 'error' ? 'bg-red-50/90 border-red-200 text-red-800' :
            toastMessage.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' :
            'bg-stone-800/90 border-stone-700 text-white'
          }`}>
            <div className="mt-0.5">
              {toastMessage.type === 'error' ? <XCircle size={18} className="text-red-500" /> :
               toastMessage.type === 'success' ? <CheckCircle size={18} className="text-emerald-500" /> :
               <Info size={18} className="text-stone-300" />}
            </div>
            <div>
              {toastMessage.title && <h4 className="font-bold text-sm mb-0.5">{toastMessage.title}</h4>}
              <p className="text-xs sm:text-sm font-medium">{toastMessage.text}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="ml-auto opacity-70 hover:opacity-100 transition-opacity">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

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
