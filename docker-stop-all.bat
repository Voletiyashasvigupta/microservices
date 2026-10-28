@echo off
echo Stopping and removing Bank Microservice containers...
docker stop microservices-api-gateway microservices-account-service microservices-customer-service microservices-auth-service microservices-service-registry microservices-frontend 2>nul
docker rm microservices-api-gateway microservices-account-service microservices-customer-service microservices-auth-service microservices-service-registry microservices-frontend 2>nul
echo Done.
pause
