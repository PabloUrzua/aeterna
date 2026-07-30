"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Shield, 
  Building, 
  Users, 
  Activity, 
  Database, 
  TrendingUp, 
  AlertTriangle, 
  Search, 
  RefreshCw, 
  Layers, 
  CheckCircle,
  FileText,
  ExternalLink,
  Plus,
  UserPlus,
  Mail,
  Receipt,
  Menu,
  X
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useBranding, presets } from "../../context/BrandingContext";
import confetti from "canvas-confetti";
import { createClient } from "@/utils/supabase/client";

export default function SuperAdminDashboard({ switchRole, originalRole }: { switchRole?: (role: string) => void, originalRole?: string | null }) {
  const router = useRouter();
  const { config } = useBranding();

  const [globalMemorials, setGlobalMemorials] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [boletas, setBoletas] = useState<any[]>([]);
  const [newBoletaAmount, setNewBoletaAmount] = useState("");
  const [newBoletaTenant, setNewBoletaTenant] = useState("");
  const [newBoletaConcept, setNewBoletaConcept] = useState("");
  const [isCreatingBoleta, setIsCreatingBoleta] = useState(false);
  const [boletaCreateMsg, setBoletaCreateMsg] = useState<{type: "success"|"error", text: string} | null>(null);

  const handleCreateBoleta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoletaTenant || !newBoletaAmount || !newBoletaConcept) return;

    setIsCreatingBoleta(true);
    setBoletaCreateMsg(null);

    setTimeout(() => {
      const newBoleta = {
        id: `bol-${Date.now()}`,
        tenantName: newBoletaTenant,
        amount: newBoletaAmount,
        concept: newBoletaConcept,
        status: "Activa", // Activa, Por Confirmar, Confirmada
        date: new Date().toISOString().substring(0, 10),
      };

      const savedBoletas = localStorage.getItem("amuley_boletas");
      const allBoletas = savedBoletas ? JSON.parse(savedBoletas) : [];
      const updated = [...allBoletas, newBoleta];
      
      localStorage.setItem("amuley_boletas", JSON.stringify(updated));
      setBoletas(updated);

      setNewBoletaAmount("");
      setNewBoletaConcept("");
      setNewBoletaTenant("");
      setBoletaCreateMsg({ type: "success", text: "Boleta creada exitosamente." });
      setIsCreatingBoleta(false);
      
      confetti({ particleCount: 20, spread: 25, colors: ["#14B8A6", "#FAF7F2"] });
      setTimeout(() => setBoletaCreateMsg(null), 3000);
    }, 600);
  };

  const handleChangeBoletaStatus = (id: string, newStatus: string) => {
    const updated = boletas.map(b => b.id === id ? { ...b, status: newStatus } : b);
    setBoletas(updated);
    localStorage.setItem("amuley_boletas", JSON.stringify(updated));
  };


  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMemorialId, setInviteMemorialId] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<{type: "success"|"error", text: string} | null>(null);

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteMemorialId) return;

    setIsSendingInvite(true);
    setInviteSuccessMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: inviteEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        setInviteSuccessMsg({ type: "error", text: error.message });
      } else {
        const memorial = globalMemorials.find(m => m.id === inviteMemorialId);
        if (memorial) {
          const invite = {
            id: memorial.id,
            slug: memorial.slug,
            name: memorial.name,
            birthDate: memorial.birthDate,
            deathDate: memorial.deathDate,
            mainImage: memorial.mainImage,
            invitedBy: "Amuley Default",
            invitedDate: new Date().toISOString(),
            relation: "Administrador Familiar",
            tenantName: memorial.tenantName || "Amuley Default",
            inviteEmail: inviteEmail
          };
          
          const existingInvitesStr = localStorage.getItem("amuley_user_invites");
          const existingInvites = existingInvitesStr ? JSON.parse(existingInvitesStr) : [];
          localStorage.setItem("amuley_user_invites", JSON.stringify([...existingInvites, invite]));
          
          const existingUsersStr = localStorage.getItem("amuley_users");
          const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
          if (!existingUsers.some((u: any) => u.email === inviteEmail)) {
            const newUser = {
              id: `u-${Date.now()}`,
              name: "Administrador Familiar",
              email: inviteEmail,
              role: "FAMILIA",
              tenantName: memorial.tenantName || "Amuley Default",
              branchName: "Global",
              createdAt: new Date().toISOString().substring(0, 10),
              status: "Pendiente Confirmación"
            };
            localStorage.setItem("amuley_users", JSON.stringify([...existingUsers, newUser]));
            window.dispatchEvent(new Event("local-storage-update"));
          }
        }
        
        setInviteSuccessMsg({ type: "success", text: `Magic Link enviado a ${inviteEmail}` });
        setInviteEmail("");
        setInviteMemorialId("");
        confetti({ particleCount: 20, spread: 25, colors: ["#14B8A6", "#FAF7F2"] });
      }
    } catch (err: any) {
      setInviteSuccessMsg({ type: "error", text: err.message || "Error inesperado" });
    } finally {
      setIsSendingInvite(false);
    }
  };

  const [activeTab, setActiveTab] = useState<"overview" | "funerarias" | "sucursales" | "usuarios" | "memoriales" | "invitaciones" | "boletas">("overview");
  const [tenants, setTenants] = useState<any[]>([]);
  
  // Calculate dynamic stats
  const calculateMRR = () => {
    return tenants.reduce((total, tenant) => {
      if (tenant.status !== "Activo") return total;
      switch (tenant.plan) {
        case "Enterprise": return total + 1200000;
        case "Growth B2B": return total + 500000;
        case "Essential B2B": return total + 150000;
        default: return total;
      }
    }, 0);
  };

  const calculateChurn = () => {
    if (tenants.length === 0) return 0;
    const inactive = tenants.filter(t => t.status !== "Activo").length;
    return ((inactive / tenants.length) * 100).toFixed(1);
  };
  
  // Generar datos históricos simulados terminando en el valor EXACTO real de ingresos
  const chartData = React.useMemo(() => {
    const currentRevenue = calculateMRR();
    return [
      { name: "Feb", revenue: Math.round(currentRevenue * 0.4) },
      { name: "Mar", revenue: Math.round(currentRevenue * 0.55) },
      { name: "Abr", revenue: Math.round(currentRevenue * 0.7) },
      { name: "May", revenue: Math.round(currentRevenue * 0.8) },
      { name: "Jun", revenue: Math.round(currentRevenue * 0.92) },
      { name: "Jul (Actual)", revenue: currentRevenue }
    ];
  }, [tenants]);

  // Funeraria Tools State
  const [branches, setBranches] = useState<any[]>([]);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchCity, setNewBranchCity] = useState("");
  const [newBranchAddress, setNewBranchAddress] = useState("");
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [branchCreateMsg, setBranchCreateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Tenant Creation State
  const [newTenantName, setNewTenantName] = useState("");
  const [newTenantDomain, setNewTenantDomain] = useState("");
  const [newTenantPlan, setNewTenantPlan] = useState("Growth B2B");
  const [isCreatingTenant, setIsCreatingTenant] = useState(false);
  const [tenantCreateMsg, setTenantCreateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [newName, setNewName] = useState("");
  const [newBirth, setNewBirth] = useState("");
  const [newDeath, setNewDeath] = useState("");
  const [newFamilyEmail, setNewFamilyEmail] = useState("");
  const [newType, setNewType] = useState<"persona" | "mascota">("persona");
  const [newSpecies, setNewSpecies] = useState("");
  const [newBreed, setNewBreed] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newMemorialTenant, setNewMemorialTenant] = useState("");

  const [emailSubject, setEmailSubject] = useState("Acceso a tu Memorial Digital - Amuley Legacy");
  const [emailGreeting, setEmailGreeting] = useState("Estimada familia Valenzuela,");
  const [emailBody, setEmailBody] = useState("Le enviamos este enlace mágico privado para que puedan administrar, personalizar y compartir el memorial digital de su ser querido. A través de este portal, podrán subir fotografías, mensajes de voz, biografías y configurar su árbol familiar perpetuo.");
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);

  // Create User State
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserTenant, setNewUserTenant] = useState("");
  const [newUserBranch, setNewUserBranch] = useState("");
  const [newUserRole, setNewUserRole] = useState<"FUNERARIA" | "FAMILIA">("FUNERARIA");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userCreateMsg, setUserCreateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [createdUsers, setCreatedUsers] = useState<any[]>([]);

  React.useEffect(() => {
    const savedUsers = localStorage.getItem("amuley_users");
    if (savedUsers) {
      setCreatedUsers(JSON.parse(savedUsers));
    }
    
    const savedBranches = localStorage.getItem("amuley_branches");
    if (savedBranches) {
      setBranches(JSON.parse(savedBranches));
    } else {
      const defaultBranches = [
        { id: "b1", name: "Sucursal Centro", city: "Santiago", address: "Av. Providencia 1024" },
        { id: "b2", name: "Sucursal Valparaíso", city: "Valparaíso", address: "Condell 450" }
      ];
      setBranches(defaultBranches);
      localStorage.setItem("amuley_branches", JSON.stringify(defaultBranches));
    }
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim() || !newUserTenant.trim()) return;

    setIsCreatingUser(true);
    setUserCreateMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
      });

      if (error) {
        setUserCreateMsg({ type: "error", text: error.message });
      } else {
        const newUser = {
          id: `u-${Date.now()}`,
          name: newUserName,
          email: newUserEmail,
          role: newUserRole,
          tenantName: newUserTenant,
          branchName: newUserBranch || "Global",
          createdAt: new Date().toISOString().substring(0, 10),
          status: "Pendiente Confirmación"
        };

        const savedUsers = localStorage.getItem("amuley_users");
        const allUsers = savedUsers ? JSON.parse(savedUsers) : [];
        const updated = [...allUsers, newUser];
        localStorage.setItem("amuley_users", JSON.stringify(updated));
        setCreatedUsers(updated);

        setUserCreateMsg({ type: "success", text: `Usuario ${newUserEmail} creado exitosamente. Se envió correo de confirmación.` });
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserTenant("");
        setNewUserBranch("");
        confetti({ particleCount: 20, spread: 25, colors: ["#14B8A6", "#FAF7F2"] });
      }
    } catch (err: any) {
      setUserCreateMsg({ type: "error", text: err.message || "Error inesperado" });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim() || !newBranchCity.trim() || !newBranchAddress.trim()) return;
    
    setIsCreatingBranch(true);
    setBranchCreateMsg(null);

    setTimeout(() => {
      const newBranch = {
        id: `b-${Date.now()}`,
        name: newBranchName,
        city: newBranchCity,
        address: newBranchAddress
      };
      
      const savedBranches = localStorage.getItem("amuley_branches");
      const allBranches = savedBranches ? JSON.parse(savedBranches) : [];
      const updated = [...allBranches, newBranch];
      localStorage.setItem("amuley_branches", JSON.stringify(updated));
      setBranches(updated);
      
      setBranchCreateMsg({ type: "success", text: `Sucursal "${newBranchName}" creada con éxito.` });
      setNewBranchName("");
      setNewBranchCity("");
      setNewBranchAddress("");
      setIsCreatingBranch(false);
      
      confetti({ particleCount: 20, spread: 25, colors: ["#14B8A6", "#FAF7F2"] });
    }, 800);
  };

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim() || !newTenantDomain.trim()) return;

    setIsCreatingTenant(true);
    setTenantCreateMsg(null);

    setTimeout(() => {
      const newTenant = {
        id: `t-${Date.now()}`,
        name: newTenantName,
        domain: newTenantDomain,
        plan: newTenantPlan,
        status: "Activo",
        memorials: 0,
        date: new Date().toISOString().substring(0, 10)
      };

      const savedBoletas = localStorage.getItem("amuley_boletas");
    if (savedBoletas) setBoletas(JSON.parse(savedBoletas));

    const savedTenants = localStorage.getItem("amuley_tenants");
      const allTenants = savedTenants ? JSON.parse(savedTenants) : [];
      const updated = [...allTenants, newTenant];
      localStorage.setItem("amuley_tenants", JSON.stringify(updated));
      setTenants(updated);

      setTenantCreateMsg({ type: "success", text: `Funeraria "${newTenantName}" registrada exitosamente.` });
      setNewTenantName("");
      setNewTenantDomain("");
      setNewTenantPlan("Growth B2B");
      setIsCreatingTenant(false);

      confetti({ particleCount: 20, spread: 25, colors: ["#14B8A6", "#FAF7F2"] });
    }, 800);
  };

  const handleCreateMemorial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newFamilyEmail.trim()) return;

    setIsCreating(true);

    setTimeout(() => {
      const slugified = newName.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
      const selectedTenantName = newMemorialTenant || (tenants.length > 0 ? tenants[0].name : "Amuley Default");
      
      const newMemorial = {
        id: `m-${Date.now()}`,
        slug: slugified,
        name: newName,
        birthDate: newBirth,
        deathDate: newDeath,
        biography: "Biografía pendiente...",
        mainImage: "https://picsum.photos/id/93/2000/1200",
        coverImage: "https://picsum.photos/id/93/2000/1200",
        isPrivate: false,
        tenantName: selectedTenantName,
        createdBy: "cjxd123@gmail.com" // Opcionalmente sessionEmail si existe
      };

      const savedMems = localStorage.getItem("amuley_memorials");
      const allMems = savedMems ? JSON.parse(savedMems) : [];
      const updatedAllMems = [...allMems, newMemorial];
      localStorage.setItem("amuley_memorials", JSON.stringify(updatedAllMems));

      setGlobalMemorials(prev => [...prev, newMemorial]);

      // Guardar el usuario familiar en la tabla de usuarios local
      const newUser = {
        id: `u-${Date.now()}`,
        name: "Administrador Familiar",
        email: newFamilyEmail,
        role: "FAMILIA",
        tenantName: selectedTenantName,
        branchName: "Global",
        createdAt: new Date().toISOString().substring(0, 10),
        status: "Pendiente Magic Link"
      };
      const savedUsers = localStorage.getItem("amuley_users");
      const allUsers = savedUsers ? JSON.parse(savedUsers) : [];
      if (!allUsers.some((u: any) => u.email === newFamilyEmail)) {
        const updatedUsers = [...allUsers, newUser];
        localStorage.setItem("amuley_users", JSON.stringify(updatedUsers));
      }

      // Guardar invitación local
      const invite = {
        id: newMemorial.id,
        slug: newMemorial.slug,
        name: newMemorial.name,
        birthDate: newMemorial.birthDate,
        deathDate: newMemorial.deathDate,
        mainImage: newMemorial.mainImage,
        invitedBy: selectedTenantName,
        invitedDate: new Date().toISOString(),
        relation: "Administrador Familiar",
        tenantName: selectedTenantName,
        inviteEmail: newFamilyEmail
      };
      const existingInvitesStr = localStorage.getItem("amuley_user_invites");
      const existingInvites = existingInvitesStr ? JSON.parse(existingInvitesStr) : [];
      localStorage.setItem("amuley_user_invites", JSON.stringify([...existingInvites, invite]));

      setIsCreating(false);
      setNewName("");
      setNewBirth("");
      setNewDeath("");
      setNewFamilyEmail("");
      setNewMemorialTenant("");

      confetti({
        particleCount: 25,
        spread: 30,
        colors: ["#14B8A6", "#FAF7F2"]
      });
      alert(`Memorial creado con éxito. Se envió un correo con un Magic Link de acceso administrativo a: ${newFamilyEmail}`);
    }, 1200);
  };

  React.useEffect(() => {
    const savedMems = localStorage.getItem("amuley_memorials");
    if (savedMems) {
      setGlobalMemorials(JSON.parse(savedMems));
    }

    const savedTenants = localStorage.getItem("amuley_tenants");
    if (savedTenants) {
      setTenants(JSON.parse(savedTenants));
    } else {
      // Provide one default real tenant so the platform can be used
      const defaultTenant = [{ id: "t1", name: "Amuley Default", domain: "memoriales.amuley.app", plan: "Enterprise", status: "Activo", memorials: 0, date: new Date().toISOString().substring(0, 10) }];
      setTenants(defaultTenant);
      localStorage.setItem("amuley_tenants", JSON.stringify(defaultTenant));
    }
  }, []);

  const [logs, setLogs] = useState([
    { time: "14:24:02", type: "info", msg: "Tenant 'Funeraria La Paz' creó memorial 'Beatriz Mendoza'" },
    { time: "14:21:40", type: "success", msg: "Tenant 'Elysium Gardens' vinculó dominio 'legado.elysiumgardens.com'" },
    { time: "14:15:10", type: "info", msg: "Usuario 'marta@correo.com' subió audio conmemorativo a memorial 'Alejandro Valenzuela'" },
    { time: "14:05:22", type: "system", msg: "Sistema: Copia de seguridad programada de base de datos finalizada con éxito" },
    { time: "13:58:12", type: "warning", msg: "Intento fallido de login desde IP 192.168.1.120 (3 reintentos superados)" }
  ]);

  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);

  const triggerBackup = () => {
    setIsBackingUp(true);
    setBackupSuccess(false);
    
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupSuccess(true);
      confetti({
        particleCount: 30,
        spread: 40,
        colors: [config.primaryColor, "#FAF7F2"]
      });
      
      const newLog = {
        time: new Date().toTimeString().split(" ")[0],
        type: "system",
        msg: "Super Admin: Copia de seguridad forzada realizada manualmente"
      };
      setLogs(prev => [newLog, ...prev]);

      setTimeout(() => setBackupSuccess(false), 3000);
    }, 1500);
  };

  const handleToggleStatus = (id: string) => {
    const updatedTenants = tenants.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === "Activo" ? "Suspendido" : "Activo";
        
        const newLog = {
          time: new Date().toTimeString().split(" ")[0],
          type: nextStatus === "Suspendido" ? "warning" : "success",
          msg: `Super Admin: Cambió estado de tenant '${t.name}' a ${nextStatus}`
        };
        setLogs(l => [newLog, ...l]);
        
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setTenants(updatedTenants);
    localStorage.setItem("amuley_tenants", JSON.stringify(updatedTenants));
  };

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] font-sans smooth-transition text-sm md:text-base overflow-hidden">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar fija a la izquierda */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 lg:w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex-shrink-0 flex flex-col h-full z-50 shadow-2xl md:shadow-sm transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} md:flex`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <span className="font-serif text-xl tracking-wider font-bold">
            AM<span className="text-[var(--tenant-primary)]">U</span>LEY
          </span>
          <button 
            className="md:hidden text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          {/* Navegación Super Admin */}
          <div className="space-y-1">
            <div className="text-[10px] md:text-xs uppercase tracking-widest text-neutral-400 font-bold px-3 py-2 mb-1">
              Consola Central
            </div>
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold flex items-center gap-2 smooth-transition ${
                activeTab === "overview" 
                  ? "bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]" 
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <Activity size={16} /> Panel de Control
            </button>
            <button 
              onClick={() => setActiveTab("funerarias")}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold flex items-center gap-2 smooth-transition ${
                activeTab === "funerarias" 
                  ? "bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]" 
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <Building size={16} /> Gestión de Funerarias
            </button>
            <button 
              onClick={() => setActiveTab("sucursales")}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold flex items-center gap-2 smooth-transition ${
                activeTab === "sucursales" 
                  ? "bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]" 
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <Layers size={16} /> Gestión de Sucursales
            </button>
            <button 
              onClick={() => setActiveTab("usuarios")}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold flex items-center gap-2 smooth-transition ${
                activeTab === "usuarios" 
                  ? "bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]" 
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <Users size={16} /> Usuarios y Administradores
            </button>
            <button 
              onClick={() => setActiveTab("memoriales")}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold flex items-center gap-2 smooth-transition ${
                activeTab === "memoriales" 
                  ? "bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]" 
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <FileText size={16} /> Memoriales Digitales
            </button>

            <button 
              onClick={() => setActiveTab("invitaciones")}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold flex items-center gap-2 smooth-transition ${
                activeTab === "invitaciones" 
                  ? "bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]" 
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <Mail size={16} /> Invitaciones
            </button>

            <button 
              onClick={() => setActiveTab("boletas")}
              className={`w-full text-left px-3 py-2.5 rounded-lg font-semibold flex items-center gap-2 smooth-transition ${
                activeTab === "boletas" 
                  ? "bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]" 
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <Receipt size={16} /> Boletas y Facturación
            </button>


          </div>
        </div>

        {/* Operaciones del Sistema en la parte inferior */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4 shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
          <h4 className="font-serif text-sm font-semibold mb-2 flex items-center gap-1.5"><Database size={14} /> Infraestructura</h4>
          <div className="space-y-3">
            <button 
              onClick={triggerBackup}
              disabled={isBackingUp}
              className="w-full py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={12} className={isBackingUp ? "animate-spin" : ""} />
              {isBackingUp ? "Respaldando..." : "Respaldar DB Prisma"}
            </button>
            {backupSuccess && (
              <span className="text-[10px] md:text-xs text-green-500 font-semibold text-center block">
                ✔ Copia guardada en S3/R2
              </span>
            )}

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3 space-y-2 text-[10px] md:text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Servidor API:</span>
                <span className="text-green-500 font-bold">Online (99.98%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Uso de CPU:</span>
                <span className="text-neutral-700 dark:text-neutral-300 font-mono">14.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Latencia DB:</span>
                <span className="text-neutral-700 dark:text-neutral-300 font-mono">4.8ms</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header Superior del Panel Central */}
        <header className="h-16 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-6 flex justify-between items-center z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span className="px-2.5 py-1 rounded-md bg-purple-600/10 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Shield size={12} /> Super Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block font-medium text-sm text-neutral-500 dark:text-neutral-400">
              Control de Plataforma Global
            </span>
            <button 
              onClick={() => router.push("/")}
              className="text-xs md:text-sm font-semibold text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Contenido Principal Scrolleable */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Métricas Globales */}
                <section className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-panel p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold block mb-1">Ingresos Generados</span>
                    <span className="text-xl font-bold font-serif text-neutral-800 dark:text-neutral-100 flex items-center gap-1">
                      ${calculateMRR().toLocaleString('es-CL')} <TrendingUp size={14} className="text-green-500" />
                    </span>
                    <span className="text-[8px] text-neutral-400 mt-1 block">Basado en planes activos</span>
                  </div>

            <div className="glass-panel p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold block mb-1">Funerarias SaaS</span>
              <span className="text-xl font-bold font-serif text-neutral-800 dark:text-neutral-100">
                {tenants.length} Registradas
              </span>
              <span className="text-[8px] text-neutral-400 mt-1 block">{tenants.filter(t => t.status === "Activo").length} marca blanca activas</span>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold block mb-1">Memoriales Totales</span>
              <span className="text-xl font-bold font-serif text-neutral-800 dark:text-neutral-100">
                {globalMemorials.length} Activos
              </span>
              <span className="text-[8px] text-neutral-400 mt-1 block">Custodia perpetua activa</span>
            </div>

            <div className="glass-panel p-5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold block mb-1">Tasa de Churn</span>
              <span className="text-xl font-bold font-serif text-neutral-800 dark:text-neutral-100">
                {calculateChurn()}%
              </span>
              <span className={`text-[8px] mt-1 block font-bold ${Number(calculateChurn()) > 5 ? 'text-red-500' : 'text-green-500'}`}>
                {Number(calculateChurn()) > 5 ? 'Requiere atención' : 'Excelente retención'}
              </span>
            </div>
          </section>

          {/* Gráfico en Tiempo Real */}
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h2 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
              <Activity size={18} className="text-[var(--tenant-primary)]" />
              Ingresos Generados de la Empresa
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--tenant-primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--tenant-primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMemorials" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickFormatter={(value) => `$${value.toLocaleString('es-CL')}`}
                  />
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.15)" />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(8px)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Ingresos (CLP)"
                    stroke="var(--tenant-primary)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorMrr)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Historial de Auditoría / Logs en Tiempo Real */}
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              <Activity size={18} className="text-[var(--tenant-primary)]" />
              Logs de Auditoría y Seguridad
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Monitoreo en tiempo real de actividades críticas en la infraestructura SaaS y acciones de White Label realizadas por los administradores de funerarias.
            </p>

            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-xs md:text-sm space-y-2.5 max-h-[220px] overflow-y-auto pr-2 shadow-inner">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-3 leading-relaxed border-b border-neutral-100 dark:border-neutral-800/60 pb-2 last:border-0 last:pb-0">
                  <span className="text-neutral-400 shrink-0">[{log.time}]</span>
                  <span className={`px-1.5 py-0.2 rounded text-[8px] uppercase tracking-wider font-bold shrink-0 ${
                    log.type === "success" 
                      ? "bg-emerald-800/10 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" 
                      : log.type === "warning"
                        ? "bg-amber-600/10 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                        : log.type === "system"
                          ? "bg-purple-600/10 text-purple-700 dark:bg-purple-955/20 dark:text-purple-400"
                          : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-neutral-700 dark:text-neutral-300">{log.msg}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

          {/* Directorio de Funerarias */}
          {activeTab === "funerarias" && (
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              <Building size={18} className="text-[var(--tenant-primary)]" />
              Directorio de Clientes B2B SaaS
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Registra nuevas funerarias para generar su instancia White Label o administra las existentes.
            </p>

            {tenantCreateMsg && (
              <div className={`p-4 rounded-xl text-sm font-medium mb-4 ${
                tenantCreateMsg.type === "success" 
                  ? "bg-green-50 border border-green-200 text-green-700" 
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}>
                {tenantCreateMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateTenant} className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end mb-8">
              <div>
                <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Nombre Funeraria</label>
                <input 
                  type="text" 
                  placeholder="Ej. Funeraria La Paz"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                />
              </div>
              <div>
                <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Dominio</label>
                <input 
                  type="text" 
                  placeholder="Ej. lapaz.amuley.app"
                  value={newTenantDomain}
                  onChange={(e) => setNewTenantDomain(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                />
              </div>
              <div>
                <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Plan SaaS</label>
                <select
                  value={newTenantPlan}
                  onChange={(e) => setNewTenantPlan(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                >
                  <option value="Enterprise">Enterprise ($1.200.000)</option>
                  <option value="Growth B2B">Growth B2B ($500.000)</option>
                  <option value="Essential B2B">Essential B2B ($150.000)</option>
                </select>
              </div>
              <button 
                type="submit"
                disabled={isCreatingTenant}
                className="w-full py-2.5 px-6 rounded-lg bg-[var(--tenant-primary)] text-white hover:opacity-90 font-bold uppercase tracking-widest transition-colors shadow-sm text-sm"
              >
                {isCreatingTenant ? "..." : "Registrar"}
              </button>
            </form>
            
            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold">
                    <th className="pb-3 font-semibold">Funeraria</th>
                    <th className="pb-3 font-semibold">Dominio White Label</th>
                    <th className="pb-3 font-semibold">Plan SaaS</th>
                    <th className="pb-3 font-semibold">Memoriales</th>
                    <th className="pb-3 font-semibold">Estado</th>
                    <th className="pb-3 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/80">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="py-3.5 font-bold text-neutral-800 dark:text-neutral-100">{t.name}</td>
                      <td className="py-3.5 font-mono text-xs md:text-sm text-neutral-500">{t.domain}</td>
                      <td className="py-3.5 font-medium text-neutral-600 dark:text-neutral-400">{t.plan}</td>
                      <td className="py-3.5 font-mono">{t.memorials}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider ${t.status === "Activo" ? "bg-emerald-800/10 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right space-x-2.5">
                        <button 
                          onClick={() => handleToggleStatus(t.id)}
                          className={`text-xs md:text-sm font-semibold hover:underline ${t.status === "Activo" ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"}`}
                        >
                          {t.status === "Activo" ? "Suspender" : "Reactivar"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          )}

          {/* Directorio Global de Memoriales (Todos los clientes de todas las funerarias) */}


          {/* Nueva Sección: Boletas */}
          {activeTab === "boletas" && (
          <div className="space-y-6 md:space-y-8">
            <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
              <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
                <Receipt size={18} className="text-[var(--tenant-primary)]" />
                Gestión de Boletas y Facturación
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
                Crea cobros para las funerarias y administra los estados de pago.
              </p>
              
              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">Crear Nueva Boleta</h3>
                <form onSubmit={handleCreateBoleta} className="grid md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Funeraria</label>
                    <select 
                      value={newBoletaTenant}
                      onChange={(e) => setNewBoletaTenant(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 outline-none text-sm md:text-base"
                    >
                      <option value="">Seleccionar...</option>
                      {tenants.map((t) => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Concepto</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Plan Mensual"
                      value={newBoletaConcept}
                      onChange={(e) => setNewBoletaConcept(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 outline-none text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Monto (USD/CLP)</label>
                    <input 
                      type="number" 
                      placeholder="99.00"
                      value={newBoletaAmount}
                      onChange={(e) => setNewBoletaAmount(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 outline-none text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <button 
                      type="submit"
                      disabled={isCreatingBoleta}
                      className="w-full py-2.5 rounded-lg bg-[var(--tenant-primary)] text-white hover:opacity-90 font-bold tracking-widest transition-all uppercase text-sm disabled:opacity-50"
                    >
                      {isCreatingBoleta ? "Creando..." : "Emitir Boleta"}
                    </button>
                  </div>
                </form>
                {boletaCreateMsg && (
                  <div className={`mt-4 p-3 rounded-lg text-sm font-semibold ${
                    boletaCreateMsg.type === "success" 
                      ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" 
                      : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                  }`}>
                    {boletaCreateMsg.text}
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold">
                      <th className="pb-3 font-semibold">ID</th>
                      <th className="pb-3 font-semibold">Funeraria</th>
                      <th className="pb-3 font-semibold">Concepto</th>
                      <th className="pb-3 font-semibold">Monto</th>
                      <th className="pb-3 font-semibold">Fecha</th>
                      <th className="pb-3 font-semibold">Estado</th>
                      <th className="pb-3 font-semibold text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/80">
                    {boletas.map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                        <td className="py-3.5 font-mono text-xs text-neutral-500">{b.id}</td>
                        <td className="py-3.5 font-bold text-neutral-800 dark:text-neutral-100">{b.tenantName}</td>
                        <td className="py-3.5 text-neutral-600 dark:text-neutral-400">{b.concept}</td>
                        <td className="py-3.5 font-medium text-[var(--tenant-primary)]">${b.amount}</td>
                        <td className="py-3.5 text-neutral-500 text-sm">{b.date}</td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            b.status === "Confirmada" ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" : 
                            b.status === "Por Confirmar" ? "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" :
                            "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          <select 
                            value={b.status}
                            onChange={(e) => handleChangeBoletaStatus(b.id, e.target.value)}
                            className="bg-transparent text-xs border border-neutral-300 dark:border-neutral-700 rounded p-1 outline-none font-semibold text-neutral-600 dark:text-neutral-300"
                          >
                            <option value="Activa">Activa</option>
                            <option value="Por Confirmar">Por Confirmar</option>
                            <option value="Confirmada">Confirmada</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {boletas.length === 0 && (
                  <div className="text-center py-12 text-neutral-400 dark:text-neutral-500 font-light">
                    No hay boletas registradas en el sistema.
                  </div>
                )}
              </div>
            </section>
          </div>
          )}

          {/* Nueva Sección: Invitaciones */}
          {activeTab === "invitaciones" && (
          <div className="space-y-6 md:space-y-8">
            <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
              <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
                <Mail size={18} className="text-[var(--tenant-primary)]" />
                Invitar a un Miembro de la Familia
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
                Envía un Magic Link para que un familiar pueda tomar el control o colaborar en un memorial específico.
              </p>
              
              <form onSubmit={handleSendInvitation} className="grid md:grid-cols-3 gap-6 items-end">
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Correo a Invitar</label>
                  <input 
                    type="email" 
                    placeholder="familiar@correo.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 outline-none text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Memorial a Vincular</label>
                  <select 
                    value={inviteMemorialId}
                    onChange={(e) => setInviteMemorialId(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 outline-none text-sm md:text-base"
                  >
                    <option value="">Selecciona un memorial...</option>
                    {globalMemorials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} - {m.tenantName || "Funeraria"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <button 
                    type="submit"
                    disabled={isSendingInvite}
                    className="w-full py-2.5 rounded-lg bg-[var(--tenant-primary)] text-white hover:opacity-90 font-bold tracking-widest transition-all uppercase text-sm disabled:opacity-50"
                  >
                    {isSendingInvite ? "Enviando..." : "Enviar Invitación"}
                  </button>
                </div>
              </form>

              {inviteSuccessMsg && (
                <div className={`mt-4 p-4 rounded-xl text-sm font-semibold ${
                  inviteSuccessMsg.type === "success" 
                    ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" 
                    : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                }`}>
                  {inviteSuccessMsg.text}
                </div>
              )}
            </section>
          </div>
          )}

          {activeTab === "memoriales" && (
          <div className="space-y-6 md:space-y-8">
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              <Users size={18} className="text-[var(--tenant-primary)]" />
              Gestión Global de Perfiles
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Todos los perfiles de fallecidos creados a través de las funerarias B2B. Accede y modifica cualquier cambio ya hecho.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold">
                    <th className="pb-3 font-semibold">Fallecido</th>
                    <th className="pb-3 font-semibold">Funeraria Responsable</th>
                    <th className="pb-3 font-semibold">Período</th>
                    <th className="pb-3 font-semibold">Estado</th>
                    <th className="pb-3 font-semibold text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/80">
                  {globalMemorials.map((m) => (
                    <tr key={m.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="py-3.5 font-bold text-neutral-800 dark:text-neutral-100">{m.name}</td>
                      <td className="py-3.5 font-medium text-[var(--tenant-primary)]">{m.tenantName || "Funeraria Default"}</td>
                      <td className="py-3.5 font-mono text-xs md:text-sm text-neutral-500">{m.birthDate?.substring(0,4)} - {m.deathDate?.substring(0,4)}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          m.isPrivate ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" : "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                        }`}>
                          {m.isPrivate ? "Privado" : "Público"}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button 
                          onClick={() => {
                            localStorage.setItem("active_memorial_id", m.id);
                            switchRole?.("FAMILIA");
                          }}
                          className="text-xs md:text-sm font-bold text-[var(--tenant-primary)] hover:underline flex items-center justify-end gap-1 ml-auto"
                        >
                          Modificar Perfil <ExternalLink size={10} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {globalMemorials.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-neutral-500 italic">No hay perfiles creados en el sistema aún.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>


          {/* Formulario Crear Nuevo Memorial */}
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              <Plus size={18} className="text-[var(--tenant-primary)]" />
              Crear Nuevo Memorial
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Registra un servicio y genera de inmediato el memorial digital. El sistema enviará una invitación por correo a la familia para que tomen control administrativo colaborativo.
            </p>

            <form onSubmit={handleCreateMemorial} className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Funeraria Responsable</label>
                  <select 
                    value={newMemorialTenant}
                    onChange={(e) => setNewMemorialTenant(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base mb-4"
                  >
                    <option value="">Selecciona una funeraria...</option>
                    {tenants.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Tipo de Memorial</label>
                    <select 
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as "persona" | "mascota")}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                    >
                      <option value="persona">Persona</option>
                      <option value="mascota">Mascota</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">
                      {newType === "persona" ? "Nombre del Fallecido" : "Nombre de la Mascota"}
                    </label>
                    <input 
                      type="text" 
                      placeholder={newType === "persona" ? "Ej. Roberto García" : "Ej. Toby"}
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Nacimiento</label>
                    <input 
                      type="date"
                      value={newBirth}
                      onChange={(e) => setNewBirth(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Fallecimiento</label>
                    <input 
                      type="date"
                      value={newDeath}
                      onChange={(e) => setNewDeath(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                    />
                  </div>
                </div>
                
                {newType === "mascota" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Especie</label>
                      <input 
                        type="text"
                        placeholder="Ej. Perro, Gato"
                        value={newSpecies}
                        onChange={(e) => setNewSpecies(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Raza (Opcional)</label>
                      <input 
                        type="text"
                        placeholder="Ej. Pastor Alemán"
                        value={newBreed}
                        onChange={(e) => setNewBreed(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Correo del Administrador Familiar</label>
                  <input 
                    type="email"
                    placeholder="familiar@correo.com"
                    value={newFamilyEmail}
                    onChange={(e) => setNewFamilyEmail(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                  />
                  <span className="text-xs md:text-sm text-neutral-400 mt-1 block">Se le enviará un Magic Link para configurar la privacidad, fotos y relatos familiares.</span>
                </div>
                <button 
                  type="submit"
                  disabled={isCreating}
                  className="w-full py-3.5 rounded-full bg-[var(--tenant-primary)] text-white hover:opacity-90 font-bold uppercase tracking-widest transition-colors shadow-sm"
                >
                  {isCreating ? "Creando..." : "Registrar Memorial y Enviar Accesos"}
                </button>
              </div>
            </form>
          </section>
          </div>
          )}

          {activeTab === "usuarios" && (
          <div className="space-y-6 md:space-y-8">
          {/* Formulario Crear Usuario */}
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              <UserPlus size={18} className="text-[var(--tenant-primary)]" />
              Crear Nuevo Usuario
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Registra un nuevo usuario en la plataforma y asígnalo a una funeraria. Se le enviará un correo de confirmación que deberá verificar antes de poder acceder.
            </p>

            {userCreateMsg && (
              <div className={`p-4 rounded-xl text-sm font-medium mb-4 ${
                userCreateMsg.type === "success" 
                  ? "bg-green-50 border border-green-200 text-green-700" 
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}>
                {userCreateMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Juan Pérez"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    placeholder="usuario@funeraria.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Contraseña Inicial</label>
                  <input 
                    type="password" 
                    placeholder="Mínimo 6 caracteres"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                  />
                </div>
              </div>
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Funeraria Asignada</label>
                  <select
                    value={newUserTenant}
                    onChange={(e) => setNewUserTenant(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                  >
                    <option value="">Seleccionar funeraria...</option>
                    {tenants.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Sucursal</label>
                  <select
                    value={newUserBranch}
                    onChange={(e) => setNewUserBranch(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                  >
                    <option value="">Global / Todas</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name} ({b.city})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Rol del Usuario</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as "FUNERARIA" | "FAMILIA")}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                  >
                    <option value="FUNERARIA">Administrador de Funeraria</option>
                    <option value="FAMILIA">Familia / Usuario</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  disabled={isCreatingUser}
                  className="w-full py-3 rounded-full bg-[var(--tenant-primary)] text-white hover:opacity-90 font-bold uppercase tracking-widest transition-colors shadow-sm text-sm"
                >
                  {isCreatingUser ? "Creando usuario..." : "Crear Usuario y Enviar Confirmación"}
                </button>
              </div>
            </form>
          </section>

          {/* Listado de Usuarios Creados */}
          {createdUsers.length > 0 && (
          <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
            <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
              <Users size={18} className="text-[var(--tenant-primary)]" />
              Usuarios Registrados
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
              Todos los usuarios creados desde este panel.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold">
                    <th className="pb-3 font-semibold">Nombre</th>
                    <th className="pb-3 font-semibold">Correo</th>
                    <th className="pb-3 font-semibold">Funeraria</th>
                    <th className="pb-3 font-semibold">Sucursal</th>
                    <th className="pb-3 font-semibold">Rol</th>
                    <th className="pb-3 font-semibold">Fecha</th>
                    <th className="pb-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/80">
                  {createdUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="py-3.5 font-bold text-neutral-800 dark:text-neutral-100">{u.name || "Sin nombre"}</td>
                      <td className="py-3.5 text-neutral-600 dark:text-neutral-300">{u.email}</td>
                      <td className="py-3.5 font-medium text-[var(--tenant-primary)]">{u.tenantName}</td>
                      <td className="py-3.5 font-medium text-neutral-600 dark:text-neutral-400">{u.branchName || "Global"}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          u.role === "FUNERARIA" 
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400" 
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                        }`}>
                          {u.role === "FUNERARIA" ? "Admin Funeraria" : "Familia"}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-xs md:text-sm text-neutral-500">{u.createdAt}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          )}
          </div>
          )}

          {activeTab === "sucursales" && (
          <div className="space-y-6 md:space-y-8">
            <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
              <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
                <Building size={18} className="text-[var(--tenant-primary)]" />
                Gestión de Sucursales
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
                Administra las sucursales de las funerarias. Estas sucursales podrán ser asignadas a los administradores de funeraria al momento de crear un usuario.
              </p>

              {branchCreateMsg && (
                <div className={`p-4 rounded-xl text-sm font-medium mb-4 ${
                  branchCreateMsg.type === "success" 
                    ? "bg-green-50 border border-green-200 text-green-700" 
                    : "bg-red-50 border border-red-200 text-red-600"
                }`}>
                  {branchCreateMsg.text}
                </div>
              )}

              <form onSubmit={handleCreateBranch} className="grid md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end mb-8">
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Nombre de Sucursal</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Sucursal Providencia"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Ciudad</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Santiago"
                    value={newBranchCity}
                    onChange={(e) => setNewBranchCity(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Dirección</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Av. Siempre Viva 742"
                    value={newBranchAddress}
                    onChange={(e) => setNewBranchAddress(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2 outline-none text-sm md:text-base"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isCreatingBranch}
                  className="w-full py-2.5 px-6 rounded-lg bg-[var(--tenant-primary)] text-white hover:opacity-90 font-bold uppercase tracking-widest transition-colors shadow-sm text-sm"
                >
                  {isCreatingBranch ? "..." : "Crear"}
                </button>
              </form>

              <div className="overflow-x-auto mt-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold">
                      <th className="pb-3 font-semibold">Nombre</th>
                      <th className="pb-3 font-semibold">Ciudad</th>
                      <th className="pb-3 font-semibold">Dirección</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/80">
                    {branches.map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                        <td className="py-3.5 font-bold text-neutral-800 dark:text-neutral-100">{b.name}</td>
                        <td className="py-3.5 font-medium text-neutral-600 dark:text-neutral-400">{b.city}</td>
                        <td className="py-3.5 text-neutral-500">{b.address}</td>
                      </tr>
                    ))}
                    {branches.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-neutral-500 italic">No hay sucursales creadas.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
          )}


          </div>
        </main>
      </div>
    </div>
  );
}
