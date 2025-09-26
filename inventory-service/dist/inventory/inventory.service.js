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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in .env file');
}
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const logger = new common_1.Logger('InventoryService');
let InventoryService = class InventoryService {
    async createProduct(name, description, price, stock) {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert({ name, description, price, stock, service_id: 'inventory_service' })
                .select();
            if (error) {
                console.error('Supabase insert error:', error);
                throw new Error(`Failed to create product: ${error.message} (Details: ${JSON.stringify(error)})`);
            }
            return data[0];
        }
        catch (error) {
            console.error('Create product failed:', error);
            throw error;
        }
    }
    async getProduct(id) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw new Error(`Product not found: ${error.message}`);
        return data;
    }
    async getAllProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*');
        if (error)
            throw new Error(`Failed to retrieve products: ${error.message}`);
        return data;
    }
    async updateProduct(id, name, description, price, stock) {
        const { data, error } = await supabase
            .from('products')
            .update({ name, description, price, stock, service_id: 'inventory_service' })
            .eq('id', id)
            .select();
        if (error)
            throw new Error(`Failed to update product: ${error.message}`);
        return data[0];
    }
    async deleteProduct(id) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error)
            throw new Error(`Failed to delete product: ${error.message}`);
        return { success: true };
    }
    async adjustStock(id, quantityDelta) {
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('stock')
            .eq('id', id)
            .single();
        if (fetchError)
            throw new Error(`Product not found: ${fetchError.message}`);
        const newStock = product.stock + quantityDelta;
        const { data, error } = await supabase
            .from('products')
            .update({ stock: newStock, service_id: 'inventory_service' })
            .eq('id', id)
            .select();
        if (error)
            throw new Error(`Failed to update stock: ${error.message}`);
        return data[0];
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)()
], InventoryService);
//# sourceMappingURL=inventory.service.js.map