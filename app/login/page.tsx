"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Key, Mail, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg("Registro exitoso. Revisa tu correo o inicia sesión directamente si no requiere confirmación.");
          setIsSignUp(false);
          confetti({ particleCount: 30, spread: 40, colors: ["#1F2937", "#9CA3AF"] });
        }
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg("Credenciales inválidas o correo no registrado.");
        } else if (data.user) {
          // Guardar role básico si lo necesitas, o el token
          localStorage.setItem("user_session", JSON.stringify({ email: data.user.email, role: "ADMIN" }));
          
          confetti({ particleCount: 30, spread: 40, colors: ["#1F2937", "#9CA3AF"] });
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Ha ocurrido un error inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBFA] flex flex-col justify-center items-center p-6 text-[#111111] relative overflow-hidden">
      {/* Global Fixed Background Image */}
      <div className="fixed top-0 left-0 w-full h-full -z-20 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://picsum.photos/id/93/2000/1200" 
          alt="Paisaje de fondo" 
          className="w-full h-full object-cover opacity-15 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[#FCFBFA]/85"></div>
      </div>
      <Link
        href="/"
        className="absolute top-6 left-6 text-sm uppercase tracking-widest font-bold text-[#967B62] hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft size={12} /> Volver a Inicio
      </Link>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm border border-stone-200/60 p-8 rounded-2xl shadow-sm space-y-6">
        <div className="space-y-1.5 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 group mb-1">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 md:w-6 md:h-6 text-[#967B62] group-hover:scale-110 transition-transform duration-500 ease-in-out"
            >
              <path d="M12 2V22M6 8H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-serif text-sm tracking-[0.2em] font-bold uppercase text-[#111111]">
              AETERNA
            </span>
          </Link>
          <h2 className="font-serif text-lg font-normal text-[#111111]">
            Acceso a tu Cuenta
          </h2>
          <p className="text-xs text-neutral-500 uppercase tracking-wider">
            Consola del Memorial
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {successMsg}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/60 border border-stone-200/80 rounded-lg pl-8.5 pr-4 py-2 outline-none text-sm text-[#111111] focus:border-[#967B62] transition-colors"
              />
              <Mail size={12} className="absolute left-3 top-3 text-[#967B62]" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold block mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/60 border border-stone-200/80 rounded-lg pl-8.5 pr-4 py-2 outline-none text-sm text-[#111111] focus:border-[#967B62] transition-colors"
              />
              <Key size={12} className="absolute left-3 top-3 text-[#967B62]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-[#967B62] text-white hover:bg-[#7D654E] text-sm uppercase tracking-widest font-bold transition-colors shadow-xs"
          >
            {isLoading ? "Cargando..." : isSignUp ? "Crear Cuenta" : "Ingresar a la Consola"}
          </button>
        </form>

        <div className="text-center text-sm text-neutral-500 font-light border-t border-stone-100 pt-4">
          {isSignUp ? (
            <p>
              ¿Ya tienes una cuenta?{" "}
              <button type="button" onClick={() => setIsSignUp(false)} className="text-[#967B62] font-semibold hover:underline">
                Inicia sesión aquí
              </button>
            </p>
          ) : (
            <p>
              ¿No tienes una cuenta?{" "}
              <button type="button" onClick={() => setIsSignUp(true)} className="text-[#967B62] font-semibold hover:underline">
                Regístrate aquí
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
