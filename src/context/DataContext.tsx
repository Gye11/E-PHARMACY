import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  initialCustomers,
  initialOrders,
  initialProducts,
  initialSuppliers,
  initialTransactions,
} from '../data/mockData';
import type {
  Customer,
  DashboardStats,
  Order,
  Product,
  Supplier,
  Transaction,
} from '../types';

interface DataContextValue {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  suppliers: Supplier[];
  transactions: Transaction[];
  stats: DashboardStats;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => string;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

const uid = () => crypto.randomUUID();

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState(initialProducts);
  const [orders] = useState(initialOrders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [transactions] = useState(initialTransactions);

  const stats = useMemo<DashboardStats>(
    () => ({
      products: 8430,
      suppliers: suppliers.length + 208,
      customers: customers.length + 135,
    }),
    [suppliers.length, customers.length],
  );

  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt'>) => {
    const id = uid();
    setProducts((prev) => [
      {
        ...product,
        id,
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    return id;
  }, []);

  const updateProduct = useCallback((id: string, data: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addSupplier = useCallback((supplier: Omit<Supplier, 'id'>) => {
    setSuppliers((prev) => [{ ...supplier, id: uid() }, ...prev]);
  }, []);

  const updateSupplier = useCallback((id: string, data: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  }, []);

  const updateCustomer = useCallback((id: string, data: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const value = useMemo(
    () => ({
      products,
      orders,
      customers,
      suppliers,
      transactions,
      stats,
      addProduct,
      updateProduct,
      deleteProduct,
      addSupplier,
      updateSupplier,
      updateCustomer,
    }),
    [
      products,
      orders,
      customers,
      suppliers,
      transactions,
      stats,
      addProduct,
      updateProduct,
      deleteProduct,
      addSupplier,
      updateSupplier,
      updateCustomer,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
