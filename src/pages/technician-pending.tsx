import { useState } from "react";
import TechnicianLayout from "@/components/TechnicianLayout";
import PendingHeader from "@/features/technician/pending/components/PendingHeader";
import PendingTable from "@/features/technician/pending/components/PendingTable";

export default function TechnicianPendingPage() {

  // ================= STATE =================
  const [search, setSearch] = useState<string>("");

  // ✅ service type ชัดเจน
  const [service, setService] = useState<string>("ทั้งหมด");

  // ✅ sort type ชัดเจน (สำคัญมาก)
  const [sort, setSort] =
    useState<"nearest" | "latest">("nearest");

  return (
    <TechnicianLayout>

      <PendingHeader
        search={search}
        setSearch={setSearch}
        service={service}
        setService={setService}
        sort={sort}
        setSort={setSort}
      />

      <PendingTable
        search={search}
        service={service}
        sort={sort}
      />

    </TechnicianLayout>
  );
}