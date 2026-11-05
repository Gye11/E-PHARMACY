import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReviews, getStores, type StoreReview } from "../../api/storeApi";
import type { PharmacyStore } from "../../types";
import pillImage from "../../assets/login-pill.svg";

export function HomePage() {
  const [stores, setStores] = useState<PharmacyStore[]>([]);
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [location, setLocation] = useState("");
  const [reviewPage, setReviewPage] = useState(1);

  useEffect(() => {
    let active = true;
    Promise.all([getStores(), getReviews()])
      .then(([storeList, reviewList]) => {
        if (!active) return;
        setStores(storeList.slice(0, 6));
        setReviews(reviewList);
      })
      .catch(() => {
        if (active) {
          setStores([]);
          setReviews([]);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredStores = stores.filter((store) =>
    `${store.address} ${store.city}`
      .toLowerCase()
      .includes(location.trim().toLowerCase()),
  );
  const visibleReviews = reviews.slice((reviewPage - 1) * 3, reviewPage * 3);

  return (
    <>
      <section className="customer-home__hero">
        <div className="customer-home__hero-copy">
          <h1>
            Your medication <span>delivered</span>
          </h1>
          <p>
            Say goodbye to all your healthcare worries with us. Find your local
            pharmacy and the products you need.
          </p>
          <Link className="customer-primary-button" to="/medicine">
            Explore medicine
          </Link>
        </div>
        <img
          className="customer-home__hero-art"
          src={pillImage}
          alt="Medicine tablet illustration"
        />
      </section>

      <section className="customer-home__promos" aria-label="Special offers">
        <article className="promo-card">
          <h3>Huge Sale</h3>
          <strong>70% off</strong>
          <Link to="/medicine?discount=70">Shop now</Link>
        </article>
        <article className="promo-card">
          <h3>Secure delivery</h3>
          <strong>100% care</strong>
          <Link to="/features">Read more</Link>
        </article>
        <article className="promo-card">
          <h3>Limited offer</h3>
          <strong>35% off</strong>
          <Link to="/medicine?discount=35">Shop now</Link>
        </article>
      </section>

      <section className="customer-section">
        <header className="customer-section__heading">
          <h2>Your Nearest Medicine Store</h2>
          <p>Search for Medicine, Filter by your location</p>
        </header>
        <div className="customer-toolbar customer-store-search">
          <input
            aria-label="Filter by your location"
            placeholder="Filter by your location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </div>
        <div className="customer-store-grid">
          {filteredStores.map((store) => (
            <article className="customer-store-card" key={store.id}>
              <h3>{store.name}</h3>
              <p>
                {store.address}, {store.city}
              </p>
              <p>{store.phone}</p>
              <div className="store-card__meta">
                <span>{store.isOpen ? "OPEN" : "CLOSE"}</span>
                <span>★ {store.rating.toFixed(1)}</span>
              </div>
              <div className="store-card__actions">
                <span>Local pharmacy</span>
                <Link to={`/medicine-store/${store.id}`}>Visit store</Link>
              </div>
            </article>
          ))}
          {!filteredStores.length && (
            <p className="customer-empty">
              No pharmacies are available right now.
            </p>
          )}
        </div>
        <p style={{ textAlign: "center", marginTop: 22 }}>
          <Link to="/medicine-store">See all medicine stores →</Link>
        </p>
      </section>

      <section className="customer-promo customer-section">
        <div>
          <h2>Add your local pharmacy online now</h2>
          <p>
            Enjoy the convenience of having your prescriptions filled from home
            by connecting with your community pharmacy through our online
            platform.
          </p>
          <Link className="customer-primary-button" to="/medicine-store">
            Buy medicine
          </Link>
        </div>
        <ul>
          <li>Take user orders form online</li>
          <li>Create your shop profile</li>
          <li>Manage your store</li>
          <li>Get more orders</li>
          <li>Storage shed</li>
        </ul>
      </section>

      <section className="customer-section">
        <header className="customer-section__heading">
          <h2>Reviews</h2>
          <p>Search for Medicine, Filter by your location</p>
        </header>
        <div className="customer-review-grid">
          {visibleReviews.map((review) => (
            <article className="customer-review-card" key={review.id}>
              {review.userPhoto ? (
                <img
                  className="customer-review-card__avatar"
                  src={review.userPhoto}
                  alt={`${review.userName} profile`}
                  loading="lazy"
                />
              ) : (
                <span
                  className="customer-review-card__avatar customer-review-card__avatar--fallback"
                  aria-hidden="true"
                >
                  {review.userName.charAt(0).toUpperCase()}
                </span>
              )}
              <strong>{review.userName}</strong>
              <span aria-label={`${review.rating} out of 5 stars`}>
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </span>
              <p>{review.text}</p>
            </article>
          ))}
          {!reviews.length && (
            <p className="customer-empty">
              Reviews will appear here when available.
            </p>
          )}
        </div>
        {reviews.length > 3 && (
          <nav className="customer-pagination" aria-label="Review pages">
            {Array.from(
              { length: Math.ceil(reviews.length / 3) },
              (_, index) => (
                <button
                  key={index}
                  type="button"
                  className={reviewPage === index + 1 ? "active" : ""}
                  onClick={() => setReviewPage(index + 1)}
                >
                  {index + 1}
                </button>
              ),
            )}
          </nav>
        )}
      </section>
    </>
  );
}
