export declare class SuppliersService {
    createSupplier(name: string, contactEmail?: string, contactName?: string, contactPhone?: string): Promise<any>;
    getSupplier(id: string): Promise<any>;
    getAllSuppliers(): Promise<any[]>;
    updateSupplier(id: string, name?: string, contactName?: string, contactEmail?: string, contactPhone?: string): Promise<any>;
    deleteSupplier(id: string): Promise<{
        success: boolean;
    }>;
}
