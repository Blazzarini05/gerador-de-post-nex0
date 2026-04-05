#!/bin/bash
# Deploy script for Gerador VersaVisual to Vercel

echo "🚀 Deploying Gerador VersaVisual to Vercel..."

# Check if logged in
if ! vercel whoami >/dev/null 2>&1; then
    echo "❌ Not logged into Vercel. Please run: vercel login"
    exit 1
fi

# Deploy to production
vercel --prod --name gerador-versavisual

echo "✅ Deploy complete!"