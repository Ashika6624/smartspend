$BackendDir = Join-Path $PSScriptRoot "backend"
Push-Location $BackendDir
try {
    & ".\mvnw.cmd" @args
}
finally {
    Pop-Location
}
