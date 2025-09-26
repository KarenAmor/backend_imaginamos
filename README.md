# Imaginamos Microservices Project

Este proyecto consiste en varios microservicios (`auth`, `billing`, `customers`, `inventory`, `suppliers`) y un **API Gateway** para centralizar las rutas.

## Requisitos

* Docker >= 24.x
* Docker Compose >= 2.x
* Node.js (solo si quieres correr local sin Docker)

## Levantar el proyecto con Docker

1. Abrir terminal en la raíz del proyecto (`C:\Users\krnmo\Documents\imaginamos`).
2. Levantar los microservicios primero:

```bash
docker-compose up -d auth-service billing-service customers-service inventory-service suppliers-service
```

3. Levantar la API Gateway:

```bash
docker-compose up -d api-gateway
```

> Nota: la API Gateway usa los nombres de los servicios (`auth-service`, `billing-service`, etc.) para conectarse, evitando problemas de IP.

4. Verificar los logs de la API Gateway:

```bash
docker-compose logs -f api-gateway
```

5. Acceder a la API (ejemplo endpoint de health check):

```
GET http://localhost:3000/api/health
```

## Parar el proyecto

```bash
docker-compose down
```