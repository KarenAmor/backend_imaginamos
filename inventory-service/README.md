# Documentación de la API del Servicio de Inventario

Este documento proporciona una visión general del Servicio de Inventario (Inventory Service) para la aplicación basada en microservicios. Detalla la estructura de la tabla `products`, las políticas de Seguridad a Nivel de Fila (RLS), las validaciones, el manejo de excepciones y su integración con el API Gateway. El servicio permite la gestión CRUD de productos y se comunica vía TCP con el Gateway.

## Tabla de Contenidos
- [Visión General](#visión-general)
- [Estructura de la Tabla Products](#estructura-de-la-tabla-products)
- [Políticas de Seguridad a Nivel de Fila (RLS)](#políticas-de-seguridad-a-nivel-de-fila-rls)
- [Validaciones](#validaciones)
- [Manejo de Excepciones](#manejo-de-excepciones)
- [Integración con API Gateway](#integración-con-api-gateway)
- [Notas de Desarrollo](#notas-de-desarrollo)

## Visión General
El Servicio de Inventario es un microservicio basado en NestJS encargado de la gestión de productos. Permite la creación, consulta, actualización y eliminación de productos, almacenando la información en una base de datos Supabase. Se integra con el API Gateway mediante comunicación TCP en el puerto 3002 y actualiza el stock en colaboración con el servicio de facturación.

## Estructura de la Tabla Products
La tabla `products` en Supabase almacena la información de los productos con el siguiente esquema:

| Columna          | Tipo           | Descripción                  | Restricciones         |
|------------------|----------------|--------------------------------|-----------------------|
| `id`             | SERIAL         | Identificador único           | Clave Primaria, Auto-incremental |
| `name`           | VARCHAR(100)   | Nombre del producto           | NOT NULL              |
| `description`    | TEXT           | Descripción del producto      | Optional              |
| `price`          | DECIMAL(10,2)  | Precio del producto           | NOT NULL, >= 0        |
| `stock`          | INTEGER        | Cantidad en stock             | NOT NULL, >= 0        |
| `service_id`     | VARCHAR(50)    | Identificador del servicio    | Default 'inventory_service', NOT NULL |
| `created_at`     | TIMESTAMP      | Fecha de creación             | Default CURRENT_TIMESTAMP |
| `updated_at`     | TIMESTAMP      | Fecha de actualización        | Default CURRENT_TIMESTAMP |

- **Notas**: La columna `service_id` asegura el aislamiento por microservicio. El stock se actualiza automáticamente con el servicio de facturación.

## Políticas de Seguridad a Nivel de Fila (RLS)
RLS está habilitada en la tabla `products` para restringir el acceso al servicio de inventario:

- **Políticas Principales**:
  ```sql
  -- Para SELECT
  CREATE POLICY "Inventory service can read products" ON products
    FOR SELECT
    TO authenticated
    USING (service_id = 'inventory_service');

  -- Para INSERT
  CREATE POLICY "Inventory service can insert products" ON products
    FOR INSERT
    TO authenticated
    WITH CHECK (service_id = 'inventory_service');

  -- Para UPDATE
  CREATE POLICY "Inventory service can update products" ON products
    FOR UPDATE
    TO authenticated
    USING (service_id = 'inventory_service')
    WITH CHECK (service_id = 'inventory_service');

  -- Para DELETE
  CREATE POLICY "Inventory service can delete products" ON products
    FOR DELETE
    TO authenticated
    USING (service_id = 'inventory_service');
  ```
- **Propósito**: Permite solo al `Inventory Service` (con `service_id = 'inventory_service'`) realizar operaciones. La clave de servicio de Supabase bypassa RLS si es necesario, pero las políticas aseguran integridad.

## Validaciones
El servicio valida los datos de entrada antes de procesarlos:
- **Creación/Actualización**:
  - `name`: Obligatorio, longitud máxima 100 caracteres.
  - `price`: Obligatorio, mayor o igual a 0.
  - `stock`: Obligatorio, mayor o igual a 0.
  - `description`: Opcional.
- **Si falla la validación**: Lanza `RpcException` con status 400 (Bad Request).
- **Ejemplo de Error**:
  ```json
  {
    "statusCode": 400,
    "message": "Invalid product data: price must be greater than or equal to 0"
  }
  ```

## Manejo de Excepciones
El servicio usa `RpcException` de NestJS para errores consistentes:
- **400 Bad Request**: Datos inválidos (e.g., precio negativo).
- **404 Not Found**: Producto no existe al intentar obtenerlo o eliminarlo.
- **409 Conflict**: Violación de unicidad (si aplica).
- **500 Internal Server Error**: Errores de Supabase o internos.
- **Respuestas**: El Gateway las traduce a HTTP con estructura uniforme.

## Integración con API Gateway
El servicio se integra con el API Gateway como sigue:
- **Transporte**: TCP (puerto 3002).
- **Patrones de Mensaje**:
  - `createProduct`: Crea un producto.
  - `getProduct`: Obtiene un producto por ID.
  - `getAllProducts`: Lista todos los productos.
  - `updateProduct`: Actualiza un producto.
  - `deleteProduct`: Elimina un producto.
- **Flujo**:
  1. El Gateway recibe HTTP (e.g., `POST /api/inventory/create`).
  2. Envía mensaje TCP con patrón (e.g., `createProduct`) y datos al servicio.
  3. El servicio procesa y responde con datos o error.
  4. El Gateway convierte la respuesta TCP a HTTP.
- **Configuración en Gateway**: Cliente `INVENTORY_SERVICE` en `gateway.module.ts`.

## Notas de Desarrollo
- **Requisitos**: Node.js, NestJS CLI, Supabase SDK.
- **Configuración**:
  1. Instala dependencias: `npm install`.
  2. Configura `.env` con `SUPABASE_URL` y `SUPABASE_KEY` (usa clave de servicio).
  3. Inicia: `npm run start:dev`.
- **Pruebas**: Usa Postman con el Gateway (e.g., `GET http://localhost:3000/api/inventory`).
- **Depuración**: Logs con `console.error` para errores de Supabase.
- **Actualizaciones**: Integra con facturación para actualizar stock en ventas/devoluciones.

---