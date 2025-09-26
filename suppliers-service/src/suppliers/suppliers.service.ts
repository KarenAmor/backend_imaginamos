import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in .env file');
}

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

@Injectable()
export class SuppliersService {
  async createSupplier(name: string, contactEmail?: string, contactName?: string, contactPhone?: string) {
    const { data, error } = await supabase
      .from('suppliers')
      .insert({ 
        name, 
        contact_name: contactName, 
        contact_email: contactEmail, 
        contact_phone: contactPhone, 
        service_id: 'suppliers_service' 
      })
      .select();
    if (error) throw new Error(`Failed to create supplier: ${error.message}`);
    return data[0];
  }

  async getSupplier(id: string) {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return { success: false, message: `Supplier with id ${id} not found` };
    }

    return { success: true, data };
  }

  async getAllSuppliers() {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*');
    if (error) throw new Error(`Failed to retrieve suppliers: ${error.message}`);
    return data;
  }

  async updateSupplier(id: string, name?: string, contactName?: string, contactEmail?: string, contactPhone?: string) {
    const { data, error } = await supabase
      .from('suppliers')
      .update({ 
        name, 
        contact_name: contactName, 
        contact_email: contactEmail, 
        contact_phone: contactPhone, 
        service_id: 'suppliers_service' 
      })
      .eq('id', id)
      .select();
    if (error || !data || data.length === 0) {
      return { success: false, message: `Supplier with id ${id} not found or failed to update` };
    }

    return { success: true, data: data[0] };
  }

  async deleteSupplier(id: string) {
    // Verificar existencia antes de borrar
    const { data: existingSupplier, error: fetchError } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingSupplier) {
      return { success: false, message: `Supplier with id ${id} not found` };
    }

    const { error } = await supabase.from('suppliers').delete().eq('id', id);

    if (error) {
      return { success: false, message: `Failed to delete supplier: ${error.message}` };
    }

    return { success: true, message: `Supplier with id ${id} deleted successfully` };
  }
}