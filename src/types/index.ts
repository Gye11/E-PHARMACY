export type ProductCategory =
  | "Medicine"
  | "Head"
  | "Hand"
  | "Dental Care"
  | "Skin Care"
  | "Eye Care"
  | "Vitamins & Supplements"
  | "Orthopedic Products"
  | "Baby Care";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  stock: number;
  suppliers: string;
  price: number;
  image: string;
  description?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userName: string;
  userEmail: string;
  address: string;
  products: string;
  orderDate: string;
  price: number;
  status: "Pending" | "Delivered" | "Cancelled" | "Processing";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  registerDate: string;
  spent: number;
  medicines?: ClientMedicine[];
}

export interface ClientMedicine {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  company: string;
  deliveryDate: string;
  amount: number;
  status: "Active" | "Inactive" | "Pending";
}

export interface Transaction {
  id: string;
  title: string;
  email?: string;
  amount: number;
  type: "income" | "expense" | "error";
}

export interface DashboardStats {
  products: number;
  suppliers: number;
  customers: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  displayName?: string;
  phone?: string;
  role?: "customer" | "pharmacy";
}

export interface PharmacyStore {
  id: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  isOpen: boolean;
  rating: number;
  ownerEmail?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  userId: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  paymentMethod: "Cash On Delivery" | "Bank";
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  total: number;
  createdAt: string;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
}
