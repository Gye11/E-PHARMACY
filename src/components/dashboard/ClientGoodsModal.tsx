import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Customer } from '../../types';
import { OptimizedImage } from '../common/OptimizedImage';

interface ClientGoodsModalProps {
  customer: Customer | null;
  onClose: () => void;
}

export function ClientGoodsModal({ customer, onClose }: ClientGoodsModalProps) {
  const open = Boolean(customer);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pr: 6 }}>
        The client&apos;s goods
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {customer && (
          <>
            <Box
              sx={{
                bgcolor: '#E9F6ED',
                borderRadius: 2,
                p: 2,
                mb: 2,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1,
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Name
                </Typography>
                <Typography fontWeight={600}>{customer.name}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography fontWeight={600}>{customer.email}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Spent
                </Typography>
                <Typography fontWeight={600}>{customer.spent.toFixed(2)}</Typography>
              </Box>
            </Box>
            {(customer.medicines ?? []).map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  gap: 2,
                  py: 2,
                  borderBottom: '1px solid #eee',
                }}
              >
                <OptimizedImage
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="client-goods-thumb"
                />
                <Box>
                  <Typography fontWeight={700}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                  <Typography sx={{ mt: 1, fontWeight: 600 }}>
                    $ {item.price.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))}
            {!customer.medicines?.length && (
              <Typography color="text.secondary">No purchase history available.</Typography>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
