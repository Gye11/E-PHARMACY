import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PRODUCT_CATEGORIES } from '../../data/mockData';
import { DEFAULT_PRODUCT_IMAGE, MEDICINE_IMAGES } from '../../data/productImages';
import type { Product, ProductCategory } from '../../types';

export type ProductFormValues = {
  name: string;
  category: ProductCategory;
  stock: number;
  suppliers: string;
  price: number;
  image: string;
};

const schema = yup.object({
  name: yup.string().required('Product name is required'),
  category: yup.string().oneOf([...PRODUCT_CATEGORIES]).required(),
  stock: yup.number().typeError('Stock must be a number').min(0).required(),
  suppliers: yup.string().required('Supplier is required'),
  price: yup.number().typeError('Price must be a number').min(0).required(),
  image: yup.string().required('Choose a product image'),
});

interface ProductFormModalProps {
  open: boolean;
  title: string;
  submitLabel: string;
  initial?: Product | null;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
}

export function ProductFormModal({
  open,
  title,
  submitLabel,
  initial,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      category: 'Medicine',
      stock: 0,
      suppliers: '',
      price: 0,
      image: DEFAULT_PRODUCT_IMAGE,
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initial
          ? {
              name: initial.name,
              category: initial.category,
              stock: initial.stock,
              suppliers: initial.suppliers,
              price: initial.price,
              image: initial.image,
            }
          : {
              name: '',
              category: 'Medicine',
              stock: 0,
              suppliers: '',
              price: 0,
              image: DEFAULT_PRODUCT_IMAGE,
            },
      );
    }
  }, [open, initial, reset]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form
        onSubmit={handleSubmit((values) => {
          onSubmit(values);
          onClose();
        })}
      >
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <TextField
            label="Product Info"
            {...register('name')}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField select label="Category" {...field} error={Boolean(errors.category)}>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <TextField
            label="Stock"
            type="number"
            {...register('stock')}
            error={Boolean(errors.stock)}
            helperText={errors.stock?.message}
          />
          <TextField
            label="Suppliers"
            {...register('suppliers')}
            error={Boolean(errors.suppliers)}
            helperText={errors.suppliers?.message}
          />
          <TextField
            label="Price"
            type="number"
            {...register('price')}
            error={Boolean(errors.price)}
            helperText={errors.price?.message}
          />
          <Controller
            name="image"
            control={control}
            render={({ field }) => {
              const selectedImage = MEDICINE_IMAGES.find((image) => image.src === field.value);
              return (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 88px', gap: 2, alignItems: 'center' }}>
                  <TextField
                    select
                    label="Product image"
                    {...field}
                    error={Boolean(errors.image)}
                    helperText={errors.image?.message}
                  >
                    {MEDICINE_IMAGES.map((image) => (
                      <MenuItem key={image.name} value={image.src}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <img
                            src={image.src}
                            alt=""
                            width={40}
                            height={36}
                            style={{ objectFit: 'contain' }}
                          />
                          {image.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                  {selectedImage && (
                    <img
                      src={selectedImage.src}
                      alt={selectedImage.name}
                      width={88}
                      height={72}
                      style={{ objectFit: 'contain', border: '1px solid #E8ECEA', borderRadius: 8 }}
                    />
                  )}
                </Box>
              );
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
