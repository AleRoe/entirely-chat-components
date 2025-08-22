# GitHub Packages Publishing Script
# Run this after setting your NODE_AUTH_TOKEN environment variable

Write-Host "🚀 Publishing @aleroe/react-chat-component to GitHub Packages..." -ForegroundColor Green

# Check if NODE_AUTH_TOKEN is set
if (-not $env:NODE_AUTH_TOKEN) {
    Write-Host "❌ ERROR: NODE_AUTH_TOKEN environment variable is not set!" -ForegroundColor Red
    Write-Host "Please set it with: `$env:NODE_AUTH_TOKEN='your_github_token_here'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ NODE_AUTH_TOKEN is set" -ForegroundColor Green

# Build the package
Write-Host "📦 Building package..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Publish to GitHub Packages
Write-Host "📤 Publishing to GitHub Packages..." -ForegroundColor Blue
npm publish

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Successfully published @aleroe/react-chat-component to GitHub Packages!" -ForegroundColor Green
    Write-Host "📦 Package URL: https://github.com/AleRoe/entirely-chat-components/packages" -ForegroundColor Cyan
} else {
    Write-Host "❌ Publishing failed" -ForegroundColor Red
    exit 1
}
