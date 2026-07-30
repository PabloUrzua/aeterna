"use client";

import React, { useEffect, useState } from "react";
import SuperAdminDashboard from "../components/dashboards/SuperAdminDashboard";
import FunerariaDashboard from "../components/dashboards/FunerariaDashboard";
import FamiliaDashboard from "../components/dashboards/FamiliaDashboard";
import UserDashboard from "../components/dashboards/UserDashboard";
import { useRouter } from "next/navigation";

export default function MasterDashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [originalRole, setOriginalRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionStr = localStorage.getItem("user_session");
    if (!sessionStr) {
      router.push("/login");
      return;
    }
    try {
      const session = JSON.parse(sessionStr);
      let sessionRole = session.role || "USER";
      
      // Update from pseudo-DB in case SuperAdmin changed their role
      const savedUsersStr = localStorage.getItem("amuley_users");
      if (savedUsersStr) {
        const savedUsers = JSON.parse(savedUsersStr);
        const foundUser = savedUsers.find((u: any) => u.email.toLowerCase() === session.email.toLowerCase());
        if (foundUser && foundUser.role) {
          sessionRole = foundUser.role;
          // Update stale session
          session.role = sessionRole;
          localStorage.setItem("user_session", JSON.stringify(session));
        }
      }

      if (session.email?.toLowerCase() === "pccleanltda@gmail.com") {
        sessionRole = "FUNERARIA";
        session.role = sessionRole;
        localStorage.setItem("user_session", JSON.stringify(session));
      }

      setRole(sessionRole);
      setOriginalRole(sessionRole);
    } catch (e) {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#967B62]"></div>
      </div>
    );
  }

  switch (role) {
    case "ADMIN":
      return <SuperAdminDashboard switchRole={setRole} originalRole={originalRole} />;
    case "FUNERARIA":
      return <FunerariaDashboard switchRole={setRole} originalRole={originalRole} />;
    case "FAMILIA":
    default:
      return <FamiliaDashboard switchRole={setRole} originalRole={originalRole} />;
  }
}
