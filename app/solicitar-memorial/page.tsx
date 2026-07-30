"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Send, CheckCircle, Calendar as CalendarIcon,
  User, PawPrint, Heart, ImageIcon, Music, BookOpen, QrCode,
  Share2, Footprints, MessageCircle, Video, Lock, Globe,
  ChevronDown, Clock, Users, Star, Sparkles, Shield, Check,
  ClipboardEdit, Key
} from "lucide-react";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

const PERSON_FEATURES = [
  { icon: <ImageIcon size={15} />, title: "Galería de Fotos", desc: "Hasta 500 fotos en alta resolución", details: "Crea álbumes temáticos, sube fotos familiares en alta calidad y permite que otros familiares invitados contribuyan con sus propias imágenes para construir un archivo visual colaborativo." },
  { icon: <Video size={15} />, title: "Galería de Videos", desc: "Videos de hasta 5 minutos cada uno", details: "Sube videos directamente desde tu celular, crea recopilaciones de momentos importantes y revive recuerdos en un reproductor integrado y sin publicidad." },
  { icon: <BookOpen size={15} />, title: "Biografía Completa", desc: "Historia de vida estructurada y perpetua", details: "Redacta la historia de vida por capítulos, añade hitos importantes en una línea de tiempo y destaca los logros, valores y pasiones de tu ser querido." },
  { icon: <Music size={15} />, title: "Cartas y Audios", desc: "Mensajes de voz y texto eternos", details: "Escribe cartas abiertas y graba notas de voz directamente en la plataforma para que las futuras generaciones puedan leer y escuchar emociones auténticas." },
  { icon: <MessageCircle size={15} />, title: "Libro de Condolencias", desc: "Espacio abierto para mensajes", details: "Habilita un espacio seguro donde asistentes al funeral, colegas y amigos lejanos puedan dejar sus respetos, anécdotas y mensajes de consuelo a la familia." },
  { icon: <Share2 size={15} />, title: "Árbol Genealógico", desc: "Conexión familiar perpetua", details: "Añade perfiles de familiares, conecta generaciones gráficamente de forma interactiva y preserva el linaje para que tus descendientes conozcan sus raíces." },
  { icon: <QrCode size={15} />, title: "Código QR", desc: "Acceso físico al memorial digital", details: "Descarga tu código en alta calidad, envíalo a grabar en una placa física para la lápida o imprímelo para las tarjetas de recuerdo en la ceremonia." },
  { icon: <Lock size={15} />, title: "Galería Privada", desc: "Fotos solo para la familia cercana", details: "Oculta álbumes o videos específicos para que solo los usuarios que tú autorices (tu círculo familiar directo) puedan visualizarlos de forma segura." },
  { icon: <Users size={15} />, title: "Invitación Familiar", desc: "Cada familiar tiene su acceso", details: "Envía invitaciones por correo o WhatsApp a tus familiares para que se unan como co-administradores y puedan gestionar contenido dentro del memorial." },
];

const PET_FEATURES = [
  { icon: <ImageIcon size={15} />, title: "Galería de Fotos", desc: "Álbum de momentos especiales", details: "Organiza sus fotos por etapas de vida, sube todas las aventuras que compartieron y crea un álbum dedicado exclusivamente a sus travesuras y mejores momentos." },
  { icon: <Video size={15} />, title: "Videos", desc: "Clips de vida juntos", details: "Sube los videos de sus paseos, sus trucos aprendidos, sus ronroneos o ladridos, y ten siempre a mano su energía y personalidad en movimiento." },
  { icon: <Footprints size={15} />, title: "Álbum de Huellas", desc: "Huella digital e impresa", details: "Sube la imagen escaneada o fotografiada de su huellita. La plataforma la guardará en alta resolución para que puedas usarla luego en cuadros o incluso tatuajes." },
  { icon: <BookOpen size={15} />, title: "Historia de Vida", desc: "Personalidad y recuerdos eternos", details: "Cuenta la anécdota de cómo llegó a tu familia, describe su personalidad única, sus premios, juguetes favoritos y todo lo que lo hacía tan especial." },
  { icon: <MessageCircle size={15} />, title: "Mensajes de Amor", desc: "Familia y amigos se expresan", details: "Permite que todos los integrantes de la familia y amigos cercanos que lo conocieron dejen un mensaje de agradecimiento y cariño en su memoria." },
  { icon: <Music size={15} />, title: "Cartas y Audios", desc: "Palabras de despedida", details: "Escríbele esa última carta de despedida que llevas en el corazón, o graba un audio contando lo mucho que lo extrañas y lo que significó en tu vida." },
  { icon: <QrCode size={15} />, title: "Código QR", desc: "Acceso al memorial desde cualquier lugar", details: "Imprime el código QR para colocarlo junto a su ánfora, en un cuadro conmemorativo en tu casa, o en una placa especial en su lugar favorito del jardín." },
  { icon: <Lock size={15} />, title: "Galería Privada", desc: "Fotos solo para la familia", details: "Guarda de forma completamente privada las fotos de sus últimos días o momentos más sensibles, manteniéndolas solo para ti y quienes te acompañaron." },
];

export default function SolicitarMemorialPage() {
  const router = useRouter();
  const [type, setType] = useState<"persona" | "mascota">("persona");
  const [reqName, setReqName] = useState("");
  const [reqBirth, setReqBirth] = useState<Date | null>(null);
  const [reqDeath, setReqDeath] = useState<Date | null>(null);
  const [reqRelation, setReqRelation] = useState("");
  const [reqSpecies, setReqSpecies] = useState("");
  const [reqBreed, setReqBreed] = useState("");
  const [reqMessage, setReqMessage] = useState("");
  const [reqPlan, setReqPlan] = useState("");
  const [reqPlaca, setReqPlaca] = useState(false);
  const [reqSent, setReqSent] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user_session");
    if (!saved) router.push("/login");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userSession = JSON.parse(localStorage.getItem("user_session") || "{}");
    const userEmail = userSession.email || "usuario@ejemplo.com";

    const newReq = { name: reqName, type, plan: reqPlan, placa: reqPlaca, date: new Date().toISOString(), status: "Pendiente" };
    const prev = JSON.parse(localStorage.getItem("amuley_user_requests") || "[]");
    localStorage.setItem("amuley_user_requests", JSON.stringify([...prev, newReq]));

    try {
      await fetch("/api/solicitar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...newReq, 
          userEmail, 
          relation: reqRelation, 
          message: reqMessage,
          species: reqSpecies,
          breed: reqBreed,
          totalPrice
        })
      });
    } catch (err) {
      console.error("Error sending email:", err);
    }

    setReqSent(true);
  };

  const isPet = type === "mascota";
  const accent = isPet ? "#2E7D32" : "#7A5C44";
  const accentHex = isPet ? "#2E7D32" : "#7A5C44";
  const features = isPet ? PET_FEATURES : PERSON_FEATURES;

  const PLAN_PRICES: Record<string, number> = {
    "Esencial": 24900,
    "Familiar": 49900,
    "Legado": 99900,
    "Huella": 14900,
    "Huella Plus": 29900
  };
  const PLACA_PRICE = 20000;
  
  const basePrice = PLAN_PRICES[reqPlan] || 0;
  const totalPrice = basePrice + (reqPlaca ? PLACA_PRICE : 0);

  // ─── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (reqSent) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1208 0%, #2d1f10 50%, #3d2b18 100%)" }}>
        {/* Orbes */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: isPet ? "#2E7D32" : "#876B52" }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: isPet ? "#4CAF50" : "#B89A80" }} />

        <div className="relative z-10 max-w-md w-full mx-auto px-6 text-center">
          <div className="relative inline-block mb-8">
            <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto shadow-2xl"
              style={{ background: `linear-gradient(145deg, ${accent}, ${accent}99)`, boxShadow: `0 20px 60px ${accent}60` }}>
              <CheckCircle size={52} className="text-white" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles size={14} className="text-white" />
            </div>
          </div>

          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.3em] mb-4 px-4 py-1.5 rounded-full"
            style={{ background: `${accent}25`, color: accent, border: `1px solid ${accent}40` }}>
            Solicitud recibida
          </span>

          <h2 className="font-serif text-5xl font-bold text-white mb-4">¡Todo listo!</h2>
          <p className="text-white/60 leading-relaxed mb-2 text-base">
            {isPet
              ? "El memorial de tu compañero está siendo preparado con todo el amor del mundo."
              : "Tu solicitud ha sido recibida. El equipo de Amuley ya está trabajando en ello."}
          </p>
          <p className="text-white/40 text-sm mb-10">
            Recibirás tu enlace de acceso en <span className="text-white/70 font-semibold">menos de 24 horas.</span>
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-sm uppercase tracking-[0.12em] transition-all hover:brightness-110 active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 8px 30px ${accent}50` }}
          >
            <Heart size={16} />
            Volver a mi Espacio
          </button>
        </div>
      </div>
    );
  }

  // ─── MAIN PAGE ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans" style={{ background: "#F5F0EA" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-40 h-20"
        style={{ background: "rgba(26,18,8,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">

          {/* Back */}
          <button onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2.5 text-white/60 hover:text-white transition-colors group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors">
              <ArrowLeft size={14} />
            </div>
            <span className="text-sm font-medium hidden sm:inline">Volver al menú</span>
          </button>

          {/* Logo + nombre — mismo patrón que UserDashboard */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-white/20 [transform:translateZ(0)]">
              <img src="/logo.png" alt="Amuley" className="w-full h-full object-cover scale-[1.6]" />
            </div>
            <div className="flex flex-col border-l border-white/15 pl-3">
              <span className="font-serif text-lg tracking-[0.2em] font-bold uppercase text-white leading-none mb-1">AMULEY</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">Memoriales digitales</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="w-32" />
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20"
        style={{ background: "linear-gradient(135deg, #1a1208 0%, #2d1f10 55%, #3d2b18 100%)", minHeight: "45vh" }}>
        {/* Background orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: isPet ? "#4CAF50" : "#B89A80" }} />
        <div className="absolute -bottom-20 left-10 w-80 h-80 rounded-full opacity-8 blur-3xl"
          style={{ background: isPet ? "#2E7D32" : "#7A5C44" }} />
        {/* Star dots */}
        {[
          { top: "20%", left: "15%", size: 2 }, { top: "40%", left: "8%", size: 1.5 },
          { top: "15%", right: "20%", size: 1.5 }, { top: "60%", right: "12%", size: 2 },
          { top: "30%", right: "35%", size: 1 },
        ].map((dot, i) => (
          <div key={i} className="absolute rounded-full bg-white/30"
            style={{ top: dot.top, left: (dot as any).left, right: (dot as any).right, width: dot.size, height: dot.size }} />
        ))}

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ background: `${accent}30`, color: isPet ? "#81C784" : "#C4A882", border: `1px solid ${accent}35` }}>
              {isPet ? <PawPrint size={11} /> : <Heart size={11} />}
              {isPet ? "Memorial para mascota" : "Nuevo memorial"}
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-5">
              Un espacio<br />
              <span style={{ color: isPet ? "#81C784" : "#C4A882" }}>eterno.</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-md mb-8">
              Preserva el legado y los recuerdos de tu ser querido para siempre. Un memorial digital que honra su historia.
            </p>

            {/* ── TYPE TOGGLE ─────────────────────────────────────── */}
            <div className="inline-flex gap-2 p-1.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {[
                { value: "persona", label: "Para una Persona", icon: <User size={15} />, color: "#7A5C44" },
                { value: "mascota", label: "Para una Mascota", icon: <PawPrint size={15} />, color: "#2E7D32" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setType(opt.value as "persona" | "mascota"); setExpandedFeature(null); }}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300"
                  style={type === opt.value
                    ? { background: opt.color, color: "#fff", boxShadow: `0 4px 16px ${opt.color}50` }
                    : { background: "transparent", color: "rgba(255,255,255,0.45)" }
                  }
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-12 md:h-16">
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#F5F0EA"/>
          </svg>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid lg:grid-cols-[1fr_440px] gap-10 items-start">

          {/* LEFT ─────────────────────────────────────────────────────────────── */}
          <div className="space-y-8">

            {/* Steps */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400 mb-5">Cómo funciona</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { n: "01", Icon: ClipboardEdit, title: "Completa el formulario", desc: "Ingresa el nombre, fechas y cuéntanos sobre él/ella." },
                  { n: "02", Icon: Clock, title: "24 horas de procesamiento", desc: "El equipo de Amuley prepara tu espacio memorial." },
                  { n: "03", Icon: Key, title: "Recibes acceso privado", desc: "Un enlace exclusivo para construir el memorial." },
                  { n: "04", Icon: Heart, title: "Memorial activo y eterno", desc: "Comparte, invita a la familia y preserva el legado." },
                ].map((s) => (
                  <div key={s.n}
                    className="group relative flex gap-4 p-5 rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 text-6xl font-black opacity-[0.04] leading-none select-none"
                      style={{ color: accentHex }}>{s.n}</div>
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 bg-stone-50">
                      <s.Icon size={20} style={{ color: accentHex }} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: accentHex }}>Paso {s.n}</p>
                      <p className="text-sm font-bold text-neutral-800">{s.title}</p>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400 mb-5">
                {isPet ? "Qué incluye el memorial" : "Qué incluye tu memorial"}
              </p>
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                {features.map((f, i) => (
                  <div key={i} className={i > 0 ? "border-t border-stone-50" : ""}>
                    <button
                      type="button"
                      onClick={() => setExpandedFeature(expandedFeature === i ? null : i)}
                      className="w-full px-5 py-3.5 flex items-center gap-4 text-left hover:bg-stone-50/70 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                        style={{
                          background: expandedFeature === i ? accentHex : "#F5F0EA",
                          color: expandedFeature === i ? "#fff" : accentHex
                        }}>
                        {f.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-800">{f.title}</p>
                        <p className="text-xs text-neutral-400">{f.desc}</p>
                      </div>
                      <ChevronDown size={13} className="text-neutral-300 shrink-0 transition-transform duration-200"
                        style={{ transform: expandedFeature === i ? "rotate(180deg)" : "none" }} />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedFeature === i ? "max-h-40 opacity-100 mb-4" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-[4.25rem] pr-6 text-sm text-neutral-500 leading-relaxed">
                        {f.details}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="relative overflow-hidden rounded-2xl p-6"
              style={{ background: "linear-gradient(135deg, #1a1208 0%, #2d1f10 100%)" }}>
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-12 translate-x-12 blur-2xl"
                style={{ background: accentHex }} />
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-5 italic">
                {isPet
                  ? '"Perdimos a Rocky después de 13 años. Gracias a Amuley tenemos su galería, sus videos y el álbum de huellas siempre disponible. Fue un regalo enorme para toda la familia."'
                  : '"Cuando falleció mi abuela no sabíamos cómo preservar su historia. Con Amuley armamos su biografía, subimos más de 200 fotos y toda la familia pudo dejar mensajes. El QR en su lápida fue lo más emotivo."'}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: `linear-gradient(145deg, ${accentHex}, ${accentHex}88)` }}>
                  {isPet ? "CF" : "MR"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{isPet ? "Camila F." : "Martín R."}</p>
                  <p className="text-xs text-white/40">{isPet ? "Dueña de Rocky · Santiago" : "Nieto · Concepción, Chile"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — FORM ──────────────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24">
            <div className="rounded-3xl overflow-hidden shadow-2xl"
              style={{ boxShadow: `0 30px 80px ${accentHex}20, 0 0 0 1px ${accentHex}15` }}>

              {/* Form header */}
              <div className="px-7 pt-7 pb-6 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${accentHex} 0%, ${accentHex}cc 100%)` }}>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/8" />
                <div className="absolute top-4 right-20 w-2 h-2 bg-white/40 rounded-full" />
                <div className="absolute top-10 right-12 w-1.5 h-1.5 bg-white/25 rounded-full" />
                <div className="absolute bottom-2 left-20 w-1 h-1 bg-white/30 rounded-full" />
                <div className="relative flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    {isPet ? <PawPrint size={22} className="text-white" /> : <Heart size={22} className="text-white" strokeWidth={1.5} />}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">
                      {isPet ? "Datos de tu compañero/a" : "Datos de la persona"}
                    </h3>
                    <p className="text-xs text-white/60 mt-0.5">
                      {isPet ? "Cuéntanos sobre tu querida mascota" : "Información sobre tu ser querido"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form body */}
              <div className="bg-white px-7 py-6">
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Nombre */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black block mb-1.5">
                      {isPet ? "Nombre de la mascota *" : "Nombre completo *"}
                    </label>
                    <input type="text" required
                      placeholder={isPet ? "Ej: Luna, Max, Simba, Rocky..." : "Ej: María Elena Rodríguez"}
                      value={reqName} onChange={(e) => setReqName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none transition-all placeholder:text-neutral-300 focus:bg-white"
                      onFocus={(e) => { e.target.style.borderColor = accentHex; e.target.style.boxShadow = `0 0 0 3px ${accentHex}18`; }}
                      onBlur={(e) => { e.target.style.borderColor = "#E7E3DE"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>

                  {isPet && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black block mb-1.5">Especie *</label>
                        <select required value={reqSpecies} onChange={(e) => setReqSpecies(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none">
                          <option value="">Seleccionar...</option>
                          <option>🐶 Perro</option><option>🐱 Gato</option><option>🐦 Ave</option>
                          <option>🐰 Conejo</option><option>🐹 Hámster</option><option>🐟 Pez</option>
                          <option>🦎 Reptil</option><option>🐾 Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black block mb-1.5">Raza</label>
                        <input type="text" placeholder="Ej: Labrador..."
                          value={reqBreed} onChange={(e) => setReqBreed(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none placeholder:text-neutral-300"
                          onFocus={(e) => { e.target.style.borderColor = accentHex; e.target.style.boxShadow = `0 0 0 3px ${accentHex}18`; }}
                          onBlur={(e) => { e.target.style.borderColor = "#E7E3DE"; e.target.style.boxShadow = "none"; }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Relación */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black block mb-1.5">
                      {isPet ? "Tu relación" : "Tu relación *"}
                    </label>
                    <input type="text" required={!isPet}
                      placeholder={isPet ? "Ej: Dueño/a, Familia..." : "Ej: Hijo/a, Nieto/a, Esposo/a"}
                      value={reqRelation} onChange={(e) => setReqRelation(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none placeholder:text-neutral-300 focus:bg-white transition-all"
                      onFocus={(e) => { e.target.style.borderColor = accentHex; e.target.style.boxShadow = `0 0 0 3px ${accentHex}18`; }}
                      onBlur={(e) => { e.target.style.borderColor = "#E7E3DE"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>

                  {/* Fechas */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Fecha nacimiento", value: reqBirth, set: setReqBirth },
                      { label: "Fecha fallecimiento", value: reqDeath, set: setReqDeath },
                    ].map((dp, i) => (
                      <div key={i}>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black block mb-1.5">{dp.label}</label>
                        <div className="relative">
                          <DatePicker selected={dp.value} onChange={dp.set} locale={es}
                            dateFormat="dd/MM/yyyy" placeholderText="dd/mm/aaaa"
                            showYearDropdown scrollableYearDropdown yearDropdownItemNumber={100}
                            className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 pl-9 text-sm text-neutral-800 outline-none placeholder:text-neutral-300"
                            wrapperClassName="w-full" />
                          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={13} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black block mb-1.5">
                      {isPet ? "Historia y recuerdos" : "Mensaje o historia"}
                    </label>
                    <textarea rows={3}
                      placeholder={isPet
                        ? "Sus travesuras, comida favorita, cómo llegó a tu vida..."
                        : "Su personalidad, un recuerdo especial, qué legado dejó..."}
                      value={reqMessage} onChange={(e) => setReqMessage(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none resize-none leading-relaxed placeholder:text-neutral-300 focus:bg-white transition-all"
                      onFocus={(e) => { e.target.style.borderColor = accentHex; e.target.style.boxShadow = `0 0 0 3px ${accentHex}18`; }}
                      onBlur={(e) => { e.target.style.borderColor = "#E7E3DE"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>

                  {/* Plan */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-black block mb-1.5">
                      Plan a elegir *
                    </label>
                    <select required value={reqPlan} onChange={(e) => setReqPlan(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none transition-all focus:bg-white"
                      onFocus={(e) => { e.target.style.borderColor = accentHex; e.target.style.boxShadow = `0 0 0 3px ${accentHex}18`; }}
                      onBlur={(e) => { e.target.style.borderColor = "#E7E3DE"; e.target.style.boxShadow = "none"; }}
                    >
                      <option value="">Seleccionar plan...</option>
                      {isPet ? (
                        <>
                          <option value="Huella">Plan Huella ($14.900)</option>
                          <option value="Huella Plus">Plan Huella Plus ($29.900)</option>
                        </>
                      ) : (
                        <>
                          <option value="Esencial">Plan Esencial ($24.900)</option>
                          <option value="Familiar">Plan Familiar ($49.900)</option>
                          <option value="Legado">Plan Legado ($99.900)</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Placa Física */}
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:border-[#967B62]/30 cursor-pointer"
                    onClick={() => setReqPlaca(!reqPlaca)}>
                    <div className="mt-0.5">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${reqPlaca ? 'bg-[#967B62] border-[#967B62]' : 'border-stone-300'}`}>
                        {reqPlaca && <Check size={14} className="text-white" />}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-800 mb-0.5">Agregar Placa Física con Código QR</p>
                      <p className="text-xs text-neutral-500">Recibe una hermosa placa conmemorativa para instalar donde desees. (+${PLACA_PRICE.toLocaleString("es-CL")})</p>
                    </div>
                  </div>

                  {/* ETA */}
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                    style={{ background: `${accentHex}0D`, border: `1px solid ${accentHex}20` }}>
                    <Clock size={13} style={{ color: accentHex }} className="shrink-0" />
                    <p className="text-xs" style={{ color: accentHex }}>
                      Recibirás tu enlace en <strong>menos de 24 horas</strong>
                    </p>
                  </div>

                  {/* Buttons & Total */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-4 px-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Total a pagar:</span>
                      <span className="text-xl font-black" style={{ color: accentHex }}>
                        ${totalPrice.toLocaleString("es-CL")}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => router.push("/dashboard")}
                        className="px-4 py-3 text-xs font-semibold text-neutral-400 hover:text-neutral-700 transition-colors rounded-xl hover:bg-stone-50">
                        Cancelar
                      </button>
                      <button type="submit"
                        className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-bold uppercase tracking-[0.1em] transition-all hover:brightness-110 active:scale-[0.98]"
                        style={{ background: `linear-gradient(135deg, ${accentHex} 0%, ${accentHex}cc 100%)`, boxShadow: `0 8px 24px ${accentHex}40` }}>
                        <Send size={14} />
                        Enviar Solicitud
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer trust */}
              <div className="bg-stone-50 border-t border-stone-100 px-7 py-3 flex items-center justify-center gap-5">
                {[
                  { icon: <Shield size={11} />, text: "Datos seguros" },
                  { icon: <Clock size={11} />, text: "Respuesta en 24h" },
                  { icon: <Heart size={11} />, text: "Memorial eterno" },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    {b.icon}
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
