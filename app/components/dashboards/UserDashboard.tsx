"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Heart,
  Eye,
  LogOut,
  Calendar,
  MapPin,
  Flower2,
  Clock,
  Shield,
  ExternalLink,
  Sparkles,
  Plus,
  Send,
  CheckCircle,
  AlertCircle,
  FileText
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface InvitedMemorial {
  id: string;
  slug: string;
  name: string;
  birthDate: string;
  deathDate: string;
  mainImage: string;
  invitedBy: string;
  invitedDate: string;
  relation: string;
  tenantName?: string;
}

export default function UserDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<{ email: string; role: string } | null>(null);
  const [invitedMemorials, setInvitedMemorials] = useState<InvitedMemorial[]>([]);
  const [memberSince, setMemberSince] = useState("");

  // Solicitudes previas
  const [myRequests, setMyRequests] = useState<{name: string; date: string; status: string}[]>([]);

  // Pedir unirse a familia
  const [targetAdminEmail, setTargetAdminEmail] = useState("");
  const [isRequestingFamily, setIsRequestingFamily] = useState(false);
  const [familyRequestStatus, setFamilyRequestStatus] = useState<"idle" | "success" | "error">("idle");
  const [familyRequestMessage, setFamilyRequestMessage] = useState("");

  useEffect(() => {
    let parsedSession = null;
    const saved = localStorage.getItem("user_session");
    if (saved) {
      parsedSession = JSON.parse(saved);
      setSession(parsedSession);
    }

    // Calcular fecha de registro
    const regDate = localStorage.getItem("amuley_user_registered");
    if (!regDate) {
      const now = new Date().toISOString();
      localStorage.setItem("amuley_user_registered", now);
      setMemberSince(now);
    } else {
      setMemberSince(regDate);
    }

    // Cargar memoriales a los que fue invitado
    const invitesStr = localStorage.getItem("amuley_user_invites");
    if (invitesStr) {
      const allInvites = JSON.parse(invitesStr);
      const myInvites = parsedSession ? allInvites.filter((i: any) => i.inviteEmail === parsedSession.email) : [];
      setInvitedMemorials(myInvites);
    }

    // Cargar solicitudes previas
    const reqStr = localStorage.getItem("amuley_user_requests");
    if (reqStr) {
      setMyRequests(JSON.parse(reqStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    router.push("/login");
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("es-CL", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  const getInitials = (email: string) => {
    return email.split("@")[0].substring(0, 2).toUpperCase();
  };

  const handleRequestFamilyAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !targetAdminEmail.trim()) return;
    setIsRequestingFamily(true);
    setFamilyRequestStatus("idle");
    
    try {
      const supabase = createClient();
      // Insert a request. Target admin email isn't stored in DB schema yet,
      // but inserting the user's email puts them in the admin's 'Propuestas de Acceso' queue.
      const { error } = await supabase
        .from('family_accesses')
        .insert([{ email: session.email, status: 'pending', role: 'Familiar' }]);
        
      if (error) throw error;
      
      setFamilyRequestStatus("success");
      setFamilyRequestMessage("¡Solicitud enviada! El administrador deberá aceptarla en su panel.");
      setTargetAdminEmail("");
    } catch (err: any) {
      setFamilyRequestStatus("error");
      setFamilyRequestMessage("Ocurrió un error al enviar la solicitud.");
    } finally {
      setIsRequestingFamily(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#967B62]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans smooth-transition text-sm md:text-base" style={{background: "linear-gradient(135deg, #FAF7F4 0%, #F0E8E0 40%, #E8DDD4 100%)"}}>
      {/* Header Premium */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-[#967B62]/10 shadow-[0_2px_20px_rgba(150,123,98,0.08)]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-[#967B62]/40 [transform:translateZ(0)]">
              <img src="/logo.png" alt="Amuley" className="w-full h-full object-cover scale-[1.6]" />
            </div>
            <div className="flex flex-col border-l border-stone-200 pl-3 md:pl-4">
              <span className="font-serif text-lg md:text-xl tracking-[0.2em] font-bold uppercase text-[#967B62] leading-none mb-1">AMULEY</span>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold">Mi Espacio Personal</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-500 bg-stone-50 px-4 py-2.5 rounded-xl">
              <Mail size={16} className="text-[#967B62]" />
              <span>{session.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 border border-red-100 transition-all duration-200"
            >
              <LogOut size={16} />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Perfil del Usuario */}
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
              className="absolute top-5 right-5 md:top-6 md:right-8 flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm font-bold uppercase tracking-wider hover:bg-white/30 active:scale-[0.98] transition-all duration-300 border border-white/30 shadow-lg"
            >
              <Plus size={16} />
              Solicitar Memorial
            </button>
          </div>
          
          {/* Contenido solapado */}
          <div className="bg-white px-8 md:px-12 pb-8 -mt-20 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div
                className="w-28 h-28 md:w-32 md:h-32 rounded-[22px] flex items-center justify-center text-white text-4xl md:text-5xl font-bold font-serif border-[4px] border-white z-10 shadow-[0_10px_40px_rgba(150,123,98,0.35)]"
                style={{background: "linear-gradient(145deg, #7A5A42, #967B62, #B89A80)"}}
              >
                {getInitials(session.email)}
              </div>
              <div className="flex-1 pb-1">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1a1208] leading-tight">
                  {session.email.split("@")[0].charAt(0).toUpperCase() + session.email.split("@")[0].slice(1)}
                </h1>
                <p className="text-[11px] text-[#967B62] mt-1.5 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                  <Shield size={10} />
                  Usuario Visitante
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
                <span>{session.email}</span>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl">
                <Sparkles size={12} />
                Cuenta Activa
              </div>
            </div>
          </div>
        </section>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-3xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group border border-white/20"
               style={{background: "linear-gradient(135deg, #B89A80 0%, #967B62 100%)"}}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 relative z-10 shadow-inner">
              <Heart size={24} className="text-white drop-shadow-md" />
            </div>
            <div className="relative z-10">
              <p className="text-4xl font-bold text-white font-serif drop-shadow-sm">{invitedMemorials.length}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-bold mt-1">
                {invitedMemorials.length === 1 ? "Memorial Invitado" : "Memoriales Invitados"}
              </p>
            </div>
          </div>

          <div className="rounded-3xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group border border-white/20"
               style={{background: "linear-gradient(135deg, #2A5C4A 0%, #1B3D31 100%)"}}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 relative z-10 shadow-inner">
              <Sparkles size={24} className="text-[#A7D4B4] drop-shadow-md" />
            </div>
            <div className="relative z-10">
              <p className="text-4xl font-bold text-white font-serif drop-shadow-sm">
                {invitedMemorials.length > 0 ? "Sí" : "No"}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#A7D4B4] font-bold mt-1">Fue Invitado</p>
            </div>
          </div>

          <div className="rounded-3xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group border border-white/20"
               style={{background: "linear-gradient(135deg, #2A455C 0%, #1A2D3D 100%)"}}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 relative z-10 shadow-inner">
              <User size={24} className="text-[#A7C8D4] drop-shadow-md" />
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-bold text-white font-serif drop-shadow-sm mt-1 mb-1">Visitante</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#A7C8D4] font-bold mt-1">Tu Rol</p>
            </div>
          </div>
        </div>

        {/* Solicitar unirse a Familia */}
        <section className="bg-white rounded-3xl border border-stone-200/60 p-6 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-[#967B62]" />
            <h2 className="font-serif text-lg font-semibold text-[#111]">Solicitar unirse a una Familia</h2>
          </div>
          <p className="text-sm text-neutral-500 mb-5">
            Si un familiar ya creó el memorial y es Administrador, envíale una solicitud para que te agregue a la familia y puedas subir fotos o mensajes.
          </p>
          
          <form onSubmit={handleRequestFamilyAccess} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="email" 
                required
                placeholder="Correo electrónico del Administrador"
                value={targetAdminEmail}
                onChange={(e) => setTargetAdminEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#967B62] focus:bg-white transition-all"
              />
            </div>
            <button 
              type="submit" 
              disabled={isRequestingFamily}
              className="shrink-0 px-6 py-3 bg-[#967B62] text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#856b54] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRequestingFamily ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
              Enviar Solicitud
            </button>
          </form>
          
          {familyRequestStatus !== "idle" && (
            <div className={`mt-4 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
              familyRequestStatus === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
            }`}>
              {familyRequestStatus === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {familyRequestMessage}
            </div>
          )}
        </section>

        {/* Memoriales Invitados */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Flower2 size={18} className="text-[#967B62]" />
            <h2 className="font-serif text-lg font-semibold text-[#111]">Memoriales a los que fuiste invitado</h2>
          </div>

          {invitedMemorials.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200/60 p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="text-neutral-300" />
              </div>
              <h3 className="font-serif text-lg text-neutral-600 mb-2">Aún no has sido invitado a ningún memorial</h3>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">
                Cuando una familia o funeraria te invite a ver el memorial de un ser querido, aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {invitedMemorials.map((memorial) => (
                <div
                  key={memorial.id}
                  className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Imagen del memorial */}
                  <div className="relative h-40 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={memorial.mainImage}
                      alt={memorial.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-white font-serif text-lg font-semibold drop-shadow-sm">{memorial.name}</h3>
                      <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                        <Calendar size={10} />
                        {formatDate(memorial.birthDate)} — {formatDate(memorial.deathDate)}
                      </p>
                    </div>
                  </div>

                  {/* Info de la invitación */}
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-stone-50 rounded-lg p-3">
                        <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Invitado por</p>
                        <p className="text-xs text-neutral-700 font-medium truncate">{memorial.invitedBy}</p>
                      </div>
                      <div className="bg-stone-50 rounded-lg p-3">
                        <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Tu relación</p>
                        <p className="text-xs text-neutral-700 font-medium">{memorial.relation}</p>
                      </div>
                      <div className="bg-stone-50 rounded-lg p-3">
                        <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Fecha invitación</p>
                        <p className="text-xs text-neutral-700 font-medium flex items-center gap-1">
                          <Clock size={10} />
                          {formatDate(memorial.invitedDate)}
                        </p>
                      </div>
                      {memorial.tenantName && (
                        <div className="bg-stone-50 rounded-lg p-3">
                          <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Funeraria</p>
                          <p className="text-xs text-neutral-700 font-medium flex items-center gap-1">
                            <MapPin size={10} />
                            {memorial.tenantName}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Botón de ver memorial */}
                    <Link
                      href={`/memorial/${memorial.slug}`}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#967B62] text-white text-xs uppercase tracking-[0.15em] font-bold hover:bg-[#856b54] active:scale-[0.98] transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <Eye size={14} />
                      Ver Memorial
                      <ExternalLink size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Solicitar un Memorial */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Plus size={18} className="text-[#967B62]" />
            <h2 className="font-serif text-lg font-semibold text-[#111]">Solicitar un Memorial</h2>
          </div>



          {/* Solicitudes previas */}
          {myRequests.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-neutral-400 font-bold ml-1">Mis solicitudes anteriores</p>
              {myRequests.map((req, i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-200/60 p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#967B62]/10 flex items-center justify-center">
                      <Heart size={18} className="text-[#967B62]" />
                    </div>
                    <div>
                      <p className="font-serif text-sm font-semibold text-[#111]">{req.name}</p>
                      <p className="text-xs text-neutral-400">Solicitado el {formatDate(req.date)}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg ${
                    req.status === "Aprobado" ? "bg-emerald-50 text-emerald-600" :
                    req.status === "Rechazado" ? "bg-red-50 text-red-500" :
                    "bg-amber-50 text-amber-600"
                  }`}>
                    {req.status === "Aprobado" ? <CheckCircle size={13} /> :
                     req.status === "Rechazado" ? <AlertCircle size={13} /> :
                     <Clock size={13} />}
                    {req.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-stone-200/40">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-300 font-semibold">
            Amuley Legacy · Tu espacio de recuerdos
          </p>
        </footer>
      </main>
    </div>
  );
}
