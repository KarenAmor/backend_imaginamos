export declare class InventoryService {
    createProduct(name: string, description: string, price: number, stock: number): Promise<any>;
    getProduct(id: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
    getAllProducts(): Promise<any[]>;
    updateProduct(id: string, name?: string, description?: string, price?: number, stock?: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
    deleteProduct(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    adjustStock(id: string, quantityDelta: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
}
