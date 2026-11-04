import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EllipsisText from 'react-ellipsis-text';
import { useData } from '../../context/DataContext';

function statusChip(type: 'income' | 'expense' | 'error') {
  if (type === 'income') return <Chip label="Income" size="small" color="success" variant="outlined" />;
  if (type === 'expense') return <Chip label="Expense" size="small" color="error" variant="outlined" />;
  return <Chip label="Error" size="small" variant="outlined" />;
}

export function IncomeExpenses() {
  const { transactions } = useData();

  return (
    <Paper elevation={0} sx={{ border: '1px solid #E8ECEA', borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: '#E9F6ED', px: 2, py: 1.5 }}>
        <Typography fontWeight={600}>Income/Expenses</Typography>
        <Typography variant="caption" color="text.secondary">
          Today
        </Typography>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {statusChip(row.type)}
                    {row.title}
                  </Box>
                </TableCell>
                <TableCell sx={{ maxWidth: 140 }}>
                  {row.email ? <EllipsisText text={row.email} length={20} /> : '—'}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    color:
                      row.type === 'income'
                        ? 'success.main'
                        : row.type === 'expense'
                          ? 'error.main'
                          : 'text.secondary',
                  }}
                >
                  {row.type === 'income' && '+'}
                  {row.type === 'expense' && ''}
                  {row.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
