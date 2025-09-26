export declare class CustomersService {
    createCustomer(name: string, email?: string, phone?: string, address?: string): Promise<any>;
    getCustomer(id: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
    getAllCustomers(): Promise<any[]>;
    updateCustomer(id: string, name?: string, email?: string, phone?: string, address?: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
    deleteCustomer(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
