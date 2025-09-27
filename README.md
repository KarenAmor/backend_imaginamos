# Imaginamos Microservices Project

Este proyecto consiste en varios microservicios (`auth`, `billing`, `customers`, `inventory`, `suppliers`) y un **API Gateway** que centraliza todas las rutas.

## Requisitos

- Docker >= 24.x
- Docker Compose >= 2.x
- Node.js (solo si deseas correr local sin Docker)

---

## 🚀 Levantar el proyecto con Docker

1. Abrir terminal en la raíz del proyecto:

   ```bash
   cd C:\Users\krnmo\Documents\imaginamos
   usa la ruta de tu computadora
   ```

2. Construir y levantar todos los servicios:

   ```bash
   docker compose up -d --build
   ```

   > Esto inicia los microservicios y el API Gateway en paralelo.

3. Ver logs de la API Gateway:

   ```bash
   docker compose logs -f api-gateway
   ```

4. Verificar que los contenedores estén corriendo:

   ```bash
   docker ps
   ```

---

## ✅ Probar la API

* Health check del Gateway:

  ```bash
  curl http://localhost:3000/api/health
  ```

* Ejemplo en navegador/Postman:
  👉 [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🛑 Parar el proyecto

```bash
docker compose down
```

---

## ℹ️ Notas

* La **API Gateway** se conecta a los microservicios usando los nombres de servicio definidos en `docker-compose.yml` (`auth-service`, `billing-service`, etc.), evitando problemas de IP.
* Si cambias puertos en algún microservicio, asegúrate de actualizar también en el **GatewayModule**.