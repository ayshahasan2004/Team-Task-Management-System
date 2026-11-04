# ===== Team Task Management System - Start All Services =====
# Run from project root:  .\start-all.ps1

$root = $PSScriptRoot

# --- Config (edit if needed) ---
$env:DB_PASSWORD  = 'Aysha@2026'
$env:JWT_SECRET   = 'taskflow-dev-secret-change-me-0123456789abcdef'
$AUTH_DIR  = Join-Path $root 'task-management-backend\auth-service'
$CORE_DIR  = Join-Path $root 'task-management-backend\core-service'
$FRONT_DIR = Join-Path $root 'task-flow'
$LOG_DIR   = Join-Path $root 'logs'

# --- Ensure logs folder exists ---
New-Item -ItemType Directory -Force -Path $LOG_DIR | Out-Null

# --- Kill anything already on our ports ---
foreach ($port in 8081, 8082, 4200) {
    Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
        ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}

# --- 1. Auth service (port 8081) ---
Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c","mvnw.cmd spring-boot:run > ..\..\logs\auth.log 2>&1" `
    -WorkingDirectory $AUTH_DIR -WindowStyle Hidden

# --- 2. Core service (port 8082) ---
Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c","mvnw.cmd spring-boot:run > ..\..\logs\core.log 2>&1" `
    -WorkingDirectory $CORE_DIR -WindowStyle Hidden

# --- 3. Angular frontend (port 4200) ---
Start-Process -FilePath "cmd.exe" `
    -ArgumentList "/c","npm start > ..\logs\frontend.log 2>&1" `
    -WorkingDirectory $FRONT_DIR -WindowStyle Hidden

Write-Output "Starting all services..."
Write-Output "  - Auth service  : http://localhost:8081  (log: logs\auth.log)"
Write-Output "  - Core service  : http://localhost:8082  (log: logs\core.log)"
Write-Output "  - Frontend      : http://localhost:4200  (log: logs\frontend.log)"
Write-Output ""
Write-Output "Wait ~30-60 seconds, then open http://localhost:4200"
