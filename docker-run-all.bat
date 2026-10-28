@echo off
echo Creating Docker network 'bank-net' if it does not exist...
docker network create bank-net 2>nul

echo [1/5] Starting Service Registry container...
docker run -d --name microservices-service-registry --net bank-net -p 8761:8761 microservices-service-registry:latest

echo Waiting 10 seconds for Eureka Server to initialize...
timeout /t 10 /nobreak >nul

echo [2/5] Starting Auth Service container...
docker run -d --name microservices-auth-service --net bank-net -p 9898:9898 -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://service-registry:8761/eureka/ microservices-auth-service:latest

echo [3/5] Starting Customer Service container...
docker run -d --name microservices-customer-service --net bank-net -p 8081:8081 -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://service-registry:8761/eureka/ -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/bank_customer_db?createDatabaseIfNotExist=true microservices-customer-service:latest

echo [4/5] Starting Account Service container...
docker run -d --name microservices-account-service --net bank-net -p 8082:8082 -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://service-registry:8761/eureka/ -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/bank_account_db?createDatabaseIfNotExist=true microservices-account-service:latest

echo [5/5] Starting API Gateway container...
docker run -d --name microservices-api-gateway --net bank-net -p 8765:8765 -e EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://service-registry:8761/eureka/ microservices-api-gateway:latest

echo.
echo All microservice containers are running!
echo View running containers with: docker ps
pause
