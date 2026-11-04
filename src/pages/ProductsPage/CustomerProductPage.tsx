import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  getCart,
  getReviews,
  getStorefrontProducts,
  saveCart,
  type StoreReview,
  type StorefrontProduct,
} from "../../api/storeApi";
import { useAuth } from "../../context/AuthContext";

export function CustomerProductPage() {
  const { productId } = useParams();
  const { isAuthenticated, role, userId } = useAuth();
  const [product, setProduct] = useState<StorefrontProduct>();
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [tab, setTab] = useState<"description" | "reviews">("description");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([getStorefrontProducts(), getReviews(productId)])
      .then(([items, comments]) => {
        if (!active) return;
        setProduct(items.find((item) => item.id === productId));
        setReviews(comments);
      })
      .catch(() => setMessage("Product details could not be loaded."));
    return () => {
      active = false;
    };
  }, [productId]);
  if (!productId) return <Navigate to="/medicine" replace />;
  if (!product) return <p className="customer-empty">Loading product…</p>;

  const add = async () => {
    if (!isAuthenticated || role !== "customer") {
      setMessage(
        "Please log in or register with a customer account to add products to cart.",
      );
      return;
    }
    const cart = await getCart(userId ?? undefined);
    const found = cart.find((item) => item.productId === product.id);
    await saveCart(
      found
        ? cart.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...cart, { productId: product.id, quantity }],
      userId ?? undefined,
    );
    setMessage("Added to cart.");
  };
  return (
    <>
      <p>
        <Link to="/medicine">← Medicine</Link>
      </p>
      <div className="customer-detail">
        <section className="customer-detail__product">
          <div className="customer-detail__image">
            <img src={product.image} alt={product.name} />
          </div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>
            <strong>Brand:</strong> E-Pharmacy
          </p>
          <p>
            <strong>Rating:</strong> ★★★★☆
          </p>
          <h2>${product.price}</h2>
          <label>
            Quantity{" "}
            <input
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.max(1, Number(event.target.value)))
              }
            />
          </label>
          <p>
            <button
              className="customer-primary-button"
              onClick={() => void add()}
            >
              Add to cart
            </button>
          </p>
          {message && (
            <p className="customer-success" role="status">
              {message}{" "}
              {!isAuthenticated && (
                <>
                  <Link to="/login">Log in</Link> ·{" "}
                  <Link to="/register">Register</Link>
                </>
              )}
            </p>
          )}
        </section>
        <section className="customer-detail__tabs">
          <nav>
            <button
              className={tab === "description" ? "active" : ""}
              onClick={() => setTab("description")}
            >
              Description
            </button>
            <button
              className={tab === "reviews" ? "active" : ""}
              onClick={() => setTab("reviews")}
            >
              Reviews ({reviews.length})
            </button>
          </nav>
          {tab === "description" ? (
            <div>
              <h2>Product information</h2>
              <p>
                {product.description}. Read the packaging and follow the advice
                of a qualified healthcare professional before use. Ask your
                pharmacist if you have questions.
              </p>
              <h3>Usage and warnings</h3>
              <p>
                Keep out of reach of children. Use only as directed on the
                product label.
              </p>
            </div>
          ) : reviews.length ? (
            reviews.map((review) => (
              <article className="customer-review-card" key={review.id}>
                <strong>{review.userName}</strong> · {review.createdAt}
                <p>
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>
                <p>{review.text}</p>
              </article>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </section>
      </div>
    </>
  );
}
