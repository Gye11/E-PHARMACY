import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Box, Button, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { MEDICINE_CATALOG } from '../../data/productImages';
import { useData } from '../../context/DataContext';
import './MedicineDetailPage.css';

const STORE_MEDICINES_KEY = 'e_pharmacy_store_medicines';

export function MedicineDetailPage() {
  const { productId } = useParams();
  const { products } = useData();
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const medicine =
    MEDICINE_CATALOG.find((item) => item.id === productId) ??
    products.find((item) => item.id === productId);

  if (!medicine) return <Navigate to="/products" replace />;

  const description =
    'Please read the product packaging and follow the advice of a qualified healthcare professional before use. If you have questions about this product, consult your pharmacist.';

  const addToStore = () => {
    const stored = localStorage.getItem(STORE_MEDICINES_KEY);
    let ids: string[] = [];
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'string')) {
          ids = parsed;
        }
      } catch {
        ids = [];
      }
    }
    if (!ids.includes(medicine.id)) {
      localStorage.setItem(STORE_MEDICINES_KEY, JSON.stringify([...ids, medicine.id]));
    }
  };

  return (
    <div className="medicine-detail">
      <Button
        component={Link}
        to="/products"
        startIcon={<ArrowBackIcon />}
        color="inherit"
        sx={{ mb: 2 }}
      >
        All medicine
      </Button>
      <div className="medicine-detail__layout">
        <Paper elevation={0} className="medicine-detail__product">
          <div className="medicine-detail__image">
            <img src={medicine.image} alt={medicine.name} />
          </div>
          <Typography variant="h6" fontWeight={700}>
            {medicine.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {medicine.description}
          </Typography>
          <Typography fontWeight={700}>${medicine.price}</Typography>
          <Button variant="contained" onClick={addToStore}>
            Add to shop
          </Button>
        </Paper>
        <Paper elevation={0} className="medicine-detail__description">
          <Box className="medicine-detail__tabs" role="tablist" aria-label="Medicine information">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'description'}
              className={activeTab === 'description' ? 'is-active' : ''}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'reviews'}
              className={activeTab === 'reviews' ? 'is-active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </Box>
          {activeTab === 'description' ? (
            <>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Product information and ingredients are provided on the packaging. Store according
                to the directions on the label and keep out of reach of children.
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              There are no reviews for this medicine yet.
            </Typography>
          )}
        </Paper>
      </div>
    </div>
  );
}
