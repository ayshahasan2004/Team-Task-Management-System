# ===== Team Task Management System - Stop All Services =====
# Run from project root:  .\stop-all.ps1

foreach ($port in 8081, 8082, 4200) {
    Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
        ForEach-Object {
            Write-Output "Stopping process $($_.OwningProcess) on port $port"
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
}
Write-Output "All services stopped."
