import React, { useState, useEffect } from "react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import HistoryList from "@/components/history/HistoryList";
import HistoryDetail from "@/components/history/HistoryDetail";
import {
  HistoryDetailData,
  HistoryOrder,
} from "@/services/history/history.types";
import { getHistoryDetail } from "@/services/history/history.service";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const HistoryPage = () => {
  const { state, isAuthenticated } = useAuth();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<HistoryDetailData | null>(
    null,
  );
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    if (selectedOrderId) {
      const fetchDetail = async () => {
        try {
          setIsDetailLoading(true);
          const detail = await getHistoryDetail(selectedOrderId);
          setSelectedOrder(detail);
        } catch (error) {
          console.error("Failed to fetch order detail:", error);
        } finally {
          setIsDetailLoading(false);
        }
      };
      fetchDetail();
    } else {
      setSelectedOrder(null);
    }
  }, [selectedOrderId]);

  return (
    <ProtectedRoute
      isLoading={state.getUserLoading}
      isAuthenticated={isAuthenticated}
      userRole={state.user?.role ?? null}
      requiredRole="technician"
    >
      <TechnicianLayout>
        {selectedOrderId === null ? (
          <HistoryList onViewDetail={(id) => setSelectedOrderId(id)} />
        ) : (
          <>
            {isDetailLoading ? (
              <div className="flex items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-[#336DF2] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              selectedOrder && (
                <HistoryDetail
                  order={selectedOrder}
                  onBack={() => setSelectedOrderId(null)}
                />
              )
            )}
          </>
        )}
      </TechnicianLayout>
    </ProtectedRoute>
  );
};

export default HistoryPage;
