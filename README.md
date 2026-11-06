# E-Pharmacy

Responsive pharmacy platform with two experiences: a public customer storefront (pharmacies, medicine catalogue, product details and cart) and a protected pharmacy franchise panel (shop profile, inventory and statistics).

## Technology

- React 19, TypeScript, Vite 6, React Router
- Material UI and React Hook Form/Yup
- Firebase Authentication and Cloud Firestore (enabled when Firebase environment variables are configured)
- Local demo data is used when Firebase is not configured; it is for development only and is not a production backend.

## Design and requirements

- Live demo: https://gye11.github.io/E-PHARMACY/
- Figma: https://www.figma.com/design/Y63xRRr90KDcrpYTznH2yf/E-PHARMACY--franchise-?node-id=0-1
- Technical specification: project brief supplied with this repository/task.

## Run locally

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in the Firebase Web App configuration from Firebase Console → Project settings → Your apps.
4. In Firebase Console, enable Email/Password under Authentication → Sign-in method and create a Cloud Firestore database. Apply `firestore.rules` before deploying.
5. Run `npm run dev` and open the local URL printed by Vite.

Without Firebase settings the app starts in local demo mode. Demo data and localStorage are not shared across browsers and do not provide production security.

## Firebase collections

- `users/{uid}`: account profile and `customer`/`pharmacy` role.
- `stores/{uid}`: pharmacy profile, readable by customers and writable by its owner.
- `storeProducts/{productId}`: published pharmacy catalogue entries.
- `carts/{uid}`: that customer's cart.
- `orders/{orderId}`: submitted customer orders.
- `reviews/{reviewId}`: store or product reviews.

Firestore rules are included as a starting point. Review and adapt them to your final business policies before production.
Public sign-up creates customer accounts only. To grant franchise access, assign `role: "pharmacy"` to that user's `users/{uid}` profile through a trusted administrator process (never expose a client-side role selector as authorization).

## Build and deploy

- `npm run build` creates the production site in `dist/`.
- `npm run deploy` publishes to the GitHub Pages branch (configure the repository's Pages source and ensure the `base` value in `vite.config.ts` matches the repository name).
- The Vite configuration writes a `404.html` fallback for client-side routes.

Deployment is not automatic: configure the hosting repository/project and verify the live URL after publishing.
