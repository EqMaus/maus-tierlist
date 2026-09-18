@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
echo.
echo === Maus Tier List: publicacion segura ===

git status --short
set /p MSG=Mensaje del commit [actualizacion web]: 
if "!MSG!"=="" set "MSG=actualizacion web"

git add -A
git commit -m "!MSG!"
if errorlevel 1 (
  echo.
  echo No se creo ningun commit. Puede que no haya cambios.
  git status
  pause
  exit /b 1
)

echo.
echo Comprobando cambios remotos antes de subir...
git fetch origin
if errorlevel 1 goto :error

git rebase origin/main
if errorlevel 1 goto :conflict

git push origin main
if errorlevel 1 goto :error

echo.
echo OK: publicado sin Force Push.
git status
pause
exit /b 0

:conflict
echo.
echo HAY UN CONFLICTO DURANTE EL REBASE.
echo No uses Force Push. Resuelve el conflicto y despues ejecuta:
echo   git rebase --continue
echo   git push origin main
pause
exit /b 1

:error
echo.
echo La publicacion no se completo. No se ha usado Force Push.
pause
exit /b 1
