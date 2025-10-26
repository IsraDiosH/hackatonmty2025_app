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
  { text: 'Businesses', icon: <BusinessIcon />, path: '/dashboard/businesses' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/dashboard/categories' },
  { text: 'Scenarios', icon: <ScenarioIcon />, path: '/dashboard/scenarios' },
  { text: 'Transactions', icon: <TransactionIcon />, path: '/dashboard/transactions' },
  { text: 'Calculator', icon: <CalculatorIcon />, path: '/dashboard/calculator' },
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #4A6CF7 0%, #3A5BD6 100%)' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box
          component="img"
          src="/numio.png"
          alt="NUMIO"
          sx={{ height: 36, width: 'auto', display: 'block', mb: 0.5 }}
        />
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 1)' }}>
          Finance Manager
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
                  bgcolor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.2s',
                  backdropFilter: isActive ? 'blur(10px)' : 'none',
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: '#ffffff',
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

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            px: 2,
            color: '#ffffff',
            '&:hover': {
              bgcolor: 'rgba(239, 68, 68, 0.2)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: '#ffffff' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Log Out"
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
          bgcolor: '#ffffff',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: 'primary.main' }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>
              Welcome back
            </Typography>
            <Typography variant="subtitle1" fontWeight="700" sx={{ 
              color: 'text.primary',
              background: 'linear-gradient(135deg, #4A6CF7 0%, #42E2B8 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {user?.username || 'User'}
            </Typography>
          </Box>

          <Button
            onClick={handleLogout}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              color: 'text.secondary',
              borderRadius: 2,
              '&:hover': {
                color: 'error.main',
                bgcolor: 'rgba(239, 68, 68, 0.08)',
              },
            }}
            startIcon={<LogoutIcon />}
          >
            Logout
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
              boxShadow: '4px 0 24px rgba(74, 108, 247, 0.08)',
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
          bgcolor: 'background.default',
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
          Welcome
        </Typography>
        <Alert severity="info" sx={{ mt: 2 }}>
          To get started, create your first business from the "Businesses" menu.
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
            Overview of your financial activity
          </Typography>
        </Box>
        
        {businesses.length > 1 && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Business</InputLabel>
            <Select
              value={selectedBusinessId}
              label="Business"
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
        <Card sx={{ 
          background: 'linear-gradient(135deg, #42E2B8 0%, #32C79E 100%)',
          color: '#fff',
          border: 'none',
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }} gutterBottom>
                  Total Income
                </Typography>
                <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
                  ${metrics.totalIncome.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {metrics.incomeCount} transactions
                </Typography>
              </Box>
              <Box sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                borderRadius: 2, 
                p: 1.5,
                backdropFilter: 'blur(10px)',
              }}>
                <TrendingUpIcon sx={{ fontSize: 28 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#fff',
          border: 'none',
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }} gutterBottom>
                  Total Expenses
                </Typography>
                <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
                  ${metrics.totalExpenses.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {metrics.expenseCount} transactions
                </Typography>
              </Box>
              <Box sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                borderRadius: 2, 
                p: 1.5,
                backdropFilter: 'blur(10px)',
              }}>
                <TrendingDownIcon sx={{ fontSize: 28 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: metrics.netProfit >= 0 
            ? 'linear-gradient(135deg, #4A6CF7 0%, #3A5BD6 100%)'
            : 'linear-gradient(135deg, #F9D65C 0%, #E8C13F 100%)',
          color: '#fff',
          border: 'none',
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }} gutterBottom>
                  Net Profit
                </Typography>
                <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
                  ${metrics.netProfit.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {metrics.netProfit >= 0 ? 'Positive' : 'Negative'}
                </Typography>
              </Box>
              <Box sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                borderRadius: 2, 
                p: 1.5,
                backdropFilter: 'blur(10px)',
              }}>
                <BalanceIcon sx={{ fontSize: 28 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #1E1E1E 0%, #2d2d2d 100%)',
          color: '#fff',
          border: 'none',
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }} gutterBottom>
                  Current Balance
                </Typography>
                <Typography variant="h5" fontWeight="700" sx={{ mb: 0.5 }}>
                  ${metrics.currentBalance.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {metrics.transactionCount} transactions
                </Typography>
              </Box>
              <Box sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                borderRadius: 2, 
                p: 1.5,
                backdropFilter: 'blur(10px)',
              }}>
                <BalanceIcon sx={{ fontSize: 28 }} />
              </Box>
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
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(74, 108, 247, 0.08)' }}>
          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ color: 'text.primary' }}>
            Cash Flow
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Last 30 days
          </Typography>
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#42E2B8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#42E2B8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A6CF7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4A6CF7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" style={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis style={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip />
                <Area type="monotone" dataKey="income" stroke="#42E2B8" strokeWidth={3} fill="url(#colorIncome)" name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#4A6CF7" strokeWidth={3} fill="url(#colorExpense)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Box textAlign="center" py={8}>
              <Typography color="text.secondary">No data available</Typography>
            </Box>
          )}
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(74, 108, 247, 0.08)' }}>
          <Typography variant="h6" fontWeight="700" gutterBottom sx={{ color: 'text.primary' }}>
            Categories
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Distribution by category
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
                      fill={entry.type === 'income' ? '#42E2B8' : '#4A6CF7'}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box textAlign="center" py={8}>
              <Typography color="text.secondary">No data available</Typography>
            </Box>
          )}
        </Paper>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(74, 108, 247, 0.08)' }}>
        <Typography variant="h6" fontWeight="700" gutterBottom sx={{ color: 'text.primary' }}>
          Top Categories
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Top categories by amount
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
                  <Cell key={`cell-${index}`} fill={entry.type === 'income' ? '#42E2B8' : '#4A6CF7'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          ) : (
          <Box textAlign="center" py={8}>
            <Typography color="text.secondary">No data available</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
