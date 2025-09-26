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
exports.SuppliersController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const suppliers_service_1 = require("./suppliers.service");
let SuppliersController = class SuppliersController {
    suppliersService;
    constructor(suppliersService) {
        this.suppliersService = suppliersService;
    }
    async createSupplier(data) {
        return this.suppliersService.createSupplier(data.name, data.contactEmail, data.contactName, data.contactPhone);
    }
    async getSupplier(data) {
        return this.suppliersService.getSupplier(data.id);
    }
    async getAllSuppliers() {
        return this.suppliersService.getAllSuppliers();
    }
    async updateSupplier(data) {
        return this.suppliersService.updateSupplier(data.id, data.name, data.contactName, data.contactEmail, data.contactPhone);
    }
    async deleteSupplier(data) {
        return this.suppliersService.deleteSupplier(data.id);
    }
};
exports.SuppliersController = SuppliersController;
__decorate([
    (0, microservices_1.MessagePattern)('createSupplier'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "createSupplier", null);
__decorate([
    (0, microservices_1.MessagePattern)('getSupplier'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "getSupplier", null);
__decorate([
    (0, microservices_1.MessagePattern)('getAllSuppliers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "getAllSuppliers", null);
__decorate([
    (0, microservices_1.MessagePattern)('updateSupplier'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "updateSupplier", null);
__decorate([
    (0, microservices_1.MessagePattern)('deleteSupplier'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "deleteSupplier", null);
exports.SuppliersController = SuppliersController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [suppliers_service_1.SuppliersService])
], SuppliersController);
//# sourceMappingURL=suppliers.controller.js.map