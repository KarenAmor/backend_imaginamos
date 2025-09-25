"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const inventory_module_1 = require("./inventory/inventory.module");
const microservices_1 = require("@nestjs/microservices");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(inventory_module_1.InventoryModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: 'localhost',
            port: 3002,
        },
    });
    await app.listen();
    console.log('Inventory Service is running on port 3002');
}
bootstrap();
//# sourceMappingURL=main.js.map