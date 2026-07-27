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

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FCFBFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#967B62]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFBFA] via-[#F5F0EB] to-[#EDE6DF]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#967B62]/15 shadow-md">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#967B62]/40 shadow-md">
              <img src="/logo.png" alt="Amuley" className="w-full h-full object-cover scale-[1.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-[0.25em] font-bold uppercase text-[#967B62]">AMULEY</span>
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold">Mi Espacio Personal</span>
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
        <section className="bg-white rounded-3xl border border-stone-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="bg-gradient-to-r from-[#967B62] via-[#A8917A] to-[#967B62] h-44 md:h-52 relative">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.15\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
            <div className="absolute bottom-6 left-8 md:left-12">
              <h2 className="text-white/70 text-xs uppercase tracking-[0.3em] font-semibold">Bienvenido a tu espacio</h2>
            </div>
            <button
              onClick={() => router.push("/solicitar-memorial")}
              className="absolute top-5 right-5 md:top-6 md:right-8 flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm font-bold uppercase tracking-wider hover:bg-white/30 active:scale-[0.98] transition-all duration-300 border border-white/30 shadow-lg"
            >
              <Plus size={16} />
              Solicitar Memorial
            </button>
          </div>
          <div className="px-8 md:px-12 pb-10 -mt-16 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#967B62] to-[#7D654E] flex items-center justify-center text-white text-5xl font-bold font-serif shadow-2xl border-[5px] border-white">
                {getInitials(session.email)}
              </div>
              <div className="flex-1 pt-3">
                <h1 className="text-3xl md:text-4xl font-serif font-semibold text-[#111]">
                  {session.email.split("@")[0].charAt(0).toUpperCase() + session.email.split("@")[0].slice(1)}
                </h1>
                <p className="text-sm text-neutral-400 mt-1 flex items-center gap-2">
                  <Shield size={14} />
                  Usuario Visitante
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-6 text-sm text-neutral-500">
              <div className="flex items-center gap-2 bg-stone-50 px-5 py-3 rounded-xl">
                <Calendar size={15} className="text-[#967B62]" />
                <span>Miembro desde {memberSince ? formatDate(memberSince) : "hoy"}</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-50 px-5 py-3 rounded-xl">
                <Mail size={15} className="text-[#967B62]" />
                <span>{session.email}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#967B62]/10 flex items-center justify-center mb-3">
              <Heart size={24} className="text-[#967B62]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#111] font-serif">{invitedMemorials.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mt-1">
                {invitedMemorials.length === 1 ? "Memorial Invitado" : "Memoriales Invitados"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
              <Sparkles size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#111] font-serif">
                {invitedMemorials.length > 0 ? "Sí" : "No"}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mt-1">Fue Invitado</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
              <User size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#111] font-serif">Visitante</p>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mt-1">Tu Rol</p>
            </div>
          </div>
        </div>

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
