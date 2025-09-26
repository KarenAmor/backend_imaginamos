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
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const billing_service_1 = require("./billing.service");
let BillingController = class BillingController {
    billingService;
    constructor(billingService) {
        this.billingService = billingService;
    }
    async createInvoice(data) {
        return this.billingService.createInvoice(data.customerId, data.invoiceItems, data.total);
    }
    async getInvoice(data) {
        return this.billingService.getInvoice(data.id);
    }
    async getAllInvoices() {
        return this.billingService.getAllInvoices();
    }
    async updateInvoice(data) {
        return this.billingService.updateInvoice(data.id, data.customerId, data.total, data.status, data.invoiceItems);
    }
    async deleteInvoice(data) {
        return this.billingService.deleteInvoice(data.id);
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, microservices_1.MessagePattern)('createInvoice'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createInvoice", null);
__decorate([
    (0, microservices_1.MessagePattern)('getInvoice'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getInvoice", null);
__decorate([
    (0, microservices_1.MessagePattern)('getAllInvoices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "getAllInvoices", null);
__decorate([
    (0, microservices_1.MessagePattern)('updateInvoice'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "updateInvoice", null);
__decorate([
    (0, microservices_1.MessagePattern)('deleteInvoice'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "deleteInvoice", null);
exports.BillingController = BillingController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [billing_service_1.BillingService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map