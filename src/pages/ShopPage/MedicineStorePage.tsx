import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { demoStores, getStores } from "../../api/storeApi";
import type { PharmacyStore } from "../../types";

export function MedicineStorePage() {
  const { storeId } = useParams();
  const [stores, setStores] = useState<PharmacyStore[]>(demoStores);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getStores()
      .then((items) => {
        if (active) setStores(items);
      })
      .catch(() => {
        if (active)
          setError("Could not load pharmacies. Please try again later.");
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedStore = stores.find((store) => store.id === storeId);
  return (
    <>
      <h1 className="customer-page-title">
        {selectedStore?.name ?? "Medicine store"}
      </h1>
      {selectedStore ? (
        <section className="customer-store-card">
          <p>
            {selectedStore.address}, {selectedStore.city}
          </p>
          <p>{selectedStore.phone}</p>
          <div className="store-card__meta">
            <span>{selectedStore.isOpen ? "OPEN" : "CLOSE"}</span>
            <span>★ {selectedStore.rating.toFixed(1)}</span>
          </div>
          <p>Browse our available medicine and find the products you need.</p>
          <Link
            className="customer-primary-button"
            to={`/medicine?store=${selectedStore.id}`}
          >
            Browse medicine
          </Link>
          <p>
            <Link to="/medicine-store">← All medicine stores</Link>
          </p>
        </section>
      ) : (
        <>
          <div className="customer-section__heading">
            <p>Find a trusted pharmacy near you.</p>
          </div>
          {error && (
            <p className="customer-error" role="alert">
              {error}
            </p>
          )}
          <div className="customer-store-grid">
            {stores.map((store) => (
              <article className="customer-store-card" key={store.id}>
                <h2>{store.name}</h2>
                <p>
                  {store.address}, {store.city}
                </p>
                <p>{store.phone}</p>
                <div className="store-card__meta">
                  <span>{store.isOpen ? "OPEN" : "CLOSE"}</span>
                  <span>★ {store.rating.toFixed(1)}</span>
                </div>
                <div className="store-card__actions">
                  <span>Community pharmacy</span>
                  <Link to={`/medicine-store/${store.id}`}>Visit Store</Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
