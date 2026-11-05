import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

interface AuthPromptDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AuthPromptDialog({ open, onClose }: AuthPromptDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="auth-prompt-title"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="auth-prompt-title">
        Sign in to add items to your cart
      </DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">
          Create a customer account or log in to continue shopping.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3, px: 3 }}>
        <Button
          component={Link}
          to="/login"
          variant="outlined"
          onClick={onClose}
        >
          Log in
        </Button>
        <Button
          component={Link}
          to="/register"
          variant="contained"
          onClick={onClose}
        >
          Create account
        </Button>
      </DialogActions>
    </Dialog>
  );
}
