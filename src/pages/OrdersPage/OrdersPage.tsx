import { useEffect, useMemo, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EllipsisText from "react-ellipsis-text";
import { NameFilterBar } from "../../components/filters/NameFilterBar";
import { useData } from "../../context/DataContext";
import { getCustomerOrders } from "../../api/storeApi";
import type { Order } from "../../types";

export function OrdersPage() {
  const { orders } = useData();
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getCustomerOrders()
      .then(setCustomerOrders)
      .catch(() => setCustomerOrders([]));
  }, []);

  const filtered = useMemo(() => {
    const allOrders = [...customerOrders, ...orders];
    if (!filter) return allOrders;
    const q = filter.toLowerCase();
    return allOrders.filter((o) => o.userName.toLowerCase().includes(q));
  }, [orders, customerOrders, filter]);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        All orders
      </Typography>
      <NameFilterBar onFilter={setFilter} />
      <Paper
        elevation={0}
        sx={{ border: "1px solid #E8ECEA", borderRadius: 3 }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Info</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Order date</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{order.userName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      <EllipsisText text={order.userEmail} length={24} />
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 180 }}>
                    <EllipsisText text={order.address} length={28} />
                  </TableCell>
                  <TableCell>{order.products}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>${order.price.toFixed(2)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
              {!filtered.length && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
