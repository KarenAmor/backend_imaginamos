"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const customers_service_1 = require("./customers.service");
let CustomersController = class CustomersController {
    customersService;
    constructor(customersService) {
        this.customersService = customersService;
    }
    async createCustomer(data) {
        return this.customersService.createCustomer(data.name, data.email, data.phone, data.address);
    }
    async getCustomer(data) {
        return this.customersService.getCustomer(data.id);
    }
    async getAllCustomers() {
        return this.customersService.getAllCustomers();
    }
    async updateCustomer(data) {
        return this.customersService.updateCustomer(data.id, data.name, data.email, data.phone, data.address);
    }
    async deleteCustomer(data) {
        return this.customersService.deleteCustomer(data.id);
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, microservices_1.MessagePattern)('createCustomer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "createCustomer", null);
__decorate([
    (0, microservices_1.MessagePattern)('getCustomer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomer", null);
__decorate([
    (0, microservices_1.MessagePattern)('getAllCustomers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getAllCustomers", null);
__decorate([
    (0, microservices_1.MessagePattern)('updateCustomer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateCustomer", null);
__decorate([
    (0, microservices_1.MessagePattern)('deleteCustomer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "deleteCustomer", null);
exports.CustomersController = CustomersController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map