import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { MEDICINE_CATALOG } from "../data/productImages";
import type { CartItem, CustomerOrder, Order, PharmacyStore } from "../types";
import { firestore } from "./firebase";

const CART_KEY = "e_pharmacy_customer_cart";

const demoStores: PharmacyStore[] = [
  {
    id: "store-1",
    name: "Huge Sale",
    address: "Albenia 683",
    city: "Seoul",
    phone: "+82 2 555 0184",
    isOpen: true,
    rating: 4.9,
  },
  {
    id: "store-2",
    name: "Tremblay and Schiller",
    address: "Maple Street 24",
    city: "Toronto",
    phone: "+1 416 555 0136",
    isOpen: true,
    rating: 4.8,
  },
  {
    id: "store-3",
    name: "Fahey-Batz",
    address: "Krakowie 148",
    city: "Warsaw",
    phone: "+48 22 555 0102",
    isOpen: false,
    rating: 4.7,
  },
  {
    id: "store-4",
    name: "Green Cross Pharmacy",
    address: "Via Roma 5",
    city: "Milan",
    phone: "+39 02 555 0191",
    isOpen: true,
    rating: 4.6,
  },
  {
    id: "store-5",
    name: "CarePoint Pharmacy",
    address: "Berlin Str. 22",
    city: "Berlin",
    phone: "+49 30 555 0168",
    isOpen: true,
    rating: 4.5,
  },
  {
    id: "store-6",
    name: "Wellness Corner",
    address: "Oak Street 12",
    city: "London",
    phone: "+44 20 5555 0140",
    isOpen: false,
    rating: 4.4,
  },
];

export interface StoreReview {
  id: string;
  userName: string;
  userPhoto?: string;
  text: string;
  rating: number;
  createdAt: string;
  productId?: string;
}

const demoReviews: StoreReview[] = [
  {
    id: "review-1",
    userName: "Maria Tkachuk",
    text: "I recently used this medical platform to book an appointment with a specialist, and I was impressed by how easy and user-friendly the process was. Highly recommended!",
    rating: 5,
    createdAt: "2026-03-20",
  },
  {
    id: "review-2",
    userName: "Alex Shatov",
    text: "A convenient way to find nearby pharmacies and get the products I need.",
    rating: 5,
    createdAt: "2026-03-17",
  },
  {
    id: "review-3",
    userName: "Dasha Harmon",
    text: "The store information was clear and delivery was easy to arrange.",
    rating: 4,
    createdAt: "2026-03-12",
  },
];

export async function getStores(): Promise<PharmacyStore[]> {
  if (!firestore) {
    try {
      const saved = JSON.parse(
        localStorage.getItem("e_pharmacy_shop") ?? "null",
      ) as Record<string, string> | null;
      if (saved?.shopName) {
        return [
          {
            id: "local-pharmacy",
            name: saved.shopName,
            address: saved.street ?? "",
            city: saved.city ?? "",
            phone: saved.phone ?? "",
            isOpen: true,
            rating: 5,
            ownerEmail: saved.email,
          },
          ...demoStores,
        ];
      }
    } catch {
      return demoStores;
    }
    return demoStores;
  }
  const snapshot = await getDocs(collection(firestore, "stores"));
  return snapshot.docs.length
    ? snapshot.docs.map(
        (item) => ({ id: item.id, ...item.data() }) as PharmacyStore,
      )
    : demoStores;
}

export async function getReviews(productId?: string): Promise<StoreReview[]> {
  if (!firestore) return productId ? [] : demoReviews;
  const snapshot = await getDocs(collection(firestore, "reviews"));
  const reviews = snapshot.docs.map(
    (item) => ({ id: item.id, ...item.data() }) as StoreReview,
  );
  return (
    productId
      ? reviews.filter((review) => review.productId === productId)
      : reviews
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getCart(userId?: string): Promise<CartItem[]> {
  if (firestore && userId) {
    const snapshot = await getDoc(doc(firestore, "carts", userId));
    return (snapshot.data()?.items as CartItem[] | undefined) ?? [];
  }
  try {
    const value: unknown = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
    return Array.isArray(value) ? (value as CartItem[]) : [];
  } catch {
    return [];
  }
}

export async function saveCart(
  items: CartItem[],
  userId?: string,
): Promise<void> {
  if (firestore && userId) {
    await setDoc(doc(firestore, "carts", userId), {
      userId,
      items,
      updatedAt: new Date().toISOString(),
    });
    return;
  }
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export async function placeOrder(
  order: Omit<CustomerOrder, "id" | "createdAt" | "status">,
): Promise<void> {
  const value = {
    ...order,
    createdAt: new Date().toISOString(),
    status: "Pending" as const,
  };
  if (firestore) {
    await addDoc(collection(firestore, "orders"), value);
    return;
  }
  const existing: unknown = JSON.parse(
    localStorage.getItem("e_pharmacy_customer_orders") ?? "[]",
  );
  const orders = Array.isArray(existing) ? existing : [];
  localStorage.setItem(
    "e_pharmacy_customer_orders",
    JSON.stringify([...orders, { ...value, id: crypto.randomUUID() }]),
  );
}

export async function getCustomerOrders(): Promise<Order[]> {
  if (!firestore) {
    try {
      const saved = JSON.parse(
        localStorage.getItem("e_pharmacy_customer_orders") ?? "[]",
      ) as CustomerOrder[];
      return saved.map((order) => ({
        id: order.id,
        userName: order.name,
        userEmail: order.email,
        address: order.address,
        products: order.items
          .map((item) => `${item.name} x${item.quantity}`)
          .join(", "),
        orderDate: order.createdAt.slice(0, 10),
        price: order.total,
        status: order.status,
      }));
    } catch {
      return [];
    }
  }
  const snapshot = await getDocs(collection(firestore, "orders"));
  return snapshot.docs.map((item) => {
    const order = item.data() as CustomerOrder;
    return {
      id: item.id,
      userName: order.name,
      userEmail: order.email,
      address: order.address,
      products: order.items
        .map((product) => `${product.name} x${product.quantity}`)
        .join(", "),
      orderDate: order.createdAt.slice(0, 10),
      price: order.total,
      status: order.status,
    };
  });
}

export async function getStorefrontProducts(discount?: number) {
  if (firestore) {
    const productsRef = collection(firestore, "storeProducts");
    const snapshot = await getDocs(
      discount
        ? query(productsRef, where("discountPercent", ">=", discount))
        : productsRef,
    );
    if (snapshot.docs.length) {
      return snapshot.docs.map(
        (item) => ({ id: item.id, ...item.data() }) as StorefrontProduct,
      );
    }
  }
  const catalog = MEDICINE_CATALOG.map((item, index) => ({
    ...item,
    category: "Medicine" as const,
    stock: 100,
    suppliers: "E-Pharmacy",
    createdAt: "",
    discountPercent: index % 4 === 0 ? 70 : index % 3 === 0 ? 35 : 0,
  }));
  let published: StorefrontProduct[] = [];
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem("e_pharmacy_public_products") ?? "[]",
    );
    if (Array.isArray(saved)) published = saved as StorefrontProduct[];
  } catch {
    published = [];
  }
  const allProducts = [
    ...catalog,
    ...published.filter(
      (item) => !catalog.some((product) => product.id === item.id),
    ),
  ];
  return discount
    ? allProducts.filter((item) => item.discountPercent >= discount)
    : allProducts;
}

export interface StorefrontProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  discountPercent: number;
  createdAt: string;
}

export async function savePharmacyStore(
  ownerId: string,
  store: Omit<PharmacyStore, "id">,
): Promise<void> {
  if (firestore) {
    await setDoc(doc(firestore, "stores", ownerId), { ...store, ownerId });
    return;
  }
  localStorage.setItem("e_pharmacy_shop", JSON.stringify(store));
}

export async function publishStoreProduct(
  storeId: string,
  product: StorefrontProduct,
): Promise<void> {
  if (firestore) {
    await setDoc(doc(firestore, "storeProducts", product.id), {
      ...product,
      storeId,
    });
    return;
  }
  const saved = JSON.parse(
    localStorage.getItem("e_pharmacy_public_products") ?? "[]",
  ) as StorefrontProduct[];
  localStorage.setItem(
    "e_pharmacy_public_products",
    JSON.stringify([
      ...saved.filter((item) => item.id !== product.id),
      product,
    ]),
  );
}

export async function removeStoreProduct(productId: string): Promise<void> {
  if (firestore) {
    await deleteDoc(doc(firestore, "storeProducts", productId));
    return;
  }
  const saved = JSON.parse(
    localStorage.getItem("e_pharmacy_public_products") ?? "[]",
  ) as StorefrontProduct[];
  localStorage.setItem(
    "e_pharmacy_public_products",
    JSON.stringify(saved.filter((item) => item.id !== productId)),
  );
}

export { demoStores };
