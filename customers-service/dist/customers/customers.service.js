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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in .env file');
}
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
let CustomersService = class CustomersService {
    async createCustomer(name, email, phone, address) {
        const { data, error } = await supabase
            .from('customers')
            .insert({ name, email, phone, address, service_id: 'customers_service' })
            .select();
        if (error)
            throw new Error(`Failed to create customer: ${error.message}`);
        return data[0];
    }
    async getCustomer(id) {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !data) {
            return { success: false, message: `Customer with id ${id} not found` };
        }
        return { success: true, data };
    }
    async getAllCustomers() {
        const { data, error } = await supabase
            .from('customers')
            .select('*');
        if (error)
            throw new Error(`Failed to retrieve customers: ${error.message}`);
        return data;
    }
    async updateCustomer(id, name, email, phone, address) {
        const { data, error } = await supabase
            .from('customers')
            .update({ name, email, phone, address, service_id: 'customers_service' })
            .eq('id', id)
            .select();
        if (error || !data || data.length === 0) {
            return { success: false, message: `Customer with id ${id} not found or failed to update` };
        }
        return { success: true, data: data[0] };
    }
    async deleteCustomer(id) {
        const { data: existingCustomer, error: fetchError } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();
        if (fetchError || !existingCustomer) {
            return { success: false, message: `Customer with id ${id} not found` };
        }
        const { error } = await supabase.from('customers').delete().eq('id', id);
        if (error) {
            return { success: false, message: `Failed to delete customer: ${error.message}` };
        }
        return { success: true, message: `Customer with id ${id} deleted successfully` };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)()
], CustomersService);
//# sourceMappingURL=customers.service.js.map