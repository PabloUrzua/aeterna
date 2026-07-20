"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ArrowRight, ShieldCheck, Sparkles, Eye, Leaf, QrCode, LogIn, Plus } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const handleDemoClick = () => {
    router.push("/memorial/alejandro-valenzuela");
  };

  return (
    <>
      {/* Global Fixed Background Image */}
      <div className="fixed top-0 left-0 w-full h-full z-0 bg-[#FCFBFA] transform-gpu will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://picsum.photos/id/93/2000/1200" 
          alt="Paisaje alegre de fondo" 
          className="w-full h-full object-cover opacity-[0.25]"
        />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 min-h-screen font-sans text-[#111111] overflow-x-hidden flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FCFBFA]/90 backdrop-blur-sm border-b border-[#967B62]/30 px-4 md:px-6 py-3 md:py-5 animate-fade-in-up">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-2">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 md:w-7 md:h-7 text-[#967B62] group-hover:scale-110 transition-transform duration-500 ease-in-out drop-shadow-sm"
            >
              <path d="M12 2V22M6 8H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-serif text-sm sm:text-base md:text-xl tracking-[0.1em] md:tracking-[0.3em] font-bold uppercase text-[#967B62]">
              AETERNA
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
            <Link
              href="/login"
              className="text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-bold text-[#55504C] hover:text-[#967B62] transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <LogIn size={16} /> Ingresar
            </Link>
            <Link
              href="/login"
              className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-5 md:py-2.5 rounded-sm bg-[#967B62]/10 border border-[#967B62] hover:bg-[#967B62] hover:text-[#FCFBFA] text-[#967B62] text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-bold transition-all shadow-sm hover:shadow-md whitespace-nowrap flex items-center gap-1.5"
            >
              <Plus size={16} /> Crear Memorial
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto px-6 pt-28 pb-20 text-center space-y-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#967B62]/30 bg-white/70 backdrop-blur-sm text-sm font-semibold text-[#967B62] shadow-sm animate-fade-in-up delay-100">
            <Leaf size={14} className="text-[#967B62]" />
            Un santuario privado para preservar historias familiares
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#111111] leading-[1.1] max-w-3xl mx-auto animate-fade-in-up delay-200">
            Conserva el legado de tus seres queridos para siempre
          </h1>

          <p className="text-[#3A3836] font-normal text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed animate-fade-in-up delay-300">
            Un espacio íntimo, minimalista y libre de publicidad. Diseñado para recopilar de forma colaborativa los relatos, fotografías y videos que realmente importan, enlazados opcionalmente a un código QR discreto.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 animate-fade-in-up delay-400">
            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#967B62] hover:bg-[#7D654E] text-white text-base font-semibold tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              Ver Memorial Demo <Eye size={16} />
            </button>
            
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-transparent hover:bg-[#967B62]/10 border border-[#967B62] text-[#967B62] text-base font-semibold tracking-wider transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              Empezar a Crear <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Showcase / Mockup */}
        <section className="max-w-4xl mx-auto px-6 pb-32 animate-fade-in-up delay-500">
          <div className="rounded-xl border border-[#967B62]/20 bg-white/90 p-2 shadow-xl hover:-translate-y-2 transition-transform duration-500">
            <div className="border border-[#EBE6DF] bg-[#FDFCFB] rounded-lg p-6 sm:p-8 md:p-10 text-left space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 border-b border-[#EBE6DF] pb-5">
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-hidden">
                  <span className="w-3 h-3 rounded-full bg-[#EBE6DF] shrink-0" />
                  <span className="w-3 h-3 rounded-full bg-[#EBE6DF] shrink-0" />
                  <span className="text-xs sm:text-sm font-mono text-[#635D58] font-medium truncate">recuerdos.aeterna.app/alejandro-valenzuela</span>
                </div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#967B62] font-bold bg-[#967B62]/10 px-3 py-1 rounded border border-[#967B62]/20 whitespace-nowrap">
                  Privacidad: Público
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                <div className="space-y-5">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#967B62] p-1 mx-auto md:mx-0 shadow-sm">
                    <img
                      src="https://picsum.photos/id/93/2000/1200"
                      alt="Retrato de Alejandro Valenzuela García"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="text-center md:text-left space-y-2">
                    <h3 className="font-serif text-xl font-bold text-[#111111]">
                      Alejandro Valenzuela García
                    </h3>
                    <p className="text-sm font-mono text-[#967B62] font-semibold">1948 - 2026</p>
                  </div>
                  <p className="text-base text-[#55504C] italic text-center md:text-left leading-relaxed">
                    &ldquo;La duda es el origen de la sabiduría. Solo cuestionando lo evidente encontramos luz en el sendero.&rdquo;
                  </p>
                </div>

                <div className="col-span-2 space-y-6 border-t md:border-t-0 md:border-l border-[#EBE6DF] pt-8 md:pt-0 md:pl-10">
                  <div className="flex flex-wrap gap-4 md:gap-6 border-b border-[#EBE6DF] pb-3 text-xs md:text-sm uppercase tracking-widest font-semibold text-[#635D58]">
                    <span className="text-[#967B62] border-b-2 border-[#967B62] pb-3 -mb-[14px]">Recuerdos</span>
                    <span className="hover:text-[#3A3836] transition-colors cursor-pointer">Biografía</span>
                    <span className="hover:text-[#3A3836] transition-colors cursor-pointer">Condolencias</span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-white border border-[#EBE6DF] rounded-md text-sm space-y-2 hover:border-[#967B62]/50 transition-colors shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
                        <span className="font-bold text-[#111111] text-sm sm:text-base">&ldquo;El primer día de clases...&rdquo;</span>
                        <span className="text-xs font-mono text-[#967B62] font-semibold">Marta V. (Hija)</span>
                      </div>
                      <p className="text-[#55504C] font-normal leading-relaxed line-clamp-2">
                        Llegó sumamente nervioso con su maletín de cuero marrón. Nos contó después que ensayó su discurso frente al espejo...
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-[#EBE6DF] rounded-md text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 hover:border-[#967B62]/50 transition-colors shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📸</span>
                        <div>
                          <span className="font-bold text-[#111111] block text-sm sm:text-base">Fotografía: Con Toby</span>
                          <span className="text-xs text-[#55504C]">Otoño, 2018 • Sofía V. (Nieta)</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-[#967B62] font-semibold bg-[#967B62]/10 border border-[#967B62]/30 px-3 py-1 rounded hover:bg-[#967B62]/20 transition-colors cursor-pointer">Ver Foto</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features list with Texture Background */}
        <section className="relative py-24 px-6 border-y border-[#EBE6DF] overflow-hidden bg-white/80">

          <div className="max-w-5xl mx-auto space-y-20">
            <div className="text-center space-y-3 animate-fade-in-up">
              <h2 className="font-serif text-3xl md:text-4xl font-normal text-[#111111]">
                Esencia de la Plataforma
              </h2>
              <p className="text-[#967B62] text-sm tracking-widest font-bold uppercase">
                Diseño enfocado en la intimidad y la elegancia
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4 p-6 rounded-xl border border-[#EBE6DF] bg-white/90 hover:-translate-y-2 hover:border-[#967B62]/50 hover:shadow-lg transition-all duration-500 animate-fade-in-up delay-100">
                <div className="w-12 h-12 rounded-lg bg-[#967B62]/10 border border-[#967B62]/30 flex items-center justify-center text-[#967B62]">
                  <Heart size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#111111]">Área Colaborativa</h3>
                <p className="text-[#55504C] text-base font-normal leading-relaxed">
                  Invita a tus familiares por correo electrónico. Todos pueden aportar sus recuerdos, fotos, videos y relatos para construir un mosaico familiar íntegro.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-xl border border-[#EBE6DF] bg-white/90 hover:-translate-y-2 hover:border-[#967B62]/50 hover:shadow-lg transition-all duration-500 animate-fade-in-up delay-200">
                <div className="w-12 h-12 rounded-lg bg-[#967B62]/10 border border-[#967B62]/30 flex items-center justify-center text-[#967B62]">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#111111]">Privacidad Absoluta</h3>
                <p className="text-[#55504C] text-base font-normal leading-relaxed">
                  Controla quién ve el memorial. Puedes configurarlo de forma pública para la comunidad o privado con clave o limitación de accesos por invitación.
                </p>
              </div>

              <div className="space-y-4 p-6 rounded-xl border border-[#EBE6DF] bg-white/90 hover:-translate-y-2 hover:border-[#967B62]/50 hover:shadow-lg transition-all duration-500 animate-fade-in-up delay-300">
                <div className="w-12 h-12 rounded-lg bg-[#967B62]/10 border border-[#967B62]/30 flex items-center justify-center text-[#967B62]">
                  <QrCode size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#111111]">Integración QR Física</h3>
                <p className="text-[#55504C] text-base font-normal leading-relaxed">
                  Genera códigos QR de alta resolución listos para imprimir o grabar. Al escanear el código físico, los visitantes acceden al memorial digital de forma instantánea.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-[#EBE6DF] text-center text-sm text-[#635D58] font-mono space-y-3 bg-white/80">
        <p>Aeterna Memorial Platform © 2026. Todos los derechos reservados.</p>
        <p className="opacity-80 flex items-center justify-center gap-1.5 hover:text-[#967B62] transition-colors cursor-default">
          Hecho con respeto, minimalismo y elegancia <Sparkles size={12} className="text-[#967B62]" />
        </p>
      </footer>
      </div>
    </>
  );
}

