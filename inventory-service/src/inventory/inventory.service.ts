import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in .env file');
}

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const logger = new Logger('InventoryService');

@Injectable()
export class InventoryService {
 async createProduct(name: string, description: string, price: number, stock: number) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({ name, description, price, stock, service_id: 'inventory_service' })
      .select();
    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Failed to create product: ${error.message} (Details: ${JSON.stringify(error)})`);
    }
    return data[0];
  } catch (error) {
    console.error('Create product failed:', error);
    throw error;
  }
}

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(`Product not found: ${error.message}`);
    return data;
  }

  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) throw new Error(`Failed to retrieve products: ${error.message}`);
    return data; // Retorna la lista completa de productos
  }

  async updateProduct(id: string, name?: string, description?: string, price?: number, stock?: number) {
    const { data, error } = await supabase
      .from('products')
      .update({ name, description, price, stock, service_id: 'inventory_service' })
      .eq('id', id)
      .select();
    if (error) throw new Error(`Failed to update product: ${error.message}`);
    return data[0];
  }

  async deleteProduct(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete product: ${error.message}`);
    return { success: true };
  }
}