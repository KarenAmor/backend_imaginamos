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
    }): Promise<any>;
    getAllSuppliers(): Promise<any[]>;
    updateSupplier(data: {
        id: string;
        name?: string;
        contactName?: string;
        contactEmail?: string;
        contactPhone?: string;
    }): Promise<any>;
    deleteSupplier(data: {
        id: string;
    }): Promise<{
        success: boolean;
    }>;
}
