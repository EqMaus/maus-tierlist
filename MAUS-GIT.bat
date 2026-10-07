@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"

if /I "%~1"=="sync" goto :sync
if /I "%~1"=="publish" goto :publish
if /I "%~1"=="status" goto :status

:menu
cls
echo ============================================================
echo                 MAUS TIER LIST - GIT SEGURO
echo ============================================================
echo.
echo  [1] Sincronizar con GitHub ANTES de instalar una actualización
echo  [2] Publicar cambios en GitHub
echo  [3] Ver estado del repositorio
echo  [0] Salir
echo.
set "choice="
set /p "choice=Elige una opción: "
if "%choice%"=="1" goto :sync
if "%choice%"=="2" goto :publish
if "%choice%"=="3" goto :status
if "%choice%"=="0" exit /b 0
goto :menu

:check_repo
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo.
  echo ERROR: Este archivo debe estar dentro de la carpeta del repositorio maus-tierlist.
  echo.
  pause
  exit /b 1
)

for /f "delims=" %%A in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set "BRANCH=%%A"
if /I not "%BRANCH%"=="main" (
  echo.
  echo ERROR: Estás en la rama "%BRANCH%".
  echo Cambia a main antes de continuar:
  echo.
  echo     git switch main
  echo.
  pause
  exit /b 1
)

git remote get-url origin >nul 2>&1
if errorlevel 1 (
  echo.
  echo ERROR: No existe el remoto "origin".
  echo.
  pause
  exit /b 1
)
exit /b 0

:sync
cls
echo ============================================================
echo              SINCRONIZAR CON GITHUB
echo ============================================================
echo.
call :check_repo
if errorlevel 1 exit /b 1

set "DIRTY="
for /f "delims=" %%A in ('git status --porcelain 2^>nul') do set "DIRTY=1"
if defined DIRTY (
  echo Hay cambios locales sin guardar.
  echo.
  echo Por seguridad NO voy a hacer pull ni tocar tus archivos.
  echo Publica o guarda esos cambios antes de sincronizar.
  echo.
  git status --short
  echo.
  pause
  exit /b 1
)

echo Consultando GitHub...
git fetch origin main
if errorlevel 1 (
  echo.
  echo ERROR: No se pudo consultar GitHub.
  echo No se ha modificado ningún archivo local.
  echo.
  pause
  exit /b 1
)

for /f "delims=" %%A in ('git rev-parse HEAD') do set "LOCAL_HEAD=%%A"
for /f "delims=" %%A in ('git rev-parse origin/main') do set "REMOTE_HEAD=%%A"

if "%LOCAL_HEAD%"=="%REMOTE_HEAD%" (
  echo.
  echo OK: Tu carpeta local ya está exactamente igual que GitHub.
  echo Ya puedes copiar encima la actualización nueva.
  echo.
  pause
  exit /b 0
)

git merge-base --is-ancestor HEAD origin/main >nul 2>&1
if not errorlevel 1 (
  echo GitHub tiene cambios más nuevos. Actualizando por fast-forward...
  git pull --ff-only origin main
  if errorlevel 1 (
    echo.
    echo ERROR: Git no pudo hacer un fast-forward limpio.
    echo No uses Force Push. Pide ayuda antes de continuar.
    echo.
    pause
    exit /b 1
  )
  echo.
  echo OK: Sincronización terminada.
  echo Tu carpeta local ya contiene los últimos cambios hechos desde el editor.
  echo Ya puedes copiar encima la actualización nueva.
  echo.
  pause
  exit /b 0
)

git merge-base --is-ancestor origin/main HEAD >nul 2>&1
if not errorlevel 1 (
  echo.
  echo ATENCIÓN: Tu PC tiene commits que todavía no están publicados en GitHub.
  echo No voy a sobrescribirlos.
  echo.
  echo Ejecuta PUBLICAR-CAMBIOS.bat para publicarlos primero.
  echo.
  pause
  exit /b 1
)

echo.
echo ERROR: La rama local y GitHub tienen historiales distintos.
echo No voy a hacer merge, reset ni Force Push automáticamente.
echo Tus archivos no han sido modificados.
echo Pide ayuda antes de continuar.
echo.
pause
exit /b 1

:publish
cls
echo ============================================================
echo                 PUBLICAR CAMBIOS
echo ============================================================
echo.
call :check_repo
if errorlevel 1 exit /b 1

echo Comprobando primero si GitHub tiene cambios nuevos...
git fetch origin main
if errorlevel 1 (
  echo.
  echo ERROR: No se pudo consultar GitHub.
  echo No se ha publicado ni modificado nada.
  echo.
  pause
  exit /b 1
)

for /f "delims=" %%A in ('git rev-parse HEAD') do set "LOCAL_HEAD=%%A"
for /f "delims=" %%A in ('git rev-parse origin/main') do set "REMOTE_HEAD=%%A"

if not "%LOCAL_HEAD%"=="%REMOTE_HEAD%" (
  git merge-base --is-ancestor HEAD origin/main >nul 2>&1
  if not errorlevel 1 (
    echo.
    echo BLOQUEADO POR SEGURIDAD:
    echo GitHub tiene commits más nuevos que tu carpeta local.
    echo.
    echo No voy a crear un commit encima de una base antigua.
    echo Tampoco voy a hacer merge ni Force Push.
    echo.
    echo Si todavía NO has copiado una actualización nueva, ejecuta:
    echo     SINCRONIZAR-ANTES-DE-ACTUALIZAR.bat
    echo.
    echo Si YA has copiado archivos nuevos, no hagas nada más y pide ayuda.
    echo Tus archivos actuales siguen intactos.
    echo.
    pause
    exit /b 1
  )

  git merge-base --is-ancestor origin/main HEAD >nul 2>&1
  if errorlevel 1 (
    echo.
    echo ERROR: Tu rama y GitHub han divergido.
    echo No voy a hacer Force Push ni resolverlo automáticamente.
    echo Tus archivos siguen intactos.
    echo.
    pause
    exit /b 1
  )
)

set "HAS_CHANGES="
for /f "delims=" %%A in ('git status --porcelain 2^>nul') do set "HAS_CHANGES=1"

if defined HAS_CHANGES (
  echo Cambios detectados:
  echo.
  git status --short
  echo.
  set "COMMIT_MSG="
  set /p "COMMIT_MSG=Nombre del commit (ej. 5.6.18 - nueva función): "
  if not defined COMMIT_MSG set "COMMIT_MSG=Actualización de maus-tierlist"

  echo.
  echo Preparando archivos...
  git add -A
  if errorlevel 1 (
    echo ERROR al preparar los archivos.
    pause
    exit /b 1
  )

  git commit -m "%COMMIT_MSG%"
  if errorlevel 1 (
    echo.
    echo ERROR: No se pudo crear el commit.
    echo.
    pause
    exit /b 1
  )
) else (
  echo No hay archivos modificados sin commit.
)

git rev-list --count origin/main..HEAD > "%TEMP%\maus_git_ahead.txt"
set /p "AHEAD="<"%TEMP%\maus_git_ahead.txt"
del "%TEMP%\maus_git_ahead.txt" >nul 2>&1

if "%AHEAD%"=="0" (
  echo.
  echo OK: No hay nada nuevo que publicar. GitHub ya está al día.
  echo.
  pause
  exit /b 0
)

echo.
echo Publicando %AHEAD% commit(s) por el remoto configurado...
git push origin main
if errorlevel 1 (
  echo.
  echo ERROR: GitHub rechazó el push.
  echo El commit LOCAL sigue guardado y no se ha perdido nada.
  echo No uses Force Push.
  echo.
  pause
  exit /b 1
)

echo.
echo ============================================================
echo OK: Cambios publicados correctamente en GitHub.
echo ============================================================
echo.
pause
exit /b 0

:status
cls
echo ============================================================
echo                ESTADO DEL REPOSITORIO
echo ============================================================
echo.
call :check_repo
if errorlevel 1 exit /b 1
git fetch origin main >nul 2>&1
echo Rama:
git branch --show-current
echo.
echo Estado:
git status
echo.
echo Últimos commits locales:
git log --oneline -5
echo.
echo Remoto:
git remote -v
echo.
pause
exit /b 0
