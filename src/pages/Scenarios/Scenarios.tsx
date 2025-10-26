import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Card,
  CardContent,
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
import { Add, Edit, Delete, AutoAwesome } from '@mui/icons-material';
import { RootState } from '@/app/store';
import { useGetBusinessesByUserQuery } from '@/features/business/businessApiSlice';
import {
  useGetScenariosByBusinessQuery,
  useCreateScenarioMutation,
  useUpdateScenarioMutation,
  useDeleteScenarioMutation,
} from '@/features/scenario/scenarioApiSlice';
import type { Scenario } from '@/types';

export default function ScenariosPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: businessesData } = useGetBusinessesByUserQuery(user?.user_id || 0, {
    skip: !user?.user_id
  });
  const businesses = businessesData?.data || [];

  const [selectedBusinessId, setSelectedBusinessId] = useState<number>(0);

  // Actualizar el negocio seleccionado cuando se carguen los negocios
  useEffect(() => {
    if (businesses.length > 0 && selectedBusinessId === 0) {
      setSelectedBusinessId(businesses[0].id);
    }
  }, [businesses, selectedBusinessId]);

  const { data: scenariosData, isLoading, error } = useGetScenariosByBusinessQuery(
    selectedBusinessId,
    { skip: !selectedBusinessId }
  );
  const [createScenario] = useCreateScenarioMutation();
  const [updateScenario] = useUpdateScenarioMutation();
  const [deleteScenario] = useDeleteScenarioMutation();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    income_multiplier: '',
    expense_multiplier: '',
    payment_delay_days: '',
  });
  const [formError, setFormError] = useState('');

  const handleOpen = (scenario?: Scenario) => {
    if (scenario) {
      setEditMode(true);
      setSelectedScenario(scenario);
      setFormData({
        name: scenario.name,
        income_multiplier: scenario.income_multiplier.toString(),
        expense_multiplier: scenario.expense_multiplier.toString(),
        payment_delay_days: scenario.payment_delay_days.toString(),
      });
    } else {
      setEditMode(false);
      setSelectedScenario(null);
      setFormData({
        name: '',
        income_multiplier: '1.0',
        expense_multiplier: '1.0',
        payment_delay_days: '0',
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

    if (!formData.name) {
      setFormError('Scenario name is required');
      return;
    }

    if (!selectedBusinessId) {
      setFormError('Please select a business first');
      return;
    }

    const incomeMultiplier = parseFloat(formData.income_multiplier);
    const expenseMultiplier = parseFloat(formData.expense_multiplier);
    const paymentDelayDays = parseInt(formData.payment_delay_days);

    if (isNaN(incomeMultiplier) || isNaN(expenseMultiplier) || isNaN(paymentDelayDays)) {
      setFormError('All multipliers and delay must be valid numbers');
      return;
    }

    try {
      if (editMode && selectedScenario) {
        await updateScenario({
          id: selectedScenario.id,
          name: formData.name,
          income_multiplier: incomeMultiplier,
          expense_multiplier: expenseMultiplier,
          payment_delay_days: paymentDelayDays,
        }).unwrap();
      } else {
        await createScenario({
          business_id: selectedBusinessId,
          name: formData.name,
          income_multiplier: incomeMultiplier,
          expense_multiplier: expenseMultiplier,
          payment_delay_days: paymentDelayDays,
        }).unwrap();
      }
      handleClose();
    } catch (err: any) {
      setFormError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      try {
        await deleteScenario(id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete scenario');
      }
    }
  };

  if (businesses.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1" color="text.secondary" align="center">
            Please create a business first to manage scenarios.
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

  const scenarios = scenariosData?.data || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Financial Scenarios</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Scenario
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load scenarios
        </Alert>
      )}

      {scenarios.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center">
              <AutoAwesome sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No scenarios found. AI-generated scenarios appear automatically when you create a business!
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Scenario Name</TableCell>
                <TableCell align="center">Income Multiplier</TableCell>
                <TableCell align="center">Expense Multiplier</TableCell>
                <TableCell align="center">Payment Delay (days)</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scenarios.map((scenario) => (
                <TableRow key={scenario.id}>
                  <TableCell>{scenario.name}</TableCell>
                  <TableCell align="center">{scenario.income_multiplier}x</TableCell>
                  <TableCell align="center">{scenario.expense_multiplier}x</TableCell>
                  <TableCell align="center">{scenario.payment_delay_days}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleOpen(scenario)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(scenario.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Scenario' : 'Create New Scenario'}</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Scenario Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Income Multiplier"
                type="number"
                inputProps={{ step: 0.1 }}
                value={formData.income_multiplier}
                onChange={(e) =>
                  setFormData({ ...formData, income_multiplier: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Expense Multiplier"
                type="number"
                inputProps={{ step: 0.1 }}
                value={formData.expense_multiplier}
                onChange={(e) =>
                  setFormData({ ...formData, expense_multiplier: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Payment Delay (days)"
                type="number"
                value={formData.payment_delay_days}
                onChange={(e) =>
                  setFormData({ ...formData, payment_delay_days: e.target.value })
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
