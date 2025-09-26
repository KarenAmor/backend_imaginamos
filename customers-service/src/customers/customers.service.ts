import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in .env file');
}

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

@Injectable()
export class CustomersService {
  async createCustomer(name: string, email?: string, phone?: string, address?: string) {
    const { data, error } = await supabase
      .from('customers')
      .insert({ name, email, phone, address, service_id: 'customers_service' })
      .select();
    if (error) throw new Error(`Failed to create customer: ${error.message}`);
    return data[0];
  }

  async getCustomer(id: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return { success: false, message: `Customer with id ${id} not found` };
    }

    return { success: true, data };
  }

  async getAllCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*');
    if (error) throw new Error(`Failed to retrieve customers: ${error.message}`);
    return data;
  }

 async updateCustomer(id: string, name?: string, email?: string, phone?: string, address?: string) {
    const { data, error } = await supabase
      .from('customers')
      .update({ name, email, phone, address, service_id: 'customers_service' })
      .eq('id', id)
      .select();

    if (error || !data || data.length === 0) {
      return { success: false, message: `Customer with id ${id} not found or failed to update` };
    }

    return { success: true, data: data[0] };
  }

  async deleteCustomer(id: string) {
    // Primero verificamos si existe
    const { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingCustomer) {
      return { success: false, message: `Customer with id ${id} not found` };
    }

    const { error } = await supabase.from('customers').delete().eq('id', id);

    if (error) {
      return { success: false, message: `Failed to delete customer: ${error.message}` };
    }

    return { success: true, message: `Customer with id ${id} deleted successfully` };
  }

}