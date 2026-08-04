"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Building, 
  Users, 
  UserPlus,
  Settings, 
  FileText, 
  QrCode, 
  Plus, 
  Palette, 
  TrendingUp, 
  ShieldAlert, 
  ExternalLink,
  CheckCircle,
  Undo,
  Layers,
  Laptop,
  Menu,
  X,
  LogOut,
  Receipt,
  Eye,
  Download
} from "lucide-react";
import { useBranding, presets } from "../../context/BrandingContext";
import confetti from "canvas-confetti";
import { createClient } from "@/utils/supabase/client";

export default function FunerariaDashboard({ switchRole, originalRole }: { switchRole?: (role: string) => void, originalRole?: string | null }) {
  const router = useRouter();
  const { config, updateConfig, applyPreset, resetConfig, activePreset } = useBranding();
  
  const [createdMemorials, setCreatedMemorials] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "memoriales" | "usuarios" | "sucursales" | "facturacion" | "configuracion">("overview");

  const [companyProfile, setCompanyProfile] = useState({
    rut: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    website: "",
  });
  const [profileSaveMsg, setProfileSaveMsg] = useState<{type:"success"|"error", text:string} | null>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
  const [tenantUsers, setTenantUsers] = useState<any[]>([]);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserBranch, setNewUserBranch] = useState("");
  const [newUserMemorial, setNewUserMemorial] = useState("");
  const [userCreateMsg, setUserCreateMsg] = useState<{type: "success"|"error", text: string} | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [tenantProfileName, setTenantProfileName] = useState<string>("Funeraria");

  const [branches, setBranches] = useState<any[]>([]);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchCity, setNewBranchCity] = useState("");
  const [newBranchAddress, setNewBranchAddress] = useState("");
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);
  const [branchCreateMsg, setBranchCreateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [invoices, setInvoices] = useState<any[]>([]);
  const [newInvoiceAmount, setNewInvoiceAmount] = useState("");
  const [newInvoiceDescription, setNewInvoiceDescription] = useState("");
  const [newInvoiceClient, setNewInvoiceClient] = useState("");
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [invoiceCreateMsg, setInvoiceCreateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    const savedProfile = localStorage.getItem("amuley_company_profile");
    if (savedProfile) {
      try { setCompanyProfile(JSON.parse(savedProfile)); } catch {}
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("amuley_company_profile", JSON.stringify(companyProfile));
    setProfileSaveMsg({ type: "success", text: "Datos de la empresa guardados correctamente." });
    setTimeout(() => setProfileSaveMsg(null), 3000);
  };

  React.useEffect(() => {
    const sessionStr = localStorage.getItem("user_session");
    let currentEmail: string | null = null;
    let myTenant = config.name;
    if (sessionStr) {
      const sess = JSON.parse(sessionStr);
      currentEmail = sess.email;
      setSessionEmail(currentEmail);
      
      const savedUsersStr = localStorage.getItem("amuley_users");
      if (savedUsersStr) {
        const allUsers = JSON.parse(savedUsersStr);
        const me = allUsers.find((u: any) => u.email === currentEmail);
        if (me && me.tenantName) {
          myTenant = me.tenantName;
          setTenantProfileName(me.tenantName);
        } else {
          setTenantProfileName(config.name);
        }
      }
    }

    const savedMems = localStorage.getItem("amuley_memorials");
    if (savedMems) {
      const allMems = JSON.parse(savedMems);
      if (currentEmail && currentEmail !== "cjxd123@gmail.com") {
        setCreatedMemorials(allMems.filter((m: any) => m.createdBy === currentEmail));
      } else {
        setCreatedMemorials(allMems);
      }
    }
    
    // Función para recargar usuarios desde localStorage
    const reloadUsers = () => {
      const savedUsersStr = localStorage.getItem("amuley_users");
      if (savedUsersStr) {
        const allUsers = JSON.parse(savedUsersStr);
        setTenantUsers(allUsers.filter((u: any) => u.tenantName === myTenant || u.branchName === "Global"));
      }
    };

    const loadBranches = () => {
      const savedBranches = localStorage.getItem("amuley_branches");
      if (savedBranches) {
        const allBranches = JSON.parse(savedBranches);
        setBranches(allBranches.filter((b: any) => b.tenantName === myTenant));
      }
    };

    const loadInvoices = () => {
      const savedInvoices = localStorage.getItem("amuley_invoices");
      if (savedInvoices) {
        const allInvoices = JSON.parse(savedInvoices);
        setInvoices(allInvoices.filter((i: any) => i.tenantName === myTenant));
      }
    };

    reloadUsers();
    loadBranches();
    loadInvoices();

    let timerId: NodeJS.Timeout;
    const loadTenantInfo = () => {
      const savedTenants = localStorage.getItem("amuley_tenants");
      let startDate = new Date();
      if (savedTenants) {
        const allTenants = JSON.parse(savedTenants);
        const myTenantData = allTenants.find((t: any) => t.name === myTenant);
        if (myTenantData && myTenantData.date) {
          startDate = new Date(myTenantData.date);
        }
      }
      
      const expirationDate = startDate.getTime() + 90 * 24 * 60 * 60 * 1000;
      
      const updateTimer = () => {
        const now = new Date().getTime();
        const diff = expirationDate - now;
        
        if (diff <= 0) {
          setDaysLeft(0);
          setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        } else {
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setDaysLeft(d);
          setTimeLeft({ d, h, m, s });
        }
      };
      
      updateTimer();
      timerId = setInterval(updateTimer, 1000);
    };
    loadTenantInfo();
    // Sincronizar estado en "Tiempo Real" si otra pestaña actualiza localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "amuley_users") reloadUsers();
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage-update", reloadUsers);

    // Verificar sesión activa de Supabase para cambiar estado a ACTIVO
    const checkAuthAndUpdateStatus = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const savedUsersStr = localStorage.getItem("amuley_users");
        if (savedUsersStr) {
          let allUsers = JSON.parse(savedUsersStr);
          let changed = false;
          allUsers = allUsers.map((u: any) => {
            if (u.email === session.user.email && u.status !== "ACTIVO") {
              changed = true;
              return { ...u, status: "ACTIVO" };
            }
            return u;
          });
          if (changed) {
            localStorage.setItem("amuley_users", JSON.stringify(allUsers));
            window.dispatchEvent(new Event("local-storage-update"));
          }
        }
      }
    };
    
    checkAuthAndUpdateStatus();

    // Cleanup listeners
    return () => {
      clearInterval(timerId);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage-update", reloadUsers);
    };
  }, [config.name]);

  const [dnsStatus, setDnsStatus] = useState<"pending" | "checking" | "verified">("verified");

  // Formulario creación
  const [newName, setNewName] = useState("");
  const [newBirth, setNewBirth] = useState("");
  const [newDeath, setNewDeath] = useState("");
  const [newFamilyEmail, setNewFamilyEmail] = useState("");
  const [newType, setNewType] = useState<"persona" | "mascota">("persona");
  const [newSpecies, setNewSpecies] = useState("");
  const [newBreed, setNewBreed] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Plantilla de Email (Magic Link)
  const [emailSubject, setEmailSubject] = useState("Acceso a tu Memorial Digital - Amuley Legacy");
  const [emailGreeting, setEmailGreeting] = useState("Estimada familia Valenzuela,");
  const [customAlert, setCustomAlert] = useState<{show: boolean, msg: string, isError: boolean}>({show: false, msg: "", isError: false});
  const [emailBody, setEmailBody] = useState("Le enviamos este enlace mágico privado para que puedan administrar, personalizar y compartir el memorial digital de su ser querido. A través de este portal, podrán subir fotografías, mensajes de voz, biografías y configurar su árbol familiar perpetuo.");
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);

  // Período de Reportes y Datos en Tiempo Real
  const [reportPeriod, setReportPeriod] = useState<"7d" | "30d" | "12m">("7d");
  const [liveTraffic, setLiveTraffic] = useState(0);

  React.useEffect(() => {
    // Simular tráfico orgánico en tiempo real para el Dashboard (solo afecta a la vista de 7 días)
    const interval = setInterval(() => {
      setLiveTraffic(prev => prev + (Math.random() > 0.4 ? 1 : 0));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const getChartData = () => {
    if (reportPeriod === "7d") {
      return {
        points: "50,150 150,130 250,140 350,90 450,70 550,40 650,45",
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        visits: [12, 18, 15, 34, 42, 50, 48]
      };
    }
    if (reportPeriod === "30d") {
      return {
        points: "50,140 150,120 250,130 350,80 450,90 550,50 650,40",
        labels: ["D1", "D5", "D10", "D15", "D20", "D25", "D30"],
        visits: [75, 95, 80, 142, 120, 165, 140]
      };
    }
    return {
      points: "50,150 150,135 250,110 350,90 450,60 550,45 650,30",
      labels: ["Ene", "Mar", "May", "Jul", "Sep", "Nov", "Dic"],
      visits: [340, 410, 580, 620, 840, 1120, 1300]
    };
  };

  const chart = getChartData();
  const totalVisits = chart.visits.reduce((acc, curr) => acc + curr, 0) + (reportPeriod === "7d" ? liveTraffic : 0);

  // Guardar cambio de marca
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const handleSaveBrandSettings = () => {
    setShowSaveMessage(true);
    confetti({
      particleCount: 20,
      spread: 20,
      colors: [config.primaryColor, "#FFFFFF"]
    });
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 3000);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) return;

    setIsCreatingUser(true);
    setUserCreateMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: newUserEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        setUserCreateMsg({ type: "error", text: error.message });
      } else {
        const newUser = {
          id: `u-${Date.now()}`,
          name: "Invitado",
          email: newUserEmail,
          role: "FAMILIA",
          tenantName: config.name,
          branchName: newUserBranch || "Global",
          memorialId: newUserMemorial || null,
          createdAt: new Date().toISOString().substring(0, 10),
          status: "Pendiente Confirmación"
        };

        const savedUsers = localStorage.getItem("amuley_users");
        const allUsers = savedUsers ? JSON.parse(savedUsers) : [];
        const updated = [...allUsers, newUser];
        localStorage.setItem("amuley_users", JSON.stringify(updated));
        
        setTenantUsers(updated.filter((u: any) => u.tenantName === config.name || u.branchName === "Global"));

        setUserCreateMsg({ type: "success", text: `Invitación enviada a ${newUserEmail}.` });
        setNewUserEmail("");
        setNewUserBranch("");
        setNewUserMemorial("");
        
        setTimeout(() => {
          setUserCreateMsg(null);
          setShowInviteModal(false);
        }, 2000);
      }
    } catch (err: any) {
      setUserCreateMsg({ type: "error", text: err.message || "Error inesperado" });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleGeneratePDF = (inv: any, action: "view" | "download") => {
    try {
      import("jspdf").then(({ default: jsPDF }) => {
        const doc = new jsPDF();
        
        // Helper to convert hex to rgb
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "#111111");
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 17, g: 17, b: 17 };
        };
        
        const primaryRgb = hexToRgb(config.primaryColor || "#967B62");
        
        // ====== MODERN INVOICE DESIGN ======
        const W = 210;
        
        // TOP ACCENT BAR (full width, 6px tall)
        doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.rect(0, 0, W, 6, 'F');

        // HEADER: Left = company info, Right = invoice badge
        // Company name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.text(tenantProfileName.toUpperCase(), 20, 22);

        // Company details
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(120, 120, 120);
        const addr = companyProfile.address || "Dirección no configurada";
        const ph = companyProfile.phone || "Teléfono no configurado";
        const em = companyProfile.email || ("contacto@" + tenantProfileName.toLowerCase().replace(/\s+/g, '') + ".com");
        const ct = companyProfile.city || "";
        doc.text(`${addr}${ct ? ", " + ct : ""}`, 20, 28);
        doc.text(`Tel: ${ph}  |  ${em}`, 20, 34);
        if (companyProfile.website) doc.text(`Web: ${companyProfile.website}`, 20, 40);

        // Right: FACTURA ELECTRÓNICA badge box
        const bx = 130, by = 12, bw = 65, bh = 30;
        // Shadow-like rectangle
        doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.roundedRect(bx, by, bw, bh, 3, 3, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("FACTURA ELECTRÓNICA", bx + bw/2, by + 9, { align: "center" });
        if (companyProfile.rut) {
          doc.setFontSize(8);
          doc.text(`R.U.T.: ${companyProfile.rut}`, bx + bw/2, by + 16, { align: "center" });
        }
        doc.setFontSize(11);
        doc.text(`N° ${inv.id.substring(0, 8).toUpperCase()}`, bx + bw/2, by + 25, { align: "center" });

        // DIVIDER LINE
        const divY = 48;
        doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.setLineWidth(0.5);
        doc.line(20, divY, W - 20, divY);

        // CLIENT INFO SECTION (two column grid)
        const ciY = 58;
        doc.setTextColor(120, 120, 120);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.text("CLIENTE", 20, ciY);
        doc.text("DETALLES", 110, ciY);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        doc.text(inv.client, 20, ciY + 7);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(`Fecha emisión: ${inv.date}`, 110, ciY + 7);
        doc.text(`Estado: ${inv.status}`, 110, ciY + 13);
        doc.text("Condición: Contado / Transferencia", 110, ciY + 19);

        // TABLE
        const tY = 90;
        // Header background
        doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.roundedRect(20, tY, W - 40, 11, 1, 1, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.text("CÓD.", 24, tY + 7.5);
        doc.text("DESCRIPCIÓN DEL SERVICIO", 45, tY + 7.5);
        doc.text("CANT.", 148, tY + 7.5, { align: "center" });
        doc.text("TOTAL", W - 22, tY + 7.5, { align: "right" });

        // Alternating row background
        doc.setFillColor(247, 247, 250);
        doc.rect(20, tY + 11, W - 40, 14, 'F');

        // Row content
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text("SRV-01", 24, tY + 20);

        const splitDesc = doc.splitTextToSize(inv.description, 95);
        doc.text(splitDesc, 45, tY + 20);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 30);
        doc.text("1", 148, tY + 20, { align: "center" });
        doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.text(inv.amount, W - 22, tY + 20, { align: "right" });

        // Bottom line of table
        const tableEndY = tY + 11 + 14 + (Math.max(splitDesc.length - 1, 0) * 5);
        doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.setLineWidth(0.4);
        doc.line(20, tableEndY, W - 20, tableEndY);

        // TOTALS SECTION
        const toY = tableEndY + 14;
        doc.setTextColor(120, 120, 120);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Subtotal:", W - 65, toY, { align: "right" });
        doc.text("IVA (19%):", W - 65, toY + 7, { align: "right" });
        doc.setTextColor(100, 100, 100);
        doc.text("Exento", W - 22, toY, { align: "right" });
        doc.text("Exento", W - 22, toY + 7, { align: "right" });

        // Total box
        doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.roundedRect(W - 80, toY + 12, 60, 14, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.text("TOTAL:", W - 72, toY + 21);
        doc.setFontSize(11);
        doc.text(inv.amount, W - 22, toY + 21, { align: "right" });

        // FOOTER STRIP
        doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        doc.rect(0, 285, W, 12, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.5);
        doc.text("Documento generado electrónicamente — Aeterna / Amuley Legacy", W / 2, 292, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.text(`Generado el ${new Date().toLocaleDateString()}`, W / 2, 296, { align: "center" });
        
        if (action === "download") {
          doc.save(`Factura_${inv.id.substring(0,8)}.pdf`);
        } else {
          window.open(doc.output("bloburl"), "_blank");
        }
      });
    } catch (error) {
      console.error("Error al generar PDF", error);
      setCustomAlert({ show: true, msg: "Error al generar el PDF.", isError: true });
    }
  };

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim() || !newBranchCity.trim()) return;

    setIsCreatingBranch(true);
    setBranchCreateMsg(null);

    const newBranch = {
      id: `b-${Date.now()}`,
      name: newBranchName,
      city: newBranchCity,
      address: newBranchAddress,
      tenantName: config.name,
      createdAt: new Date().toISOString().substring(0, 10),
      status: "Activa"
    };

    const savedBranches = localStorage.getItem("amuley_branches");
    const allBranches = savedBranches ? JSON.parse(savedBranches) : [];
    const updated = [...allBranches, newBranch];
    localStorage.setItem("amuley_branches", JSON.stringify(updated));
    setBranches(updated.filter(b => b.tenantName === config.name));

    setBranchCreateMsg({ type: "success", text: "Sucursal creada exitosamente." });
    setNewBranchName("");
    setNewBranchCity("");
    setNewBranchAddress("");
    setIsCreatingBranch(false);
    confetti({ particleCount: 20, spread: 25, colors: ["#14B8A6", "#FAF7F2"] });
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceClient.trim() || !newInvoiceAmount.trim()) return;

    setIsCreatingInvoice(true);
    setInvoiceCreateMsg(null);

    const newInvoice = {
      id: `inv-${Date.now()}`,
      client: newInvoiceClient,
      description: newInvoiceDescription || "Servicios Funerarios",
      amount: newInvoiceAmount,
      date: new Date().toISOString().substring(0, 10),
      status: "Emitida",
      tenantName: config.name
    };

    const savedInvoices = localStorage.getItem("amuley_invoices");
    const allInvoices = savedInvoices ? JSON.parse(savedInvoices) : [];
    const updated = [...allInvoices, newInvoice];
    localStorage.setItem("amuley_invoices", JSON.stringify(updated));
    setInvoices(updated.filter(i => i.tenantName === config.name));

    setInvoiceCreateMsg({ type: "success", text: "Factura generada exitosamente." });
    setNewInvoiceClient("");
    setNewInvoiceDescription("");
    setNewInvoiceAmount("");
    setIsCreatingInvoice(false);
    confetti({ particleCount: 20, spread: 25, colors: ["#14B8A6", "#FAF7F2"] });
  };

  const handleCreateMemorial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newFamilyEmail.trim()) return;

    setIsCreating(true);

    try {
      const supabase = createClient();
      
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: newFamilyEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (authError) {
        alert(`Error enviando invitación: ${authError.message}`);
        setIsCreating(false);
        return;
      }

      const slugified = newName.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
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
        tenantName: config.logoText || "Funeraria",
        createdBy: sessionEmail || "cjxd123@gmail.com"
      };

      const savedMems = localStorage.getItem("amuley_memorials");
      const allMems = savedMems ? JSON.parse(savedMems) : [];
      const updatedAllMems = [...allMems, newMemorial];
      localStorage.setItem("amuley_memorials", JSON.stringify(updatedAllMems));

      setCreatedMemorials(prev => [...prev, newMemorial]);

      // Guardar el usuario familiar en la tabla de usuarios local
      const newUser = {
        id: `u-${Date.now()}`,
        name: "Administrador Familiar",
        email: newFamilyEmail,
        role: "FAMILIA",
        tenantName: config.name,
        branchName: "Global",
        createdAt: new Date().toISOString().substring(0, 10),
        status: "Pendiente Magic Link"
      };
      const savedUsers = localStorage.getItem("amuley_users");
      const allUsers = savedUsers ? JSON.parse(savedUsers) : [];
      const updatedUsers = [...allUsers, newUser];
      localStorage.setItem("amuley_users", JSON.stringify(updatedUsers));
      setTenantUsers(updatedUsers.filter((u: any) => u.tenantName === config.name || u.branchName === "Global"));

      const invite = {
        id: newMemorial.id,
        slug: newMemorial.slug,
        name: newMemorial.name,
        birthDate: newMemorial.birthDate,
        deathDate: newMemorial.deathDate,
        mainImage: newMemorial.mainImage,
        invitedBy: config.name,
        invitedDate: new Date().toISOString(),
        relation: "Administrador Familiar",
        tenantName: config.name,
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

      confetti({
        particleCount: 25,
        spread: 30,
        colors: [config.primaryColor, "#FAF7F2"]
      });
      setCustomAlert({show: true, msg: `Memorial creado con éxito. Se envió un correo con un Magic Link de acceso administrativo a: ${newFamilyEmail}`, isError: false});
    } catch (err: any) {
      setCustomAlert({show: true, msg: `Error inesperado: ${err.message}`, isError: true});
      setIsCreating(false);
    }
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
          <span className="font-serif text-lg tracking-wider font-semibold flex items-center gap-2 group">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[var(--tenant-primary)] group-hover:scale-110 transition-transform duration-500 ease-in-out"
            >
              <path d="M12 2V22M6 8H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="truncate">{tenantProfileName.toUpperCase()}</span>
          </span>
          <button 
            className="md:hidden text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          {originalRole === "ADMIN" && (
            <div className="glass-panel p-4 rounded-xl space-y-1 mb-6">
              <div className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 font-bold px-3 py-2">
                Consola Central
              </div>
              <button 
                onClick={() => switchRole?.("ADMIN")} 
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center gap-2 text-neutral-600 dark:text-neutral-400 smooth-transition"
              >
                <Layers size={14} /> Panel de Control
              </button>
              <button 
                className="w-full text-left px-3 py-2 rounded-lg bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)] font-semibold flex items-center gap-2"
              >
                <Building size={14} /> Portal Funerarias
              </button>
              <button 
                onClick={() => switchRole?.("FAMILIA")} 
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center gap-2 text-neutral-600 dark:text-neutral-400 smooth-transition"
              >
                <Users size={14} /> Gestión Global de Perfiles
              </button>
            </div>
          )}

          <div className="glass-panel p-4 rounded-xl space-y-1">
            <div className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 font-bold px-3 py-2">
              Menú Operador
            </div>
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 smooth-transition ${
                activeTab === "overview" 
                  ? "bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]" 
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <Building size={14} /> Panel Principal
            </button>
            <button 
              onClick={() => setActiveTab("memoriales")}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 smooth-transition ${
                activeTab === "memoriales" 
                  ? "bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]" 
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <FileText size={14} /> Gestión de Memoriales
            </button>
            <button 
              onClick={() => setActiveTab("sucursales")}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 smooth-transition ${
                activeTab === "sucursales" 
                  ? "bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]" 
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <Layers size={14} /> Gestión de Sucursales
            </button>
            <button 
              onClick={() => setActiveTab("usuarios")}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 smooth-transition ${
                activeTab === "usuarios" 
                  ? "bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]" 
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <Users size={14} /> Gestión de Usuarios
            </button>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 smooth-transition hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
            >
              <UserPlus size={14} /> Invitar Usuarios
            </button>
            <button 
              onClick={() => setActiveTab("facturacion")}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 smooth-transition ${
                activeTab === "facturacion" 
                  ? "bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]" 
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <Receipt size={14} /> Facturación
            </button>
            <button 
              onClick={() => setActiveTab("configuracion")}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 smooth-transition ${
                activeTab === "configuracion" 
                  ? "bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)]" 
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <Settings size={14} /> Configuración
            </button>
            <Link 
              href="/memorial/alejandro-valenzuela"
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-between text-neutral-600 dark:text-neutral-400 mt-2"
            >
              <span className="flex items-center gap-2"><Laptop size={14} /> Ver Memorial Demo</span>
              <ExternalLink size={10} />
            </Link>

            <button 
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                localStorage.removeItem("user_session");
                router.push("/login");
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 text-red-600 dark:text-red-400 smooth-transition mt-8 border-t border-neutral-100 dark:border-neutral-800 pt-4"
            >
              <LogOut size={14} /> Salir del perfil
            </button>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="glass-panel p-4 md:p-6 rounded-xl space-y-4">
            <h4 className="font-serif text-sm font-semibold mb-2">Estadísticas SaaS</h4>
            <div className="space-y-3">
              <div>
                <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest block">Memoriales Activos</span>
                <span className="text-xl font-bold font-serif">{createdMemorials.length} / 80</span>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[var(--tenant-primary)] h-full" style={{ width: `${(createdMemorials.length/80)*100}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-800 pt-3">
                <div>
                  <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest block mb-1">Usuarios</span>
                  <span className="text-lg font-bold font-serif">{tenantUsers.length}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest block mb-1">Sucursales</span>
                  <span className="text-lg font-bold font-serif">{branches.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detalles de Suscripción SaaS y Contador */}
          <div className="glass-panel p-4 md:p-6 rounded-xl space-y-4">
            <h4 className="font-serif text-sm font-semibold mb-1">Suscripción B2B</h4>
            
            {/* Suscripción (Contador en vivo) */}
            {timeLeft !== null && (
              <div className={`p-4 rounded-xl border ${timeLeft.d <= 0 ? 'border-red-500/50 bg-red-50 dark:bg-red-950/20' : 'border-[var(--tenant-primary)]/20 bg-gradient-to-br from-[var(--tenant-primary)]/5 to-transparent'}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] md:text-xs uppercase tracking-widest block font-bold ${timeLeft.d <= 0 ? 'text-red-600 dark:text-red-400' : 'text-[var(--tenant-primary)]'}`}>
                    Expira en
                  </span>
                  <div className="flex gap-1">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--tenant-primary)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--tenant-primary)]"></span>
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white dark:bg-neutral-900 rounded-lg py-2 shadow-sm border border-neutral-100 dark:border-neutral-800">
                    <span className="block text-xl font-bold font-serif text-neutral-800 dark:text-neutral-100">{timeLeft.d}</span>
                    <span className="block text-[8px] uppercase tracking-wider text-neutral-400 font-bold mt-1">Días</span>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 rounded-lg py-2 shadow-sm border border-neutral-100 dark:border-neutral-800">
                    <span className="block text-xl font-bold font-serif text-neutral-800 dark:text-neutral-100">{String(timeLeft.h).padStart(2, '0')}</span>
                    <span className="block text-[8px] uppercase tracking-wider text-neutral-400 font-bold mt-1">Hrs</span>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 rounded-lg py-2 shadow-sm border border-neutral-100 dark:border-neutral-800">
                    <span className="block text-xl font-bold font-serif text-neutral-800 dark:text-neutral-100">{String(timeLeft.m).padStart(2, '0')}</span>
                    <span className="block text-[8px] uppercase tracking-wider text-neutral-400 font-bold mt-1">Min</span>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 rounded-lg py-2 shadow-sm border border-neutral-100 dark:border-neutral-800">
                    <span className="block text-xl font-bold font-serif text-[var(--tenant-primary)]">{String(timeLeft.s).padStart(2, '0')}</span>
                    <span className="block text-[8px] uppercase tracking-wider text-neutral-400 font-bold mt-1">Seg</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2.5 text-xs md:text-sm mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Plan Actual:</span>
                <span className="font-bold text-[var(--tenant-primary)]">Growth B2B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Estado:</span>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${daysLeft !== null && daysLeft <= 0 ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'}`}>
                  {daysLeft !== null && daysLeft <= 0 ? 'Expirado' : 'Activo'}
                </span>
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
            <span className="px-2.5 py-1 rounded-md bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)] text-xs md:text-sm uppercase tracking-widest font-bold flex items-center gap-1.5">
              Portal B2B
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-medium text-neutral-600 dark:text-neutral-300">
              {config.logoText}
            </span>
            {originalRole === "ADMIN" && (
              <button 
                onClick={() => switchRole?.("ADMIN")}
                className="text-xs md:text-sm text-neutral-400 hover:text-[var(--tenant-primary)] dark:hover:text-white transition-colors flex items-center gap-1"
              >
                <Undo size={12} /> Volver a Admin
              </button>
            )}
          </div>
        </header>

        {/* Contenido Principal */}
        {daysLeft !== null && daysLeft <= 0 ? (
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[var(--background)] flex flex-col items-center justify-center text-center">
            <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-red-200 dark:border-red-900/50 flex flex-col items-center shadow-xl">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert size={32} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-neutral-800 dark:text-neutral-100 mb-4">Suscripción Expirada</h2>
              <p className="text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
                Tu ciclo de 3 meses ha finalizado. Vuelve a pagar el servicio para reactivar tu perfil y acceder a la administración.
                <br/><br/>
                <strong>No te preocupes:</strong> Ningún dato de tus usuarios, sucursales o memoriales ha sido borrado. Todo está a salvo y volverá a estar disponible una vez renueves la suscripción.
              </p>
              <button className="px-6 py-3 bg-[var(--tenant-primary)] text-white rounded-xl font-bold smooth-transition shadow-lg w-full hover:opacity-90 active:scale-95">
                Renovar Suscripción (Demo)
              </button>
            </div>
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            
          {activeTab === "overview" && (
            <div className="space-y-8">

              {/* Reportes y Analíticas de Visitas (SVG charts) */}
              <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="font-serif text-xl font-bold mb-1 flex items-center gap-2">
                      <TrendingUp size={18} className="text-[var(--tenant-primary)]" />
                      Reportes y Analíticas Generales
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed text-sm">
                      Monitorea ingresos, registro de usuarios y el estado de las peticiones en tiempo real.
                    </p>
                  </div>

                  {/* Selector de periodo */}
                  <div className="flex gap-2">
                    {[
                      { id: "7d", label: "7 Días" },
                      { id: "30d", label: "30 Días" },
                      { id: "12m", label: "12 Meses" }
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setReportPeriod(p.id as "7d" | "30d" | "12m")}
                        className={`px-3 py-1 rounded-lg border text-xs md:text-sm uppercase tracking-widest font-bold transition-all ${
                          reportPeriod === p.id 
                            ? "bg-[var(--tenant-primary)] border-[var(--tenant-primary)] text-[var(--tenant-primary-fg)]" 
                            : "border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid de métricas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-850 bg-white/40 dark:bg-black/20 relative overflow-hidden">
                    {reportPeriod === "7d" && (
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[var(--tenant-primary)] to-transparent opacity-50"></div>
                    )}
                    <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-2 mb-1">
                      Ingresos
                      {reportPeriod === "7d" && (
                        <span className="flex h-2 w-2 relative" title="Conectado en tiempo real">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                    </span>
                    <span className="text-lg font-serif font-bold text-neutral-800 dark:text-neutral-100 transition-all duration-300">
                      {(totalVisits * 15).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[8px] text-green-500 font-bold block mt-0.5">↑ +14.2%</span>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-850 bg-white/40 dark:bg-black/20">
                    <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold block mb-1">Usuarios</span>
                    <span className="text-lg font-serif font-bold text-neutral-800 dark:text-neutral-100 transition-all duration-300">
                      {tenantUsers.length}
                    </span>
                    <span className="text-[8px] text-neutral-400 block mt-0.5">Registrados en total</span>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-855 bg-white/40 dark:bg-black/20">
                    <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold block mb-1">Peticiones Pendientes</span>
                    <span className="text-lg font-serif font-bold text-neutral-800 dark:text-neutral-100">
                      {tenantUsers.filter((u: any) => u.status === "Pendiente Confirmación").length}
                    </span>
                    <span className="text-[8px] text-orange-500 font-bold block mt-0.5">Esperando aprobación</span>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-855 bg-white/40 dark:bg-black/20">
                    <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold block mb-1">Peticiones Aceptadas</span>
                    <span className="text-lg font-serif font-bold text-neutral-800 dark:text-neutral-100">
                      {tenantUsers.filter((u: any) => u.status === "ACTIVO").length}
                    </span>
                    <span className="text-[8px] text-green-500 font-bold block mt-0.5">Usuarios activos</span>
                  </div>
                </div>

                {/* SVG area chart representation */}
                <div className="p-5 rounded-xl border border-neutral-200/60 dark:border-neutral-800/80 bg-white dark:bg-neutral-950/20">
                  <svg viewBox="0 0 700 200" className="w-full h-auto drop-shadow-sm overflow-visible">
                    {/* Horizontal grid lines */}
                    <line x1="50" y1="30" x2="650" y2="30" stroke="rgba(150,150,150,0.15)" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="50" y1="90" x2="650" y2="90" stroke="rgba(150,150,150,0.15)" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="50" y1="150" x2="650" y2="150" stroke="rgba(150,150,150,0.25)" strokeWidth="1" />
                    
                    {/* Area fill under curve */}
                    <polygon 
                      points={`50,150 ${chart.points} 650,150`} 
                      fill="rgba(var(--tenant-primary-rgb), 0.08)"
                    />

                    {/* Line chart */}
                    <polyline 
                      fill="none" 
                      stroke="var(--tenant-primary)" 
                      strokeWidth="2.5" 
                      points={chart.points}
                      className="transition-all duration-500 ease-in-out"
                    />

                    {/* Data points (circles) */}
                    {chart.points.split(" ").map((pt, i) => {
                      const [x, y] = pt.split(",");
                      return (
                        <circle 
                          key={i}
                          cx={x} 
                          cy={y} 
                          r="4" 
                          fill="var(--tenant-primary)" 
                          stroke="#FFFFFF" 
                          strokeWidth="1.5" 
                          className="cursor-pointer hover:r-6 transition-all"
                        />
                      );
                    })}

                    {/* X labels */}
                    {chart.labels.map((lbl, i) => {
                      const step = 600 / (chart.labels.length - 1);
                      const x = 50 + i * step;
                      return (
                        <text 
                          key={i} 
                          x={x} 
                          y="175" 
                          textAnchor="middle" 
                          fontSize="9" 
                          fill="#999999" 
                          fontFamily="monospace"
                        >
                          {lbl}
                        </text>
                      );
                    })}
                  </svg>
                </div>
              </section>

              {/* Últimos Memoriales (Registros) */}
              <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold mb-1 flex items-center gap-2">
                      <FileText size={18} className="text-[var(--tenant-primary)]" />
                      Últimos Registros (Memoriales)
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed text-sm">
                      Revisa los memoriales generados recientemente bajo tu perfil de funeraria.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("memoriales")}
                    className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs md:text-sm uppercase tracking-widest font-bold text-neutral-600 dark:text-neutral-300 transition-colors"
                  >
                    Ver Todos
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs md:text-sm uppercase tracking-widest text-neutral-400">
                        <th className="pb-3 font-semibold">Nombre</th>
                        <th className="pb-3 font-semibold">F. Nacimiento</th>
                        <th className="pb-3 font-semibold">F. Fallecimiento</th>
                        <th className="pb-3 font-semibold text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm md:text-base">
                      {createdMemorials.slice(-5).reverse().map((mem) => (
                        <tr key={mem.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                          <td className="py-3 font-medium text-neutral-800 dark:text-neutral-200">{mem.name}</td>
                          <td className="py-3 text-neutral-500">{mem.birthDate}</td>
                          <td className="py-3 text-neutral-500">{mem.deathDate}</td>
                          <td className="py-3 text-right">
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase tracking-widest">
                              Activo
                            </span>
                          </td>
                        </tr>
                      ))}
                      {createdMemorials.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-neutral-500 font-light italic">
                            Aún no hay memoriales registrados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Gestión de Sucursales (B2B Multi-Branch) */}
              <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold mb-1 flex items-center gap-2">
                      <Building size={18} className="text-[var(--tenant-primary)]" />
                      Gestión de Sucursales (Multi-Branch)
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed text-sm">
                      Administra las diferentes ubicaciones físicas de tu funeraria. Cada sucursal puede generar memoriales de forma independiente vinculados a la cuenta principal.
                    </p>
                  </div>
                </div>

                {/* Listado y Agregar Sucursales */}
                <div className="grid md:grid-cols-3 gap-4 md:p-6">
                  {/* Sucursales Activas */}
                  <div className="md:col-span-2 space-y-3">
                    <span className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 font-bold block mb-1">Sucursales Activas</span>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {branches.map(branch => (
                        <div key={branch.id} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 space-y-2">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                            <span className="font-serif font-bold text-neutral-800 dark:text-neutral-100 text-sm md:text-base">{branch.name}</span>
                            <span className="px-2 py-0.5 rounded bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)] text-[8px] font-mono font-bold uppercase">{branch.city}</span>
                          </div>
                          <p className="text-xs md:text-sm text-neutral-400 font-light">{branch.address}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formulario Agregar Sucursal */}
                  <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-neutral-900/30">
                    <span className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 font-bold block mb-3">Agregar Nueva Sucursal</span>
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newBranchName.trim()) return;
                        const newB = {
                          id: `b_${Date.now()}`,
                          name: newBranchName,
                          city: newBranchCity || "General",
                          address: newBranchAddress || "Dirección no especificada"
                        };
                        setBranches(prev => [...prev, newB]);
                        setNewBranchName("");
                        setNewBranchCity("");
                        setNewBranchAddress("");
                        confetti({
                          particleCount: 15,
                          spread: 30,
                          colors: [config.primaryColor, "#FAF7F2"]
                        });
                      }}
                      className="space-y-3.5"
                    >
                      <div>
                        <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Nombre de Sucursal</label>
                        <input 
                          type="text" 
                          placeholder="Ej. Sucursal Oriente"
                          value={newBranchName}
                          onChange={(e) => setNewBranchName(e.target.value)}
                          required
                          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-sm md:text-base"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Ciudad</label>
                          <input 
                            type="text" 
                            placeholder="Ej. Concepción"
                            value={newBranchCity}
                            onChange={(e) => setNewBranchCity(e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-sm md:text-base"
                          />
                        </div>
                        <div>
                          <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Dirección</label>
                          <input 
                            type="text" 
                            placeholder="Ej. O'Higgins 34"
                            value={newBranchAddress}
                            onChange={(e) => setNewBranchAddress(e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-sm md:text-base"
                          />
                        </div>
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-2 rounded-lg bg-tenant-btn-main text-white hover:opacity-90 font-bold text-xs md:text-sm uppercase tracking-widest transition-colors shadow-xs"
                      >
                        Registrar Sucursal
                      </button>
                    </form>
                  </div>
                </div>
              </section>
              
              {/* Facturación y Límites (B2B) */}
              <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left mt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="font-serif text-xl font-bold mb-1 flex items-center gap-2">
                      <ShieldAlert size={18} className="text-[var(--tenant-primary)]" />
                      Facturación y Límites de Consumo
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed text-sm">
                      Revisa tu plan actual, límites de creación de memoriales y opciones para actualizar tu suscripción B2B.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase tracking-widest border border-green-200 dark:border-green-800/50">
                    Plan Profesional
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-xs md:text-sm font-bold text-neutral-800 dark:text-neutral-200">Memoriales Creados (Este mes)</span>
                        <span className="text-xs font-mono text-neutral-500">45 / 50</span>
                      </div>
                      <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--tenant-primary)] w-[90%] rounded-full"></div>
                      </div>
                      <span className="text-[10px] text-red-500 font-semibold">Te acercas al límite de tu plan.</span>
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between items-end">
                        <span className="text-xs md:text-sm font-bold text-neutral-800 dark:text-neutral-200">Almacenamiento (White Label)</span>
                        <span className="text-xs font-mono text-neutral-500">12 GB / 50 GB</span>
                      </div>
                      <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--tenant-primary)] w-[24%] rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl border border-[var(--tenant-primary)]/30 bg-[var(--tenant-primary)]/5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs md:text-sm uppercase tracking-widest text-[var(--tenant-primary)] font-bold block mb-2">Mejora tu suscripción</span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light mb-4">
                        Al pasar al plan <strong>Empresarial Ilimitado</strong> podrás crear memoriales sin restricciones, obtener placas físicas con descuento y multi-sucursales ilimitadas.
                      </p>
                    </div>
                    <button className="w-full py-2.5 rounded-lg bg-[var(--tenant-primary)] text-white hover:opacity-90 font-bold text-xs md:text-sm uppercase tracking-widest transition-colors">
                      Contactar a Ventas
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "memoriales" && (
            <div className="space-y-8">
              {/* Formulario Creación de Memorial (SaaS Exequial) */}
              <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
                <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
                  <Plus size={18} className="text-[var(--tenant-primary)]" />
                  Crear Nuevo Memorial
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
                  Registra un servicio y genera de inmediato el memorial digital. El sistema enviará una invitación por correo a la familia para que tomen control administrativo colaborativo.
                </p>

                <form onSubmit={handleCreateMemorial} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
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
                      className="w-full py-3.5 rounded-full bg-tenant-btn-main text-white hover:opacity-90 font-bold uppercase tracking-widest transition-colors shadow-sm"
                    >
                      {isCreating ? "Creando y Enviando Invitaciones..." : "Registrar Memorial y Enviar Accesos"}
                    </button>
                  </div>
                </form>

                {/* Plantilla de Email (Magic Link) Editor */}
                <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4 text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <div>
                      <h3 className="font-serif text-sm md:text-base font-bold text-neutral-800 dark:text-neutral-200">Personalizar Invitación por Email (Magic Link)</h3>
                      <p className="text-xs md:text-sm text-neutral-400 font-light">Modifica la plantilla de correo predeterminada que reciben las familias al registrar el servicio.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setIsEditingTemplate(!isEditingTemplate)}
                      className="px-3.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 font-bold uppercase tracking-widest text-[8px] transition-colors"
                    >
                      {isEditingTemplate ? "Cerrar Editor" : "Editar Plantilla"}
                    </button>
                  </div>

                  {isEditingTemplate ? (
                    <div className="grid md:grid-cols-2 gap-4 md:p-6 items-start">
                      {/* Inputs */}
                      <div className="space-y-3.5">
                        <div>
                          <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Asunto del Correo</label>
                          <input 
                            type="text" 
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-sm md:text-base"
                          />
                        </div>
                        <div>
                          <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Saludo Inicial</label>
                          <input 
                            type="text" 
                            value={emailGreeting}
                            onChange={(e) => setEmailGreeting(e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 outline-none text-sm md:text-base"
                          />
                        </div>
                        <div>
                          <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Cuerpo de la Carta</label>
                          <textarea 
                            rows={5} 
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-2 outline-none text-sm resize-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEmailSubject("Acceso a tu Memorial Digital - Amuley Legacy");
                            setEmailGreeting("Estimada familia Valenzuela,");
                            setEmailBody("Le enviamos este enlace mágico privado para que puedan administrar, personalizar y compartir el memorial digital de su ser querido. A través de este portal, podrán subir fotografías, mensajes de voz, biografías y configurar su árbol familiar perpetuo.");
                            confetti({
                              particleCount: 15,
                              spread: 25,
                              colors: [config.primaryColor]
                            });
                          }}
                          className="text-xs md:text-sm font-bold text-red-500 hover:underline uppercase tracking-wider block"
                        >
                          Reestablecer plantilla por defecto
                        </button>
                      </div>

                      {/* Mail Inbox Live Preview */}
                      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 space-y-3.5 shadow-sm text-neutral-700 dark:text-neutral-300">
                        <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-bold block border-b border-neutral-100 dark:border-neutral-855 pb-2">Previsualización del Recibido</span>
                        
                        <div className="text-xs md:text-sm space-y-1">
                          <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-900 pb-1.5">
                            <span className="text-neutral-400">De:</span>
                            <span className="font-semibold">{config.name} Support &lt;soporte@{config.domain}&gt;</span>
                          </div>
                          <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-900 pb-1.5">
                            <span className="text-neutral-400">Para:</span>
                            <span className="font-semibold font-mono">{newFamilyEmail || "familiar@correo.com"}</span>
                          </div>
                          <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-900 pb-1.5">
                            <span className="text-neutral-400">Asunto:</span>
                            <span className="font-semibold text-[var(--tenant-primary)]">{emailSubject}</span>
                          </div>
                        </div>

                        <div className="pt-2 text-xs md:text-sm space-y-3 font-serif leading-relaxed text-neutral-600 dark:text-neutral-400">
                          <p className="font-bold">{emailGreeting}</p>
                          <p>{emailBody}</p>
                          <div className="py-2.5 text-center">
                            <span className="inline-block px-5 py-2 rounded-full text-xs md:text-sm uppercase tracking-widest font-bold font-sans text-[var(--tenant-primary-fg)] bg-[var(--tenant-primary)] shadow-sm">
                              Configurar Memorial Familiar
                            </span>
                          </div>
                          <p className="text-xs md:text-sm font-sans text-neutral-400 text-center">Este Magic Link expira en 7 días y es de un solo uso.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-lg border border-neutral-200/60 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 text-xs md:text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 text-neutral-400">
                      <span>Asunto activo: <strong className="text-neutral-600 dark:text-neutral-200">{emailSubject}</strong></span>
                      <span className="italic">Vista previa oculta. Haz clic en &ldquo;Editar Plantilla&rdquo; para desplegar.</span>
                    </div>
                  )}
                </div>
              </section>
              
              {/* Listado / Directorio de Memoriales */}
              <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
                <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
                  <FileText size={18} className="text-[var(--tenant-primary)]" />
                  Directorio de Memoriales Digitales
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
                  Administra los perfiles conmemorativos creados. Descarga códigos QR para imprimir e integrar en lápidas, recordatorios y urnas.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold">
                        <th className="pb-3 font-semibold">Fallecido</th>
                        <th className="pb-3 font-semibold">Período</th>
                        <th className="pb-3 font-semibold">Estado</th>
                        <th className="pb-3 font-semibold">Visitas</th>
                        <th className="pb-3 font-semibold">Código QR</th>
                        <th className="pb-3 font-semibold text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/80">
                      {createdMemorials.map((m) => (
                        <tr key={m.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                          <td className="py-3.5 font-bold text-neutral-800 dark:text-neutral-100">{m.name}</td>
                          <td className="py-3.5 font-mono text-neutral-500">{m.birthDate?.substring(0,4)} - {m.deathDate?.substring(0,4)}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                              m.status === "Activo" 
                                ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" 
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                            }`}>
                              {m.isPrivate ? "Privado" : "Activo"}
                            </span>
                          </td>
                          <td className="py-3.5 font-mono">1</td>
                          <td className="py-3.5 font-medium text-neutral-600 dark:text-neutral-400">Pendiente</td>
                          <td className="py-3.5 text-right">
                            <button 
                              onClick={() => {
                                localStorage.setItem("active_memorial_id", m.id);
                                switchRole?.("FAMILIA");
                              }}
                              className="text-xs md:text-sm font-bold text-[var(--tenant-primary)] hover:underline flex items-center justify-end gap-1 ml-auto"
                            >
                              Administrar <ExternalLink size={10} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activeTab === "usuarios" && (
            <div className="space-y-8">
              <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
                <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
                  <UserPlus size={18} className="text-[var(--tenant-primary)]" />
                  Agregar Nuevo Usuario
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
                  Invita colaboradores enviando un enlace mágico a su correo electrónico.
                </p>

                <form onSubmit={handleCreateUser} className="grid md:grid-cols-2 gap-4">
                  {userCreateMsg && (
                    <div className={`md:col-span-2 p-4 rounded-xl text-sm font-medium ${
                      userCreateMsg.type === "success" 
                        ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900/50" 
                        : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50"
                    }`}>
                      {userCreateMsg.text}
                    </div>
                  )}

                  <div className="space-y-4 md:col-span-2">
                    <div>
                      <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Correo Electrónico a Invitar</label>
                      <input 
                        type="email"
                        placeholder="familiar@ejemplo.com"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        required
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 outline-none focus:border-[var(--tenant-primary)] transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Vincular Sucursal</label>
                        <select 
                          value={newUserBranch}
                          onChange={(e) => setNewUserBranch(e.target.value)}
                          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 outline-none focus:border-[var(--tenant-primary)] transition-colors"
                        >
                          <option value="">Ninguna / Global</option>
                          {branches.map(b => (
                            <option key={b.id} value={b.name}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Vincular Memorial</label>
                        <select 
                          value={newUserMemorial}
                          onChange={(e) => setNewUserMemorial(e.target.value)}
                          className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-3 outline-none focus:border-[var(--tenant-primary)] transition-colors"
                        >
                          <option value="">Ninguno</option>
                          {createdMemorials.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button 
                      type="submit"
                      disabled={isCreatingUser}
                      className="w-full md:w-auto py-3 px-8 rounded-xl bg-[var(--tenant-primary)] text-white hover:opacity-90 font-bold uppercase tracking-widest transition-colors shadow-lg"
                    >
                      {isCreatingUser ? "Enviando Invitación..." : "Enviar Invitación"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Lista de Usuarios */}
              <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
                <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
                  <Users size={18} className="text-[var(--tenant-primary)]" />
                  Directorio de Usuarios ({config.name})
                </h2>
                <div className="overflow-x-auto mt-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold">
                        <th className="pb-3 font-semibold">Nombre y Correo</th>
                        <th className="pb-3 font-semibold">Sucursal</th>
                        <th className="pb-3 font-semibold">Memorial</th>
                        <th className="pb-3 font-semibold">Registro</th>
                        <th className="pb-3 font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/80">
                      {tenantUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                          <td className="py-3.5">
                            <div className="font-bold text-neutral-800 dark:text-neutral-100">{u.name}</div>
                            <div className="text-xs text-neutral-500 font-mono">{u.email}</div>
                          </td>
                          <td className="py-3.5">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              {u.branchName || "Global"}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              {u.memorialId 
                                ? (createdMemorials.find(m => m.id === u.memorialId)?.name || "Vinculado")
                                : "Ninguno"
                              }
                            </span>
                          </td>
                          <td className="py-3.5 font-mono text-neutral-500">{u.createdAt}</td>
                          <td className="py-3.5">
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 text-[8px] font-bold uppercase tracking-wider">
                              Verificado
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* Pestaña Sucursales */}
          {activeTab === "sucursales" && (
            <div className="space-y-6 md:space-y-8">
              <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
                <h2 className="font-serif text-xl font-bold mb-2 flex items-center gap-2">
                  <Layers size={18} className="text-[var(--tenant-primary)]" />
                  Gestión de Sucursales
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
                  Crea y administra las sucursales de tu funeraria.
                </p>

                <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">Nueva Sucursal</h3>
                  <form onSubmit={handleCreateBranch} className="grid md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Nombre</label>
                      <input 
                        type="text" 
                        placeholder="Sucursal Norte"
                        value={newBranchName}
                        onChange={(e) => setNewBranchName(e.target.value)}
                        required
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 outline-none text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Ciudad</label>
                      <input 
                        type="text" 
                        placeholder="Santiago"
                        value={newBranchCity}
                        onChange={(e) => setNewBranchCity(e.target.value)}
                        required
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 outline-none text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Dirección</label>
                      <input 
                        type="text" 
                        placeholder="Av. Principal 123"
                        value={newBranchAddress}
                        onChange={(e) => setNewBranchAddress(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 outline-none text-sm md:text-base"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isCreatingBranch}
                      className="w-full py-2.5 px-6 rounded-lg bg-[var(--tenant-primary)] text-white hover:opacity-90 font-bold uppercase tracking-widest transition-colors shadow-sm text-sm"
                    >
                      {isCreatingBranch ? "Creando..." : "Crear"}
                    </button>
                  </form>
                  {branchCreateMsg && (
                    <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${branchCreateMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                      {branchCreateMsg.type === "success" ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
                      {branchCreateMsg.text}
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto mt-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold">
                        <th className="pb-3 font-semibold">Nombre de Sucursal</th>
                        <th className="pb-3 font-semibold">Ciudad</th>
                        <th className="pb-3 font-semibold">Dirección</th>
                        <th className="pb-3 font-semibold">Fecha de Creación</th>
                        <th className="pb-3 font-semibold text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/80">
                      {branches.map((b) => (
                        <tr key={b.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                          <td className="py-3.5 font-bold text-neutral-800 dark:text-neutral-100">{b.name}</td>
                          <td className="py-3.5 text-neutral-500">{b.city}</td>
                          <td className="py-3.5 text-neutral-500">{b.address}</td>
                          <td className="py-3.5 text-neutral-500 text-sm">{b.createdAt}</td>
                          <td className="py-3.5 text-right">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-800/10 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {branches.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-neutral-400 italic">
                            No tienes sucursales registradas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
              </div>
              </section>
            </div>
          )}

          {activeTab === "configuracion" && (
            <div className="space-y-6 md:space-y-8 animate-fade-in">
              <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-8">
                  <h2 className="font-serif text-2xl font-bold flex items-center gap-2 text-[var(--tenant-primary)]">
                    <Settings size={24} /> Configuración de la Empresa
                  </h2>
                  <p className="text-neutral-500 dark:text-neutral-400 mt-1 text-sm">
                    Estos datos aparecerán en las facturas y documentos generados por el sistema.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-neutral-400 font-bold block mb-2">R.U.T. de la Empresa</label>
                      <input
                        type="text"
                        placeholder="76.543.210-K"
                        value={companyProfile.rut}
                        onChange={e => setCompanyProfile(p => ({ ...p, rut: e.target.value }))}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-[var(--tenant-primary)] transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-neutral-400 font-bold block mb-2">Teléfono de Contacto</label>
                      <input
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        value={companyProfile.phone}
                        onChange={e => setCompanyProfile(p => ({ ...p, phone: e.target.value }))}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-[var(--tenant-primary)] transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-neutral-400 font-bold block mb-2">Correo Electrónico</label>
                      <input
                        type="email"
                        placeholder="contacto@mifuneraria.com"
                        value={companyProfile.email}
                        onChange={e => setCompanyProfile(p => ({ ...p, email: e.target.value }))}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-[var(--tenant-primary)] transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-neutral-400 font-bold block mb-2">Ciudad</label>
                      <input
                        type="text"
                        placeholder="Santiago"
                        value={companyProfile.city}
                        onChange={e => setCompanyProfile(p => ({ ...p, city: e.target.value }))}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-[var(--tenant-primary)] transition-colors text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-neutral-400 font-bold block mb-2">Dirección</label>
                      <input
                        type="text"
                        placeholder="Av. Las Rosas 1234"
                        value={companyProfile.address}
                        onChange={e => setCompanyProfile(p => ({ ...p, address: e.target.value }))}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-[var(--tenant-primary)] transition-colors text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-neutral-400 font-bold block mb-2">Sitio Web (opcional)</label>
                      <input
                        type="url"
                        placeholder="https://www.mifuneraria.com"
                        value={companyProfile.website}
                        onChange={e => setCompanyProfile(p => ({ ...p, website: e.target.value }))}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 outline-none focus:border-[var(--tenant-primary)] transition-colors text-sm"
                      />
                    </div>
                  </div>

                  {profileSaveMsg && (
                    <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${profileSaveMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400" : "bg-red-50 text-red-700 border border-red-200"}`}>
                      <CheckCircle size={16} />
                      {profileSaveMsg.text}
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-xl bg-[var(--tenant-primary)] text-white font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity shadow-lg"
                    >
                      Guardar Datos
                    </button>
                    <p className="text-xs text-neutral-400">Los cambios se aplican inmediatamente a las facturas generadas.</p>
                  </div>
                </form>
              </section>
            </div>
          )}

          {activeTab === "facturacion" && (
            <div className="space-y-6 md:space-y-8 animate-fade-in">
              <section className="glass-panel p-5 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-left">
                <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold flex items-center gap-2 text-[var(--tenant-primary)]">
                      <Receipt size={24} /> Facturación de la Funeraria
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-1">
                      Gestiona las facturas, recibos y pagos emitidos por tu funeraria.
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4">Emitir Nueva Factura</h3>
                  <form onSubmit={handleCreateInvoice} className="grid md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Cliente</label>
                      <input 
                        type="text" 
                        placeholder="Nombre o RUT del Cliente"
                        value={newInvoiceClient}
                        onChange={(e) => setNewInvoiceClient(e.target.value)}
                        required
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 outline-none text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Concepto</label>
                      <input 
                        type="text" 
                        placeholder="Servicios Funerarios"
                        value={newInvoiceDescription}
                        onChange={(e) => setNewInvoiceDescription(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 outline-none text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Monto Total</label>
                      <input 
                        type="text" 
                        placeholder="$450.000"
                        value={newInvoiceAmount}
                        onChange={(e) => setNewInvoiceAmount(e.target.value)}
                        required
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3.5 py-2.5 outline-none text-sm md:text-base"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isCreatingInvoice}
                      className="w-full py-2.5 px-6 rounded-lg bg-[var(--tenant-primary)] text-white hover:opacity-90 font-bold uppercase tracking-widest transition-colors shadow-sm text-sm"
                    >
                      {isCreatingInvoice ? "Generando..." : "Generar Factura"}
                    </button>
                  </form>
                  {invoiceCreateMsg && (
                    <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${invoiceCreateMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                      {invoiceCreateMsg.type === "success" ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
                      {invoiceCreateMsg.text}
                    </div>
                  )}
                </div>

                <div className="overflow-x-auto mt-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 text-xs md:text-sm text-neutral-400 uppercase tracking-widest font-bold">
                        <th className="pb-3 font-semibold">ID</th>
                        <th className="pb-3 font-semibold">Cliente</th>
                        <th className="pb-3 font-semibold">Concepto</th>
                        <th className="pb-3 font-semibold">Fecha</th>
                        <th className="pb-3 font-semibold">Monto</th>
                        <th className="pb-3 font-semibold text-center">Estado</th>
                        <th className="pb-3 font-semibold text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/80">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                          <td className="py-3.5 text-neutral-400 font-mono text-xs">{inv.id.substring(0, 8)}</td>
                          <td className="py-3.5 font-bold text-neutral-800 dark:text-neutral-100">{inv.client}</td>
                          <td className="py-3.5 text-neutral-500">{inv.description}</td>
                          <td className="py-3.5 text-neutral-500 text-sm">{inv.date}</td>
                          <td className="py-3.5 font-mono text-neutral-700 dark:text-neutral-300">{inv.amount}</td>
                          <td className="py-3.5 text-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleGeneratePDF(inv, "view")}
                                className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 transition-colors tooltip-trigger"
                                title="Ver Boleta/Factura"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => handleGeneratePDF(inv, "download")}
                                className="p-1.5 rounded-lg bg-[var(--tenant-primary)]/10 hover:bg-[var(--tenant-primary)]/20 text-[var(--tenant-primary)] transition-colors tooltip-trigger"
                                title="Descargar PDF"
                              >
                                <Download size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {invoices.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center">
                            <Receipt className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4" size={48} />
                            <h3 className="text-xl font-serif font-bold text-neutral-700 dark:text-neutral-300">No hay facturas recientes</h3>
                            <p className="text-neutral-400 mt-2">No se han generado facturas para tus clientes aún.</p>
                          </td>
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
        )}
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FCFBFA] dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-[#967B62]/30 dark:border-neutral-800 relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-serif text-2xl font-bold mb-2 flex items-center gap-2 text-[var(--tenant-primary)]">
              <UserPlus size={20} /> Invitar Nuevo Usuario
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 font-light mb-6">
              Crea una cuenta para un administrador o miembro de tu equipo.
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Correo Electrónico</label>
                <input 
                  type="email"
                  placeholder="familiar@ejemplo.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-3 outline-none focus:border-[var(--tenant-primary)] transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Vincular Sucursal</label>
                  <select 
                    value={newUserBranch}
                    onChange={(e) => setNewUserBranch(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-3 outline-none focus:border-[var(--tenant-primary)] transition-colors"
                  >
                    <option value="">Ninguna / Global</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 block mb-1">Vincular Memorial</label>
                  <select 
                    value={newUserMemorial}
                    onChange={(e) => setNewUserMemorial(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-3 outline-none focus:border-[var(--tenant-primary)] transition-colors"
                  >
                    <option value="">Ninguno</option>
                    {createdMemorials.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {userCreateMsg && (
                <div className={`p-3 rounded-lg text-sm mt-4 font-medium ${
                  userCreateMsg.type === "success" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {userCreateMsg.text}
                </div>
              )}

              <button 
                type="submit"
                disabled={isCreatingUser}
                className="w-full mt-6 py-3.5 rounded-xl bg-[var(--tenant-primary)] text-white hover:opacity-90 font-bold uppercase tracking-widest transition-colors shadow-lg"
              >
                {isCreatingUser ? "Enviando Invitación..." : "Enviar Invitación"}
              </button>
            </form>
          </div>
        </div>
      )}

      {customAlert.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#FCFBFA] p-8 rounded-2xl shadow-2xl max-w-md w-full border border-[#967B62]/30 text-center animate-in zoom-in-95 duration-300">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${customAlert.isError ? 'bg-red-500/10' : 'bg-[#14B8A6]/10'}`}>
              {customAlert.isError ? (
                <ShieldAlert size={32} className="text-red-500" />
              ) : (
                <CheckCircle size={32} className="text-[#14B8A6]" />
              )}
            </div>
            <h3 className="text-xl font-serif font-bold text-[#111111] mb-2">
              {customAlert.isError ? "Error" : "¡Operación Exitosa!"}
            </h3>
            <p className="text-[#55504C] mb-8">{customAlert.msg}</p>
            <button 
              onClick={() => setCustomAlert({show: false, msg: "", isError: false})}
              className="w-full py-3 bg-[#967B62] text-white rounded-xl font-bold tracking-widest uppercase hover:bg-[#7D654E] transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
