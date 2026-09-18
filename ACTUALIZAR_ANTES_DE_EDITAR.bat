@echo off
setlocal
cd /d "%~dp0"
echo.
echo === Maus Tier List: sincronizando con GitHub ===
git fetch origin
if errorlevel 1 goto :error
git pull --ff-only origin main
if errorlevel 1 goto :pull_error
echo.
echo OK: tu carpeta local esta al dia con origin/main.
echo Ya puedes copiar una nueva version o editar archivos.
pause
exit /b 0

:pull_error
echo.
echo NO SE HA FORZADO NADA.
echo Git no pudo hacer un fast-forward limpio. No uses Force Push.
echo Abre GitHub Desktop o pide ayuda antes de continuar.
pause
exit /b 1

:error
echo.
echo No se pudo conectar con origin. No se ha modificado el historial.
pause
exit /b 1
