import { BillingService } from './billing.service';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    createInvoice(data: {
        customerId: number;
        invoiceItems: {
            product_id: number;
            quantity: number;
            unit_price: number;
        }[];
        total: number;
    }): Promise<any>;
    getInvoice(data: {
        id: string;
    }): Promise<any>;
    getAllInvoices(): Promise<any[]>;
    updateInvoice(data: {
        id: string;
        customerId?: number;
        total?: number;
        status?: string;
        invoiceItems?: {
            product_id: number;
            quantity: number;
            unit_price: number;
        }[];
    }): Promise<any>;
    deleteInvoice(data: {
        id: string;
    }): Promise<{
        success: boolean;
    }>;
}
