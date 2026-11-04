import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  getCart,
  getStorefrontProducts,
  saveCart,
  type StorefrontProduct,
} from "../../api/storeApi";
import { useAuth } from "../../context/AuthContext";

export function MedicinePage() {
  const { isAuthenticated, role, userId } = useAuth();
  const [params] = useSearchParams();
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const pageSize = 12;

  useEffect(() => {
    let active = true;
    const discount = Number(params.get("discount")) || undefined;
    getStorefrontProducts(discount)
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch(() => {
        if (active)
          setMessage("Medicine could not be loaded. Please try again.");
      });
    return () => {
      active = false;
    };
  }, [params]);

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          `${product.name} ${product.description}`
            .toLowerCase()
            .includes(search.toLowerCase()) &&
          (category === "All categories" || product.category === category),
      ),
    [products, search, category],
  );
  const shown = filtered.slice((page - 1) * pageSize, page * pageSize);

  const addToCart = async (product: StorefrontProduct) => {
    if (!isAuthenticated || role !== "customer") {
      setMessage(
        "Add to cart için müşteri hesabınızla giriş yapın veya kayıt olun.",
      );
      return;
    }
    const cart = await getCart(userId ?? undefined);
    const found = cart.find((item) => item.productId === product.id);
    await saveCart(
      found
        ? cart.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...cart, { productId: product.id, quantity: 1 }],
      userId ?? undefined,
    );
    setMessage(`${product.name} sepete eklendi.`);
  };

  return (
    <>
      <h1 className="customer-page-title">Medicine</h1>
      <div className="customer-toolbar">
        <select
          aria-label="Product category"
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
        >
          <option>All categories</option>
          <option>Medicine</option>
        </select>
        <input
          placeholder="Search medicine"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <button
          className="customer-primary-button"
          type="button"
          onClick={() => setPage(1)}
        >
          Filter
        </button>
      </div>
      {message && (
        <p
          className={
            message.includes("could not")
              ? "customer-error"
              : "customer-success"
          }
          role="status"
        >
          {message}{" "}
          {!isAuthenticated && (
            <>
              <Link to="/login">Log in</Link> ·{" "}
              <Link to="/register">Register</Link>
            </>
          )}
        </p>
      )}
      <div className="customer-product-grid">
        {shown.map((product) => (
          <article className="customer-product-card" key={product.id}>
            <Link
              className="customer-product-card__image"
              to={`/product/${product.id}`}
            >
              <img src={product.image} alt={product.name} loading="lazy" />
            </Link>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <div className="customer-product-card__actions">
              <strong>${product.price}</strong>
              <button
                className="customer-primary-button"
                onClick={() => void addToCart(product)}
              >
                Add to cart
              </button>
              <Link to={`/product/${product.id}`}>Details</Link>
            </div>
          </article>
        ))}
        {!shown.length && (
          <p className="customer-empty">Nothing was found for your request</p>
        )}
      </div>
      {filtered.length > pageSize && (
        <nav className="customer-pagination" aria-label="Product pages">
          {Array.from(
            { length: Math.ceil(filtered.length / pageSize) },
            (_, index) => (
              <button
                key={index}
                className={page === index + 1 ? "active" : ""}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ),
          )}
        </nav>
      )}
    </>
  );
}
