import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Alert, Button, CircularProgress, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { LoginCredentials } from '../../types';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setServerError(null);
    try {
      await login(data);
      navigate('/home');
    } catch (error) {
      setServerError(
        error instanceof Error
          ? `${error.message} Use vendor@gmail.com / password123 for the demo account.`
          : 'Unable to log in. Please try again.',
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
        label="Email address"
        placeholder="Email address"
        margin="normal"
        {...register('email')}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
      />
      <TextField
        fullWidth
        type="password"
        label="Password"
        placeholder="Password"
        margin="normal"
        {...register('password')}
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
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
        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Log In Now'}
      </Button>
    </form>
  );
}
