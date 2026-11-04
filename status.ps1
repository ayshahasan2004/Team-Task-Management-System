# ===== Team Task Management System - Status Check =====
# Run from project root:  .\status.ps1

$services = @(
    @{ Name = "Auth service"; Port = 8081 },
    @{ Name = "Core service"; Port = 8082 },
    @{ Name = "Frontend";     Port = 4200 }
)

foreach ($s in $services) {
    $conn = Get-NetTCPConnection -LocalPort $s.Port -State Listen -ErrorAction SilentlyContinue
    if ($conn) { Write-Output "$($s.Name) : RUNNING  (port $($s.Port))" }
    else       { Write-Output "$($s.Name) : STOPPED  (port $($s.Port))" }
}
