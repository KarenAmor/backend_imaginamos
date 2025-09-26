# Documentación de la API del Servicio de Facturación (Billing Service)

Este documento proporciona una visión general del Servicio de Facturación para la aplicación basada en microservicios. Detalla la estructura de la tabla `invoices`, la integración con el Servicio de Inventario, las políticas de Seguridad a Nivel de Fila (RLS) y las operaciones para crear, actualizar, consultar y eliminar facturas.

## Tabla de Contenidos

* [Visión General](#visión-general)
* [Estructura de la Tabla Invoices](#estructura-de-la-tabla-invoices)
* [Políticas de Seguridad a Nivel de Fila (RLS)](#políticas-de-seguridad-a-nivel-de-fila-rls)
* [Integración con el Servicio de Inventario](#integración-con-el-servicio-de-inventario)
* [Operaciones de Factura](#operaciones-de-factura)
* [Manejo de Errores](#manejo-de-errores)
* [Notas de Desarrollo](#notas-de-desarrollo)

## Visión General

El Servicio de Facturación es un microservicio basado en NestJS encargado de la gestión de facturas. Se comunica con una base de datos Supabase e interactúa con el Servicio de Inventario a través de un cliente de microservicio (`ClientProxy`) para actualizar el stock cuando se crean, actualizan o eliminan facturas.

## Estructura de la Tabla Invoices

La tabla `invoices` en Supabase almacena la información de facturación:

| Columna       | Tipo             | Descripción                                    | Restricciones               |
| ------------- | ---------------- | ---------------------------------------------- | --------------------------- |
| `id`          | SERIAL           | Identificador único de la factura              | Clave primaria              |
| `customer_id` | INTEGER          | ID del cliente                                 | Clave foránea a `customers` |
| `date`        | DATE             | Fecha de creación de la factura                | Default: CURRENT_DATE       |
| `total`       | NUMERIC(10,2)    | Total de la factura                            | Debe ser >= 0               |
| `status`      | `invoice_status` | Estado de la factura (`pending`, `paid`, etc.) | Default: 'pending'          |
| `created_at`  | TIMESTAMP        | Fecha de creación                              | Default: CURRENT_TIMESTAMP  |
| `updated_at`  | TIMESTAMP        | Fecha de última actualización                  | Default: CURRENT_TIMESTAMP  |
| `service_id`  | VARCHAR(50)      | Identificador del servicio                     | Default: 'billing_service'  |

La tabla tiene asociada `invoice_items`, que almacena los productos individuales y las cantidades incluidas en la factura.

## Políticas de Seguridad a Nivel de Fila (RLS)

RLS está habilitada en la tabla `invoices` y `invoice_items` para restringir el acceso al servicio de facturación:

* **Políticas Principales**:

```sql
-- Para SELECT en invoices
CREATE POLICY "Billing service can read invoices" ON invoices
  FOR SELECT
  TO authenticated
  USING (service_id = 'billing_service');

-- Para INSERT en invoices
CREATE POLICY "Billing service can insert invoices" ON invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (service_id = 'billing_service');

-- Para UPDATE en invoices
CREATE POLICY "Billing service can update invoices" ON invoices
  FOR UPDATE
  TO authenticated
  USING (service_id = 'billing_service')
  WITH CHECK (service_id = 'billing_service');

-- Para DELETE en invoices
CREATE POLICY "Billing service can delete invoices" ON invoices
  FOR DELETE
  TO authenticated
  USING (service_id = 'billing_service');

-- Policies para invoice_items
CREATE POLICY "Billing service can manage invoice items" ON invoice_items
  FOR ALL
  TO authenticated
  USING (service_id = 'billing_service')
  WITH CHECK (service_id = 'billing_service');
```

* **Propósito**: Permite solo al `Billing Service` (con `service_id = 'billing_service'`) realizar operaciones sobre facturas e ítems asociados. La clave de servicio de Supabase puede bypassar RLS si es necesario, pero las políticas aseguran integridad y aislamiento del microservicio.

## Integración con el Servicio de Inventario

* El Servicio de Facturación utiliza `inventoryClient` (`ClientProxy`) para actualizar el stock de productos:

  * **Al crear una factura:** Resta las cantidades facturadas del stock.
  * **Al actualizar una factura:** Ajusta el stock devolviendo las cantidades antiguas y restando las nuevas.
  * **Al eliminar una factura:** Devuelve las cantidades de los productos al stock.

## Operaciones de Factura

### Crear Factura

* **Entrada:** `customerId`, `invoiceItems` (array de `{product_id, quantity, unit_price}`), `total`.
* **Proceso:**

  1. Inserta la factura en la tabla `invoices`.
  2. Inserta los ítems asociados en la tabla `invoice_items`.
  3. Actualiza el stock a través del Servicio de Inventario.
* **Salida:** Factura creada con sus ítems.

### Consultar Factura

* **Entrada:** `invoiceId`
* **Salida:** Datos de la factura incluyendo `invoice_items`.

### Consultar Todas las Facturas

* **Salida:** Lista de todas las facturas con sus ítems asociados.

### Actualizar Factura

* **Entrada:** `invoiceId`, opcional: `customerId`, `total`, `status`, `invoiceItems`.
* **Proceso:**

  1. Actualiza la factura y los ítems asociados.
  2. Ajusta el stock a través del Servicio de Inventario según los cambios.
* **Salida:** Factura actualizada con sus ítems.

### Eliminar Factura

* **Entrada:** `invoiceId`
* **Proceso:**

  1. Elimina la factura de la base de datos.
  2. Devuelve el stock de todos los ítems asociados.
* **Salida:** Mensaje de éxito o error.

## Manejo de Errores

* Se generan errores descriptivos si falla la creación, actualización o eliminación de facturas.
* Los errores de Supabase se registran detalladamente para depuración.
* Estructura de respuesta estándar:

```json
{
  "success": false,
  "message": "Invoice with id 123 not found"
}
```

## Notas de Desarrollo

* **Requisitos Previos:** Node.js, CLI de NestJS, CLI de Supabase y dependencias (`@nestjs/microservices`, `@supabase/supabase-js`).
* **Configuración:**

  1. Instalar dependencias: `npm install`
  2. Configurar `.env` con `SUPABASE_URL` y `SUPABASE_KEY`.
  3. Iniciar el servicio: `npm run start:dev`
* **Pruebas:** Usar Postman para probar los endpoints de facturas con payloads JSON.
* **Depuración:** Los logs proporcionan detalles de las operaciones en la base de datos y actualizaciones de stock.
