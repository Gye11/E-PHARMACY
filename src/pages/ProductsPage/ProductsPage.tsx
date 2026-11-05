import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { MEDICINE_CATALOG } from "../../data/productImages";
import {
  AddMedicineModal,
  type NewMedicineValues,
} from "../../components/products/AddMedicineModal";
import { useData } from "../../context/DataContext";
import {
  getPublishedProducts,
  publishStoreProduct,
  removeStoreProduct,
} from "../../api/storeApi";
import { useAuth } from "../../context/AuthContext";
import "./ProductsPage.css";

const STORE_MEDICINES_KEY = "e_pharmacy_store_medicines";
const SHOP_DETAILS_KEY = "e_pharmacy_shop";
const categories = [
  "All categories",
  "Medicine",
  "Supplements",
  "Personal care",
] as const;

interface SavedShop {
  shopName?: string;
  ownerName?: string;
  street?: string;
  city?: string;
  phone?: string;
}

function readStoreMedicines(userId?: string): string[] {
  const stored = localStorage.getItem(
    `${STORE_MEDICINES_KEY}:${userId ?? "demo"}`,
  );
  if (!stored) return [];
  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function readShopDetails(userId?: string): SavedShop {
  const stored = localStorage.getItem(
    `${SHOP_DETAILS_KEY}:${userId ?? "demo"}`,
  );
  if (!stored) return {};
  try {
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed as SavedShop;
  } catch {
    return {};
  }
}

export function ProductsPage() {
  const { products, addProduct } = useData();
  const { userId } = useAuth();
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("All categories");
  const [activeTab, setActiveTab] = useState<"store" | "all">("all");
  const [addOpen, setAddOpen] = useState(false);
  const [storeMedicines, setStoreMedicines] = useState(() =>
    readStoreMedicines(userId ?? undefined),
  );
  const [publishedProducts, setPublishedProducts] = useState<
    Awaited<ReturnType<typeof getPublishedProducts>>
  >([]);
  const [actionError, setActionError] = useState("");
  const addMedicineButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    getPublishedProducts(userId)
      .then((published) => {
        if (!active) return;
        setPublishedProducts(published);
        const catalogIds = published.map((item) =>
          item.id.startsWith(`${userId}-`)
            ? item.id.slice(userId.length + 1)
            : item.id,
        );
        localStorage.setItem(
          `${STORE_MEDICINES_KEY}:${userId}`,
          JSON.stringify(catalogIds),
        );
        setStoreMedicines(catalogIds);
      })
      .catch(() => {
        if (active) setStoreMedicines(readStoreMedicines(userId));
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const medicines = useMemo(
    () => [
      ...MEDICINE_CATALOG,
      ...products
        .filter(
          (product) =>
            !MEDICINE_CATALOG.some((medicine) => medicine.id === product.id),
        )
        .map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description || product.category,
          image: product.image,
          price: product.price,
        })),
      ...publishedProducts
        .filter(
          (product) =>
            !MEDICINE_CATALOG.some((medicine) => medicine.id === product.id),
        )
        .map((product) => ({
          id: product.id.startsWith(`${userId}-`)
            ? product.id.slice(userId!.length + 1)
            : product.id,
          name: product.name,
          description: product.description,
          image: product.image,
          price: product.price,
        }))
        .filter(
          (product) => !products.some((entry) => entry.id === product.id),
        ),
    ],
    [products, publishedProducts, userId],
  );

  const filtered = useMemo(
    () =>
      medicines.filter((medicine) => {
        const matchesQuery = `${medicine.name} ${medicine.description}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesTab =
          activeTab === "all" || storeMedicines.includes(medicine.id);
        const matchesCategory =
          category === "All categories" ||
          (category === "Medicine"
            ? !/supplement|vitamin|skin care|sanitizer|alcohol/i.test(
                medicine.description,
              )
            : category === "Supplements"
              ? /supplement|vitamin/i.test(medicine.description)
              : /skin care|sanitizer|alcohol/i.test(medicine.description));
        return matchesQuery && matchesTab && matchesCategory;
      }),
    [activeTab, category, medicines, query, storeMedicines],
  );

  const toggleStoreMedicine = async (id: string) => {
    const next = storeMedicines.includes(id)
      ? storeMedicines.filter((medicineId) => medicineId !== id)
      : [...storeMedicines, id];
    setActionError("");
    try {
      if (next.includes(id)) {
        const medicine = medicines.find((item) => item.id === id);
        if (medicine) {
          await publishStoreProduct(userId ?? "demo-pharmacy", {
            ...medicine,
            id: `${userId ?? "demo-pharmacy"}-${medicine.id}`,
            category: "Medicine",
            stock: 100,
            suppliers: "E-Pharmacy",
            createdAt: new Date().toISOString(),
            discountPercent: 0,
          });
        }
      } else {
        await removeStoreProduct(`${userId ?? "demo-pharmacy"}-${id}`);
      }
      localStorage.setItem(
        `${STORE_MEDICINES_KEY}:${userId ?? "demo"}`,
        JSON.stringify(next),
      );
      setStoreMedicines(next);
      setPublishedProducts(
        await getPublishedProducts(userId ?? "demo-pharmacy"),
      );
    } catch {
      setActionError(
        "The medicine could not be updated. Check your Firebase permissions and try again.",
      );
    }
  };

  const handleAddMedicine = async (values: NewMedicineValues) => {
    try {
      const id = await addProduct({
        ...values,
        category: "Medicine",
        stock: 0,
        suppliers: "Your shop",
      });
      const next = [...storeMedicines, id];
      await publishStoreProduct(userId ?? "demo-pharmacy", {
        id: `${userId ?? "demo-pharmacy"}-${id}`,
        ...values,
        category: "Medicine",
        stock: 0,
        suppliers: "Your shop",
        createdAt: new Date().toISOString(),
        discountPercent: 0,
      });
      localStorage.setItem(
        `${STORE_MEDICINES_KEY}:${userId ?? "demo"}`,
        JSON.stringify(next),
      );
      setStoreMedicines(next);
      setPublishedProducts(
        await getPublishedProducts(userId ?? "demo-pharmacy"),
      );
      setActionError("");
    } catch {
      setActionError(
        "The medicine could not be saved. Check your Firebase permissions and try again.",
      );
    }
  };

  const shop = readShopDetails(userId ?? undefined);
  const shopLocation = [shop.street, shop.city].filter(Boolean).join(", ");

  return (
    <div className="medicine-page">
      <Box className="medicine-page__shop-summary">
        <Box>
          <Typography variant="h6" component="h1" fontWeight={700}>
            {shop.shopName || "Your medicine store"}
          </Typography>
          {(shop.ownerName || shopLocation || shop.phone) && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              {[shop.ownerName, shopLocation, shop.phone]
                .filter(Boolean)
                .join(" · ")}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            Choose medicines to display in your shop.
          </Typography>
        </Box>
        <Button
          ref={addMedicineButtonRef}
          variant="contained"
          onClick={() => setAddOpen(true)}
        >
          + Add medicine
        </Button>
      </Box>
      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      )}

      <div
        className="medicine-page__tabs"
        role="tablist"
        aria-label="Medicine lists"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "store"}
          className={activeTab === "store" ? "is-active" : ""}
          onClick={() => setActiveTab("store")}
        >
          Drug store
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "all"}
          className={activeTab === "all" ? "is-active" : ""}
          onClick={() => setActiveTab("all")}
        >
          All medicine
        </button>
      </div>

      {activeTab === "store" && storeMedicines.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Your shop does not have any medicines yet. Add medicines from the
          catalog below.
        </Alert>
      )}

      <div className="medicine-page__filters">
        <TextField
          select
          size="small"
          label="Product category"
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as (typeof categories)[number])
          }
        >
          {categories.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          placeholder="Search medicine"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          inputProps={{ "aria-label": "Search medicine" }}
        />
      </div>

      <div className="medicine-grid">
        {filtered.map((medicine) => {
          const isInStore = storeMedicines.includes(medicine.id);
          return (
            <article className="medicine-card" key={medicine.id}>
              <Link
                to={`/products/${encodeURIComponent(medicine.id)}`}
                className="medicine-card__image"
                aria-label={`View ${medicine.name} details`}
              >
                <img src={medicine.image} alt={medicine.name} loading="lazy" />
              </Link>
              <Paper elevation={0} className="medicine-card__info">
                <div className="medicine-card__heading">
                  <Typography fontWeight={700}>{medicine.name}</Typography>
                  <Typography fontWeight={700}>${medicine.price}</Typography>
                </div>
                <Typography variant="caption" color="text.secondary">
                  {medicine.description}
                </Typography>
                <div className="medicine-card__actions">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => toggleStoreMedicine(medicine.id)}
                  >
                    {isInStore ? "Remove from shop" : "Add to shop"}
                  </Button>
                  <Button
                    size="small"
                    component={Link}
                    to={`/products/${encodeURIComponent(medicine.id)}`}
                    color="inherit"
                  >
                    Details
                  </Button>
                </div>
              </Paper>
            </article>
          );
        })}
        {!filtered.length && (
          <Typography
            color="text.secondary"
            sx={{ gridColumn: "1 / -1", py: 4, textAlign: "center" }}
          >
            No medicines match your search.
          </Typography>
        )}
      </div>

      <AddMedicineModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onExited={() => addMedicineButtonRef.current?.focus()}
        onSubmit={handleAddMedicine}
      />
    </div>
  );
}
