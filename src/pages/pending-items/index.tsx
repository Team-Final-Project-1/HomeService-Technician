import { useState } from "react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import PendingHeader from "@/features/technician/pending/components/PendingHeader";
import PendingTable from "@/features/technician/pending/components/PendingTable";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function TechnicianPendingPage() {
  const { state, isAuthenticated } = useAuth();

  // ================= STATE =================
  const [search, setSearch] = useState<string>("");

  // service type
  const [service, setService] = useState<string>("ทั้งหมด");

  // sort type
  const [sort, setSort] = useState<"nearest" | "latest">("nearest");

  return (
    <ProtectedRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
      userRole={state.user?.role ?? null}
      requiredRole="technician"
    >
      <TechnicianLayout>
        <PendingHeader
          search={search}
          setSearch={setSearch}
          service={service}
          setService={setService}
          sort={sort}
          setSort={setSort}
        />

        <PendingTable search={search} service={service} sort={sort} />
      </TechnicianLayout>
    </ProtectedRoute>
  );
}
