import { ClientProxy } from '@nestjs/microservices';
export declare class BillingService {
    private inventoryClient;
    constructor(inventoryClient: ClientProxy);
    createInvoice(customerId: number, invoiceItems: {
        product_id: number;
        quantity: number;
        unit_price: number;
    }[], total: number): Promise<any>;
    getInvoice(id: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
    getAllInvoices(): Promise<any[]>;
    updateInvoice(id: string, customerId?: number, total?: number, status?: string, invoiceItems?: {
        product_id: number;
        quantity: number;
        unit_price: number;
    }[]): Promise<any>;
    deleteInvoice(id: string): Promise<{
        success: boolean;
        message: string;
    } | undefined>;
}
