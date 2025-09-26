export declare class SuppliersService {
    createSupplier(name: string, contactEmail?: string, contactName?: string, contactPhone?: string): Promise<any>;
    getSupplier(id: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
    getAllSuppliers(): Promise<any[]>;
    updateSupplier(id: string, name?: string, contactName?: string, contactEmail?: string, contactPhone?: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
    deleteSupplier(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
