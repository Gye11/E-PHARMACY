import { useMemo, useState } from 'react';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EllipsisText from 'react-ellipsis-text';
import { NameFilterBar } from '../../components/filters/NameFilterBar';
import { EditCustomerModal } from '../../components/customers/EditCustomerModal';
import { useData } from '../../context/DataContext';
import type { Customer } from '../../types';

const ROWS_PER_PAGE = 5;

export function CustomersPage() {
  const { customers, updateCustomer } = useData();
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    if (!filter) return customers;
    const q = filter.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q));
  }, [customers, filter]);

  const paged = useMemo(
    () => filtered.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE),
    [filtered, page],
  );

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Customers Data
      </Typography>
      <NameFilterBar onFilter={(v) => { setFilter(v); setPage(0); }} />
      <Paper elevation={0} sx={{ border: '1px solid #E8ECEA', borderRadius: 3 }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Info</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Register date</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell sx={{ maxWidth: 160 }}>
                    <EllipsisText text={customer.email} length={22} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 140 }}>
                    <EllipsisText text={customer.address} length={20} />
                  </TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.registerDate}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      aria-label="Edit customer"
                      onClick={() => setEditCustomer(customer)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={ROWS_PER_PAGE}
          rowsPerPageOptions={[ROWS_PER_PAGE]}
        />
      </Paper>
      <EditCustomerModal
        customer={editCustomer}
        onClose={() => setEditCustomer(null)}
        onSave={updateCustomer}
      />
    </div>
  );
}
