@echo off
echo ========================================
echo   Upload to VPS - Ministerial Center
echo ========================================
echo.

set VPS_IP=72.61.41.94
set VPS_USER=root
set VPS_PASS=NDSw222arle#

echo VPS: %VPS_IP%
echo User: %VPS_USER%
echo.

echo [Step 1] Uploading deployment scripts...
scp deployment\setup-vps.sh %VPS_USER%@%VPS_IP%:/root/
scp deployment\deploy-backend.sh %VPS_USER%@%VPS_IP%:/root/
scp deployment\deploy-frontend.sh %VPS_USER%@%VPS_IP%:/root/

echo.
echo [Step 2] Uploading backend code...
scp -r backend %VPS_USER%@%VPS_IP%:/var/www/ministerial-command-center/

echo.
echo [Step 3] Building frontend...
call npm run build

echo.
echo [Step 4] Uploading frontend build...
scp -r dist %VPS_USER%@%VPS_IP%:/var/www/ministerial-command-center/

echo.
echo ========================================
echo   Upload Complete!
echo ========================================
echo.
echo Next steps:
echo 1. SSH to VPS: ssh root@72.61.41.94
echo 2. Run: chmod +x /root/*.sh
echo 3. Run: /root/setup-vps.sh
echo 4. Run: /root/deploy-backend.sh
echo 5. Run: /root/deploy-frontend.sh
echo 6. Test: http://72.61.41.94
echo.
pause
