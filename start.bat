@echo off
echo ============================================
echo  Hospital Management System - Startup
echo ============================================
echo.

REM Check Java version (requires Java 17+)
for /f "tokens=3" %%g in ('java -version 2^>^&1 ^| findstr /i "version"') do (
  set JAVA_VER=%%g
)
echo Detected Java: %JAVA_VER%
echo.
echo NOTE: This project requires Java 17 or higher.
echo       Download from: https://adoptium.net/
echo       Java 8 will NOT work with Spring Boot 3.x
echo.

REM Prefer Maven wrapper if available
if exist "%~dp0backend\mvnw.cmd" (
    echo Using Maven Wrapper...
    cd /d "%~dp0backend"
    call mvnw.cmd spring-boot:run
    goto :end
)

REM Check if Maven is available
where mvn >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Maven not found in PATH.
    echo Install Maven from: https://maven.apache.org/download.cgi
    echo Or use: choco install maven
    echo.
    pause
    exit /b 1
)

echo Starting Spring Boot backend...
echo Frontend will be served at: http://localhost:8080
echo.
echo Demo Login:
echo   Admin:   admin@hms.com / Admin@123
echo   Doctor:  doctor@hms.com / Doctor@123
echo   Patient: patient@hms.com / Patient@123
echo.
echo Make sure MySQL is running on localhost:3306
echo.

cd /d "%~dp0backend"
mvn spring-boot:run

:end
pause
