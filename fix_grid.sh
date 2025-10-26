#!/bin/bash

# Fix Businesses.tsx - replace Grid item with Grid (no item prop)
sed -i '' 's/<Grid item xs={12}>/<Grid xs={12}>/' src/pages/Businesses/Businesses.tsx

# Fix Categories.tsx - replace Grid item with Grid (no item prop) 
sed -i '' 's/<Grid item xs={12}>/<Grid xs={12}>/' src/pages/Categories/Categories.tsx

# Fix Calculator.tsx - replace all Grid item variations
sed -i '' 's/<Grid item xs={12} md={3}>/<Grid xs={12} md={3}>/' src/pages/Calculator/Calculator.tsx
sed -i '' 's/<Grid item xs={12} md={4}>/<Grid xs={12} md={4}>/' src/pages/Calculator/Calculator.tsx

echo "✅ Fixed Grid component issues"
