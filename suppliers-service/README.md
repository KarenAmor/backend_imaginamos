# Documentación de la API del Servicio de Proveedores (Suppliers Service)

Este documento proporciona una visión general del Servicio de Proveedores para la aplicación basada en microservicios. Describe la estructura de la tabla `suppliers`, las políticas de Seguridad a Nivel de Fila (RLS) y las operaciones disponibles para la gestión de proveedores.

## Tabla de Contenidos

* [Visión General](#visión-general)
* [Estructura de la Tabla Suppliers](#estructura-de-la-tabla-suppliers)
* [Políticas de Seguridad a Nivel de Fila (RLS)](#políticas-de-seguridad-a-nivel-de-fila-rls)
* [Operaciones del Servicio](#operaciones-del-servicio)
* [Manejo de Errores](#manejo-de-errores)
* [Notas de Desarrollo](#notas-de-desarrollo)

## Visión General

El Servicio de Proveedores es un microservicio basado en NestJS encargado de gestionar la información de los proveedores. Permite crear, consultar, actualizar y eliminar proveedores en la base de datos Supabase.

## Estructura de la Tabla Suppliers

La tabla `suppliers` almacena información de los proveedores:

| Columna         | Tipo         | Descripción                       | Restricciones                |
| --------------- | ------------ | --------------------------------- | ---------------------------- |
| `id`            | SERIAL       | Identificador único del proveedor | Clave primaria               |
| `name`          | VARCHAR(100) | Nombre del proveedor              | No nulo                      |
| `contact_name`  | VARCHAR(100) | Nombre de contacto del proveedor  | Puede ser nulo               |
| `contact_email` | VARCHAR(255) | Correo electrónico de contacto    | Puede ser nulo               |
| `contact_phone` | VARCHAR(20)  | Teléfono de contacto              | Puede ser nulo               |
| `address`       | TEXT         | Dirección del proveedor           | Puede ser nulo               |
| `created_at`    | TIMESTAMP    | Fecha de creación                 | Default: CURRENT_TIMESTAMP   |
| `updated_at`    | TIMESTAMP    | Fecha de última actualización     | Default: CURRENT_TIMESTAMP   |
| `service_id`    | VARCHAR(50)  | Identificador del servicio        | Default: 'suppliers_service' |

### Notas

* `service_id` asegura que solo este servicio gestione los datos de proveedores.

## Políticas de Seguridad a Nivel de Fila (RLS)

RLS está habilitada en la tabla `suppliers` para restringir el acceso al servicio de proveedores:

* **Políticas Principales**:

```sql
-- Para SELECT
CREATE POLICY "Suppliers service can read suppliers" ON suppliers
  FOR SELECT
  TO authenticated
  USING (service_id = 'suppliers_service');

-- Para INSERT
CREATE POLICY "Suppliers service can insert suppliers" ON suppliers
  FOR INSERT
  TO authenticated
  WITH CHECK (service_id = 'suppliers_service');

-- Para UPDATE
CREATE POLICY "Suppliers service can update suppliers" ON suppliers
  FOR UPDATE
  TO authenticated
  USING (service_id = 'suppliers_service')
  WITH CHECK (service_id = 'suppliers_service');

-- Para DELETE
CREATE POLICY "Suppliers service can delete suppliers" ON suppliers
  FOR DELETE
  TO authenticated
  USING (service_id = 'suppliers_service');
```

* **Propósito**: Permite solo al `Suppliers Service` (con `service_id = 'suppliers_service'`) realizar operaciones sobre proveedores. La clave de servicio de Supabase puede bypassar RLS si es necesario, pero las políticas aseguran integridad y aislamiento del microservicio.

## Operaciones del Servicio

### Crear Proveedor

* **Entrada:** `name`, `contactName`, `contactEmail`, `contactPhone`, `address`.
* **Proceso:** Inserta un nuevo proveedor en la tabla `suppliers`.
* **Salida:** Datos del proveedor creado.

### Consultar Proveedor

* **Entrada:** `id` del proveedor.
* **Salida:** Datos del proveedor o mensaje de error si no se encuentra.

### Consultar Todos los Proveedores

* **Salida:** Lista completa de proveedores almacenados.

### Actualizar Proveedor

* **Entrada:** `id` del proveedor y campos a actualizar (`name`, `contactName`, `contactEmail`, `contactPhone`, `address`).
* **Salida:** Proveedor actualizado o mensaje de error si no se encuentra.

### Eliminar Proveedor

* **Entrada:** `id` del proveedor.
* **Salida:** Mensaje de éxito o error si no se encuentra.

## Manejo de Errores

* Si falla alguna operación, se devuelve un mensaje descriptivo con `success: false`.
* Ejemplo de respuesta cuando no se encuentra un proveedor:

```json
{
  "success": false,
  "message": "Supplier with id 123 not found"
}
```

## Notas de Desarrollo

* **Requisitos Previos:** Node.js, CLI de NestJS, CLI de Supabase y dependencias (`@supabase/supabase-js`).
* **Configuración:**

  1. Instalar dependencias: `npm install`
  2. Configurar `.env` con `SUPABASE_URL` y `SUPABASE_KEY`.
  3. Iniciar el servicio: `npm run start:dev`
* **Pruebas:** Usar Postman para probar los endpoints con payloads JSON, por ejemplo:

```json
{
  "name": "Proveedor ABC",
  "contactName": "Juan Pérez",
  "contactEmail": "juan@example.com",
  "contactPhone": "3001234567",
  "address": "Calle 123, Bogotá"
}
```

* **Depuración:** Los logs muestran la información de las operaciones realizadas en la base de datos y posibles errores.
