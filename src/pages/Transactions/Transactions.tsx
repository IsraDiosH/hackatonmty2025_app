import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  IconButton,
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
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, TrendingUp, TrendingDown } from '@mui/icons-material';
import type { RootState } from '@/app/store';
import { useGetBusinessesByUserQuery } from '@/features/business/businessApiSlice';
import { useGetCategoriesByBusinessQuery } from '@/features/category/categoryApiSlice';
import {
  useGetTransactionsByBusinessQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from '@/features/transaction/transactionApiSlice';
import type { Transaction } from '@/types';

export default function TransactionsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: businessesData } = useGetBusinessesByUserQuery(user?.user_id || 0, {
    skip: !user?.user_id
  });
  const businesses = businessesData?.data || [];

  const [selectedBusinessId, setSelectedBusinessId] = useState<number>(0);

  // Update the selected business when businesses are loaded
  useEffect(() => {
    if (businesses.length > 0 && selectedBusinessId === 0) {
      setSelectedBusinessId(businesses[0].id);
    }
  }, [businesses, selectedBusinessId]);

  const { data: categoriesData } = useGetCategoriesByBusinessQuery(selectedBusinessId, {
    skip: !selectedBusinessId,
  });
  const { data: transactionsData, isLoading, error } = useGetTransactionsByBusinessQuery(
    selectedBusinessId,
    { skip: !selectedBusinessId }
  );

  const [createTransaction] = useCreateTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [formError, setFormError] = useState('');

  const categories = categoriesData?.data || [];
  const transactions = transactionsData?.data || [];

  const handleOpen = (transaction?: Transaction) => {
    if (transaction) {
      setEditMode(true);
      setSelectedTransaction(transaction);
      setFormData({
        category_id: transaction.category_id.toString(),
        amount: transaction.amount.toString(),
        date: transaction.date.split('T')[0],
        description: transaction.description || '',
      });
    } else {
      setEditMode(false);
      setSelectedTransaction(null);
      setFormData({
        category_id: categories[0]?.id.toString() || '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
    setFormError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormError('');
  };

  const handleSubmit = async () => {
    setFormError('');

    if (!formData.category_id || !formData.amount) {
      setFormError('Category and amount are required');
      return;
    }

    if (!selectedBusinessId) {
      setFormError('Please select a business first');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) {
      setFormError('Amount must be a valid number');
      return;
    }

    try {
      if (editMode && selectedTransaction) {
        await updateTransaction({
          id: selectedTransaction.id,
          category_id: parseInt(formData.category_id),
          amount,
          date: formData.date,
          description: formData.description,
        }).unwrap();
      } else {
        await createTransaction({
          business_id: selectedBusinessId,
          category_id: parseInt(formData.category_id),
          amount,
          date: formData.date,
          description: formData.description,
        }).unwrap();
      }
      handleClose();
    } catch (err: any) {
      setFormError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete transaction');
      }
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getCategoryType = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.type || 'income';
  };

  const totalIncome = transactions
    .filter((t) => getCategoryType(t.category_id) === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => getCategoryType(t.category_id) === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  if (businesses.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary" align="center">
            Please create a business first to manage transactions.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Transactions</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Transaction
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl fullWidth>
            <InputLabel>Select Business</InputLabel>
            <Select
              value={selectedBusinessId}
              label="Select Business"
              onChange={(e) => setSelectedBusinessId(Number(e.target.value))}
            >
              {businesses.map((business) => (
                <MenuItem key={business.id} value={business.id}>
                  {business.enterprise_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Income
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    ${totalIncome.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUp color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Expenses
                  </Typography>
                  <Typography variant="h5" color="error.main">
                    ${totalExpense.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingDown color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Balance
                  </Typography>
                  <Typography
                    variant="h5"
                    color={balance >= 0 ? 'success.main' : 'error.main'}
                  >
                    ${balance.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load transactions
        </Alert>
      )}

      {transactions.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              No transactions found. Start tracking your financial movements!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => {
                const categoryType = getCategoryType(transaction.category_id);
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getCategoryName(transaction.category_id)}</TableCell>
                    <TableCell>{transaction.description || '-'}</TableCell>
                    <TableCell align="right">
                      <Typography
                        color={categoryType === 'income' ? 'success.main' : 'error.main'}
                      >
                        {categoryType === 'income' ? '+' : '-'}$
                        {transaction.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={categoryType}
                        color={categoryType === 'income' ? 'success' : 'primary'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpen(transaction)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Edit Transaction' : 'Create New Transaction'}
        </DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category_id}
                  label="Category"
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name} ({category.type})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
