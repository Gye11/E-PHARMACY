import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { savePharmacyStore } from "../../api/storeApi";
import shopImage from "../../assets/medicines/image8.jpg";
import "./ShopPage.css";

interface ShopDetails {
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zip: string;
  hasDeliverySystem: boolean;
}

const STORAGE_KEY = "e_pharmacy_shop";

function readShop(): ShopDetails | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as ShopDetails;
  } catch {
    return null;
  }
}

export function ShopPage() {
  const { userEmail, userId } = useAuth();
  const [details, setDetails] = useState<ShopDetails>(
    () =>
      readShop() ?? {
        shopName: "",
        ownerName: "",
        email: userEmail ?? "",
        phone: "",
        street: "",
        city: "",
        zip: "",
        hasDeliverySystem: true,
      },
  );
  const [saved, setSaved] = useState(false);

  const updateField = (field: keyof ShopDetails, value: string | boolean) => {
    setDetails((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await savePharmacyStore(userId ?? "demo-pharmacy", {
        name: details.shopName,
        address: [details.street, details.zip].filter(Boolean).join(", "),
        city: details.city,
        phone: details.phone,
        isOpen: true,
        rating: 5,
        ownerEmail: details.email,
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  };

  return (
    <div className="shop-page">
      <div className="shop-page__navigation-label">
        <span>Shop</span>
        <span>Medicine</span>
        <span>Statistics</span>
      </div>
      <div className="shop-page__content">
        <Paper
          component="form"
          onSubmit={handleSubmit}
          className="shop-form"
          elevation={0}
        >
          <Typography variant="h5" component="h1" fontWeight={700}>
            {details.shopName ? "Edit shop" : "Create your Shop"}
          </Typography>
          <Typography color="text.secondary" className="shop-form__description">
            This information will be displayed publicly, so be careful what you
            share.
          </Typography>
          {saved && <Alert severity="success">Shop details saved.</Alert>}
          <div className="shop-form__fields">
            <TextField
              label="Shop Name"
              value={details.shopName}
              onChange={(event) => updateField("shopName", event.target.value)}
              required
              size="small"
            />
            <TextField
              label="Shop Owner Name"
              value={details.ownerName}
              onChange={(event) => updateField("ownerName", event.target.value)}
              required
              size="small"
            />
            <TextField
              label="Email address"
              type="email"
              value={details.email}
              onChange={(event) => updateField("email", event.target.value)}
              required
              size="small"
            />
            <TextField
              label="Phone Number"
              value={details.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              required
              size="small"
            />
            <TextField
              label="Street address"
              value={details.street}
              onChange={(event) => updateField("street", event.target.value)}
              required
              size="small"
            />
            <TextField
              label="City"
              value={details.city}
              onChange={(event) => updateField("city", event.target.value)}
              required
              size="small"
            />
            <TextField
              label="Zip / Postal"
              value={details.zip}
              onChange={(event) => updateField("zip", event.target.value)}
              required
              size="small"
            />
          </div>
          <fieldset className="shop-form__delivery">
            <legend>Has own Delivery System?</legend>
            <label>
              <input
                type="radio"
                name="delivery"
                checked={details.hasDeliverySystem}
                onChange={() => updateField("hasDeliverySystem", true)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="delivery"
                checked={!details.hasDeliverySystem}
                onChange={() => updateField("hasDeliverySystem", false)}
              />
              No
            </label>
          </fieldset>
          <Button type="submit" variant="contained" sx={{ minWidth: 130 }}>
            {details.shopName ? "Save" : "Create account"}
          </Button>
        </Paper>
        <Box className="shop-page__image">
          <img src={shopImage} alt="Medicine products" />
        </Box>
      </div>
    </div>
  );
}
