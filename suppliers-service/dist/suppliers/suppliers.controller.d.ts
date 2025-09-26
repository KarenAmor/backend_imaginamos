import { SuppliersService } from './suppliers.service';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    createSupplier(data: {
        name: string;
        contactEmail?: string;
        contactName?: string;
        contactPhone?: string;
    }): Promise<any>;
    getSupplier(data: {
        id: string;
    }): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
    getAllSuppliers(): Promise<any[]>;
    updateSupplier(data: {
        id: string;
        name?: string;
        contactName?: string;
        contactEmail?: string;
        contactPhone?: string;
    }): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
    deleteSupplier(data: {
        id: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
