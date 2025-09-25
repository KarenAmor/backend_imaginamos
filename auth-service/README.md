# Documentación de la API del Servicio de Autenticación

Este documento proporciona una visión general del Servicio de Autenticación (Auth Service) para la aplicación basada en microservicios. Detalla la estructura de la tabla `users`, las políticas de Seguridad a Nivel de Fila (RLS), las validaciones de contraseñas, el manejo de excepciones, los mecanismos de encriptación y su integración con el API Gateway.

## Tabla de Contenidos
- [Visión General](#visión-general)
- [Estructura de la Tabla Users](#estructura-de-la-tabla-users)
- [Políticas de Seguridad a Nivel de Fila (RLS)](#políticas-de-seguridad-a-nivel-de-fila-rls)
- [Validaciones de Contraseña](#validaciones-de-contraseña)
- [Manejo de Excepciones](#manejo-de-excepciones)
- [Encriptación](#encriptación)
- [Integración con API Gateway](#integración-con-api-gateway)
- [Notas de Desarrollo](#notas-de-desarrollo)

## Visión General
El Servicio de Autenticación es un microservicio basado en NestJS encargado de la autenticación y registro de usuarios. Expone endpoints para registrar nuevos usuarios e iniciar sesión en cuentas existentes, comunicándose con una base de datos Supabase e integrándose con el API Gateway mediante TCP.

## Estructura de la Tabla Users
La tabla `users` en Supabase almacena los datos de autenticación de los usuarios con el siguiente esquema:

| Columna          | Tipo           | Descripción                  | Restricciones         |
|------------------|----------------|--------------------------------|-----------------------|
| `id`             | UUID           | Identificador único de cada usuario | Clave Primaria, Generada automáticamente |
| `email`          | VARCHAR        | Dirección de correo del usuario | ÚNICO, NO NULO        |
| `password_hash`  | TEXT           | Contraseña hasheada para seguridad | NO NULO               |
| `role`           | VARCHAR        | Rol del usuario (e.g., 'user') | Predeterminado 'user' |
| `service_id`     | VARCHAR(50)    | Identificador del servicio    | Predeterminado 'auth_service' |

- **Notas**: La columna `email` impone unicidad para evitar registros duplicados.

## Políticas de Seguridad a Nivel de Fila (RLS)
La RLS está habilitada en la tabla `users` para restringir el acceso según la identidad del servicio. La política actual es:

- **Nombre de la Política**: `Auth service can manage users`
- **Definición**:
  ```sql
  CREATE POLICY "Auth service can manage users" ON users
    FOR ALL
    TO authenticated
    USING (service_id = 'auth_service');
  ```
- **Propósito**: Permite al Servicio de Autenticación realizar todas las operaciones (INSERT, SELECT, UPDATE, DELETE) en la tabla `users` solo cuando el `service_id` es `'auth_service'`. Esto asegura que solo este servicio pueda gestionar los datos de los usuarios, alineándose con los requisitos de seguridad de microservicios.
- **Pruebas Temporales**: Durante el desarrollo, la RLS puede desactivarse con `ALTER TABLE users DISABLE ROW LEVEL SECURITY;` y reactivarse con `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`.

## Validaciones de Contraseña
El Servicio de Autenticación impone los siguientes requisitos para las contraseñas:
- Longitud mínima: 8 caracteres.
- Debe contener al menos una letra (mayúscula o minúscula).
- Debe contener al menos un número.
- Debe contener al menos un símbolo de la lista `!@#$%^&*`.

### Lógica de Validación
- Implementada usando la expresión regular: `/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/`.
- Si la contraseña no cumple con la validación, se lanza un `RpcException` con código de estado 400, devolviendo:
  ```json
  {
    "statusCode": 400,
    "message": "La contraseña debe tener al menos 8 caracteres y contener letras, números y símbolos (!@#$%^&*)."
  }
  ```

## Manejo de Excepciones
El Servicio de Autenticación utiliza `RpcException` de NestJS para el manejo de errores en un contexto de microservicios, asegurando respuestas de error consistentes enviadas vía TCP al API Gateway. Las excepciones comunes incluyen:
- **400 Solicitud Incorrecta**: Formato de contraseña inválido.
- **409 Conflicto**: Correo electrónico duplicado (violación de restricción única, código de error PostgreSQL 23505).
- **401 No Autorizado**: Credenciales de inicio de sesión inválidas.
- **500 Error Interno del Servidor**: Otros errores de Supabase o del servidor.

### Ejemplos de Respuestas
- Correo Duplicado:
  ```json
  {
    "statusCode": 409,
    "message": "El correo electrónico ya está registrado"
  }
  ```
- El filtro `AllExceptionsFilter` del API Gateway transforma estas respuestas en respuestas HTTP con la misma estructura.

## Encriptación
- **Hash de Contraseñas**: Las contraseñas se encriptan usando `bcrypt` con una ronda de sal de 10 antes de almacenarse en la columna `password_hash`.
- **Tokens JWT**: Tras un registro o inicio de sesión exitoso, se genera un JSON Web Token (JWT) usando `@nestjs/jwt`, firmado con una clave secreta de las variables de entorno. La carga del token incluye `sub` (ID de usuario) y `email`.

## Integración con API Gateway
El Servicio de Autenticación se integra con el API Gateway de la siguiente manera:
- **Transporte**: TCP (puerto 3001).
- **Comunicación**: El API Gateway actúa como cliente TCP, enviando payloads JSON al Servicio de Autenticación usando `ClientsModule` con el cliente `AUTH_SERVICE`.
- **Endpoints**:
  - `register`: Maneja solicitudes `POST /auth/register`, enrutadas vía el Gateway.
  - `login`: Maneja solicitudes `POST /auth/login`, enrutadas vía el Gateway.
- **Flujo**:
  1. El Gateway recibe solicitudes HTTP (e.g., `/auth/register`).
  2. Convierte la solicitud en un mensaje TCP y lo envía al Servicio de Autenticación.
  3. El Servicio de Autenticación procesa la solicitud, aplica validaciones y devuelve una respuesta (e.g., token o error).
  4. El Gateway traduce la respuesta TCP a una respuesta HTTP.
- **Configuración**: Definida en `gateway.module.ts` con:
  ```typescript
  ClientsModule.register([
    {
      name: 'AUTH_SERVICE',
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3001 },
    },
  ]),
  ```

## Notas de Desarrollo
- **Requisitos Previos**: Node.js, CLI de NestJS, CLI de Supabase y las dependencias requeridas (`@nestjs/microservices`, `@supabase/supabase-js`, etc.).
- **Configuración**:
  1. Instala las dependencias: `npm install`.
  2. Configura `.env` con `SUPABASE_URL` y `SUPABASE_KEY`.
  3. Inicia el Servicio de Autenticación: `npm run start:dev`.
  4. Inicia el API Gateway: `npm run start:dev` en el directorio del gateway.
- **Pruebas**: Usa Postman para probar los endpoints con payloads JSON (e.g., `{ "email": "user@example.com", "password": "Abc123!@" }`).
- **Depuración**: Revisa los logs de `console.log` para rastrear flujos de validación y errores.