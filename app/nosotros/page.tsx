"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, LogIn, Plus } from "lucide-react";

export default function NosotrosPage() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full z-0 bg-[#FCFBFA] transform-gpu will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://picsum.photos/id/93/2000/1200" 
          alt="Paisaje alegre de fondo" 
          className="w-full h-full object-cover opacity-[0.15]"
        />
      </div>

      <div className="relative z-10 min-h-screen font-sans text-[#111111] overflow-x-hidden flex flex-col">
        {/* Header - Simple for Nosotros */}
        <header className="fixed w-full top-0 z-50 bg-[#FCFBFA]/90 backdrop-blur-sm border-b border-[#967B62]/30 px-4 md:px-6 py-3 md:py-5 animate-fade-in-up">
          <div className="max-w-6xl mx-auto flex justify-between items-center gap-2">
            <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-[#967B62]/40 [transform:translateZ(0)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
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

            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-[#55504C]">
              <Link href="/" className="hover:text-[#967B62] transition-colors">INICIO</Link>
              <Link href="/#pricing" className="hover:text-[#967B62] transition-colors">PLANES FAMILIARES</Link>
              <Link href="/#pricing" className="hover:text-[#967B62] transition-colors">PLANES EMPRESAS</Link>
              <span className="text-[#967B62] border-b-2 border-[#967B62] pb-1 cursor-default">NOSOTROS</span>
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

        <main className="flex-grow w-full flex flex-col px-6 pt-32 pb-24 max-w-5xl mx-auto min-h-[80vh] mt-10">
          {/* Section 1: Intro */}
          <div className="text-center mb-20">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#111111] leading-[1.1] animate-fade-in-up">
              Nuestra Historia
            </h1>
            <p className="text-[#3A3836] mt-8 font-normal text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
              En Amuley creemos que la memoria es el tesoro más grande que dejamos al partir. Nacimos con el propósito de ofrecer un espacio digital digno, elegante y seguro para preservar la historia de nuestras familias.
            </p>
          </div>

          {/* Section 2: Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 mb-24 animate-fade-in-up delay-200">
            <div className="bg-white/70 backdrop-blur-md border border-[#967B62]/20 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center md:text-left">
              <h2 className="font-serif text-2xl font-bold text-[#111111] mb-4">Nuestra Misión</h2>
              <p className="text-[#55504C] leading-relaxed text-sm md:text-base">
                Transformar la forma en que recordamos a nuestros seres queridos, pasando del olvido físico a un legado digital perdurable. Queremos democratizar el acceso a herramientas tecnológicas que permitan a las futuras generaciones conocer de dónde vienen.
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-md border border-[#967B62]/20 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center md:text-left">
              <h2 className="font-serif text-2xl font-bold text-[#111111] mb-4">Nuestra Visión</h2>
              <p className="text-[#55504C] leading-relaxed text-sm md:text-base">
                Convertirnos en el estándar global de preservación de memorias familiares e institucionales. Un ecosistema donde cada vida, por sencilla que haya sido, tenga un espacio de honor en la eternidad digital.
              </p>
            </div>
          </div>

          {/* Section 3: Values */}
          <div className="text-center animate-fade-in-up delay-300">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#111111] mb-12">Lo que nos define</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#967B62]/10 flex items-center justify-center mb-6 text-[#967B62]">
                  <Sparkles size={28} />
                </div>
                <h3 className="font-bold text-lg text-[#111111] mb-3 uppercase tracking-widest text-xs">Respeto Absoluto</h3>
                <p className="text-[#55504C] text-sm leading-relaxed">
                  Tratamos cada memoria con la máxima dignidad. No vendemos datos ni mostramos publicidad invasiva.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#967B62]/10 flex items-center justify-center mb-6 text-[#967B62]">
                  <LogIn size={28} />
                </div>
                <h3 className="font-bold text-lg text-[#111111] mb-3 uppercase tracking-widest text-xs">Conexión Familiar</h3>
                <p className="text-[#55504C] text-sm leading-relaxed">
                  Fomentamos la colaboración entre miembros de la familia para construir un legado colectivo y enriquecedor.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#967B62]/10 flex items-center justify-center mb-6 text-[#967B62]">
                  <Plus size={28} />
                </div>
                <h3 className="font-bold text-lg text-[#111111] mb-3 uppercase tracking-widest text-xs">Innovación Continua</h3>
                <p className="text-[#55504C] text-sm leading-relaxed">
                  Constantemente mejoramos nuestras herramientas tecnológicas para garantizar la preservación de datos a largo plazo.
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-12 border-t border-[#EBE6DF] text-center text-sm text-[#635D58] font-mono space-y-3 bg-[#FCFBFA] mt-auto">
          <p>Amuley Legacy Platform © 2026. Todos los derechos reservados.</p>
          <p className="opacity-80 flex items-center justify-center gap-1.5 hover:text-[#967B62] transition-colors cursor-default">
            Hecho con respeto, minimalismo y elegancia <Sparkles size={12} className="text-[#967B62]" />
          </p>
        </footer>
      </div>
    </>
  );
}
