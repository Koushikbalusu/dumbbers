#!/bin/bash

# Create .env.local file with backend URL
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:5000" > .env.local

echo "✅ Environment file created successfully!"
echo "📁 Created: .env.local"
echo "🔗 Backend URL: http://localhost:5000"
echo ""
echo "🚀 Now restart your Next.js development server:"
echo "   npm run dev"
