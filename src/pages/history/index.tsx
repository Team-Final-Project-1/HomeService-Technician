import React, { useState, useEffect } from "react";
import TechnicianLayout from "@/components/layout/TechnicianLayout";
import HistoryList from "./HistoryList";
import HistoryDetail from "./HistoryDetail";
import { HistoryDetailData, HistoryOrder } from "@/services/history/history.types";
import { getHistoryDetail } from "@/services/history/history.service";

const HistoryPage = () => {
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
  );
};

export default HistoryPage;
