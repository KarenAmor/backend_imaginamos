"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = __importStar(require("dotenv"));
const microservices_1 = require("@nestjs/microservices");
const common_2 = require("@nestjs/common");
dotenv.config();
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in .env file');
}
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
let BillingService = class BillingService {
    inventoryClient;
    constructor(inventoryClient) {
        this.inventoryClient = inventoryClient;
    }
    async createInvoice(customerId, invoiceItems, total) {
        console.log('Processing createInvoice in BillingService:', { customerId, total, invoiceItems });
        try {
            const { data: invoiceData, error: invoiceError } = await supabase
                .from('invoices')
                .insert({
                customer_id: customerId,
                total,
                service_id: 'billing_service',
            })
                .select();
            if (invoiceError) {
                console.error('Invoice insertion error:', {
                    message: invoiceError.message,
                    details: invoiceError.details,
                    hint: invoiceError.hint,
                    code: invoiceError.code,
                });
                throw new Error(`Failed to create invoice: ${invoiceError.message}`);
            }
            const invoice = invoiceData[0];
            const itemsData = invoiceItems.map(item => ({
                invoice_id: invoice.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
            }));
            const { error: itemsError } = await supabase.from('invoice_items').insert(itemsData);
            if (itemsError) {
                await supabase.from('invoices').delete().eq('id', invoice.id);
                console.error('Invoice items insertion error:', {
                    message: itemsError.message,
                    details: itemsError.details,
                    hint: itemsError.hint,
                    code: itemsError.code,
                });
                throw new Error(`Failed to create invoice items: ${itemsError.message}`);
            }
            await this.inventoryClient.send('updateStock', {
                action: 'subtract',
                products: invoiceItems.map(item => ({ id: item.product_id, quantity: item.quantity })),
            }).toPromise();
            console.log('Invoice created successfully:', invoice);
            return { ...invoice, items: invoiceItems };
        }
        catch (error) {
            console.error('Unexpected error in createInvoice:', {
                message: error.message || 'Unknown error',
                stack: error.stack || 'No stack trace',
                name: error.name,
            });
            throw error;
        }
    }
    async getInvoice(id) {
        const { data: invoice, error: invoiceError } = await supabase
            .from('invoices')
            .select('*, invoice_items(*)')
            .eq('id', id)
            .single();
        if (invoiceError)
            throw new Error(`Invoice not found: ${invoiceError.message}`);
        return invoice;
    }
    async getAllInvoices() {
        const { data, error } = await supabase
            .from('invoices')
            .select('*, invoice_items(*)');
        if (error)
            throw new Error(`Failed to retrieve invoices: ${error.message}`);
        return data;
    }
    async updateInvoice(id, customerId, total, status, invoiceItems) {
        const { data: oldInvoice, error: fetchError } = await supabase
            .from('invoices')
            .select('*, invoice_items(*)')
            .eq('id', id)
            .single();
        if (fetchError)
            throw new Error(`Failed to fetch invoice: ${fetchError.message}`);
        const updateData = { customer_id: customerId, total, status, service_id: 'billing_service' };
        const { data: updatedInvoice, error: updateError } = await supabase
            .from('invoices')
            .update(updateData)
            .eq('id', id)
            .select();
        if (updateError)
            throw new Error(`Failed to update invoice: ${updateError.message}`);
        const invoice = updatedInvoice[0];
        if (invoiceItems) {
            await supabase.from('invoice_items').delete().eq('invoice_id', id);
            const itemsData = invoiceItems.map(item => ({
                invoice_id: id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
            }));
            const { error: itemsError } = await supabase.from('invoice_items').insert(itemsData);
            if (itemsError)
                throw new Error(`Failed to update invoice items: ${itemsError.message}`);
            if (oldInvoice.invoice_items) {
                await this.inventoryClient.send('updateStock', {
                    action: 'add',
                    products: oldInvoice.invoice_items.map(item => ({ id: item.product_id, quantity: item.quantity })),
                }).toPromise();
            }
            await this.inventoryClient.send('updateStock', {
                action: 'subtract',
                products: invoiceItems.map(item => ({ id: item.product_id, quantity: item.quantity })),
            }).toPromise();
        }
        return { ...invoice, items: invoiceItems || oldInvoice.invoice_items };
    }
    async deleteInvoice(id) {
        const { data: invoice, error: fetchError } = await supabase
            .from('invoices')
            .select('*, invoice_items(*)')
            .eq('id', id)
            .single();
        if (fetchError)
            throw new Error(`Failed to fetch invoice: ${fetchError.message}`);
        const { error } = await supabase.from('invoices').delete().eq('id', id);
        if (error)
            throw new Error(`Failed to delete invoice: ${error.message}`);
        if (invoice.invoice_items) {
            await this.inventoryClient.send('updateStock', {
                action: 'add',
                products: invoice.invoice_items.map(item => ({ id: item.product_id, quantity: item.quantity })),
            }).toPromise();
        }
        return { success: true };
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('INVENTORY_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], BillingService);
async function testSupabaseConnection() {
    const { data, error } = await supabase.from('invoices').select('*').limit(1);
    if (error)
        console.error('Supabase connection test failed:', error);
    else
        console.log('Supabase connection test successful:', data);
}
testSupabaseConnection();
//# sourceMappingURL=billing.service.js.map