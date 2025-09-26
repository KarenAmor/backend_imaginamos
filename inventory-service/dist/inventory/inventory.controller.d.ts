import { InventoryService } from './inventory.service';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getAllProducts(): Promise<any[]>;
    create(data: {
        name: string;
        description: string;
        price: number;
        stock: number;
    }): Promise<any>;
    get(data: {
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
    update(data: {
        id: string;
        name?: string;
        description?: string;
        price?: number;
        stock?: number;
    }): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
        message?: undefined;
    }>;
    delete(data: {
        id: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    updateStock(data: {
        action: 'add' | 'subtract';
        products: {
            id: number;
            quantity: number;
        }[];
    }): Promise<{
        success: boolean;
        action: "add" | "subtract";
    }>;
}
