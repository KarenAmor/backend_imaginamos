export declare class CustomersService {
    createCustomer(name: string, email?: string, phone?: string, address?: string): Promise<any>;
    getCustomer(id: string): Promise<any>;
    getAllCustomers(): Promise<any[]>;
    updateCustomer(id: string, name?: string, email?: string, phone?: string, address?: string): Promise<any>;
    deleteCustomer(id: string): Promise<{
        success: boolean;
    }>;
}
