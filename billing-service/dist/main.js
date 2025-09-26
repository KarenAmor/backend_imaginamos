"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const billing_module_1 = require("./billing/billing.module");
const microservices_1 = require("@nestjs/microservices");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(billing_module_1.BillingModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: 'localhost',
            port: 3004,
        },
    });
    await app.listen();
    console.log('Billing Service is running on port 3004');
}
bootstrap();
//# sourceMappingURL=main.js.map