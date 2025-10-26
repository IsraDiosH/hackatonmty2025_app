#!/bin/bash

# Revertir cambios de Grid2 y usar Grid sin xs/md props (Grid container/spacing solo)
files=(
  "src/pages/Businesses/Businesses.tsx"
  "src/pages/Categories/Categories.tsx"
  "src/pages/Scenarios/Scenarios.tsx"
  "src/pages/Transactions/Transactions.tsx"
)

for file in "${files[@]}"; do
  # Revertir Grid2 a Grid normal
  sed -i '' 's/Grid2 as Grid/Grid/' "$file"
  # Remover prop item de todos los Grid
  sed -i '' 's/<Grid item /<Grid /' "$file"
  # Agregar Box al import si no existe
  if ! grep -q "import.*Box" "$file"; then
    sed -i '' 's/import {/import {\n  Box,/' "$file"
  fi
done

# Fix Calculator - CartesianGrid
sed -i '' 's/CartesianGrid2 as Grid/CartesianGrid/' src/pages/Calculator/Calculator.tsx

echo "✅ Reverted to simple Grid + Box approach"
