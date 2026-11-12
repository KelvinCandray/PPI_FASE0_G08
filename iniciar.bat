@echo off
title Iniciando PoC Grupo 08 - Docker Cluster
echo ===================================================
echo   Levantando servicios en Docker (Nginx, Nodes, Redis)
echo ===================================================
echo.

cd /d "%~dp0"
docker-compose up -d --remove-orphans

echo.
echo ===================================================
echo   Servidores listos. Abriendo navegador...
echo ===================================================
timeout /t 3 >nul
start http://localhost/

pause