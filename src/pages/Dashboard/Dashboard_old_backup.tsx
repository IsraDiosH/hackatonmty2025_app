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
  Divider,
  Card,
  CardContent,
  Grid,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Avatar,
  Fade,
  Grow,
  Slide,
  Zoom,
  useTheme,
  alpha,
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
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as BalanceIcon,
  ShowChart,
  Timeline,
  Insights,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
      
      {/* Header minimalista */}
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

      {/* Sidebar */}
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

      {/* Main content */}
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
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Financial Manager
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Welcome, {user?.username || 'User'}
          </Typography>
          <Button color="inherit" onClick={handleLogout} sx={{ display: { xs: 'none', sm: 'block' } }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
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
  );
}

function DashboardHome() {
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: businessesData } = useGetBusinessesByUserQuery(user?.user_id || 0, {
    skip: !user?.user_id,
  });
  const businesses = businessesData?.data || [];

  const [selectedBusinessId, setSelectedBusinessId] = useState<number>(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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

    // Calcular tendencias (comparar con período anterior)
    const last30Days = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return transactionDate >= thirtyDaysAgo;
    });

    const previous30Days = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return transactionDate >= sixtyDaysAgo && transactionDate < thirtyDaysAgo;
    });

    const last30Income = last30Days
      .filter((t) => categories.find((c) => c.id === t.category_id)?.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const prev30Income = previous30Days
      .filter((t) => categories.find((c) => c.id === t.category_id)?.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const incomeTrend = prev30Income > 0 ? ((last30Income - prev30Income) / prev30Income) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      currentBalance,
      transactionCount: transactions.length,
      incomeCount: incomeTransactions.length,
      expenseCount: expenseTransactions.length,
      incomeTrend,
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
        net: data.income - data.expense,
      }))
      .filter((_, idx) => idx % 3 === 0);
  }, [transactions, categories]);

  const COLORS = ['#00C49F', '#FF6B6B', '#4ECDC4', '#FFD93D', '#A8E6CF', '#FF8B94'];
  const GRADIENT_COLORS = {
    income: ['#4ade80', '#22c55e'],
    expense: ['#f87171', '#ef4444'],
    balance: ['#60a5fa', '#3b82f6'],
    net: ['#a78bfa', '#8b5cf6'],
  };

  if (businesses.length === 0) {
    return (
      <Fade in timeout={800}>
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="700" sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            ¡Bienvenido a tu Dashboard Financiero! 🚀
          </Typography>
          <Alert 
            severity="info" 
            sx={{ 
              mt: 3, 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.02)' },
              }
            }}
          >
            Para comenzar tu viaje financiero, crea tu primer negocio desde el menú "Businesses". 
            ¡La IA generará escenarios automáticamente para ti!
          </Alert>
        </Box>
      </Fade>
    );
  }

  if (transactionsLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Cargando tus datos financieros...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={1000}>
      <Box>
        {/* Header con gradiente y selector de negocio */}
        <Box 
          sx={{ 
            mb: 4,
            p: 3,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight="700" sx={{ mb: 1 }}>
                Dashboard Financiero
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Visualiza y analiza tus finanzas en tiempo real
              </Typography>
            </Box>
            {businesses.length > 1 && (
              <Zoom in timeout={600}>
                <FormControl sx={{ 
                  minWidth: 250,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  borderRadius: 2,
                  backdropFilter: 'blur(10px)',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiSelect-select': { color: 'white' },
                  '& .MuiSvgIcon-root': { color: 'white' },
                }}>
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
              </Zoom>
            )}
          </Box>
        </Box>

        {/* Tarjetas de Métricas Principales con animaciones */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            {
              key: 'income',
              title: 'Ingresos Totales',
              value: metrics.totalIncome,
              count: metrics.incomeCount,
              icon: <TrendingUpIcon sx={{ fontSize: 48 }} />,
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              trend: metrics.incomeTrend,
            },
            {
              key: 'expense',
              title: 'Gastos Totales',
              value: metrics.totalExpenses,
              count: metrics.expenseCount,
              icon: <TrendingDownIcon sx={{ fontSize: 48 }} />,
              gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            },
            {
              key: 'net',
              title: 'Ganancia Neta',
              value: metrics.netProfit,
              icon: <MoneyIcon sx={{ fontSize: 48 }} />,
              gradient: metrics.netProfit >= 0 
                ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            },
            {
              key: 'balance',
              title: 'Balance Actual',
              value: metrics.currentBalance,
              count: metrics.transactionCount,
              icon: <BalanceIcon sx={{ fontSize: 48 }} />,
              gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            },
          ].map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={metric.key}>
              <Grow in timeout={600 + index * 200}>
                <Card
                  onMouseEnter={() => setHoveredCard(metric.key)}
                  onMouseLeave={() => setHoveredCard(null)}
                  sx={{
                    height: '100%',
                    background: metric.gradient,
                    color: 'white',
                    borderRadius: 4,
                    overflow: 'visible',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: hoveredCard === metric.key ? 'translateY(-8px) scale(1.02)' : 'none',
                    boxShadow: hoveredCard === metric.key
                      ? '0 20px 40px rgba(0,0,0,0.2)'
                      : '0 8px 32px rgba(0,0,0,0.1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 4,
                      padding: '2px',
                      background: hoveredCard === metric.key
                        ? 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0))'
                        : 'none',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    },
                  }}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                      <Box flex={1}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            opacity: 0.9, 
                            mb: 1,
                            fontWeight: 500,
                            letterSpacing: 0.5,
                          }}
                        >
                          {metric.title}
                        </Typography>
                        <Typography 
                          variant="h4" 
                          fontWeight="700"
                          sx={{
                            mb: 0.5,
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                          }}
                        >
                          ${metric.value.toLocaleString()}
                        </Typography>
                        {metric.count !== undefined && (
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            {metric.count} transacciones
                          </Typography>
                        )}
                        {metric.trend !== undefined && (
                          <Chip
                            label={`${metric.trend > 0 ? '+' : ''}${metric.trend.toFixed(1)}%`}
                            size="small"
                            sx={{
                              mt: 1,
                              bgcolor: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                      <Box 
                        sx={{ 
                          opacity: 0.2,
                          transform: hoveredCard === metric.key ? 'scale(1.1) rotate(10deg)' : 'none',
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        {metric.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Gráfico de Área - Flujo de Efectivo */}
          <Grid item xs={12} lg={8}>
            <Slide direction="up" in timeout={800}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(to bottom, rgba(102, 126, 234, 0.05), transparent)',
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <ShowChart sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="600">
                    Flujo de Efectivo - Últimos 30 Días
                  </Typography>
                </Box>
                {timelineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={timelineData}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f87171" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#888"
                        style={{ fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#888"
                        style={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: 12,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        }}
                        formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#22c55e"
                        strokeWidth={3}
                        fill="url(#colorIncome)"
                        name="Ingresos"
                      />
                      <Area
                        type="monotone"
                        dataKey="expense"
                        stroke="#ef4444"
                        strokeWidth={3}
                        fill="url(#colorExpense)"
                        name="Gastos"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <Box textAlign="center" py={8}>
                    <Typography color="text.secondary">
                      No hay datos en los últimos 30 días
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Slide>
          </Grid>

          {/* Gráfico de Dona - Distribución de Categorías */}
          <Grid item xs={12} lg={4}>
            <Slide direction="up" in timeout={900}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(to bottom, rgba(244, 114, 182, 0.05), transparent)',
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Insights sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6" fontWeight="600">
                    Categorías
                  </Typography>
                </Box>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                        fill="#8884d8"
                        dataKey="amount"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {categoryData.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: 12,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box textAlign="center" py={8}>
                    <Typography color="text.secondary">
                      No hay categorías
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Slide>
          </Grid>

          {/* Gráfico de Barras con Gradiente */}
          <Grid item xs={12}>
            <Slide direction="up" in timeout={1000}>
              <Paper 
                sx={{ 
                  p: 3,
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.05), transparent)',
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Timeline sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="h6" fontWeight="600">
                    Distribución por Categoría
                  </Typography>
                </Box>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#667eea" stopOpacity={1} />
                          <stop offset="100%" stopColor="#764ba2" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: 12,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="amount"
                        fill="url(#barGradient)"
                        name="Monto Total"
                        radius={[8, 8, 0, 0]}
                        animationBegin={0}
                        animationDuration={800}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box textAlign="center" py={8}>
                    <Typography color="text.secondary">
                      No hay datos para mostrar
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Slide>
          </Grid>

          {/* Tarjetas de Resumen de Negocios con diseño mejorado */}
          <Grid item xs={12}>
            <Slide direction="up" in timeout={1100}>
              <Paper 
                sx={{ 
                  p: 3,
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                }}
              >
                <Typography variant="h6" fontWeight="600" mb={3}>
                  📊 Resumen de Negocios
                </Typography>
                <Grid container spacing={3}>
                  {businesses.map((business, index) => {
                    const businessTransactions = transactions.filter((t) => t.business_id === business.id);
                    const businessIncome = businessTransactions
                      .filter((t) => categories.find((c) => c.id === t.category_id)?.type === 'income')
                      .reduce((sum, t) => sum + t.amount, 0);
                    const businessExpenses = businessTransactions
                      .filter((t) => categories.find((c) => c.id === t.category_id)?.type === 'expense')
                      .reduce((sum, t) => sum + t.amount, 0);
                    const businessBalance = business.initial_balance + businessIncome - businessExpenses;

                    return (
                      <Grid item xs={12} md={6} lg={4} key={business.id}>
                        <Grow in timeout={700 + index * 150}>
                          <Card
                            sx={{
                              borderRadius: 3,
                              overflow: 'hidden',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                              },
                            }}
                          >
                            <Box
                              sx={{
                                p: 2,
                                background: `linear-gradient(135deg, ${COLORS[index % COLORS.length]}20, ${COLORS[(index + 1) % COLORS.length]}20)`,
                                borderBottom: `3px solid ${COLORS[index % COLORS.length]}`,
                              }}
                            >
                              <Typography variant="h6" fontWeight="600">
                                {business.enterprise_name}
                              </Typography>
                              <Chip
                                label={business.business_type}
                                size="small"
                                sx={{
                                  mt: 1,
                                  bgcolor: COLORS[index % COLORS.length],
                                  color: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                            <CardContent>
                              <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="body2" color="text.secondary">
                                  Balance Inicial
                                </Typography>
                                <Typography variant="body2" fontWeight="600">
                                  ${business.initial_balance.toLocaleString()}
                                </Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="body2" sx={{ color: '#22c55e' }}>
                                  Ingresos
                                </Typography>
                                <Typography variant="body2" fontWeight="600" sx={{ color: '#22c55e' }}>
                                  +${businessIncome.toLocaleString()}
                                </Typography>
                              </Box>
                              <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography variant="body2" sx={{ color: '#ef4444' }}>
                                  Gastos
                                </Typography>
                                <Typography variant="body2" fontWeight="600" sx={{ color: '#ef4444' }}>
                                  -${businessExpenses.toLocaleString()}
                                </Typography>
                              </Box>
                              <Divider sx={{ my: 2 }} />
                              <Box 
                                display="flex" 
                                justifyContent="space-between"
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: businessBalance >= 0 ? alpha('#22c55e', 0.1) : alpha('#ef4444', 0.1),
                                }}
                              >
                                <Typography variant="body1" fontWeight="700">
                                  Balance Actual
                                </Typography>
                                <Typography
                                  variant="h6"
                                  fontWeight="700"
                                  sx={{ color: businessBalance >= 0 ? '#22c55e' : '#ef4444' }}
                                >
                                  ${businessBalance.toLocaleString()}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grow>
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </Slide>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}
