import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppRouter } from './routes/AppRouter';
import { theme } from './theme/theme';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <AuthProvider>
          <DataProvider>
            <AppRouter />
          </DataProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
);
