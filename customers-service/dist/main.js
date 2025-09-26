"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const customers_module_1 = require("./customers/customers.module");
const microservices_1 = require("@nestjs/microservices");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(customers_module_1.CustomersModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: 'localhost',
            port: 3005,
        },
    });
    await app.listen();
    console.log('Customers Service is running on port 3005');
}
bootstrap();
//# sourceMappingURL=main.js.map