import { historyAxios } from "./history.axios";
import { HistoryOrder, HistoryDetailData } from "./history.types";

export const getHistory = async (): Promise<HistoryOrder[]> => {
  const response = await historyAxios.get("technician/history");
  
  return response.data.map((item: { order_code: string; service_name: string; date_time: string; total_price: string }) => ({
    orderId: item.order_code,
    service: item.service_name,
    date: item.date_time,
    price: item.total_price
  }));
};

export const getHistoryDetail = async (orderId: string): Promise<HistoryDetailData> => {
  const numericId = orderId.replace("AD", "").replace(/^0+/, "");
  const response = await historyAxios.get(`technician/history/${numericId}`);
  const data = response.data;

  return {
    orderId: data.order_code,
    service: data.service_name,
    category: data.category_name,
    items: data.items.map((i: { name: string; quantity: number }) => `${i.name} ${i.quantity} รายการ`).join(", "),
    date: data.date_time,
    location: data.address,
    price: data.total_price,
    customerName: data.customer_name,
    phone: data.customer_phone,
    rating: data.rating,
    feedback: data.review_comment
  };
};
