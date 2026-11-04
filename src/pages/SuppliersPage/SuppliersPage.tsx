import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EllipsisText from 'react-ellipsis-text';
import { NameFilterBar } from '../../components/filters/NameFilterBar';
import { SupplierFormModal } from '../../components/suppliers/SupplierFormModal';
import { useData } from '../../context/DataContext';
import type { Supplier } from '../../types';

export function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier } = useData();
  const [filter, setFilter] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);

  const filtered = useMemo(() => {
    if (!filter) return suppliers;
    const q = filter.toLowerCase();
    return suppliers.filter((s) => s.name.toLowerCase().includes(q));
  }, [suppliers, filter]);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          All Suppliers
        </Typography>
        <Button variant="contained" onClick={() => setAddOpen(true)}>
          Add a new supplier
        </Button>
      </Box>
      <NameFilterBar onFilter={setFilter} />
      <Paper elevation={0} sx={{ border: '1px solid #E8ECEA', borderRadius: 3 }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Suppliers Info</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Delivery date</TableCell>
                <TableCell>Ammount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((supplier) => (
                <TableRow key={supplier.id} hover>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell sx={{ maxWidth: 160 }}>
                    <EllipsisText text={supplier.address} length={26} />
                  </TableCell>
                  <TableCell>{supplier.company}</TableCell>
                  <TableCell>{supplier.deliveryDate}</TableCell>
                  <TableCell>${supplier.amount.toLocaleString()}</TableCell>
                  <TableCell>{supplier.status}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      aria-label="Edit supplier"
                      onClick={() => setEditSupplier(supplier)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SupplierFormModal
        open={addOpen}
        title="Add New Supplier"
        submitLabel="Add"
        onClose={() => setAddOpen(false)}
        onSubmit={addSupplier}
      />
      <SupplierFormModal
        open={Boolean(editSupplier)}
        title="Edit Supplier Data"
        submitLabel="Save"
        initial={editSupplier}
        onClose={() => setEditSupplier(null)}
        onSubmit={(values) => editSupplier && updateSupplier(editSupplier.id, values)}
      />
    </div>
  );
}
