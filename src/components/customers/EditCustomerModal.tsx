import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Customer } from "../../types";

type CustomerFormValues = Pick<
  Customer,
  "name" | "email" | "address" | "phone"
>;

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  address: yup.string().required(),
  phone: yup.string().required(),
});

interface EditCustomerModalProps {
  customer: Customer | null;
  onClose: () => void;
  onSave: (id: string, data: CustomerFormValues) => void | Promise<void>;
}

export function EditCustomerModal({
  customer,
  onClose,
  onSave,
}: EditCustomerModalProps) {
  const [saveError, setSaveError] = useState("");
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
      setSaveError("");
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
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form
        onSubmit={handleSubmit(async (values) => {
          if (!customer) return;
          setSaveError("");
          try {
            await onSave(customer.id, values);
            onClose();
          } catch {
            setSaveError(
              "Could not save customer. Check Firebase access and try again.",
            );
          }
        })}
      >
        <DialogContent sx={{ display: "grid", gap: 2 }}>
          {saveError && <Alert severity="error">{saveError}</Alert>}
          <TextField
            label="User Info"
            {...register("name")}
            error={Boolean(errors.name)}
          />
          <TextField
            label="Email"
            {...register("email")}
            error={Boolean(errors.email)}
          />
          <TextField
            label="Address"
            {...register("address")}
            error={Boolean(errors.address)}
          />
          <TextField
            label="Phone"
            {...register("phone")}
            error={Boolean(errors.phone)}
          />
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
