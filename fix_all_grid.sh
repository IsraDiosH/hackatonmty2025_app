#!/bin/bash

# Agregar import de Grid2 en todos los archivos
files=(
  "src/pages/Businesses/Businesses.tsx"
  "src/pages/Categories/Categories.tsx"
  "src/pages/Calculator/Calculator.tsx"
  "src/pages/Scenarios/Scenarios.tsx"
  "src/pages/Transactions/Transactions.tsx"
)

for file in "${files[@]}"; do
  # Reemplazar Grid por Grid2 en el import
  sed -i '' 's/Grid,/Grid2 as Grid,/' "$file"
done

# Fix Scenarios - agregar import de RootState como type
sed -i '' 's/import { RootState }/import type { RootState }/' src/pages/Scenarios/Scenarios.tsx

# Fix Calculator - agregar useEffect que fue removido accidentalmente
sed -i '' 's/import { useState, useMemo }/import { useState, useMemo, useEffect }/' src/pages/Calculator/Calculator.tsx

# Fix Calculator - remover Button no usado
sed -i '' '/^  Button,$/d' src/pages/Calculator/Calculator.tsx

echo "✅ Fixed all Grid and import issues"
