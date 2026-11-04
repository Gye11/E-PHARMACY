import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { SpriteIcon } from '../common/SpriteIcon';

export function LogoutBtn() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="app-header__logout"
      variant="outlined"
      color="primary"
      onClick={handleLogout}
      disabled={loading}
      startIcon={
        loading ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <SpriteIcon name="logout" size={18} />
        )
      }
    >
      Log out
    </Button>
  );
}
