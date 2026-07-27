"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Send, CheckCircle, Calendar as CalendarIcon,
  User, PawPrint, Heart, ImageIcon, Music, BookOpen, QrCode,
  Share2, Footprints, MessageCircle, Video, Lock, Globe,
  ChevronDown, Clock, Users, Star
} from "lucide-react";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

const PERSON_FEATURES = [
  { icon: <ImageIcon size={18} />, title: "Galería de Fotos", desc: "Hasta 500 fotos en alta resolución", example: "Cumpleaños, viajes, momentos familiares, bodas y reuniones" },
  { icon: <Video size={18} />, title: "Galería de Videos", desc: "Videos de hasta 5 minutos cada uno", example: "Discursos, vacaciones, primeros pasos o palabras de despedida" },
  { icon: <BookOpen size={18} />, title: "Biografía Completa", desc: "Historia de vida estructurada y perpetua", example: "Nacimiento, estudios, trabajo, logros, valores y personalidad" },
  { icon: <Music size={18} />, title: "Cartas y Audios", desc: "Mensajes de voz y texto eternos", example: "Carta de despedida, grabación de voz, canción favorita" },
  { icon: <MessageCircle size={18} />, title: "Libro de Condolencias", desc: "Espacio abierto para mensajes", example: "Amigos y familia pueden dejar rezos, recuerdos y palabras" },
  { icon: <Share2 size={18} />, title: "Árbol Genealógico", desc: "Conexión familiar perpetua", example: "Padres, hijos, nietos — toda la familia conectada y visible" },
  { icon: <QrCode size={18} />, title: "Código QR", desc: "Acceso físico al memorial digital", example: "Se imprime en lápida, urna, ángel fúnebre o tarjeta" },
  { icon: <Lock size={18} />, title: "Galería Privada", desc: "Fotos solo para la familia cercana", example: "Imágenes íntimas visibles solo con invitación" },
  { icon: <Users size={18} />, title: "Invitación Familiar", desc: "Cada familiar tiene su acceso", example: "Invita por correo a subir fotos y dejar recuerdos" },
  { icon: <Globe size={18} />, title: "Dominio Propio (Premium)", desc: "URL personalizada y elegante", example: "www.maria-elena-rodriguez.cl — acceso directo" },
];

const PET_FEATURES = [
  { icon: <ImageIcon size={18} />, title: "Galería de Fotos", desc: "Álbum de momentos especiales", example: "Primeros días en casa, paseos, juegos, momentos de cariño" },
  { icon: <Video size={18} />, title: "Videos", desc: "Clips de vida juntos", example: "Travesuras, trucos favoritos, últimos momentos felices" },
  { icon: <Footprints size={18} />, title: "Álbum de Huellas", desc: "Huella digital e impresa", example: "Sube la foto de su huella o solicita la placa física" },
  { icon: <BookOpen size={18} />, title: "Historia de Vida", desc: "Personalidad y recuerdos eternos", example: "Raza, especie, comida favorita, juguetes, manías especiales" },
  { icon: <MessageCircle size={18} />, title: "Mensajes de Amor", desc: "Familia y amigos se expresan", example: "Dejan mensajes, fotos y recuerdos del compañero" },
  { icon: <Music size={18} />, title: "Cartas y Audios", desc: "Palabras de despedida", example: "Una carta especial o grabación de sus sonidos favoritos" },
  { icon: <QrCode size={18} />, title: "Código QR", desc: "Acceso al memorial desde cualquier lugar", example: "Para la urna, medalla, placa o marco recordatorio" },
  { icon: <Lock size={18} />, title: "Galería Privada", desc: "Fotos solo para la familia", example: "Espacio reservado para dueños y personas autorizadas" },
];

const STEPS = [
  { n: 1, title: "Completa el formulario", desc: "Ingresa el nombre, fechas y cuéntanos sobre él/ella." },
  { n: 2, title: "Procesamos en 24 horas", desc: "El equipo de Amuley prepara tu espacio memorial." },
  { n: 3, title: "Recibes acceso privado", desc: "Enlace privado para construir el memorial." },
  { n: 4, title: "Memorial activo y eterno", desc: "Comparte, invita a la familia y preserva el legado." },
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
  const [reqSent, setReqSent] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user_session");
    if (!saved) router.push("/login");
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = { name: reqName, type, date: new Date().toISOString(), status: "Pendiente" };
    const prev = JSON.parse(localStorage.getItem("amuley_user_requests") || "[]");
    localStorage.setItem("amuley_user_requests", JSON.stringify([...prev, newReq]));
    setReqSent(true);
  };

  const isPet = type === "mascota";
  const accent = isPet ? "#4A7A3A" : "#876B52";
  const features = isPet ? PET_FEATURES : PERSON_FEATURES;

  if (reqSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#FAF8F5" }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: isPet ? "#EBF5E8" : "#F5EDE6" }}>
            <CheckCircle size={40} style={{ color: accent }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: accent }}>
            Solicitud recibida
          </p>
          <h2 className="font-serif text-3xl font-bold text-neutral-900 mb-4">¡Todo listo!</h2>
          <p className="text-neutral-500 leading-relaxed mb-2">
            {isPet
              ? "El memorial de tu compañero está siendo preparado."
              : "Tu solicitud ha sido recibida por el equipo de Amuley."}
          </p>
          <p className="text-sm text-neutral-400 mb-8">Recibirás un enlace de acceso en menos de 24 horas.</p>
          <button onClick={() => router.push("/dashboard")}
            className="px-8 py-3.5 rounded-full text-white text-sm font-semibold tracking-wide transition-all hover:opacity-90"
            style={{ background: accent }}>
            Volver a mi Espacio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAF8F5" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Back button */}
        <button onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-700 transition-colors mb-10 group">
          <div className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center group-hover:border-neutral-400 transition-colors">
            <ArrowLeft size={14} />
          </div>
          <span>Volver al dashboard</span>
        </button>

        {/* Page title */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accent }}>Nuevo memorial</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
            Un espacio eterno<br />
            <span className="text-neutral-400 font-light">para quien más amas.</span>
          </h1>
        </div>

        {/* Type toggle */}
        <div className="flex gap-3 mb-10">
          {[
            { value: "persona", label: "Para una Persona", icon: <User size={15} />, color: "#876B52" },
            { value: "mascota", label: "Para una Mascota", icon: <PawPrint size={15} />, color: "#4A7A3A" },
          ].map((opt) => (
            <button key={opt.value} type="button"
              onClick={() => { setType(opt.value as "persona" | "mascota"); setExpandedFeature(null); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border"
              style={type === opt.value ? {
                background: opt.color, color: "#fff", borderColor: opt.color,
                boxShadow: `0 4px 16px ${opt.color}35`
              } : {
                background: "#fff", color: "#9CA3AF", borderColor: "#E5E7EB"
              }}>
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">

          {/* LEFT column */}
          <div className="space-y-10">

            {/* Steps */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 mb-5">Cómo funciona</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {STEPS.map((s) => (
                  <div key={s.n} className="flex gap-4 p-4 rounded-2xl bg-white border border-neutral-100">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
                      style={{ background: `${accent}15`, color: accent }}>
                      {s.n}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-800 mb-0.5">{s.title}</p>
                      <p className="text-xs text-neutral-400 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400 mb-5">
                {isPet ? "Qué incluye el memorial de mascota" : "Qué incluye tu memorial"}
              </p>
              <div className="rounded-2xl bg-white border border-neutral-100 overflow-hidden divide-y divide-neutral-50">
                {features.map((f, i) => (
                  <div key={i}>
                    <button type="button"
                      onClick={() => setExpandedFeature(expandedFeature === i ? null : i)}
                      className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-neutral-50 transition-colors">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                        style={{
                          background: expandedFeature === i ? accent : `${accent}12`,
                          color: expandedFeature === i ? "#fff" : accent
                        }}>
                        {f.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-800">{f.title}</p>
                        <p className="text-xs text-neutral-400">{f.desc}</p>
                      </div>
                      <ChevronDown size={15} className="text-neutral-300 shrink-0 transition-transform duration-200"
                        style={{ transform: expandedFeature === i ? "rotate(180deg)" : "none" }} />
                    </button>
                    {expandedFeature === i && (
                      <div className="px-5 pb-4 ml-14">
                        <p className="text-xs leading-relaxed p-3 rounded-lg" style={{ background: `${accent}08`, color: "#666" }}>
                          <span className="font-semibold" style={{ color: accent }}>Ejemplo: </span>
                          {f.example}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-100">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed mb-5 italic">
                {isPet
                  ? '"Perdimos a Rocky después de 13 años. Gracias a Amuley tenemos su galería, sus videos y el álbum de huellas siempre disponible. Toda la familia puede verlo y dejarle un mensaje. Fue un regalo enorme."'
                  : '"Cuando falleció mi abuela no sabíamos cómo preservar su historia. Con Amuley armamos su biografía, subimos más de 200 fotos y toda la familia pudo dejar mensajes. El QR en su lápida fue lo más emotivo."'}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: accent }}>
                  {isPet ? "CF" : "MR"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-700">{isPet ? "Camila F." : "Martín R."}</p>
                  <p className="text-xs text-neutral-400">{isPet ? "Dueña de Rocky · Santiago" : "Nieto · Concepción, Chile"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: sticky form */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xl shadow-neutral-200/60">
              
              {/* accent bar */}
              <div className="h-1 w-full transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />

              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: `${accent}12` }}>
                    {isPet
                      ? <PawPrint size={18} style={{ color: accent }} />
                      : <Heart size={18} style={{ color: accent }} />}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-neutral-900">
                      {isPet ? "Datos de tu compañero/a" : "Datos de la persona"}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {isPet ? "Cuéntanos sobre tu querida mascota" : "Información sobre tu ser querido"}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Nombre */}
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-bold block mb-1.5">
                      {isPet ? "Nombre de la mascota *" : "Nombre completo *"}
                    </label>
                    <input type="text" required
                      placeholder={isPet ? "Ej: Luna, Max, Simba, Rocky..." : "Ej: María Elena Rodríguez"}
                      value={reqName} onChange={(e) => setReqName(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none transition-all focus:bg-white placeholder:text-neutral-400"
                      onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}15`; }}
                      onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>

                  {isPet && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-bold block mb-1.5">Especie *</label>
                        <select required value={reqSpecies} onChange={(e) => setReqSpecies(e.target.value)}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none transition-all">
                          <option value="">Seleccionar...</option>
                          <option>🐶 Perro</option>
                          <option>🐱 Gato</option>
                          <option>🐦 Ave</option>
                          <option>🐰 Conejo</option>
                          <option>🐹 Hámster</option>
                          <option>🐟 Pez</option>
                          <option>🦎 Reptil</option>
                          <option>🐾 Otro</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-bold block mb-1.5">Raza</label>
                        <input type="text" placeholder="Ej: Labrador..."
                          value={reqBreed} onChange={(e) => setReqBreed(e.target.value)}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400"
                          onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}15`; }}
                          onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-bold block mb-1.5">
                      {isPet ? "Tu relación" : "Tu relación *"}
                    </label>
                    <input type="text" required={!isPet}
                      placeholder={isPet ? "Ej: Dueño/a, Familia..." : "Ej: Hijo/a, Nieto/a, Esposo/a"}
                      value={reqRelation} onChange={(e) => setReqRelation(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400"
                      onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}15`; }}
                      onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Fecha de nacimiento", value: reqBirth, set: setReqBirth },
                      { label: "Fecha de fallecimiento", value: reqDeath, set: setReqDeath },
                    ].map((dp, i) => (
                      <div key={i}>
                        <label className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-bold block mb-1.5">{dp.label}</label>
                        <div className="relative">
                          <DatePicker selected={dp.value} onChange={dp.set} locale={es}
                            dateFormat="dd/MM/yyyy" placeholderText="dd/mm/aaaa"
                            showYearDropdown scrollableYearDropdown yearDropdownItemNumber={100}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 pl-9 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400"
                            wrapperClassName="w-full" />
                          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={14} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-bold block mb-1.5">
                      {isPet ? "Historia y recuerdos" : "Mensaje o historia"}
                    </label>
                    <textarea rows={4}
                      placeholder={isPet
                        ? "Cuéntanos sobre tu mascota, sus travesuras, comida favorita, cómo llegó a tu vida..."
                        : "Algún recuerdo especial, su personalidad, qué legado dejó en la familia..."}
                      value={reqMessage} onChange={(e) => setReqMessage(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none transition-all resize-none leading-relaxed placeholder:text-neutral-400"
                      onFocus={(e) => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}15`; }}
                      onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>

                  {/* ETA notice */}
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                    <Clock size={13} className="text-neutral-400 shrink-0" />
                    <p className="text-xs text-neutral-400">
                      Recibirás tu enlace de acceso en <strong className="text-neutral-600">menos de 24 horas</strong>
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => router.push("/dashboard")}
                      className="px-4 py-3 text-xs font-semibold text-neutral-400 hover:text-neutral-600 transition-colors rounded-xl hover:bg-neutral-50">
                      Cancelar
                    </button>
                    <button type="submit"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{ background: accent, boxShadow: `0 4px 20px ${accent}40` }}>
                      <Send size={14} />
                      Enviar Solicitud
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
