"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Key, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import confetti from "canvas-confetti";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get("error");
      const errorDescription = urlParams.get("error_description");

      if (error) {
        let displayError = errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, " ")) : error;
        
        if (displayError.includes("Email link is invalid or has expired")) {
          displayError = "El enlace de acceso es inválido o ha expirado. Por favor, solicita uno nuevo o ingresa con tus credenciales.";
        }
        
        setErrorMsg(displayError);
        
        // Clean up the URL to remove the messy error parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Hardcoded Admin Bypass
      if (email === "cjxd123@gmail.com" && password === "123") {
        localStorage.setItem("user_session", JSON.stringify({ email: "cjxd123@gmail.com", role: "ADMIN" }));
        confetti({ particleCount: 30, spread: 40, colors: ["#1F2937", "#9CA3AF"] });
        router.push("/dashboard");
        return;
      }

      if (isSignUp) {
        if (password !== confirmPassword) {
          setErrorMsg("Las contraseñas no coinciden.");
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          let errorText = error.message;
          if (errorText.includes("Password should be at least 6 characters")) {
            errorText = "La contraseña debe tener al menos 6 caracteres.";
          } else if (errorText.includes("User already registered") || errorText.includes("already exists")) {
            errorText = "Este correo electrónico ya está registrado.";
          } else if (errorText.includes("Invalid login credentials")) {
            errorText = "Credenciales inválidas o correo no registrado.";
          } else if (errorText.includes("Email rate limit exceeded")) {
            errorText = "Has intentado muchas veces. Por favor, espera un momento y vuelve a intentarlo.";
          }
          setErrorMsg(errorText);
        } else {
          setShowConfirmation(true);
          setEmail("");
          setPassword("");
          setIsSignUp(false);
        }
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Email not confirmed")) {
            setErrorMsg("Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada (y spam) para verificar tu cuenta.");
          } else {
            setErrorMsg("Credenciales inválidas o correo no registrado.");
          }
        } else if (data.user) {
          if (!data.user.email_confirmed_at) {
            setErrorMsg("Tu correo aún no ha sido confirmado. Revisa tu bandeja de entrada para verificar tu cuenta.");
            await supabase.auth.signOut();
            return;
          }
          
          // Asignar rol: Por defecto USER
          let userRole = "USER";
          
          if (data.user.email === "cjxd123@gmail.com") {
             userRole = "ADMIN";
          } else if (data.user.email === "pccleanltda@gmail.com") {
             userRole = "FUNERARIA";
          } else {
             // Revisar si fue creado por el superadmin (FUNERARIA) o por funeraria (FAMILIA)
             const savedUsersStr = localStorage.getItem("amuley_users");
             if (savedUsersStr) {
               const savedUsers = JSON.parse(savedUsersStr);
               const foundUser = savedUsers.find((u: any) => u.email === data.user.email);
               if (foundUser) {
                 userRole = foundUser.role; // Puede ser FUNERARIA o FAMILIA
               }
             }
          }

          localStorage.setItem("user_session", JSON.stringify({ email: data.user.email, role: userRole }));
          
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
          className="w-full h-full object-cover opacity-20 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FCFBFA]/80 to-[#FCFBFA]/95"></div>
      </div>
      <Link
        href="/"
        className="absolute top-8 left-8 text-xs uppercase tracking-widest font-bold text-[#967B62] hover:text-[#7D654E] flex items-center gap-2 transition-all duration-300 hover:-translate-x-1"
      >
        <ArrowLeft size={14} /> Volver a Inicio
      </Link>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-stone-200/50 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-8 relative z-10 transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
        <div className="space-y-3 text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-3 group mb-2">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 shadow-md mx-auto border-2 border-[#967B62]/40 [transform:translateZ(0)]">
              <img 
                src="/logo.png" 
                alt="Amuley Logo" 
                className="w-full h-full object-cover scale-[1.6] group-hover:scale-[1.65] transition-transform duration-500 ease-out"
              />
            </div>
            <span className="font-serif text-lg tracking-[0.25em] font-bold uppercase text-[#111111]">
              AMULEY
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-normal text-[#111111]">
            Acceso a tu Cuenta
          </h2>
          <p className="text-xs text-neutral-400 uppercase tracking-[0.15em] font-medium">
            Consola del Memorial
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-4 bg-red-50/80 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3 transition-all">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
              <span className="font-medium leading-relaxed">{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-4 bg-green-50/80 border border-green-100 text-green-700 rounded-xl text-sm font-medium transition-all">
              {successMsg}
            </div>
          )}
          {showConfirmation && (
            <div className="p-5 bg-amber-50/80 border border-amber-200 rounded-xl text-sm space-y-2 transition-all">
              <div className="flex items-center gap-2 text-amber-800 font-bold">
                <Mail size={16} /> Confirma tu correo electrónico
              </div>
              <p className="text-amber-700 leading-relaxed">
                Te hemos enviado un enlace de verificación. Revisa tu <strong>bandeja de entrada</strong> y <strong>carpeta de spam</strong>. No podrás iniciar sesión hasta confirmar tu cuenta.
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-bold block ml-1">
              Correo Electrónico
            </label>
            <div className="relative group">
              <input
                type="email"
                required
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl pl-11 pr-4 py-3.5 outline-none text-sm text-[#111111] focus:bg-white focus:border-[#967B62] focus:ring-4 focus:ring-[#967B62]/10 transition-all duration-300 placeholder:text-neutral-400"
              />
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#967B62] transition-colors duration-300" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-bold block ml-1">
              Contraseña
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-50/50 border border-stone-200 rounded-xl pl-11 pr-11 py-3.5 outline-none text-sm text-[#111111] focus:bg-white focus:border-[#967B62] focus:ring-4 focus:ring-[#967B62]/10 transition-all duration-300 placeholder:text-neutral-400"
              />
              <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#967B62] transition-colors duration-300" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#967B62] transition-colors"
                title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-bold block ml-1">
                Confirmar Contraseña
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-xl pl-11 pr-11 py-3.5 outline-none text-sm text-[#111111] focus:bg-white focus:border-[#967B62] focus:ring-4 focus:ring-[#967B62]/10 transition-all duration-300 placeholder:text-neutral-400"
                />
                <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#967B62] transition-colors duration-300" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#967B62] transition-colors"
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 rounded-xl bg-[#967B62] text-white hover:bg-[#856b54] active:scale-[0.98] text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 shadow-lg shadow-[#967B62]/20 hover:shadow-[#967B62]/40 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Cargando..." : isSignUp ? "Crear Cuenta" : "Ingresar"}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500 font-medium border-t border-stone-100 pt-6">
          {isSignUp ? (
            <p>
              ¿Ya tienes una cuenta?{" "}
              <button type="button" onClick={() => setIsSignUp(false)} className="text-[#967B62] font-bold hover:text-[#856b54] transition-colors">
                Inicia sesión aquí
              </button>
            </p>
          ) : (
            <p>
              ¿No tienes una cuenta?{" "}
              <button type="button" onClick={() => setIsSignUp(true)} className="text-[#967B62] font-bold hover:text-[#856b54] transition-colors">
                Regístrate aquí
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
