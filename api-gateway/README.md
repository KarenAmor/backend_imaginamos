# Documentación de la API Gateway

Este documento proporciona una visión general de la API Gateway para la aplicación basada en microservicios. Detalla su propósito, estructura, configuración, manejo de rutas, integración con microservicios (como el Auth Service), manejo de excepciones y notas de desarrollo.

## Tabla de Contenidos
- [Visión General](#visión-general)
- [Estructura y Configuración](#estructura-y-configuración)
- [Manejo de Rutas](#manejo-de-rutas)
- [Integración con Microservicios](#integración-con-microservicios)
- [Manejo de Excepciones](#manejo-de-excepciones)
- [Despliegue y Ejecución](#despliegue-y-ejecución)
- [Notas de Desarrollo](#notas-de-desarrollo)

## Visión General
La API Gateway es un microservicio basado en NestJS que actúa como punto de entrada único para las solicitudes HTTP de la aplicación. Su función principal es enrutar las solicitudes a los microservicios adecuados (como el Auth Service) mediante TCP, transformar las respuestas y manejar excepciones de forma consistente. Está diseñada para proporcionar una interfaz unificada y escalable para los clientes.

## Estructura y Configuración
La API Gateway se estructura con los siguientes componentes principales:

- **Módulo Principal**: `gateway.module.ts`, donde se configuran los clientes para los microservicios.
- **Servicio**: `gateway.service.ts`, que gestiona la comunicación con los microservicios.
- **Controlador**: `gateway.controller.ts`, que define las rutas HTTP y delega a los servicios.
- **Filtro de Excepciones**: `all-exceptions.filter.ts`, que transforma excepciones en respuestas HTTP uniformes.

### Configuración
- **Puerto**: Escucha en `http://localhost:3000`.
- **Clientes TCP**: Configurados en `gateway.module.ts` para conectarse a microservicios:
  ```typescript
  ClientsModule.register([
    {
      name: 'AUTH_SERVICE',
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3001 },
    },
  ]),
  ```
- **Dependencias**: Incluye `@nestjs/microservices`, `@nestjs/common`, y otras bibliotecas de NestJS.

## Manejo de Rutas
La API Gateway expone las siguientes rutas HTTP, que se enrutan a los microservicios correspondientes:

- **POST /auth/register**:
  - Descripción: Registra un nuevo usuario enviando los datos al Auth Service.
  - Cuerpo de solicitud: `{ "email": "string", "password": "string" }`.
  - Respuesta exitosa: `{ "access_token": "string" }`.
  - Errores posibles: 400 (contraseña inválida), 409 (email duplicado), 500 (error interno).
- **POST /auth/login**:
  - Descripción: Inicia sesión de un usuario existente enviando los datos al Auth Service.
  - Cuerpo de solicitud: `{ "email": "string", "password": "string" }`.
  - Respuesta exitosa: `{ "access_token": "string" }`.
  - Errores posibles: 401 (credenciales inválidas), 500 (error interno).

## Integración con Microservicios
La API Gateway se integra con microservicios mediante el siguiente flujo:
1. **Recepción**: Recibe solicitudes HTTP en rutas definidas (e.g., `/auth/register`).
2. **Conversión**: Convierte la solicitud HTTP en un mensaje TCP y lo envía al microservicio correspondiente (e.g., Auth Service en el puerto 3001).
3. **Procesamiento**: El microservicio procesa la solicitud y devuelve una respuesta (éxito o error).
4. **Traducción**: La Gateway transforma la respuesta TCP en una respuesta HTTP y la envía al cliente.
- **Ejemplo de Integración con Auth Service**:
  - El cliente `AUTH_SERVICE` en `gateway.service.ts` usa `this.client.send(pattern, data).toPromise()` para comunicarse con el Auth Service.
  - Los patrones de mensaje (e.g., `'register'`, `'login'`) coinciden con los `@MessagePattern` del Auth Service.

## Manejo de Excepciones
La API Gateway utiliza un filtro global `AllExceptionsFilter` para manejar excepciones de manera consistente:
- **Tipos de Excepciones**:
  - `RpcException`: Errores provenientes de microservicios (e.g., 400, 409, 401).
  - `HttpException`: Errores HTTP estándar.
  - `Error`: Errores genéricos de JavaScript.
- **Respuesta Estándar**:
  ```json
  {
    "statusCode": 500,
    "message": "Error interno del servidor"
  }
  ```
  - En desarrollo (`NODE_ENV = 'development'`), incluye el mensaje específico de la excepción.
- **Ejemplo**:
  - Para un `RpcException` con `{ statusCode: 409, message: "Email already registered" }`, la respuesta será:
    ```json
    {
      "statusCode": 409,
      "message": "Email already registered"
    }
    ```

## Despliegue y Ejecución
- **Requisitos Previos**: Node.js, NestJS CLI, y las dependencias listadas en `package.json`.
- **Configuración**:
  1. Instala las dependencias: `npm install`.
  2. Asegúrate de que los microservicios (e.g., Auth Service) estén corriendo (puerto 3001).
  3. Inicia la API Gateway: `npm run start:dev`.
- **Pruebas**: Usa herramientas como Postman para enviar solicitudes HTTP a `http://localhost:3000/auth/register` o `/auth/login`.

## Notas de Desarrollo
- **Depuración**: Revisa los logs de `console.log` en `gateway.service.ts` para rastrear la comunicación con microservicios.
- **Escalabilidad**: Agrega más clientes en `gateway.module.ts` para integrar otros microservicios (e.g., Inventory Service).
- **Seguridad**: Considera agregar autenticación JWT en el Gateway para proteger las rutas en producción.
- **Actualizaciones**: Asegúrate de que las versiones de `@nestjs/microservices` y otras dependencias sean compatibles.

---