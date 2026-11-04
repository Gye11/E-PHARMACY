import { useState } from 'react';
import {
  Box,
  Button,
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
import type { Customer } from '../../types';
import { ClientGoodsModal } from './ClientGoodsModal';

export function RecentCustomers() {
  const { customers } = useData();
  const recent = customers.slice(0, 5);
  const [selected, setSelected] = useState<Customer | null>(null);

  return (
    <>
      <Paper elevation={0} sx={{ border: '1px solid #E8ECEA', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ bgcolor: '#E9F6ED', px: 2, py: 1.5 }}>
          <Typography fontWeight={600}>Recent Customers</Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Spent</TableCell>
                <TableCell align="center">Medicine</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recent.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell sx={{ maxWidth: 160 }}>
                    <EllipsisText text={customer.email} length={22} />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {customer.spent.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => setSelected(customer)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <ClientGoodsModal customer={selected} onClose={() => setSelected(null)} />
    </>
  );
}
