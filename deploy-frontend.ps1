# Builds the Vite frontend and deploys it into the Spring Boot static folder so
# that http://localhost:8080 serves the latest UI (including the Login role selector).

param(
  [switch]$StartServer
)

$ErrorActionPreference = 'Stop'

Write-Host "Building frontend (Vite) ..." -ForegroundColor Cyan
pushd "c:\Users\BHAVANA\intelligent-production-system - Copy"
cmd /c "npm run build"
popd

$dist = "c:\Users\BHAVANA\intelligent-production-system - Copy\dist"
$static = "c:\Users\BHAVANA\intelligent-production-system - Copy\java-fullstack\src\main\resources\static"

if (-not (Test-Path $dist)) { throw "Frontend dist folder not found: $dist" }

Write-Host "Clearing old static assets..." -ForegroundColor Yellow
if (Test-Path $static) { Remove-Item -Recurse -Force -Path (Join-Path $static '*') }
else { New-Item -ItemType Directory -Path $static | Out-Null }

Write-Host "Copying new build to Spring Boot static folder..." -ForegroundColor Cyan
Copy-Item -Recurse -Force "$dist\*" "$static\"

Write-Host "✅ Frontend deployed to: $static" -ForegroundColor Green

if ($StartServer) {
  Write-Host "Starting Spring Boot server..." -ForegroundColor Cyan
  pushd "c:\Users\BHAVANA\intelligent-production-system - Copy\java-fullstack"
  mvn spring-boot:run
  popd
}
