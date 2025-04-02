import Papa from 'papaparse';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { getWarehouses } from '$lib/api/getWarehouses.api';
import { productSchema } from '$lib/schemas/productSchema';
import type { Warehouse } from '$lib/interfaces/warehouse.interface';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: warehouses } = await getWarehouses(supabase);

	return { warehouses } as { warehouses: Array<Warehouse> };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const file = formData.get('csv') as File;
		const warehouseId = formData.get('warehouse') as string;

		if (!file || file.size === 0) {
			return fail(400, { error: { message: 'No file uploaded' } });
		}

		try {
			const csvText = await file.text();

			const { data: csvParsedData, errors: parseErrors } = Papa.parse(csvText, {
				header: true,
				skipEmptyLines: true,
				transform: (value, header) => {
					if (header === 'cost' || header === 'sold_price') {
						return Number(value);
					}
					return value;
				}
			});

			if (parseErrors?.length) {
				return fail(400, {
					error: {
						message: 'CSV parse errors',
						parseErrors
					}
				});
			}

			const validationResults = csvParsedData.map((row: any, index) => {
				try {
					return {
						row: index + 1,
						data: productSchema.parse({ ...row, stored_at: warehouseId }),
						valid: true
					};
				} catch (validationError: any) {
					return {
						row: index + 1,
						data: row,
						valid: false,
						errors: validationError.errors
					};
				}
			});

			const invalidRows = validationResults.filter((r) => !r.valid);

			if (invalidRows.length > 0) {
				return fail(400, {
					error: {
						message: `${invalidRows.length} invalid rows found`,
						invalidRows,
						validRows: csvParsedData.length - invalidRows.length,
						totalRows: csvParsedData.length
					}
				});
			}

			const validData = validationResults.map((r) => r.data);

			const { error } = await supabase.from('products').insert(validData);
			// .select(); // Returns inserted rows

			if (error) throw error;

			return {
				success: true,
				count: validData.length
			};
		} catch {
			return fail(500, {
				error: {
					message: 'Server error during processing'
				}
			});
		}
	}
} satisfies Actions;
