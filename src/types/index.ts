// ========== USER & AUTH ==========
export interface User {
  id: number;
  user_id: number; // Para compatibilidad con las queries
  username: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
    expires_in: string;
  };
}

// ========== BUSINESS ==========
export interface Business {
  id: number;
  enterprise_name: string;
  user_id: number;
  business_type: string;
  initial_balance: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBusinessRequest {
  enterprise_name: string;
  user_id: number;
  business_type: string;
  initial_balance: number;
}

export interface UpdateBusinessRequest extends Partial<CreateBusinessRequest> {
  id: number;
}

// ========== CATEGORY ==========
export interface Category {
  id: number;
  business_id: number;
  name: string;
  type: 'income' | 'expense';
  is_default?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryRequest {
  business_id: number;
  name: string;
  type: 'income' | 'expense';
  is_default?: boolean;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: number;
}

// ========== SCENARIO ==========
export interface Scenario {
  id: number;
  business_id: number;
  name: string;
  income_multiplier: number;
  expense_multiplier: number;
  payment_delay_days: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateScenarioRequest {
  business_id: number;
  name: string;
  income_multiplier: number;
  expense_multiplier: number;
  payment_delay_days: number;
}

export interface UpdateScenarioRequest extends Partial<CreateScenarioRequest> {
  id: number;
}

// ========== TRANSACTION ==========
export interface Transaction {
  id: number;
  business_id: number;
  category_id: number;
  amount: number;
  description?: string;
  date: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransactionRequest {
  business_id: number;
  category_id: number;
  amount: number;
  description?: string;
  date?: string;
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {
  id: number;
}

// ========== API RESPONSE ==========
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

// ========== PREDICTION ==========
export interface MonthlyPrediction {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface PredictionResult {
  scenario: Scenario;
  predictions: MonthlyPrediction[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    finalBalance: number;
  };
}
