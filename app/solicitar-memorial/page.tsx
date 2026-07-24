"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, FileText, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";

export default function SolicitarMemorialPage() {
  const router = useRouter();
  
  const [reqName, setReqName] = useState("");
  const [reqBirth, setReqBirth] = useState<Date | null>(null);
  const [reqDeath, setReqDeath] = useState<Date | null>(null);
  const [reqRelation, setReqRelation] = useState("");
  const [reqMessage, setReqMessage] = useState("");
  const [reqSent, setReqSent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("user_session");
    if (!saved) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      name: reqName,
      date: new Date().toISOString(),
      status: "Pendiente"
    };
    
    // Obtener anteriores
    const prevStr = localStorage.getItem("amuley_user_requests");
    const prev = prevStr ? JSON.parse(prevStr) : [];
    
    // Guardar
    const updated = [...prev, newReq];
    localStorage.setItem("amuley_user_requests", JSON.stringify(updated));
    setReqSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCFBFA] via-[#F5F0EB] to-[#EDE6DF] py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header simple con botón volver */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.push("/dashboard")}
            className="w-10 h-10 rounded-full bg-white border border-stone-200/60 shadow-sm flex items-center justify-center text-neutral-500 hover:bg-stone-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#111]">Solicitar un Memorial</h1>
            <p className="text-sm text-neutral-500 mt-1">Completa los datos para iniciar la creación del espacio</p>
          </div>
        </div>

        {reqSent ? (
          <div className="bg-white rounded-3xl border border-stone-200/60 p-12 text-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-emerald-500" />
            </div>
            <h2 className="font-serif text-3xl text-[#111] mb-4">¡Solicitud Enviada con Éxito!</h2>
            <p className="text-neutral-500 max-w-md mx-auto mb-8 leading-relaxed">
              Tu solicitud ha sido enviada al equipo de Amuley. Nos pondremos en contacto contigo pronto para los siguientes pasos en la creación del memorial.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-8 py-4 rounded-xl bg-[#967B62] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#856b54] active:scale-[0.98] transition-all shadow-md"
            >
              Volver a mi Espacio
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200/60 p-8 md:p-10 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#967B62]/10 flex items-center justify-center">
                  <FileText size={20} className="text-[#967B62]" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#111]">Datos de la Persona</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold block">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: María Elena Rodríguez"
                    value={reqName}
                    onChange={(e) => setReqName(e.target.value)}
                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-5 py-4 outline-none text-[#111] focus:bg-white focus:border-[#967B62] focus:ring-4 focus:ring-[#967B62]/10 transition-all duration-300 placeholder:text-neutral-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold block">Tu Relación *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Hijo/a, Nieto/a, Amigo/a"
                    value={reqRelation}
                    onChange={(e) => setReqRelation(e.target.value)}
                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-5 py-4 outline-none text-[#111] focus:bg-white focus:border-[#967B62] focus:ring-4 focus:ring-[#967B62]/10 transition-all duration-300 placeholder:text-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold block">Fecha de Nacimiento</label>
                  <div className="relative">
                    <DatePicker
                      selected={reqBirth}
                      onChange={(date) => setReqBirth(date)}
                      locale={es}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Seleccionar fecha"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-5 py-4 pl-12 outline-none text-[#111] focus:bg-white focus:border-[#967B62] focus:ring-4 focus:ring-[#967B62]/10 transition-all duration-300 placeholder:text-neutral-400"
                      wrapperClassName="w-full"
                    />
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold block">Fecha de Fallecimiento</label>
                  <div className="relative">
                    <DatePicker
                      selected={reqDeath}
                      onChange={(date) => setReqDeath(date)}
                      locale={es}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Seleccionar fecha"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-5 py-4 pl-12 outline-none text-[#111] focus:bg-white focus:border-[#967B62] focus:ring-4 focus:ring-[#967B62]/10 transition-all duration-300 placeholder:text-neutral-400"
                      wrapperClassName="w-full"
                    />
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold block">Mensaje Adicional</label>
                  <textarea
                    placeholder="Cuéntanos un poco sobre esta persona, algún recuerdo especial o detalles que consideres importantes..."
                    value={reqMessage}
                    onChange={(e) => setReqMessage(e.target.value)}
                    rows={5}
                    className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-5 py-4 outline-none text-[#111] focus:bg-white focus:border-[#967B62] focus:ring-4 focus:ring-[#967B62]/10 transition-all duration-300 placeholder:text-neutral-400 resize-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-widest text-neutral-500 hover:bg-stone-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-[#967B62] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#856b54] active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Send size={16} />
                  Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
