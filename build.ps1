$ErrorActionPreference = "Stop"

# Ensure build directory exists
New-Item -ItemType Directory -Force -Path "build" | Out-Null

# Locate Visual Studio installation via vswhere
$vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
if (-not (Test-Path $vswhere))
{
    throw "vswhere.exe not found. Ensure Visual Studio Build Tools are installed."
}

$vsPath = & $vswhere -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
if (-not $vsPath)
{
    throw "MSVC C++ x64 build tools not found."
}

$vcvars = Join-Path $vsPath "VC\Auxiliary\Build\vcvars64.bat"

Write-Host "Compiling src\tracker.c -> build\tracker.dll..." -ForegroundColor Cyan

# Run vcvars64.bat and cl.exe in the same cmd subshell
# /Fo puts .obj in build\, /Fe puts .dll/.lib/.exp in build\
cmd.exe /c "`"$vcvars`" >nul && cl.exe /nologo /O2 /W4 /LD src\tracker.c /Fo:build\ /Fe:build\tracker.dll"

if ($LASTEXITCODE -ne 0)
{
    throw "MSVC compilation failed with exit code $LASTEXITCODE"
}

Write-Host "Build succeeded: build\tracker.dll" -ForegroundColor Green
