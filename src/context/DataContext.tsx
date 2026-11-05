import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  initialCustomers,
  initialOrders,
  initialProducts,
  initialSuppliers,
  initialTransactions,
} from "../data/mockData";
import type {
  Customer,
  DashboardStats,
  Order,
  Product,
  Supplier,
  Transaction,
} from "../types";
import { firestore } from "../api/firebase";
import { useAuth } from "./AuthContext";

interface DataContextValue {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  suppliers: Supplier[];
  transactions: Transaction[];
  stats: DashboardStats;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<string>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addSupplier: (supplier: Omit<Supplier, "id">) => Promise<void>;
  updateSupplier: (id: string, data: Partial<Supplier>) => Promise<void>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

const uid = () => crypto.randomUUID();

export function DataProvider({ children }: { children: ReactNode }) {
  const { userId, role } = useAuth();
  const [products, setProducts] = useState(initialProducts);
  const [orders] = useState(initialOrders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [transactions] = useState(initialTransactions);

  useEffect(() => {
    if (!firestore || !userId || role !== "pharmacy") return;
    let active = true;
    const loadRecords = async () => {
      try {
        const [productDocs, supplierDocs, customerDocs] = await Promise.all([
          getDocs(
            query(
              collection(firestore, "products"),
              where("ownerId", "==", userId),
            ),
          ),
          getDocs(
            query(
              collection(firestore, "suppliers"),
              where("ownerId", "==", userId),
            ),
          ),
          getDocs(
            query(
              collection(firestore, "customers"),
              where("ownerId", "==", userId),
            ),
          ),
        ]);
        if (!active) return;
        if (!productDocs.empty) {
          const remote = productDocs.docs.map(
            (item) => ({ id: item.id, ...item.data() }) as Product,
          );
          setProducts([
            ...remote,
            ...initialProducts.filter(
              (item) => !remote.some((record) => record.id === item.id),
            ),
          ]);
        }
        if (!supplierDocs.empty) {
          const remote = supplierDocs.docs.map(
            (item) => ({ id: item.id, ...item.data() }) as Supplier,
          );
          setSuppliers([
            ...remote,
            ...initialSuppliers.filter(
              (item) => !remote.some((record) => record.id === item.id),
            ),
          ]);
        }
        if (!customerDocs.empty) {
          const remote = customerDocs.docs.map(
            (item) => ({ id: item.id, ...item.data() }) as Customer,
          );
          setCustomers([
            ...remote,
            ...initialCustomers.filter(
              (item) => !remote.some((record) => record.id === item.id),
            ),
          ]);
        }
      } catch {
        // Keep the sample records visible when the Firestore collections are not set up yet.
      }
    };
    void loadRecords();
    return () => {
      active = false;
    };
  }, [userId, role]);

  const stats = useMemo<DashboardStats>(
    () => ({
      products: products.length,
      suppliers: suppliers.length,
      customers: customers.length,
    }),
    [products.length, suppliers.length, customers.length],
  );

  const addProduct = useCallback(
    async (product: Omit<Product, "id" | "createdAt">) => {
      const id = uid();
      const record = {
        ...product,
        id,
        createdAt: new Date().toISOString().slice(0, 10),
        ...(userId ? { ownerId: userId } : {}),
      };
      if (firestore && userId)
        await setDoc(doc(firestore, "products", id), record);
      setProducts((prev) => [record, ...prev]);
      return id;
    },
    [userId],
  );

  const updateProduct = useCallback(
    async (id: string, data: Partial<Product>) => {
      if (firestore && userId)
        await setDoc(
          doc(firestore, "products", id),
          { ...data, ownerId: userId },
          { merge: true },
        );
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p)),
      );
    },
    [userId],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (firestore && userId) await deleteDoc(doc(firestore, "products", id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
    },
    [userId],
  );

  const addSupplier = useCallback(
    async (supplier: Omit<Supplier, "id">) => {
      const id = uid();
      const record = {
        ...supplier,
        id,
        ...(userId ? { ownerId: userId } : {}),
      };
      if (firestore && userId)
        await setDoc(doc(firestore, "suppliers", id), record);
      setSuppliers((prev) => [record, ...prev]);
    },
    [userId],
  );

  const updateSupplier = useCallback(
    async (id: string, data: Partial<Supplier>) => {
      if (firestore && userId)
        await setDoc(
          doc(firestore, "suppliers", id),
          { ...data, ownerId: userId },
          { merge: true },
        );
      setSuppliers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s)),
      );
    },
    [userId],
  );

  const updateCustomer = useCallback(
    async (id: string, data: Partial<Customer>) => {
      if (firestore && userId)
        await setDoc(
          doc(firestore, "customers", id),
          { ...data, ownerId: userId },
          { merge: true },
        );
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c)),
      );
    },
    [userId],
  );

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
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
