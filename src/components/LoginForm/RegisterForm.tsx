import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Alert, Button, CircularProgress, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { LoginCredentials } from "../../types";

interface RegistrationValues extends LoginCredentials {
  confirmPassword: string;
  displayName: string;
  phone: string;
  role: "customer" | "pharmacy";
}

const schema = yup.object({
  displayName: yup.string().required("Name is required"),
  phone: yup.string().required("Phone number is required"),
  role: yup
    .mixed<"customer" | "pharmacy">()
    .oneOf(["customer", "pharmacy"])
    .required(),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export function RegisterForm() {
  const { register: createAccount } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      displayName: "",
      phone: "",
      role: "customer",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({
    email,
    password,
    displayName,
    phone,
    role,
  }: RegistrationValues) => {
    setServerError(null);
    try {
      await createAccount({ email, password, displayName, phone, role });
      navigate(role === "pharmacy" ? "/shop" : "/home");
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.",
      );
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}
      <TextField
        fullWidth
        label="User Name"
        placeholder="User Name"
        margin="normal"
        autoComplete="name"
        {...register("displayName")}
        error={Boolean(errors.displayName)}
        helperText={errors.displayName?.message}
      />
      <TextField
        fullWidth
        label="Phone number"
        placeholder="Phone number"
        margin="normal"
        autoComplete="tel"
        {...register("phone")}
        error={Boolean(errors.phone)}
        helperText={errors.phone?.message}
      />
      <TextField
        fullWidth
        label="Email address"
        placeholder="Email address"
        margin="normal"
        autoComplete="email"
        {...register("email")}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
      />
      <TextField
        fullWidth
        type="password"
        label="Password"
        placeholder="Password"
        margin="normal"
        autoComplete="new-password"
        {...register("password")}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
      />
      <TextField
        fullWidth
        type="password"
        label="Confirm password"
        placeholder="Confirm password"
        margin="normal"
        autoComplete="new-password"
        {...register("confirmPassword")}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword?.message}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        disabled={isSubmitting}
        sx={{ mt: 3 }}
      >
        {isSubmitting ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
