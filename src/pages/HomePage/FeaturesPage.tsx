import { Link } from "react-router-dom";

const features = [
  {
    title: "Secure pharmacy partners",
    description:
      "Find clear contact details and opening status for community pharmacies.",
  },
  {
    title: "Convenient ordering",
    description:
      "Browse medicine and keep your selected items together in one cart.",
  },
  {
    title: "Delivery information",
    description:
      "Share the address and instructions that help your pharmacy arrange delivery.",
  },
];

export function FeaturesPage() {
  return (
    <section className="customer-features">
      <header className="customer-section__heading">
        <h1>Secure delivery</h1>
        <p>
          Reliable access to local pharmacy information and a convenient
          ordering experience.
        </p>
      </header>
      <div className="customer-feature-grid">
        {features.map((feature, index) => (
          <article className="customer-feature-card" key={feature.title}>
            <span aria-hidden="true">0{index + 1}</span>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
      <p className="customer-features__action">
        <Link className="customer-primary-button" to="/medicine-store">
          Find a pharmacy
        </Link>
      </p>
    </section>
  );
}
