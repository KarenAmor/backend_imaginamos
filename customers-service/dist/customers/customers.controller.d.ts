import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    createCustomer(data: {
        name: string;
        email?: string;
        phone?: string;
        address?: string;
    }): Promise<any>;
    getCustomer(data: {
        id: string;
    }): Promise<any>;
    getAllCustomers(): Promise<any[]>;
    updateCustomer(data: {
        id: string;
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
    }): Promise<any>;
    deleteCustomer(data: {
        id: string;
    }): Promise<{
        success: boolean;
    }>;
}
