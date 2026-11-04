import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Customer } from '../../types';

type CustomerFormValues = Pick<Customer, 'name' | 'email' | 'address' | 'phone'>;

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  address: yup.string().required(),
  phone: yup.string().required(),
});

interface EditCustomerModalProps {
  customer: Customer | null;
  onClose: () => void;
  onSave: (id: string, data: CustomerFormValues) => void;
}

export function EditCustomerModal({ customer, onClose, onSave }: EditCustomerModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phone: customer.phone,
      });
    }
  }, [customer, reset]);

  return (
    <Dialog open={Boolean(customer)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        Edit customer
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form
        onSubmit={handleSubmit((values) => {
          if (customer) onSave(customer.id, values);
          onClose();
        })}
      >
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <TextField label="User Info" {...register('name')} error={Boolean(errors.name)} />
          <TextField label="Email" {...register('email')} error={Boolean(errors.email)} />
          <TextField label="Address" {...register('address')} error={Boolean(errors.address)} />
          <TextField label="Phone" {...register('phone')} error={Boolean(errors.phone)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
