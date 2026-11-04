import { Typography } from '@mui/material';
import { Statistics } from '../../components/dashboard/Statistics';
import { RecentCustomers } from '../../components/dashboard/RecentCustomers';
import { IncomeExpenses } from '../../components/dashboard/IncomeExpenses';
import './DashboardPage.css';

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
        Statistics
      </Typography>
      <Statistics />
      <div className="dashboard-page__tables">
        <RecentCustomers />
        <IncomeExpenses />
      </div>
    </div>
  );
}
