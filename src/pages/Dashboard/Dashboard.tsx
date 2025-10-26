import { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  TrendingUp as ScenarioIcon,
  Receipt as TransactionIcon,
  Calculate as CalculatorIcon,
  Logout as LogoutIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { logout } from '@/features/auth/authSlice';
import type { RootState } from '@/app/store';
import { useGetBusinessesByUserQuery } from '@/features/business/businessApiSlice';
import { useGetCategoriesByBusinessQuery } from '@/features/category/categoryApiSlice';
import { useGetTransactionsByBusinessQuery } from '@/features/transaction/transactionApiSlice';
import BusinessesPage from '../Businesses/Businesses';
import CategoriesPage from '../Categories/Categories';
import ScenariosPage from '../Scenarios/Scenarios';
import TransactionsPage from '../Transactions/Transactions';
import CalculatorPage from '../Calculator/Calculator';

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Negocios', icon: <BusinessIcon />, path: '/dashboard/businesses' },
  { text: 'Categorías', icon: <CategoryIcon />, path: '/dashboard/categories' },
  { text: 'Escenarios', icon: <ScenarioIcon />, path: '/dashboard/scenarios' },
  { text: 'Transacciones', icon: <TransactionIcon />, path: '/dashboard/transactions' },
  { text: 'Calculadora', icon: <CalculatorIcon />, path: '/dashboard/calculator' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = window.location.pathname;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="700" sx={{ color: 'text.primary' }}>
          FinanceApp
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Gestión Financiera
        </Typography>
      </Box>
      
      <List sx={{ flex: 1, px: 2, py: 3 }}>
        {menuItems.map((item) => {
          const isActive = location === item.path || (item.path !== '/dashboard' && location.startsWith(item.path));
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  bgcolor: isActive ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: isActive ? 'primary.main' : 'text.secondary',
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            px: 2,
            '&:hover': {
              bgcolor: 'rgba(239, 68, 68, 0.08)',
              color: 'error.main',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Cerrar Sesión"
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Bienvenido de vuelta
            </Typography>
            <Typography variant="subtitle1" fontWeight="600" color="text.primary">
              {user?.username || 'Usuario'}
            </Typography>
          </Box>

          <Button
            onClick={handleLogout}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main',
                bgcolor: 'rgba(239, 68, 68, 0.08)',
              },
            }}
            startIcon={<LogoutIcon />}
          >
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="businesses" element={<BusinessesPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="scenarios" element={<ScenariosPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="calculator" element={<CalculatorPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

function DashboardHome() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: businessesData } = useGetBusinessesByUserQuery(user?.user_id || 0, {
    skip: !user?.user_id,
  });
  const businesses = businessesData?.data || [];

  const [selectedBusinessId, setSelectedBusinessId] = useState<number>(0);

  useEffect(() => {
    if (businesses.length > 0 && selectedBusinessId === 0) {
      setSelectedBusinessId(businesses[0].id);
    }
  }, [businesses, selectedBusinessId]);

  const { data: categoriesData } = useGetCategoriesByBusinessQuery(selectedBusinessId, {
    skip: !selectedBusinessId,
  });
  const { data: transactionsData, isLoading: transactionsLoading } =
    useGetTransactionsByBusinessQuery(selectedBusinessId, {
      skip: !selectedBusinessId,
    });

  const categories = categoriesData?.data || [];
  const transactions = transactionsData?.data || [];

  const metrics = useMemo(() => {
    const incomeTransactions = transactions.filter((t) => {
      const category = categories.find((c) => c.id === t.category_id);
      return category?.type === 'income';
    });

    const expenseTransactions = transactions.filter((t) => {
      const category = categories.find((c) => c.id === t.category_id);
      return category?.type === 'expense';
    });

    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    const selectedBusiness = businesses.find((b) => b.id === selectedBusinessId);
    const currentBalance = (selectedBusiness?.initial_balance || 0) + netProfit;

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      currentBalance,
      transactionCount: transactions.length,
      incomeCount: incomeTransactions.length,
      expenseCount: expenseTransactions.length,
    };
  }, [transactions, categories, businesses, selectedBusinessId]);

  const categoryData = useMemo(() => {
    const categoryTotals = new Map<string, { amount: number; type: string }>();

    transactions.forEach((t) => {
      const category = categories.find((c) => c.id === t.category_id);
      if (category) {
        const existing = categoryTotals.get(category.name) || { amount: 0, type: category.type };
        categoryTotals.set(category.name, {
          amount: existing.amount + t.amount,
          type: category.type,
        });
      }
    });

    return Array.from(categoryTotals.entries())
      .map(([name, data]) => ({
        name,
        amount: data.amount,
        type: data.type,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [transactions, categories]);

  const timelineData = useMemo(() => {
    const last30Days = new Map<string, { income: number; expense: number }>();
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      last30Days.set(dateKey, { income: 0, expense: 0 });
    }

    transactions.forEach((t) => {
      const dateKey = t.date.split('T')[0];
      if (last30Days.has(dateKey)) {
        const category = categories.find((c) => c.id === t.category_id);
        const data = last30Days.get(dateKey)!;
        if (category?.type === 'income') {
          data.income += t.amount;
        } else {
          data.expense += t.amount;
        }
      }
    });

    return Array.from(last30Days.entries())
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
        income: data.income,
        expense: data.expense,
      }))
      .filter((_, idx) => idx % 3 === 0);
  }, [transactions, categories]);

  if (businesses.length === 0) {
    return (
      <Box>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Bienvenido
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          Para comenzar, crea tu primer negocio desde el menú "Negocios".
        </Alert>
      </Box>
    );
  }

  if (transactionsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vista general de tu actividad financiera
          </Typography>
        </Box>
        
        {businesses.length > 1 && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Negocio</InputLabel>
            <Select
              value={selectedBusinessId}
              label="Negocio"
              onChange={(e) => setSelectedBusinessId(Number(e.target.value))}
            >
              {businesses.map((business) => (
                <MenuItem key={business.id} value={business.id}>
                  {business.enterprise_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4 
      }}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Ingresos Totales
                </Typography>
                <Typography variant="h5" fontWeight="700">
                  ${metrics.totalIncome.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {metrics.incomeCount} transacciones
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ color: 'success.main', fontSize: 28 }} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Gastos Totales
                </Typography>
                <Typography variant="h5" fontWeight="700">
                  ${metrics.totalExpenses.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {metrics.expenseCount} transacciones
                </Typography>
              </Box>
              <TrendingDownIcon sx={{ color: 'error.main', fontSize: 28 }} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Balance Neto
                </Typography>
                <Typography 
                  variant="h5" 
                  fontWeight="700"
                  sx={{ color: metrics.netProfit >= 0 ? 'success.main' : 'error.main' }}
                >
                  ${metrics.netProfit.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {metrics.netProfit >= 0 ? 'Positivo' : 'Negativo'}
                </Typography>
              </Box>
              <BalanceIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Balance Actual
                </Typography>
                <Typography variant="h5" fontWeight="700">
                  ${metrics.currentBalance.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {metrics.transactionCount} transacciones
                </Typography>
              </Box>
              <BalanceIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        gap: 3,
        mb: 3 
      }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Flujo de Efectivo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Últimos 30 días
          </Typography>
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" style={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis style={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip />
                <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#colorIncome)" name="Ingresos" />
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#colorExpense)" name="Gastos" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Box textAlign="center" py={8}>
              <Typography color="text.secondary">No hay datos disponibles</Typography>
            </Box>
          )}
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Categorías
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Distribución por categoría
          </Typography>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'income' ? '#10b981' : '#ef4444'}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box textAlign="center" py={8}>
              <Typography color="text.secondary">No hay datos disponibles</Typography>
            </Box>
          )}
        </Paper>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Top Categorías
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Principales categorías por monto
        </Typography>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" style={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis style={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.type === 'income' ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography color="text.secondary">No hay datos disponibles</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
