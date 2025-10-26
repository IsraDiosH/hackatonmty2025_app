#!/bin/bash

# Fix business API slice - remove unused params
sed -i '' 's/invalidatesTags: (result, error, { id })/invalidatesTags: (_result, _error, { id })/' src/features/business/businessApiSlice.ts
sed -i '' 's/invalidatesTags: (result, error, id)/invalidatesTags: (_result, _error, id)/' src/features/business/businessApiSlice.ts

# Fix category API slice
sed -i '' 's/invalidatesTags: (result, error, { id })/invalidatesTags: (_result, _error, { id })/' src/features/category/categoryApiSlice.ts
sed -i '' 's/invalidatesTags: (result, error, id)/invalidatesTags: (_result, _error, id)/' src/features/category/categoryApiSlice.ts

# Fix scenario API slice
sed -i '' 's/invalidatesTags: (result, error, { id })/invalidatesTags: (_result, _error, { id })/' src/features/scenario/scenarioApiSlice.ts
sed -i '' 's/invalidatesTags: (result, error, id)/invalidatesTags: (_result, _error, id)/' src/features/scenario/scenarioApiSlice.ts

# Fix transaction API slice
sed -i '' 's/invalidatesTags: (result, error, { id })/invalidatesTags: (_result, _error, { id })/' src/features/transaction/transactionApiSlice.ts
sed -i '' 's/invalidatesTags: (result, error, id)/invalidatesTags: (_result, _error, id)/' src/features/transaction/transactionApiSlice.ts

# Fix RootState imports
sed -i '' 's/import { RootState }/import type { RootState }/' src/pages/Businesses/Businesses.tsx
sed -i '' 's/import { RootState }/import type { RootState }/' src/pages/Calculator/Calculator.tsx
sed -i '' 's/import { RootState }/import type { RootState }/' src/pages/Categories/Categories.tsx

# Fix unused imports in Calculator
sed -i '' 's/import { Calculate, TrendingUp }/import { Calculate }/' src/pages/Calculator/Calculator.tsx
sed -i '' 's/, Button,/,/' src/pages/Calculator/Calculator.tsx
sed -i '' 's/, useEffect//' src/pages/Calculator/Calculator.tsx

echo "✅ Fixed all import and declaration issues"
