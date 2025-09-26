# Documentación de la API del Servicio de Clientes (Customers Service)

Este documento proporciona una visión general del Servicio de Clientes para la aplicación basada en microservicios. Detalla la estructura de la tabla `customers`, las políticas de Seguridad a Nivel de Fila (RLS), las validaciones, el manejo de excepciones y su integración con el API Gateway. El servicio permite la gestión CRUD de clientes y se comunica vía TCP con el Gateway.

## Tabla de Contenidos

* [Visión General](#visión-general)
* [Estructura de la Tabla Customers](#estructura-de-la-tabla-customers)
* [Políticas de Seguridad a Nivel de Fila (RLS)](#políticas-de-seguridad-a-nivel-de-fila-rls)
* [Validaciones](#validaciones)
* [Manejo de Excepciones](#manejo-de-excepciones)
* [Integración con API Gateway](#integración-con-api-gateway)
* [Notas de Desarrollo](#notas-de-desarrollo)

## Visión General

El Servicio de Clientes es un microservicio basado en NestJS encargado de la gestión de clientes. Permite la creación, consulta, actualización y eliminación de clientes, almacenando la información en una base de datos Supabase. Se integra con el API Gateway mediante comunicación TCP en el puerto correspondiente.

## Estructura de la Tabla Customers

La tabla `customers` en Supabase almacena la información de los clientes con el siguiente esquema:

| Columna      | Tipo         | Descripción                | Restricciones                         |
| ------------ | ------------ | -------------------------- | ------------------------------------- |
| `id`         | SERIAL       | Identificador único        | Clave Primaria, Auto-incremental      |
| `name`       | VARCHAR(100) | Nombre del cliente         | NOT NULL                              |
| `email`      | VARCHAR(255) | Correo electrónico         | ÚNICO, Opcional                       |
| `phone`      | VARCHAR(20)  | Teléfono                   | Opcional                              |
| `address`    | TEXT         | Dirección                  | Opcional                              |
| `service_id` | VARCHAR(50)  | Identificador del servicio | Default 'customers_service', NOT NULL |
| `created_at` | TIMESTAMP    | Fecha de creación          | Default CURRENT_TIMESTAMP             |
| `updated_at` | TIMESTAMP    | Fecha de actualización     | Default CURRENT_TIMESTAMP             |

## Políticas de Seguridad a Nivel de Fila (RLS)

RLS está habilitada en la tabla `customers` para restringir el acceso al servicio de clientes:

* **Políticas Principales**:

```sql
-- Para SELECT
CREATE POLICY "Customers service can read customers" ON customers
  FOR SELECT
  TO authenticated
  USING (service_id = 'customers_service');

-- Para INSERT
CREATE POLICY "Customers service can insert customers" ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (service_id = 'customers_service');

-- Para UPDATE
CREATE POLICY "Customers service can update customers" ON customers
  FOR UPDATE
  TO authenticated
  USING (service_id = 'customers_service')
  WITH CHECK (service_id = 'customers_service');

-- Para DELETE
CREATE POLICY "Customers service can delete customers" ON customers
  FOR DELETE
  TO authenticated
  USING (service_id = 'customers_service');
```

* **Propósito**: Permite solo al `Customers Service` (con `service_id = 'customers_service'`) realizar operaciones sobre los datos de clientes.

## Validaciones

El servicio valida los datos de entrada antes de procesarlos:

* **Creación/Actualización**:

  * `name`: Obligatorio, máximo 100 caracteres.
  * `email`: Opcional, formato de correo válido si se proporciona.
  * `phone`: Opcional, máximo 20 caracteres.
  * `address`: Opcional.
* **Si falla la validación**: Lanza `RpcException` con status 400.
* **Ejemplo de Error**:

```json
{
  "statusCode": 400,
  "message": "Invalid customer data: email format is incorrect"
}
```

## Manejo de Excepciones

* **400 Bad Request**: Datos inválidos.
* **404 Not Found**: Cliente no existe.
* **409 Conflict**: Violación de unicidad (correo duplicado).
* **500 Internal Server Error**: Errores de Supabase o internos.
* **Respuestas**: El Gateway las traduce a HTTP con estructura uniforme.

## Integración con API Gateway

* **Transporte**: TCP.
* **Patrones de Mensaje**:

  * `createCustomer`: Crea un cliente.
  * `getCustomer`: Obtiene un cliente por ID.
  * `getAllCustomers`: Lista todos los clientes.
  * `updateCustomer`: Actualiza un cliente.
  * `deleteCustomer`: Elimina un cliente.
* **Flujo**:

  1. El Gateway recibe HTTP (e.g., `POST /api/customers/create`).
  2. Envía mensaje TCP con patrón y datos al servicio.
  3. El servicio procesa y responde con datos o error.
  4. El Gateway convierte la respuesta TCP a HTTP.

## Notas de Desarrollo

* **Requisitos**: Node.js, NestJS CLI, Supabase SDK.
* **Configuración**:

  1. Instala dependencias: `npm install`.
  2. Configura `.env` con `SUPABASE_URL` y `SUPABASE_KEY`.
  3. Inicia: `npm run start:dev`.
* **Pruebas**: Postman con Gateway.
* **Depuración**: Logs con `console.error` para errores.
* **Notas**: RLS asegura que solo el microservicio gestione los datos.
