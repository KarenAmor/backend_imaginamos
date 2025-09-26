import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in .env file');
}

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

@Injectable()
export class BillingService {
  constructor(@Inject('INVENTORY_SERVICE') private inventoryClient: ClientProxy) {}

 async createInvoice(customerId: number, invoiceItems: { product_id: number; quantity: number; unit_price: number }[], total: number) {
  try {
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        customer_id: customerId,
        total,
        service_id: 'billing_service',
      })
      .select();
    if (invoiceError) {
      console.error('Invoice insertion error:', {
        message: invoiceError.message,
        details: invoiceError.details,
        hint: invoiceError.hint,
        code: invoiceError.code,
      });
      throw new Error(`Failed to create invoice: ${invoiceError.message}`);
    }
    const invoice = invoiceData[0];

    const itemsData = invoiceItems.map(item => ({
      invoice_id: invoice.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));
    const { error: itemsError } = await supabase.from('invoice_items').insert(itemsData);
    if (itemsError) {
      await supabase.from('invoices').delete().eq('id', invoice.id);
      console.error('Invoice items insertion error:', {
        message: itemsError.message,
        details: itemsError.details,
        hint: itemsError.hint,
        code: itemsError.code,
      });
      throw new Error(`Failed to create invoice items: ${itemsError.message}`);
    }

    await this.inventoryClient.send('updateStock', {
      action: 'subtract',
      products: invoiceItems.map(item => ({ id: item.product_id, quantity: item.quantity })),
    }).toPromise();

    return { ...invoice, items: invoiceItems };
  } catch (error) {
    console.error('Unexpected error in createInvoice:', {
      message: error.message || 'Unknown error',
      stack: error.stack || 'No stack trace',
      name: error.name,
    });
    throw error; // Asegura que el error se propague al controller
  }
}

  async getInvoice(id: string) {
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*, invoice_items(*)')
      .eq('id', id)
      .single();

    if (invoiceError || !invoice) {
      return { success: false, message: `Invoice with id ${id} not found` };
    }

    return { success: true, data: invoice };
  }

  async getAllInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, invoice_items(*)');
    if (error) throw new Error(`Failed to retrieve invoices: ${error.message}`);
    return data;
  }

  async updateInvoice(id: string, customerId?: number, total?: number, status?: string, invoiceItems?: { product_id: number; quantity: number; unit_price: number }[]) {
    const { data: oldInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*, invoice_items(*)')
      .eq('id', id)
      .single();
    if (fetchError || !oldInvoice) {
      return { success: false, message: `Invoice with id ${id} not found` };
    }
    const updateData = { customer_id: customerId, total, status, service_id: 'billing_service' };
    const { data: updatedInvoice, error: updateError } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .select();
    if (updateError) throw new Error(`Failed to update invoice: ${updateError.message}`);
    const invoice = updatedInvoice[0];

    if (invoiceItems) {
      // Eliminar ítems antiguos
      await supabase.from('invoice_items').delete().eq('invoice_id', id);

      // Insertar nuevos ítems
      const itemsData = invoiceItems.map(item => ({
        invoice_id: id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));
      const { error: itemsError } = await supabase.from('invoice_items').insert(itemsData);
      if (itemsError) throw new Error(`Failed to update invoice items: ${itemsError.message}`);

      // Revertir stock anterior y actualizar
      if (oldInvoice.invoice_items) {
        await this.inventoryClient.send('updateStock', {
          action: 'add',
          products: oldInvoice.invoice_items.map(item => ({ id: item.product_id, quantity: item.quantity })),
        }).toPromise();
      }
      await this.inventoryClient.send('updateStock', {
        action: 'subtract',
        products: invoiceItems.map(item => ({ id: item.product_id, quantity: item.quantity })),
      }).toPromise();
    }

    return { ...invoice, items: invoiceItems || oldInvoice.invoice_items };
  }

 async deleteInvoice(id: string) {
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*, invoice_items(*)')
      .eq('id', id)
      .single();

    if (fetchError || !invoice) {
      return { success: false, message: `Invoice with id ${id} not found` };
    }

    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) {
      return { success: false, message: `Failed to delete invoice: ${error.message}` };
    }

    if (invoice.invoice_items) {
      await this.inventoryClient.send('updateStock', {
        action: 'add',
        products: invoice.invoice_items.map(item => ({ id: item.product_id, quantity: item.quantity })),
      }).toPromise();
    }
  }
}