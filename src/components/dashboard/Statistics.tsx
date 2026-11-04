import { Box, Paper, Typography } from '@mui/material';
import { useData } from '../../context/DataContext';
import { SpriteIcon } from '../common/SpriteIcon';

const cards = [
  { key: 'products' as const, label: 'All products' },
  { key: 'suppliers' as const, label: 'All suppliers' },
  { key: 'customers' as const, label: 'All customers' },
];

export function Statistics() {
  const { stats } = useData();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        gap: 2,
        mb: 3,
      }}
    >
      {cards.map((card, index) => (
        <Paper
          key={card.key}
          elevation={0}
          sx={{
            p: 2.5,
            border: index === 0 ? '2px solid #59B17A' : '1px solid #E8ECEA',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              {card.label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
              {stats[card.key].toLocaleString()}
            </Typography>
          </Box>
          {index === 0 && <SpriteIcon name="package" size={32} />}
        </Paper>
      ))}
    </Box>
  );
}
