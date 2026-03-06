export interface HistoryOrder {
  orderId: string;
  service: string;
  date: string;
  price: string;
}

export interface HistoryDetailData {
  orderId: string;
  service: string;
  category: string;
  items: string;
  date: string;
  location: string;
  price: string;
  customerName: string;
  phone: string;
  rating: number;
  feedback: string;
}
