# Script to setup and run Cloudflare Tunnel for local development
$ErrorActionPreference = "Stop"

$cloudflaredUrl = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
$exeName = "cloudflared.exe"
$port = 3001

Write-Host "Checking for $exeName..." -ForegroundColor Cyan

if (-not (Test-Path $exeName)) {
    Write-Host "$exeName not found. Downloading from GitHub..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri $cloudflaredUrl -OutFile $exeName
        Write-Host "Download complete." -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to download cloudflared. Please check your internet connection or download it manually from $cloudflaredUrl"
        exit 1
    }
}
else {
    Write-Host "$exeName already exists." -ForegroundColor Green
}

Write-Host "Starting Cloudflare Tunnel on port $port..." -ForegroundColor Cyan
Write-Host "Look for the URL ending in .trycloudflare.com below:" -ForegroundColor Magenta
Write-Host "---------------------------------------------------" -ForegroundColor Gray

# Start cloudflared
# We use Start-Process to run it in the current window so the user can see the output URL
& .\$exeName tunnel --url http://localhost:$port
