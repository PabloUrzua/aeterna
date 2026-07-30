"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Heart, ArrowRight, ShieldCheck, Sparkles, Eye, Leaf, 
  QrCode, LogIn, Plus, Briefcase, Users, Cat, Box 
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [activeSegment, setActiveSegment] = useState<"familias" | "empresas">("familias");
  const [activeFamilyTab, setActiveFamilyTab] = useState<"personas" | "mascotas">("personas");
  const [activeNav, setActiveNav] = useState<"inicio" | "familias" | "empresas" | "nosotros">("inicio");

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
          className="w-full h-full object-cover opacity-[0.15]"
        />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 min-h-screen font-sans text-[#111111] overflow-x-hidden flex flex-col">

      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-[#FCFBFA]/90 backdrop-blur-sm border-b border-[#967B62]/30 px-4 md:px-6 py-3 md:py-5 animate-fade-in-up">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-2">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-[#967B62]/40 [transform:translateZ(0)]">
              <img 
                src="/logo.png" 
                alt="Amuley Logo" 
                className="w-full h-full object-cover scale-[1.6] group-hover:scale-[1.65] transition-transform duration-500 ease-in-out"
              />
            </div>
            <span className="font-serif text-sm sm:text-base md:text-xl tracking-[0.1em] md:tracking-[0.3em] font-bold uppercase text-[#967B62]">
              AMULEY
            </span>
          </Link>

          {/* Navigation Middle */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-[#55504C]">
            <button 
              onClick={() => {
                setActiveNav("inicio");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`hover:text-[#967B62] transition-colors ${activeNav === "inicio" ? "text-[#967B62] border-b-2 border-[#967B62] pb-1" : ""}`}
            >
              INICIO
            </button>
            <button 
              onClick={() => {
                setActiveNav("familias");
                setActiveSegment("familias");
                const el = document.getElementById("pricing");
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className={`hover:text-[#967B62] transition-colors ${activeNav === "familias" ? "text-[#967B62] border-b-2 border-[#967B62] pb-1" : ""}`}
            >
              PLANES FAMILIARES
            </button>
            <button 
              onClick={() => {
                setActiveNav("empresas");
                setActiveSegment("empresas");
                const el = document.getElementById("pricing");
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className={`hover:text-[#967B62] transition-colors ${activeNav === "empresas" ? "text-[#967B62] border-b-2 border-[#967B62] pb-1" : ""}`}
            >
              PLANES EMPRESAS
            </button>
            <button 
              onClick={() => {
                setActiveNav("nosotros");
                router.push("/nosotros");
              }}
              className={`hover:text-[#967B62] transition-colors ${activeNav === "nosotros" ? "text-[#967B62] border-b-2 border-[#967B62] pb-1" : ""}`}
            >
              NOSOTROS
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
            <Link
              href="/login"
              className="text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-bold text-[#55504C] hover:text-[#967B62] transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <LogIn size={16} /> Ingresar
            </Link>
            <Link
              href="/solicitar-memorial"
              className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-5 md:py-2.5 rounded-sm bg-[#967B62]/10 border border-[#967B62] hover:bg-[#967B62] hover:text-[#FCFBFA] text-[#967B62] text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-bold transition-all shadow-sm hover:shadow-md whitespace-nowrap flex items-center gap-1.5"
            >
              <Plus size={16} /> Crear
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 pt-32 pb-24 min-h-screen flex flex-col justify-center items-center text-center space-y-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#967B62]/30 bg-white/70 backdrop-blur-sm text-sm font-semibold text-[#967B62] shadow-sm animate-fade-in-up delay-100 uppercase tracking-widest">
            {activeSegment === "familias" ? (
              <><Leaf size={14} /> El santuario digital de tu familia</>
            ) : (
              <><Briefcase size={14} /> Innovación para el sector funerario</>
            )}
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#111111] leading-[1.1] max-w-4xl mx-auto animate-fade-in-up delay-200">
            {activeSegment === "familias" 
              ? "Conserva la historia de quienes amas, para siempre." 
              : "La plataforma de Legado Digital en marca blanca para tu empresa."}
          </h1>

          <p className="text-[#3A3836] font-normal text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-300">
            {activeSegment === "familias"
              ? "Un espacio íntimo, colaborativo y libre de publicidad. Recopila relatos, fotografías y construye el árbol genealógico de tus seres queridos, y también de tus amadas mascotas."
              : "No vengas a reemplazar tu servicio, ven a ofrecer algo que ninguna otra funeraria entrega. Incrementa el valor percibido, la retención y abre nuevas líneas de ingresos."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 animate-fade-in-up delay-400">
            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-[#967B62] hover:bg-[#7D654E] text-white text-sm md:text-base uppercase font-bold tracking-widest transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              Ver Demo <Eye size={16} />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("pricing");
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-transparent hover:bg-[#967B62]/10 border border-[#967B62] text-[#967B62] text-sm md:text-base uppercase font-bold tracking-widest transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              Ver Planes <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* Pricing & Business Models */}
        <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 animate-fade-in-up delay-500">
          
          {/* FAMILIAS B2C */}
          {activeSegment === "familias" && (
            <div className="space-y-12">
              <div className="flex justify-center mb-8">
                <div className="inline-flex bg-white/80 border border-[#967B62]/30 rounded-full p-1 backdrop-blur-sm">
                  <button 
                    onClick={() => setActiveFamilyTab("personas")}
                    className={`px-6 py-2 rounded-full text-sm uppercase tracking-widest font-bold transition-colors flex items-center gap-2 ${activeFamilyTab === "personas" ? "bg-[#967B62] text-white shadow-sm" : "text-[#55504C] hover:text-[#967B62]"}`}
                  >
                    <Users size={16} /> Personas
                  </button>
                  <button 
                    onClick={() => setActiveFamilyTab("mascotas")}
                    className={`px-6 py-2 rounded-full text-sm uppercase tracking-widest font-bold transition-colors flex items-center gap-2 ${activeFamilyTab === "mascotas" ? "bg-[#967B62] text-white shadow-sm" : "text-[#55504C] hover:text-[#967B62]"}`}
                  >
                    <Cat size={16} /> Mascotas
                  </button>
                </div>
              </div>

              {/* Planes Familias - Personas */}
              {activeFamilyTab === "personas" && (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Esencial */}
                  <div className="bg-white/90 border border-[#EBE6DF] p-8 rounded-2xl flex flex-col justify-between hover:border-[#967B62]/50 hover:shadow-xl transition-all">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#111111]">Esencial</h3>
                      <p className="text-[#55504C] mt-2 mb-6 text-sm">El recuerdo perfecto y sencillo para la familia inmediata.</p>
                      <div className="text-3xl font-bold text-[#967B62] mb-6">$19.900 <span className="text-sm text-[#55504C] font-normal">pago único</span></div>
                      <ul className="space-y-3 text-sm text-[#55504C] mb-8 font-medium">
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> 1 Memorial Digital</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Hasta 100 fotografías</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Hasta 20 videos</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> 5 Familiares colaboradores</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Código QR Standard</li>
                      </ul>
                    </div>
                    <button className="w-full py-3 rounded-md bg-[#967B62]/10 text-[#967B62] border border-[#967B62] hover:bg-[#967B62] hover:text-white uppercase tracking-widest font-bold text-xs transition-colors">Crear Esencial</button>
                  </div>

                  {/* Familiar */}
                  <div className="bg-[#967B62] border border-[#967B62] p-8 rounded-2xl flex flex-col justify-between transform md:-translate-y-4 shadow-2xl relative">
                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#111111] text-white px-3 py-1 rounded-full text-xs uppercase tracking-widest font-bold whitespace-nowrap shadow-sm">
                      Recomendado
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white">Familiar</h3>
                      <p className="text-white/80 mt-2 mb-6 text-sm">El espacio completo para reconstruir la historia del linaje familiar.</p>
                      <div className="text-3xl font-bold text-white mb-6">$49.900 <span className="text-sm text-white/70 font-normal">pago único</span></div>
                      <ul className="space-y-3 text-sm text-white mb-8 font-medium">
                        <li className="flex items-center gap-2"><Check size={16} className="text-white/50" /> Fotos y Videos Ilimitados</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-white/50" /> 20 Familiares colaboradores</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-white/50" /> Árbol Genealógico interactivo</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-white/50" /> Línea del Tiempo (Hitos)</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-white/50" /> QR y Álbumes</li>
                      </ul>
                    </div>
                    <button className="w-full py-3 rounded-md bg-white text-[#967B62] hover:bg-[#FCFBFA] uppercase tracking-widest font-bold text-xs transition-colors shadow-sm">Crear Familiar</button>
                  </div>

                  {/* Legado */}
                  <div className="bg-white/90 border border-[#EBE6DF] p-8 rounded-2xl flex flex-col justify-between hover:border-[#967B62]/50 hover:shadow-xl transition-all">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#111111]">Legado</h3>
                      <p className="text-[#55504C] mt-2 mb-6 text-sm">Para familias que desean un homenaje absoluto y personalizado.</p>
                      <div className="text-3xl font-bold text-[#967B62] mb-6">$99.900 <span className="text-sm text-[#55504C] font-normal">pago único</span></div>
                      <ul className="space-y-3 text-sm text-[#55504C] mb-8 font-medium">
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Todo lo de Familiar</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Usuarios ilimitados</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Dominio personalizado (.com)</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Diseño Exclusivo</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Soporte Prioritario 24/7</li>
                      </ul>
                    </div>
                    <button className="w-full py-3 rounded-md bg-[#967B62]/10 text-[#967B62] border border-[#967B62] hover:bg-[#967B62] hover:text-white uppercase tracking-widest font-bold text-xs transition-colors">Crear Legado</button>
                  </div>
                </div>
              )}

              {/* Planes Familias - Mascotas */}
              {activeFamilyTab === "mascotas" && (
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {/* Huella */}
                  <div className="bg-white/90 border border-[#EBE6DF] p-8 rounded-2xl flex flex-col justify-between hover:border-[#967B62]/50 hover:shadow-xl transition-all">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#111111] flex items-center gap-2"><Cat size={20} /> Huella</h3>
                      <p className="text-[#55504C] mt-2 mb-6 text-sm">Un lugar íntimo para recordar al compañero de siempre.</p>
                      <div className="text-3xl font-bold text-[#967B62] mb-6">$14.900 <span className="text-sm text-[#55504C] font-normal">pago único</span></div>
                      <ul className="space-y-3 text-sm text-[#55504C] mb-8 font-medium">
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Perfil de mascota</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Historia y Biografía</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Galería de Fotos limitada</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Código QR Standard</li>
                      </ul>
                    </div>
                    <button className="w-full py-3 rounded-md bg-[#967B62]/10 text-[#967B62] border border-[#967B62] hover:bg-[#967B62] hover:text-white uppercase tracking-widest font-bold text-xs transition-colors">Empezar Huella</button>
                  </div>

                  {/* Huella Plus */}
                  <div className="bg-[#967B62] border border-[#967B62] p-8 rounded-2xl flex flex-col justify-between shadow-xl">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2"><Cat size={20} /> Huella Plus</h3>
                      <p className="text-white/80 mt-2 mb-6 text-sm">El santuario digital absoluto con todos los recuerdos de su vida.</p>
                      <div className="text-3xl font-bold text-white mb-6">$29.900 <span className="text-sm text-white/70 font-normal">pago único</span></div>
                      <ul className="space-y-3 text-sm text-white mb-8 font-medium">
                        <li className="flex items-center gap-2"><Check size={16} className="text-white/50" /> Videos Ilimitados</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-white/50" /> Álbumes organizados</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-white/50" /> Participación de toda la familia</li>
                        <li className="flex items-center gap-2"><Check size={16} className="text-white/50" /> Sección de "Mis Huellas" y Juguetes</li>
                      </ul>
                    </div>
                    <button className="w-full py-3 rounded-md bg-white text-[#967B62] hover:bg-[#FCFBFA] uppercase tracking-widest font-bold text-xs transition-colors shadow-sm">Empezar Huella Plus</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EMPRESAS B2B */}
          {activeSegment === "empresas" && (
            <div className="space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <h2 className="font-serif text-3xl font-bold">Un modelo SaaS para Funerarias</h2>
                <p className="text-[#55504C]">Ofrece este servicio a tus familias, fideliza a tus clientes y automatiza la creación del legado digital.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Starter */}
                <div className="bg-white/90 border border-[#EBE6DF] p-8 rounded-2xl flex flex-col justify-between hover:border-[#967B62]/50 hover:shadow-xl transition-all">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#111111]">Starter</h3>
                    <p className="text-[#55504C] mt-2 mb-6 text-sm">Para funerarias locales que buscan digitalizarse.</p>
                    <div className="text-3xl font-bold text-[#967B62] mb-6">$49.900 <span className="text-sm text-[#55504C] font-normal">/mes</span></div>
                    <ul className="space-y-3 text-sm text-[#55504C] mb-8 font-medium">
                      <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Hasta 20 Memoriales/mes</li>
                      <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Panel Administrativo</li>
                      <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Generación automática de QR</li>
                      <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Invitaciones Automáticas Familia</li>
                      <li className="flex items-center gap-2 opacity-50"><Check size={16} className="text-[#967B62]" /> Marca Blanca de Amuley</li>
                    </ul>
                  </div>
                  <button className="w-full py-3 rounded-md bg-[#967B62]/10 text-[#967B62] border border-[#967B62] hover:bg-[#967B62] hover:text-white uppercase tracking-widest font-bold text-xs transition-colors">Prueba Gratis (3 meses)</button>
                </div>

                {/* Profesional */}
                <div className="bg-[#111111] border border-[#111111] p-8 rounded-2xl flex flex-col justify-between shadow-2xl transform md:-translate-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white">Profesional</h3>
                    <p className="text-white/80 mt-2 mb-6 text-sm">La solución White Label completa. Tu marca, tus reglas.</p>
                    <div className="text-3xl font-bold text-white mb-6">$149.900 <span className="text-sm text-white/70 font-normal">/mes</span></div>
                    <ul className="space-y-3 text-sm text-white mb-8 font-medium">
                      <li className="flex items-center gap-2"><Check size={16} className="text-white/50" /> Memoriales Ilimitados</li>
                      <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62] font-bold" /> 100% White Label (Marca Blanca)</li>
                      <li className="flex items-center gap-2"><Check size={16} className="text-white/50" /> Dominio Propio (ej. cname.tuempresa.com)</li>
                      <li className="flex items-center gap-2"><Check size={16} className="text-white/50" /> Correos personalizados a tu nombre</li>
                      <li className="flex items-center gap-2"><Check size={16} className="text-white/50" /> Soporte Dedicado</li>
                    </ul>
                  </div>
                  <button className="w-full py-3 rounded-md bg-[#967B62] text-white hover:bg-[#7D654E] uppercase tracking-widest font-bold text-xs transition-colors shadow-sm">Contactar Ventas</button>
                </div>

                {/* Enterprise */}
                <div className="bg-white/90 border border-[#EBE6DF] p-8 rounded-2xl flex flex-col justify-between hover:border-[#967B62]/50 hover:shadow-xl transition-all">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#111111]">Enterprise</h3>
                    <p className="text-[#55504C] mt-2 mb-6 text-sm">Cadenas funerarias, parques, cementerios y crematorios.</p>
                    <div className="text-3xl font-bold text-[#967B62] mb-6">Cotización <span className="text-sm text-[#55504C] font-normal">personalizada</span></div>
                    <ul className="space-y-3 text-sm text-[#55504C] mb-8 font-medium">
                      <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Multi-Sucursal Avanzado</li>
                      <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Acceso a API</li>
                      <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Capacitación de personal</li>
                      <li className="flex items-center gap-2"><Check size={16} className="text-[#967B62]" /> Integraciones CRM</li>
                    </ul>
                  </div>
                  <button className="w-full py-3 rounded-md bg-[#967B62]/10 text-[#967B62] border border-[#967B62] hover:bg-[#967B62] hover:text-white uppercase tracking-widest font-bold text-xs transition-colors">Hablar con Asesor</button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Hardware: Placas Premium */}
        <section className="bg-[#111111] text-white py-24 px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <span className="text-[#967B62] uppercase tracking-widest font-bold text-xs md:text-sm bg-[#967B62]/10 px-4 py-2 rounded border border-[#967B62]/20 inline-flex items-center gap-2">
                <Box size={14} /> Producto Físico (Premium)
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
                El vínculo permanente entre lo físico y lo digital.
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                No vendemos un simple QR impreso. Ofrecemos placas conmemorativas fabricadas en acero inoxidable anodizado, aluminio cepillado o porcelana vitrificada, con grabado láser permanente.
              </p>
              <ul className="space-y-3 font-medium text-white/80">
                <li className="flex items-center gap-3"><Check size={18} className="text-[#967B62]" /> Ideales para Lápidas, Nichos y Urnas.</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-[#967B62]" /> Resistencia absoluta a la intemperie.</li>
                <li className="flex items-center gap-3"><Check size={18} className="text-[#967B62]" /> Diseños discretos y elegantes.</li>
              </ul>
              
              <div className="pt-4">
                <span className="text-2xl font-bold block mb-4">Desde $25.000 <span className="text-sm font-normal text-white/50">/ unidad</span></span>
                <button className="px-8 py-3.5 rounded-md bg-[#967B62] hover:bg-[#7D654E] text-white uppercase font-bold tracking-widest text-sm transition-all shadow-md flex items-center justify-center gap-2">
                  Ver Catálogo de Placas <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="relative animate-fade-in-up delay-200">
              <div className="aspect-square bg-gradient-to-tr from-[#967B62]/20 to-transparent rounded-full blur-3xl absolute -inset-10 z-0"></div>
              <div className="relative z-10 w-full h-[400px] md:h-[500px] border border-white/10 rounded-2xl bg-white/5 overflow-hidden flex items-center justify-center shadow-2xl backdrop-blur-sm p-10">
                <div className="w-48 h-64 bg-gradient-to-b from-[#EAEAEA] to-[#B0B0B0] rounded-md shadow-[inset_0_-4px_10px_rgba(0,0,0,0.2),_0_20px_40px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-6 border-2 border-[#D0D0D0]/30 transform -rotate-6 hover:rotate-0 transition-transform duration-700">
                  <div className="w-24 h-24 bg-black rounded p-2 mb-6">
                    <QrCode size={80} className="text-white" />
                  </div>
                  <span className="font-serif text-[#333333] text-lg font-bold">A. Valenzuela</span>
                  <span className="text-[#555] font-mono text-[10px] tracking-widest uppercase mt-2 border-t border-[#777]/30 pt-2">Escanear para recordar</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-[#EBE6DF] text-center text-sm text-[#635D58] font-mono space-y-3 bg-[#FCFBFA]">
        <p>Amuley Legacy Platform © 2026. Todos los derechos reservados.</p>
        <p className="opacity-80 flex items-center justify-center gap-1.5 hover:text-[#967B62] transition-colors cursor-default">
          Hecho con respeto, minimalismo y elegancia <Sparkles size={12} className="text-[#967B62]" />
        </p>
      </footer>
      </div>
    </>
  );
}

// Icon helper function since lucide-react Check isn't imported
function Check({ size = 24, className = "" }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
