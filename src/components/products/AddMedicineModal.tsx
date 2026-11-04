import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
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
import { DEFAULT_PRODUCT_IMAGE, MEDICINE_IMAGES } from '../../data/productImages';

export interface NewMedicineValues {
  name: string;
  price: number;
  description: string;
  image: string;
}

interface AddMedicineModalProps {
  open: boolean;
  onClose: () => void;
  onExited: () => void;
  onSubmit: (medicine: NewMedicineValues) => void;
}

export function AddMedicineModal({ open, onClose, onExited, onSubmit }: AddMedicineModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<NewMedicineValues>({
    name: '',
    price: 0,
    description: '',
    image: DEFAULT_PRODUCT_IMAGE,
  });

  useEffect(() => {
    if (open) {
      setValues({ name: '', price: 0, description: '', image: DEFAULT_PRODUCT_IMAGE });
    }
  }, [open]);

  const closeModal = () => {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && formRef.current?.contains(activeElement)) {
      activeElement.blur();
    }
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
    closeModal();
  };

  const selectedImage = MEDICINE_IMAGES.find((image) => image.src === values.image);

  return (
    <Dialog
      open={open}
      onClose={closeModal}
      disableRestoreFocus
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 3, p: 1 } },
        transition: { onExited },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>
        Add medicine to store
        <IconButton
          aria-label="Close"
          onClick={closeModal}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form ref={formRef} onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          {selectedImage && (
            <img
              src={selectedImage.src}
              alt={selectedImage.name}
              width={112}
              height={96}
              style={{
                justifySelf: 'center',
                objectFit: 'contain',
                border: '1px solid #cfe7d8',
                borderRadius: 12,
              }}
            />
          )}
          <TextField
            select
            size="small"
            label="Medicine image"
            value={values.image}
            onChange={(event) => setValues((current) => ({ ...current, image: event.target.value }))}
          >
            {MEDICINE_IMAGES.map((image) => (
              <MenuItem key={image.name} value={image.src}>
                {image.name}
              </MenuItem>
            ))}
          </TextField>
          <div className="add-medicine-modal__fields">
            <TextField
              required
              size="small"
              label="Medicine Name"
              value={values.name}
              onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
            />
            <TextField
              required
              size="small"
              label="Price"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={values.price}
              onChange={(event) =>
                setValues((current) => ({ ...current, price: Number(event.target.value) }))
              }
            />
          </div>
          <TextField
            required
            size="small"
            label="Description"
            multiline
            minRows={3}
            value={values.description}
            onChange={(event) =>
              setValues((current) => ({ ...current, description: event.target.value }))
            }
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button type="submit" variant="contained">
            Add medicine
          </Button>
          <Button onClick={closeModal} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
