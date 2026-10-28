@echo off
cd /d "%~dp0\bank-microservices-react\backend"
echo [1/5] Building microservices-service-registry image...
cd service-registry
docker build -t microservices-service-registry:latest .

echo [2/5] Building microservices-api-gateway image...
cd ..\api-gateway
docker build -t microservices-api-gateway:latest .

echo [3/5] Building microservices-auth-service image...
cd ..\auth-service
docker build -t microservices-auth-service:latest .

echo [4/5] Building microservices-customer-service image...
cd ..\customer-service
docker build -t microservices-customer-service:latest .

echo [5/5] Building microservices-account-service image...
cd ..\account-service
docker build -t microservices-account-service:latest .

echo.
echo All Docker images built successfully with microservices-* tags!
pause
