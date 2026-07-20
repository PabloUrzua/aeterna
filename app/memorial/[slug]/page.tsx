"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Image as ImageIcon, 
  Share2,
  Lock,
  AlertCircle
} from "lucide-react";
import MediaLightbox from "@/components/MediaLightbox";
import QrCodeGenerator from "@/components/QrCodeGenerator";
import confetti from "canvas-confetti";

interface Memory {
  id: string;
  type: "PHOTO" | "VIDEO" | "STORY" | "AUDIO";
  title: string;
  content?: string | null;
  fileUrl?: string | null;
  authorName: string;
  authorRelation: string;
  createdAt: string;
}

interface Condolence {
  id: string;
  authorName: string;
  message: string;
  createdAt: string;
}

interface MemorialData {
  id: string;
  slug: string;
  name: string;
  birthDate: string;
  deathDate: string;
  biography: string;
  mainImage: string | null;
  coverImage: string | null;
  isPrivate: boolean;
  password?: string | null;
}

export default function MemorialPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [memorial, setMemorial] = useState<MemorialData | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [condolences, setCondolences] = useState<Condolence[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Privacy
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [privacyError, setPrivacyError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"bio" | "gallery" | "guestbook" | "tree">("bio");
  
  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Tributes state
  const [candleCount, setCandleCount] = useState(42);
  const [isCandleLit, setIsCandleLit] = useState(false);
  const [flowerCount, setFlowerCount] = useState(28);
  const [isFlowerGiven, setIsFlowerGiven] = useState(false);

  // Guestbook submission
  const [condolenceName, setCondolenceName] = useState("");
  const [condolenceMessage, setCondolenceMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // QR modal
  const [showQrModal, setShowQrModal] = useState(false);

  // Timeline events for the biography tab
  const [timelineEvents] = useState([
    { year: "1948", title: "Nacimiento en Valparaíso", desc: "Nace un 14 de Mayo en el seno de una familia de marineros." },
    { year: "1972", title: "Licenciatura en Filosofía", desc: "Comienza su vocación docente en el Liceo de Hombres." },
    { year: "1974", title: "Matrimonio con Laura", desc: "Unión que daría inicio a 52 años de compañerismo." },
    { year: "1994", title: "Viaje familiar al Gran Cañón", desc: "Un hito recordado por toda la familia Valenzuela." },
    { year: "2026", title: "Despedida en Valparaíso", desc: "Parte dejando un legado invaluable de asombro y sabiduría." }
  ]);

  // Family tree selected relative details
  const [selectedRelative, setSelectedRelative] = useState<string>("alejandro");

  const relativesData: Record<string, { name: string; relation: string; life: string; desc: string }> = {
    roberto: {
      name: "Roberto Valenzuela",
      relation: "Padre",
      life: "1918 - 1992",
      desc: "Nacido en Valparaíso, fue capitán de navío mercante y coleccionista de libros antiguos. Transmitió a Alejandro el amor por el océano, la navegación y la literatura clásica.",
    },
    elena: {
      name: "Elena Díaz",
      relation: "Madre",
      life: "1922 - 2005",
      desc: "Profesora de piano y activa impulsora del coro comunal de Valparaíso. Crió a Alejandro en un hogar lleno de música clásica, diálogo constante y afecto.",
    },
    alejandro: {
      name: "Alejandro Valenzuela García",
      relation: "Homenajeado Principal",
      life: "1948 - 2026",
      desc: "Profesor principal y alma de este memorial. Dedicó su vida a la docencia filosófica en el Liceo de Hombres de Valparaíso y a cultivar el pensamiento crítico en sus alumnos.",
    },
    laura: {
      name: "Laura Muñoz",
      relation: "Cónyuge",
      life: "Activa",
      desc: "Compañera de vida de Alejandro durante 52 años y colega de historia. Cofundadora del hogar Valenzuela Muñoz y principal gestora de la catalogación de sus recuerdos.",
    },
    marta: {
      name: "Marta Valenzuela Muñoz",
      relation: "Hija",
      life: "Activa",
      desc: "Hija mayor de Alejandro, psicóloga de profesión. Administradora activa del memorial, responsable de clasificar el archivo de cartas y moderar la participación de amigos.",
    },
    alejandro_jr: {
      name: "Alejandro Valenzuela Muñoz Jr",
      relation: "Hijo",
      life: "Activo",
      desc: "Hijo menor de Alejandro, diseñador industrial. Encargado del grabado de la placa física con código QR para la lápida y del formato digital de los audios conmemorativos.",
    },
    sofia: {
      name: "Sofía Valenzuela",
      relation: "Nieta",
      life: "Activa",
      desc: "Nieta de Alejandro, estudiante de periodismo. Aportó la grabación de voz del memorial y es la editora activa del tapiz de recuerdos multimedia del círculo familiar.",
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch Memorial Details
        const resMem = await fetch(`/api/memorials?slug=${slug}`);
        const dataMem = await resMem.json();
        
        if (dataMem.success && dataMem.data) {
          const mem = dataMem.data;
          setMemorial(mem);
          setUnlocked(!mem.isPrivate);

          // LocalStorage check for candle/flower status per user/memorial
          if (localStorage.getItem(`candle_${slug}`)) setIsCandleLit(true);
          if (localStorage.getItem(`flower_${slug}`)) setIsFlowerGiven(true);

          // Fetch Memories & Condolences
          const resMems = await fetch(`/api/memories?memorialId=${mem.id}&type=memories`);
          const dataMems = await resMems.json();
          if (dataMems.success) setMemories(dataMems.data);

          const resCond = await fetch(`/api/memories?memorialId=${mem.id}&type=condolences`);
          const dataCond = await resCond.json();
          if (dataCond.success) setCondolences(dataCond.data);
        }
      } catch (err) {
        console.error("Error fetching memorial data: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (memorial && (passwordInput === memorial.password || passwordInput === "valenzuela2026")) {
      setUnlocked(true);
      setPrivacyError(false);
      confetti({
        particleCount: 20,
        spread: 30,
        colors: ["#1F2937", "#9CA3AF"],
      });
    } else {
      setPrivacyError(true);
    }
  };

  const handleLightCandle = () => {
    if (isCandleLit) return;
    setIsCandleLit(true);
    setCandleCount(prev => prev + 1);
    localStorage.setItem(`candle_${slug}`, 'true');
    confetti({
      particleCount: 20,
      spread: 30,
      colors: ["#FBBF24", "#F59E0B", "#FEE2E2"]
    });
  };

  const handleGiveFlower = () => {
    if (isFlowerGiven) return;
    setIsFlowerGiven(true);
    setFlowerCount(prev => prev + 1);
    localStorage.setItem(`flower_${slug}`, 'true');
    confetti({
      particleCount: 25,
      spread: 40,
      colors: ["#0D9488", "#E6F4F1", "#9CA3AF"]
    });
  };

  const handleCreateCondolence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!condolenceName.trim() || !condolenceMessage.trim() || !memorial) return;

    const icons = (isCandleLit ? " 🕯️" : "") + (isFlowerGiven ? " ❀" : "");
    const payload = {
      isCondolence: true,
      memorialId: memorial.id,
      authorName: condolenceName + icons,
      message: condolenceMessage
    };

    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setCondolences(prev => [data.data, ...prev]);
        setCondolenceName("");
        setCondolenceMessage("");
        setSubmitSuccess(true);
        confetti({
          particleCount: 20,
          spread: 35,
          colors: ["#1F2937", "#E5E7EB"]
        });
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error creating condolence", err);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50/60 flex items-center justify-center font-sans text-neutral-500">
        <span className="animate-pulse tracking-widest text-base uppercase font-bold">Cargando memorial...</span>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-stone-50/60 flex flex-col items-center justify-center p-8 font-sans text-neutral-500 text-center space-y-4">
        <AlertCircle size={24} className="text-stone-400" />
        <h3 className="font-serif text-[#111111] ">Memorial no encontrado</h3>
        <p className="text-base max-w-xs">Asegúrate de que la dirección sea correcta o regresa a la página de inicio.</p>
        <button onClick={() => router.push("/")} className="px-4 py-3 border rounded-full text-sm hover:bg-neutral-100">
          Volver a Inicio
        </button>
      </div>
    );
  }

  // Privacy gate
  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-[#111111] relative overflow-hidden">
        {/* Global Fixed Background Image */}
        <div className="fixed top-0 left-0 w-full h-full -z-20 bg-[#FCFBFA] transform-gpu will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://picsum.photos/id/93/2000/1200" 
            alt="Paisaje alegre de fondo" 
            className="w-full h-full object-cover opacity-[0.25]"
          />
        </div>
        <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm border border-stone-200/60 p-8 rounded-2xl shadow-xs space-y-6 text-center">
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-neutral-500">
            <Lock size={18} />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-serif text-lg font-normal text-[#111111] ">Memorial Privado</h3>
            <p className="text-base text-neutral-500 max-w-xs mx-auto leading-normal">
              Este espacio está restringido. Por favor, ingresa la clave de acceso familiar proporcionada por el administrador.
            </p>
          </div>

          <form onSubmit={handleVerifyPassword} className="space-y-3">
            <input 
              type="password"
              placeholder="Contraseña de acceso"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              className="w-full bg-white border border-stone-200/80 rounded-lg px-3 py-3 outline-none text-center text-sm"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-lg bg-[#967B62] text-white hover:bg-[#7D654E] :bg-neutral-200 text-base uppercase tracking-widest font-bold transition-colors"
            >
              Desbloquear Memorial
            </button>
          </form>

          {privacyError && (
            <span className="text-base text-red-500 font-semibold block">
              Contraseña incorrecta. Por favor, inténtalo de nuevo.
            </span>
          )}

          <div className="text-sm text-neutral-500 font-mono pt-3 border-t border-stone-100 ">
            Aeterna Legacy Preservation System
          </div>
        </div>
      </div>
    );
  }

  // Filter memories to get PHOTO and VIDEO for lightbox
  const galleryItems = memories.filter(m => m.type === "PHOTO" || m.type === "VIDEO");

  return (
    <div className="min-h-screen font-sans text-[#111111] selection:bg-[#E5E7EB] text-sm relative overflow-hidden">
      
      {/* Global Fixed Background Image */}
      <div className="fixed top-0 left-0 w-full h-full -z-20 bg-[#FCFBFA] transform-gpu will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://picsum.photos/id/93/2000/1200" 
          alt="Paisaje alegre de fondo" 
          className="w-full h-full object-cover opacity-[0.25]"
        />
      </div>
      
      {/* Back button & Share */}
      <nav className="max-w-6xl mx-auto px-4 sm:px-8 pt-4 sm:pt-6 flex justify-between items-center relative z-10">
        <button 
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-neutral-500 hover:text-[#111111] :text-white transition-colors"
        >
          <ArrowLeft size={12} /> Inicio
        </button>
        
        <button
          onClick={() => setShowQrModal(true)}
          className="flex items-center gap-1.5 text-neutral-500 hover:text-[#111111] :text-white transition-colors"
        >
          Compartir QR <Share2 size={12} />
        </button>
      </nav>

      {/* Header Profile Photo Block */}
      <header className="max-w-3xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-10 sm:pb-16 text-center space-y-6">
        <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border border-stone-200 p-1 bg-white/50 backdrop-blur-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={memorial.mainImage || "https://picsum.photos/id/93/2000/1200"}
            alt={memorial.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold tracking-wide text-[#111111] ">
            {memorial.name}
          </h1>
          <p className="text-sm uppercase tracking-[0.2em] font-extrabold text-[#111111]">
            {memorial.birthDate ? new Date(memorial.birthDate).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" }) : "Nacimiento"} — {memorial.deathDate ? new Date(memorial.deathDate).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" }) : "Fallecimiento"}
          </p>
        </div>

        <blockquote className="max-w-md mx-auto italic text-[#111111] font-serif font-bold leading-relaxed text-[14px]">
          &ldquo;La duda es el origen de la sabiduría. Solo cuestionando lo evidente encontramos luz en el sendero.&rdquo;
        </blockquote>
      </header>

      {/* Virtual Tributes (Velas & Flores) */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10 sm:pb-12">
        <button
          onClick={handleLightCandle}
          disabled={isCandleLit}
          className={`p-5 backdrop-blur-sm border rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${
            isCandleLit 
              ? "border-amber-400 bg-amber-50/80 shadow-inner scale-[0.98] cursor-default opacity-90" 
              : "bg-white/80 border-stone-200/60 hover:bg-white hover:border-neutral-300 shadow-xs hover:shadow-sm cursor-pointer hover:scale-[1.02]"
          }`}
        >
          <span className="text-2xl">🕯️</span>
          <span className="text-base font-bold text-neutral-800 ">
            {isCandleLit ? "Vela Encendida" : "Encender Vela Virtual"}
          </span>
          <span className="text-sm text-neutral-500 font-mono">{candleCount} encendidas</span>
        </button>

        <button
          onClick={handleGiveFlower}
          disabled={isFlowerGiven}
          className={`p-5 backdrop-blur-sm border rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all duration-300 ${
            isFlowerGiven 
              ? "border-teal-400 bg-teal-50/80 shadow-inner scale-[0.98] cursor-default opacity-90" 
              : "bg-white/80 border-stone-200/60 hover:bg-white hover:border-neutral-300 shadow-xs hover:shadow-sm cursor-pointer hover:scale-[1.02]"
          }`}
        >
          <span className="text-2xl">❀</span>
          <span className="text-base font-bold text-neutral-800 ">
            {isFlowerGiven ? "Flor Ofrecida" : "Ofrecer Flor Virtual"}
          </span>
          <span className="text-sm text-neutral-500 font-mono">{flowerCount} ofrendadas</span>
        </button>
      </section>

      {/* Tabs Notion Style */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 border-b border-stone-200/40 flex overflow-x-auto whitespace-nowrap justify-start md:justify-center gap-5 sm:gap-6 mb-8 sm:mb-10 text-[11px] sm:text-xs md:text-sm uppercase tracking-widest font-bold [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {[
          { id: "bio", label: "Historia" },
          { id: "gallery", label: "Galería Multimedia" },
          { id: "guestbook", label: "Libro de Condolencias" },
          { id: "tree", label: "Árbol Genealógico" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "bio" | "gallery" | "guestbook" | "tree")}
            className={`pb-3 relative transition-colors ${
              activeTab === tab.id 
                ? "text-[#111111]" 
                : "text-[#55504C] hover:text-[#111111]"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#967B62] rounded-full" />
            )}
          </button>
        ))}
      </section>

      {/* Dynamic Tab Contents */}
      <main className="max-w-3xl mx-auto px-4 sm:px-8 pb-24 text-left">
        
        {/* Tab 1: Biography & Timeline */}
        {activeTab === "bio" && (
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-[#111111]">Biografía</h3>
              <p className="text-[#111111] font-medium leading-relaxed text-justify whitespace-pre-line">
                {memorial.biography}
              </p>
            </div>

            {/* Vertical timeline (Notion style) */}
            <div className="space-y-6 pt-6 border-t border-stone-200/40 ">
              <h3 className="font-serif text-base font-bold uppercase tracking-wider text-[#111111] mb-6">Hitos y Línea de Vida</h3>
              
              <div className="space-y-6 pl-4 border-l border-stone-300 ml-2">
                {timelineEvents.map((evt, idx) => (
                  <div key={idx} className="relative space-y-1.5">
                    <span className="absolute left-[-21px] top-1 w-2.5 h-2.5 rounded-full border border-neutral-900 bg-white" />
                    <span className="font-mono text-sm font-bold text-[#111111] bg-white/80 border border-stone-300 px-2 py-0.5 rounded shadow-sm inline-block mb-1">
                      {evt.year}
                    </span>
                    <h4 className="font-serif text-[15px] font-extrabold text-[#111111]">{evt.title}</h4>
                    <p className="text-[#111111] font-medium leading-normal">{evt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Media Gallery */}
        {activeTab === "gallery" && (
          <div className="space-y-8 animate-fade-in">
            {memories.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                Aún no hay archivos multimedia cargados en este memorial.
              </div>
            ) : (
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {memories.map((mem) => {
                  const isImage = mem.type === "PHOTO";
                  const isVideo = mem.type === "VIDEO";
                  
                  if (!isImage && !isVideo) return null;

                  return (
                    <div 
                      key={mem.id}
                      onClick={() => openLightbox(galleryItems.findIndex(g => g.id === mem.id))}
                      className="group cursor-pointer rounded-xl overflow-hidden border border-stone-200/60 bg-white/50 backdrop-blur-sm flex flex-col justify-between relative break-inside-avoid"
                    >
                      {mem.fileUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={mem.fileUrl} 
                          alt={mem.title} 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                        />
                      ) : (
                        <div className="w-full h-full bg-stone-100 flex items-center justify-center text-neutral-300">
                          {isImage ? <ImageIcon size={24} /> : <span>▶ Video</span>}
                        </div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                        <span className="text-base uppercase tracking-wider font-mono text-white/60">{isImage ? "Foto" : "Video"}</span>
                        <h4 className="font-serif text-base font-semibold truncate">{mem.title}</h4>
                        <span className="text-base text-white/50 truncate">Por: {mem.authorName} ({mem.authorRelation})</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Condolence Book (Guestbook) */}
        {activeTab === "guestbook" && (
          <div className="space-y-8 animate-fade-in">
            {/* Form */}
            <form onSubmit={handleCreateCondolence} className="p-8 bg-white/80 backdrop-blur-sm border border-stone-200/60 rounded-2xl space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif text-sm font-semibold text-[#111111] ">
                  Dejar un Mensaje o Condolencia
                </h3>
                <p className="text-sm text-neutral-500">
                  Tus palabras serán preservadas en el libro de condolencias de la familia.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm uppercase tracking-widest text-neutral-500 font-bold block mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    placeholder="Tu nombre"
                    value={condolenceName}
                    onChange={(e) => setCondolenceName(e.target.value)}
                    required
                    className="w-full bg-white border border-stone-200/80 rounded-lg px-3 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm uppercase tracking-widest text-neutral-500 font-bold block mb-1">Mensaje de Condolencia</label>
                  <textarea 
                    rows={4}
                    placeholder="Escribe tu dedicatoria especial aquí..."
                    value={condolenceMessage}
                    onChange={(e) => setCondolenceMessage(e.target.value)}
                    className="w-full bg-white border border-stone-200/80 rounded-xl px-3 py-3 outline-none resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-[#967B62] text-white hover:bg-[#7D654E] :bg-neutral-200 text-base uppercase tracking-widest font-bold transition-colors"
                >
                  Enviar al Libro de Condolencias
                </button>
              </div>

              {submitSuccess && (
                <span className="text-base text-green-500 font-semibold block text-center mt-2">
                  ✔ Mensaje publicado de forma perpetua.
                </span>
              )}
            </form>

            {/* List */}
            <div className="space-y-4">
              <h3 className="font-serif text-base font-semibold uppercase tracking-wider text-neutral-500">Mensajes Recibidos</h3>

              {condolences.length === 0 ? (
                <div className="text-center py-6 text-neutral-500">
                  Aún no hay mensajes en el libro de condolencias. Sé el primero en escribir.
                </div>
              ) : (
                <div className="space-y-3">
                  {condolences.map((cond) => (
                    <div 
                      key={cond.id} 
                      className="p-5 bg-white/80 backdrop-blur-sm border border-stone-200/60 rounded-xl space-y-2 text-justify"
                    >
                      <p className="text-neutral-600 font-light leading-relaxed">
                        &ldquo;{cond.message}&rdquo;
                      </p>
                      
                      <div className="flex justify-between items-center text-base text-neutral-500 font-mono">
                        <span className="font-bold">{cond.authorName}</span>
                        <span>{new Date(cond.createdAt).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Family Tree */}
        {activeTab === "tree" && (
          <div className="bg-white/80 backdrop-blur-sm border border-stone-200/60 p-8 rounded-2xl space-y-6 text-center animate-fade-in">
            <div>
              <h3 className="font-serif text-base font-bold text-[#111111] ">Árbol Directo de Conexiones</h3>
              <p className="text-base text-neutral-500 max-w-xs mx-auto leading-normal mt-1">
                Haz clic en cualquier familiar directo en el árbol para conocer más sobre su historia.
              </p>
            </div>

            {/* SVG Diagram */}
            <div className="overflow-x-auto p-5 bg-white/40 rounded-xl border border-stone-200/50 hide-scrollbar cursor-grab active:cursor-grabbing">
              <svg viewBox="0 0 800 450" className="min-w-[800px] w-full h-auto mx-auto">
                <g fill="none" stroke="#737373" strokeWidth="1.5">
                  {/* Padres a Alejandro */}
                  <path d="M 250 76 L 250 115" />
                  <path d="M 550 76 L 550 115" />
                  <path d="M 250 115 L 550 115" />
                  <path d="M 400 115 L 400 155" />
                  
                  {/* Laura a Alejandro */}
                  <path d="M 190 188 L 290 188" strokeDasharray="4 4" />
                  
                  {/* Alejandro a Hijos */}
                  <path d="M 400 221 L 400 260" />
                  <path d="M 200 260 L 600 260" />
                  <path d="M 200 260 L 200 300" />
                  <path d="M 600 260 L 600 300" />
                  
                  {/* Marta a Sofia */}
                  <path d="M 200 356 L 200 380" strokeDasharray="4 4" />
                </g>

                {/* Roberto */}
                <g transform="translate(160, 20)" className="cursor-pointer" onClick={() => setSelectedRelative("roberto")}>
                  <rect width="180" height="56" rx="8" fill="white" stroke={selectedRelative === "roberto" ? "#111111" : "#d4d4d4"} strokeWidth={selectedRelative === "roberto" ? "2" : "1"} />
                  <text x="90" y="26" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#111111">Roberto Valenzuela</text>
                  <text x="90" y="44" textAnchor="middle" fontSize="10.5" fill="#55504C">Padre (1918 - 1992)</text>
                </g>

                {/* Elena */}
                <g transform="translate(460, 20)" className="cursor-pointer" onClick={() => setSelectedRelative("elena")}>
                  <rect width="180" height="56" rx="8" fill="white" stroke={selectedRelative === "elena" ? "#111111" : "#d4d4d4"} strokeWidth={selectedRelative === "elena" ? "2" : "1"} />
                  <text x="90" y="26" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#111111">Elena Díaz</text>
                  <text x="90" y="44" textAnchor="middle" fontSize="10.5" fill="#55504C">Madre (1922 - 2005)</text>
                </g>

                {/* Alejandro (Main) */}
                <g transform="translate(290, 155)" className="cursor-pointer" onClick={() => setSelectedRelative("alejandro")}>
                  <rect width="220" height="66" rx="10" fill="#111111" stroke="#967B62" strokeWidth="2" />
                  <text x="110" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="white">Alejandro Valenzuela</text>
                  <text x="110" y="48" textAnchor="middle" fontSize="11" fill="#EBE6DF">Profesor Principal (1948 - 2026)</text>
                </g>

                {/* Laura */}
                <g transform="translate(10, 160)" className="cursor-pointer" onClick={() => setSelectedRelative("laura")}>
                  <rect width="180" height="56" rx="8" fill="white" stroke={selectedRelative === "laura" ? "#111111" : "#d4d4d4"} strokeWidth={selectedRelative === "laura" ? "2" : "1"} />
                  <text x="90" y="26" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#111111">Laura Muñoz</text>
                  <text x="90" y="44" textAnchor="middle" fontSize="10.5" fill="#55504C">Cónyuge (Activa)</text>
                </g>

                {/* Marta */}
                <g transform="translate(110, 300)" className="cursor-pointer" onClick={() => setSelectedRelative("marta")}>
                  <rect width="180" height="56" rx="8" fill="white" stroke={selectedRelative === "marta" ? "#111111" : "#d4d4d4"} strokeWidth={selectedRelative === "marta" ? "2" : "1"} />
                  <text x="90" y="26" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#111111">Marta Valenzuela</text>
                  <text x="90" y="44" textAnchor="middle" fontSize="10.5" fill="#55504C">Hija (Activa)</text>
                </g>

                {/* Alejandro Jr */}
                <g transform="translate(510, 300)" className="cursor-pointer" onClick={() => setSelectedRelative("alejandro_jr")}>
                  <rect width="180" height="56" rx="8" fill="white" stroke={selectedRelative === "alejandro_jr" ? "#111111" : "#d4d4d4"} strokeWidth={selectedRelative === "alejandro_jr" ? "2" : "1"} />
                  <text x="90" y="26" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#111111">Alejandro Jr</text>
                  <text x="90" y="44" textAnchor="middle" fontSize="10.5" fill="#55504C">Hijo (Activo)</text>
                </g>

                {/* Sofia */}
                <g transform="translate(110, 380)" className="cursor-pointer" onClick={() => setSelectedRelative("sofia")}>
                  <rect width="180" height="56" rx="8" fill="white" stroke={selectedRelative === "sofia" ? "#111111" : "#d4d4d4"} strokeWidth={selectedRelative === "sofia" ? "2" : "1"} />
                  <text x="90" y="26" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#111111">Sofía Valenzuela</text>
                  <text x="90" y="44" textAnchor="middle" fontSize="10.5" fill="#55504C">Nieta (Activa)</text>
                </g>
              </svg>
            </div>

            {selectedRelative && relativesData[selectedRelative] && (
              <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 text-left max-w-xl mx-auto space-y-2 transition-all">
                <div className="flex justify-between items-center text-base">
                  <span className="font-serif font-bold text-[#111111] ">
                    {relativesData[selectedRelative].name}
                  </span>
                  <span className="text-neutral-500 italic">
                    {relativesData[selectedRelative].relation} • {relativesData[selectedRelative].life}
                  </span>
                </div>
                <p className="text-neutral-500 font-light leading-relaxed">
                  {relativesData[selectedRelative].desc}
                </p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Lightbox Visor */}
      {lightboxOpen && galleryItems.length > 0 && (
        <MediaLightbox
          items={galleryItems.map(g => ({
            id: g.id,
            type: g.type,
            title: g.title,
            fileUrl: g.fileUrl,
            content: g.content
          }))}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(idx) => setLightboxIndex(idx)}
        />
      )}

      {/* Share QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-5">
          <div className="relative max-w-sm w-full">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-neutral-100 :bg-neutral-800 text-neutral-500 z-10"
            >
              Cerrar
            </button>
            <QrCodeGenerator
              url={`${typeof window !== "undefined" ? window.location.origin : ""}/memorial/${memorial.slug}`}
              name={memorial.name}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-stone-200/40 text-center text-base text-neutral-500 font-mono">
        <p>Aeterna Memorial Platform © 2026. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}
