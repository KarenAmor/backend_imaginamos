export declare class InventoryService {
    createProduct(name: string, description: string, price: number, stock: number): Promise<any>;
    getProduct(id: string): Promise<any>;
    getAllProducts(): Promise<any[]>;
    updateProduct(id: string, name?: string, description?: string, price?: number, stock?: number): Promise<any>;
    deleteProduct(id: string): Promise<{
        success: boolean;
    }>;
    adjustStock(id: string, quantityDelta: number): Promise<any>;
}
