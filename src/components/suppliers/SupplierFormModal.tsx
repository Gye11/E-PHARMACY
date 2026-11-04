import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import dayjs, { type Dayjs } from 'dayjs';
import type { Supplier } from '../../types';

export type SupplierFormValues = {
  name: string;
  address: string;
  company: string;
  deliveryDate: Dayjs;
  amount: number;
  status: Supplier['status'];
};

const schema = yup.object({
  name: yup.string().required('Supplier name is required'),
  address: yup.string().required('Address is required'),
  company: yup.string().required('Company is required'),
  deliveryDate: yup.mixed<Dayjs>().required('Delivery date is required'),
  amount: yup.number().typeError('Amount must be a number').min(0).required(),
  status: yup.string().oneOf(['Active', 'Inactive', 'Pending']).required(),
});

interface SupplierFormModalProps {
  open: boolean;
  title: string;
  submitLabel: string;
  initial?: Supplier | null;
  onClose: () => void;
  onSubmit: (values: Omit<Supplier, 'id'>) => void;
}

export function SupplierFormModal({
  open,
  title,
  submitLabel,
  initial,
  onClose,
  onSubmit,
}: SupplierFormModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      address: '',
      company: '',
      deliveryDate: dayjs(),
      amount: 0,
      status: 'Active',
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        initial
          ? {
              name: initial.name,
              address: initial.address,
              company: initial.company,
              deliveryDate: dayjs(initial.deliveryDate),
              amount: initial.amount,
              status: initial.status,
            }
          : {
              name: '',
              address: '',
              company: '',
              deliveryDate: dayjs(),
              amount: 0,
              status: 'Active',
            },
      );
    }
  }, [open, initial, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form
        onSubmit={handleSubmit((values) => {
          onSubmit({
            name: values.name,
            address: values.address,
            company: values.company,
            deliveryDate: values.deliveryDate.format('YYYY-MM-DD'),
            amount: values.amount,
            status: values.status,
          });
          onClose();
        })}
      >
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <TextField
            label="Suppliers Info"
            {...register('name')}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
          <TextField
            label="Address"
            {...register('address')}
            error={Boolean(errors.address)}
            helperText={errors.address?.message}
          />
          <TextField
            label="Company"
            {...register('company')}
            error={Boolean(errors.company)}
            helperText={errors.company?.message}
          />
          <Controller
            name="deliveryDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Delivery date"
                value={field.value}
                onChange={field.onChange}
                slotProps={{
                  textField: {
                    error: Boolean(errors.deliveryDate),
                    helperText: errors.deliveryDate?.message as string,
                  },
                }}
              />
            )}
          />
          <TextField
            label="Ammount"
            type="number"
            {...register('amount')}
            error={Boolean(errors.amount)}
            helperText={errors.amount?.message}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField select label="Status" {...field}>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </TextField>
            )}
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
