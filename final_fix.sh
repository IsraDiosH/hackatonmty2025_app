#!/bin/bash

# Fix double Grid2 replacement
sed -i '' 's/Grid2 as Grid2 as Grid/Grid2 as Grid/' src/pages/Businesses/Businesses.tsx
sed -i '' 's/Grid2 as Grid2 as Grid/Grid2 as Grid/' src/pages/Calculator/Calculator.tsx
sed -i '' 's/Grid2 as Grid2 as Grid/Grid2 as Grid/' src/pages/Categories/Categories.tsx
sed -i '' 's/Grid2 as Grid2 as Grid/Grid2 as Grid/' src/pages/Scenarios/Scenarios.tsx
sed -i '' 's/Grid2 as Grid2 as Grid/Grid2 as Grid/' src/pages/Transactions/Transactions.tsx

# Fix CartesianGrid2 in Calculator (from recharts, debe quedar CartesianGrid)
sed -i '' 's/CartesianGrid2 as Grid2 as Grid/CartesianGrid/' src/pages/Calculator/Calculator.tsx

echo "✅ Final fixes applied"
