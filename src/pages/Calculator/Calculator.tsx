import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Calculate, TrendingUp } from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { RootState } from '@/app/store';
import { useGetBusinessesByUserQuery } from '@/features/business/businessApiSlice';
import { useGetCategoriesByBusinessQuery } from '@/features/category/categoryApiSlice';
import { useGetScenariosByBusinessQuery } from '@/features/scenario/scenarioApiSlice';
import { useGetTransactionsByBusinessQuery } from '@/features/transaction/transactionApiSlice';

export default function CalculatorPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: businessesData, isLoading: businessesLoading } = useGetBusinessesByUserQuery(
    user?.user_id || 0,
    { skip: !user?.user_id }
  );
  const businesses = businessesData?.data || [];

  const [selectedBusinessId, setSelectedBusinessId] = useState<number>(0);
  const [selectedScenarioId, setSelectedScenarioId] = useState<number>(0);
  const [monthsToPredict, setMonthsToPredict] = useState<number>(6);

  // Actualizar el negocio seleccionado cuando se carguen los negocios
  useEffect(() => {
    if (businesses.length > 0 && selectedBusinessId === 0) {
      setSelectedBusinessId(businesses[0].id);
    }
  }, [businesses, selectedBusinessId]);

  const { data: categoriesData } = useGetCategoriesByBusinessQuery(selectedBusinessId, {
    skip: !selectedBusinessId,
  });
  const { data: scenariosData, isLoading: scenariosLoading } = useGetScenariosByBusinessQuery(
    selectedBusinessId,
    { skip: !selectedBusinessId }
  );
  const { data: transactionsData, isLoading: transactionsLoading } =
    useGetTransactionsByBusinessQuery(selectedBusinessId, {
      skip: !selectedBusinessId,
    });

  const categories = categoriesData?.data || [];
  const scenarios = scenariosData?.data || [];
  const transactions = transactionsData?.data || [];

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId);

  // Calculate historical averages
  const historicalData = useMemo(() => {
    if (transactions.length === 0) return { avgIncome: 0, avgExpense: 0 };

    const incomeTransactions = transactions.filter((t) => {
      const category = categories.find((c) => c.id === t.category_id);
      return category?.type === 'income';
    });

    const expenseTransactions = transactions.filter((t) => {
      const category = categories.find((c) => c.id === t.category_id);
      return category?.type === 'expense';
    });

    const avgIncome =
      incomeTransactions.reduce((sum, t) => sum + t.amount, 0) /
      Math.max(incomeTransactions.length, 1);

    const avgExpense =
      expenseTransactions.reduce((sum, t) => sum + t.amount, 0) /
      Math.max(expenseTransactions.length, 1);

    return { avgIncome, avgExpense };
  }, [transactions, categories]);

  // Generate predictions
  const predictions = useMemo(() => {
    if (!selectedScenario) return [];

    const { avgIncome, avgExpense } = historicalData;
    const predictions = [];
    let currentBalance =
      businesses.find((b) => b.id === selectedBusinessId)?.initial_balance || 0;

    for (let i = 1; i <= monthsToPredict; i++) {
      const projectedIncome = avgIncome * selectedScenario.income_multiplier;
      const projectedExpense = avgExpense * selectedScenario.expense_multiplier;
      const monthlyNet = projectedIncome - projectedExpense;
      currentBalance += monthlyNet;

      predictions.push({
        month: `Month ${i}`,
        income: Math.round(projectedIncome),
        expense: Math.round(projectedExpense),
        net: Math.round(monthlyNet),
        balance: Math.round(currentBalance),
      });
    }

    return predictions;
  }, [
    selectedScenario,
    historicalData,
    monthsToPredict,
    selectedBusinessId,
    businesses,
  ]);

  if (businesses.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary" align="center">
            Please create a business first to use the calculator.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (scenariosLoading || transactionsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Calculate sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
        <Typography variant="h4">Financial Predictions Calculator</Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Select Business</InputLabel>
                <Select
                  value={selectedBusinessId}
                  label="Select Business"
                  onChange={(e) => {
                    setSelectedBusinessId(Number(e.target.value));
                    setSelectedScenarioId(0);
                  }}
                >
                  {businesses.map((business) => (
                    <MenuItem key={business.id} value={business.id}>
                      {business.enterprise_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Select Scenario</InputLabel>
                <Select
                  value={selectedScenarioId}
                  label="Select Scenario"
                  onChange={(e) => setSelectedScenarioId(Number(e.target.value))}
                  disabled={scenarios.length === 0}
                >
                  <MenuItem value={0}>
                    <em>Choose a scenario</em>
                  </MenuItem>
                  {scenarios.map((scenario) => (
                    <MenuItem key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Months to Predict</InputLabel>
                <Select
                  value={monthsToPredict}
                  label="Months to Predict"
                  onChange={(e) => setMonthsToPredict(Number(e.target.value))}
                >
                  <MenuItem value={3}>3 Months</MenuItem>
                  <MenuItem value={6}>6 Months</MenuItem>
                  <MenuItem value={12}>12 Months</MenuItem>
                  <MenuItem value={24}>24 Months</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {scenarios.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          No scenarios available. Create a business to get AI-generated scenarios automatically!
        </Alert>
      )}

      {transactions.length === 0 && selectedScenarioId !== 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No transaction history found. Predictions will be based on zero historical data.
        </Alert>
      )}

      {selectedScenario && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Avg Historical Income
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    ${Math.round(historicalData.avgIncome).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Avg Historical Expense
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    ${Math.round(historicalData.avgExpense).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Income Multiplier
                  </Typography>
                  <Typography variant="h6">{selectedScenario.income_multiplier}x</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Expense Multiplier
                  </Typography>
                  <Typography variant="h6">
                    {selectedScenario.expense_multiplier}x
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {predictions.length > 0 && (
            <>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Balance Projection
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#1976d2"
                      strokeWidth={3}
                      name="Projected Balance"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>

              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Income vs Expenses
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={predictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="income" fill="#4caf50" name="Projected Income" />
                    <Bar dataKey="expense" fill="#f44336" name="Projected Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell align="right">Projected Income</TableCell>
                      <TableCell align="right">Projected Expenses</TableCell>
                      <TableCell align="right">Net Cash Flow</TableCell>
                      <TableCell align="right">Balance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {predictions.map((pred, index) => (
                      <TableRow key={index}>
                        <TableCell>{pred.month}</TableCell>
                        <TableCell align="right">
                          <Typography color="success.main">
                            ${pred.income.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography color="error.main">
                            ${pred.expense.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography color={pred.net >= 0 ? 'success.main' : 'error.main'}>
                            ${pred.net.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            fontWeight="bold"
                            color={pred.balance >= 0 ? 'success.main' : 'error.main'}
                          >
                            ${pred.balance.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}
    </Box>
  );
}
