import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import { ArrowRight, Wrench } from "lucide-react";

const HomePage = () => {
  const { state, isAuthenticated } = useAuth();

  return (
    <ProtectedRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
      userRole={state.user?.role || null}
      requiredRole="technician"
    >
      <TechnicianLayout>
        <div className="font-prompt flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          {/* Icon */}
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <Wrench className="w-8 h-8 text-blue-600" />
          </div>

          {/* Text */}
          <h1 className="text-[24px] sm:text-[28px] font-bold text-gray-900 mb-2">
            ยินดีต้อนรับกลับมา 👋
          </h1>
          <p className="text-[16px] text-gray-800 mb-1">
            คุณ {state.user?.full_name ?? "ช่างผู้ให้บริการ"}
          </p>
          <p className="text-[16px] text-gray-800 mb-8">
            พร้อมรับงานซ่อมในพื้นที่ของคุณแล้วหรือยัง?
          </p>

          {/* CTA */}
          <Link
            href="/service-requests"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold px-6 py-3 rounded-xl transition-colors shadow-md shadow-blue-200"
          >
            เริ่มรับงานเลย
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </TechnicianLayout>
    </ProtectedRoute>
  );
};

export default HomePage;
