import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCart,
  getStorefrontProducts,
  placeOrder,
  saveCart,
  type StorefrontProduct,
} from "../../api/storeApi";
import { useAuth } from "../../context/AuthContext";
import type { CartItem } from "../../types";

export function CartPage() {
  const { isAuthenticated, userEmail, userId, role } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<
    "Cash On Delivery" | "Bank"
  >("Cash On Delivery");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    Promise.all([getCart(userId ?? undefined), getStorefrontProducts()])
      .then(([items, catalog]) => {
        setCart(items);
        setProducts(catalog);
      })
      .catch(() => setMessage("Cart could not be loaded."));
  }, [userId]);
  const lines = useMemo(
    () =>
      cart
        .map((item) => ({
          item,
          product: products.find((entry) => entry.id === item.productId),
        }))
        .filter(
          (line): line is { item: CartItem; product: StorefrontProduct } =>
            Boolean(line.product),
        ),
    [cart, products],
  );
  const total = lines.reduce(
    (sum, line) => sum + line.product.price * line.item.quantity,
    0,
  );
  const updateCart = async (next: CartItem[]) => {
    setCart(next);
    await saveCart(next, userId ?? undefined);
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAuthenticated || role !== "customer") {
      navigate("/login");
      return;
    }
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setMessage("");
    try {
      await placeOrder({
        userId: userId ?? "guest",
        email: String(form.get("email")),
        name: String(form.get("name")),
        phone: String(form.get("phone")),
        address: String(form.get("address")),
        paymentMethod,
        items: lines.map(({ item, product }) => ({
          productId: product.id,
          name: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
        })),
        total,
      });
      await updateCart([]);
      setMessage("Order placed successfully.");
    } catch {
      setMessage("Could not place your order. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <h1 className="customer-page-title">Cart</h1>
      {message && (
        <p
          className={
            message.includes("Could not")
              ? "customer-error"
              : "customer-success"
          }
          role="status"
        >
          {message}
        </p>
      )}
      <div className="customer-cart">
        <section className="customer-cart__panel">
          <h2>Your products</h2>
          {lines.map(({ item, product }) => (
            <article className="customer-cart__item" key={item.productId}>
              <img src={product.image} alt={product.name} />
              <div>
                <strong>{product.name}</strong>
                <p>${product.price.toFixed(2)} each</p>
              </div>
              <label>
                Qty{" "}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) =>
                    void updateCart(
                      cart.map((line) =>
                        line.productId === item.productId
                          ? {
                              ...line,
                              quantity: Math.max(1, Number(event.target.value)),
                            }
                          : line,
                      ),
                    )
                  }
                />
              </label>
              <button
                onClick={() =>
                  void updateCart(
                    cart.filter((line) => line.productId !== item.productId),
                  )
                }
              >
                Remove
              </button>
            </article>
          ))}
          {!lines.length && (
            <p className="customer-empty">
              Your cart is empty. <Link to="/medicine">Browse medicine</Link>
            </p>
          )}
          <h2>Total: ${total.toFixed(2)}</h2>
          <p>
            Delivery and additional fees are calculated based on your shipping
            information.
          </p>
        </section>
        <form
          className="customer-cart__panel"
          onSubmit={(event) => void submit(event)}
        >
          <h2>Shipping information</h2>
          <p>
            Enter your shipping info where you'll get the product. You can also
            send any other location where you need the products.
          </p>
          <div className="customer-form">
            <input
              name="name"
              placeholder="Name"
              autoComplete="name"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email address"
              defaultValue={userEmail ?? ""}
              autoComplete="email"
              required
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone"
              autoComplete="tel"
              required
            />
            <textarea
              name="address"
              placeholder="Address"
              autoComplete="street-address"
              rows={3}
              required
            />
          </div>
          <div className="customer-payment">
            <strong>Payment method</strong>
            <label>
              <input
                type="radio"
                checked={paymentMethod === "Cash On Delivery"}
                onChange={() => setPaymentMethod("Cash On Delivery")}
              />{" "}
              Cash On Delivery
            </label>
            <label>
              <input
                type="radio"
                checked={paymentMethod === "Bank"}
                onChange={() => setPaymentMethod("Bank")}
              />{" "}
              Bank
            </label>
          </div>
          <button
            className="customer-primary-button"
            type="submit"
            disabled={busy || !lines.length}
          >
            {busy ? "Placing order…" : "Place order"}
          </button>
          {!isAuthenticated && (
            <p>
              Please <Link to="/login">log in</Link> before placing the order.
            </p>
          )}
        </form>
      </div>
    </>
  );
}
