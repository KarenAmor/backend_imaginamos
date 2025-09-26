"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const suppliers_module_1 = require("./suppliers/suppliers.module");
const microservices_1 = require("@nestjs/microservices");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(suppliers_module_1.SuppliersModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: 'localhost',
            port: 3003,
        },
    });
    await app.listen();
    console.log('Suppliers Service is running on port 3003');
}
bootstrap();
//# sourceMappingURL=main.js.map