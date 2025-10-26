import { useState } from 'react';
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
  Grid,
  IconButton,
  Paper,
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
import { Add, Edit, Delete } from '@mui/icons-material';
import { RootState } from '@/app/store';
import {
  useGetBusinessesByUserQuery,
  useCreateBusinessMutation,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
} from '@/features/business/businessApiSlice';
import type { Business } from '@/types';

export default function BusinessesPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: businessesData, isLoading, error } = useGetBusinessesByUserQuery(user?.user_id || 0);
  const [createBusiness] = useCreateBusinessMutation();
  const [updateBusiness] = useUpdateBusinessMutation();
  const [deleteBusiness] = useDeleteBusinessMutation();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [formData, setFormData] = useState({
    enterprise_name: '',
    business_type: '',
    initial_balance: '',
  });
  const [formError, setFormError] = useState('');

  const handleOpen = (business?: Business) => {
    if (business) {
      setEditMode(true);
      setSelectedBusiness(business);
      setFormData({
        enterprise_name: business.enterprise_name,
        business_type: business.business_type,
        initial_balance: business.initial_balance.toString(),
      });
    } else {
      setEditMode(false);
      setSelectedBusiness(null);
      setFormData({
        enterprise_name: '',
        business_type: '',
        initial_balance: '',
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

    if (!formData.enterprise_name || !formData.business_type || !formData.initial_balance) {
      setFormError('All fields are required');
      return;
    }

    const balance = parseFloat(formData.initial_balance);
    if (isNaN(balance)) {
      setFormError('Initial balance must be a valid number');
      return;
    }

    try {
      if (editMode && selectedBusiness) {
        await updateBusiness({
          id: selectedBusiness.id,
          enterprise_name: formData.enterprise_name,
          business_type: formData.business_type,
          initial_balance: balance,
        }).unwrap();
      } else {
        await createBusiness({
          user_id: user?.user_id || 0,
          enterprise_name: formData.enterprise_name,
          business_type: formData.business_type,
          initial_balance: balance,
        }).unwrap();
      }
      handleClose();
    } catch (err: any) {
      setFormError(err?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      try {
        await deleteBusiness(id).unwrap();
      } catch (err: any) {
        alert(err?.data?.message || 'Failed to delete business');
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const businesses = businessesData?.data || [];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Businesses</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Business
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load businesses
        </Alert>
      )}

      {businesses.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              No businesses found. Create your first business to get started!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Enterprise Name</TableCell>
                <TableCell>Business Type</TableCell>
                <TableCell align="right">Initial Balance</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {businesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell>{business.enterprise_name}</TableCell>
                  <TableCell>{business.business_type}</TableCell>
                  <TableCell align="right">
                    ${business.initial_balance.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleOpen(business)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(business.id)}
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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Business' : 'Create New Business'}</DialogTitle>
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
                label="Enterprise Name"
                value={formData.enterprise_name}
                onChange={(e) =>
                  setFormData({ ...formData, enterprise_name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Type"
                value={formData.business_type}
                onChange={(e) =>
                  setFormData({ ...formData, business_type: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Initial Balance"
                type="number"
                value={formData.initial_balance}
                onChange={(e) =>
                  setFormData({ ...formData, initial_balance: e.target.value })
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
