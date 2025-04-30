import Papa from 'papaparse';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';
import { getWarehouses } from '$lib/api/getWarehouses.api';
import { productSchema } from '$lib/schemas/productSchema';
import type { Warehouse } from '$lib/interfaces/warehouse.interface';
import type { Product } from '$lib/interfaces/product.interface';
import { getWarehouse } from '$lib/api/getWarehouse.api';
import { map, type ZodIssue } from 'zod';
import InvalidRows from './components/InvalidRows.svelte';
import { AddProductsErrorTypesEnum, type AddProductError } from './interfaces/interfaces';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: warehouses } = await getWarehouses(supabase);

	return { warehouses } as { warehouses: Array<Warehouse> };
};

export const actions: Actions = {
	process_csv_file: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const file = formData.get('csv') as File;
		const taxes = Number(formData.get('taxes')) as number;
		const logistics = Number(formData.get('logistics')) as number;
		const warehouseId = formData.get('warehouse') as string;

		const logisticsTotal = (taxes + logistics) * 100;

		const warehouse = await getWarehouse(supabase, warehouseId);

		if (!file || file.size === 0) {
			return fail(400, {
				error: {
					type: AddProductsErrorTypesEnum.INVALID_REQUIRED_FIELD,
					message: 'No file uploaded'
				} as AddProductError
			});
		}
		if (logisticsTotal < 0) {
			return fail(400, {
				error: {
					type: AddProductsErrorTypesEnum.INVALID_REQUIRED_FIELD,
					message: 'Invalid logistics values'
				} as AddProductError
			});
		}
		if (warehouse.error) {
			return fail(400, {
				error: {
					type: AddProductsErrorTypesEnum.INVALID_REQUIRED_FIELD,
					message: warehouse.error.message
				} as AddProductError
			});
		}

		let batchValue: number = 0;
		const validRows: Array<Product> = [];
		const invalidRows: Array<Product & { errors: Record<string, string>; row: number }> = [];

		try {
			const csvText = await file.text();
			const { data: csvParsedData, errors: parseErrors } = Papa.parse<Product>(csvText, {
				header: true,
				skipEmptyLines: true,
				transform: (value, header) => {
					if (header === 'cost') {
						batchValue += Number(value) * 100;
						return Number(value);
					}

					return value;
				}
			});

			if (parseErrors.length) {
				return fail(400, {
					error: {
						type: AddProductsErrorTypesEnum.CSV_PARSE_ERROR,
						message: 'CSV parse errors',
						data: parseErrors
					} as AddProductError
				});
			}

			csvParsedData.map((row: Product, index) => {
				let { cost, description, size } = row;
				cost = (cost ?? 0) * 100;

				const logistics_expenses = calculateLogisticsExpensesPerProduct(
					logisticsTotal,
					batchValue,
					cost
				);

				const product_cost = Math.ceil(cost + logistics_expenses);
				const suggested_sold_price = Math.ceil(product_cost * 1.3);

				const {
					success,
					data,
					error: _parseErrors
				} = productSchema.safeParse({
					cost: product_cost,
					sold_price: suggested_sold_price,
					description,
					size,
					stored_at: warehouseId
				});

				if (success) {
					validRows.push(data);
				} else {
					let row_errors: Record<string, string> = {};

					_parseErrors.errors.map((e: ZodIssue) => {
						row_errors[String(e.path[0])] = String(e.message);
					});

					invalidRows.push({
						row: index + 1,
						cost: product_cost,
						sold_price: suggested_sold_price,
						description,
						stored_at: warehouseId,
						size,
						errors: row_errors
					});
				}
			});

			if (invalidRows.length) {
				return fail(400, {
					error: {
						type: AddProductsErrorTypesEnum.CSV_INVALID_ROWS,
						message: 'Validation errors in CSV data',
						data: invalidRows
					} as AddProductError
				});
			}

			return {
				success: true,
				result: validRows
			};
		} catch {
			return fail(500, {
				error: {
					message: 'Server error during processing'
				} as AddProductError
			});
		}
	},

	save_data: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const json = formData.get('products') as string;

		if (!json) {
			return { error: 'No JSON payload provided' };
		}

		const products: Array<Product> = JSON.parse(json);
		const validRows: Array<Product> = [];
		const invalidRows: Map<number, Product & { errors: Record<string, string> }> = new Map();

		products.map((row: Product, index) => {
			const { cost, description, size, sold_price, stored_at } = row;

			const {
				success,
				data,
				error: _parseErrors
			} = productSchema.safeParse({
				cost: Math.ceil(cost),
				sold_price: Math.ceil(sold_price),
				description,
				size,
				stored_at
			});

			if (success) {
				validRows.push(data);
			} else {
				let row_errors: Record<string, string> = {};

				_parseErrors.errors.map((e: ZodIssue) => {
					row_errors[String(e.path[0])] = String(e.message);
				});

				invalidRows.set(index, {
					cost,
					sold_price,
					description,
					size,
					stored_at,
					errors: row_errors
				});
			}
		});

		if (invalidRows.size) {
			return fail(400, {
				error: {
					message: 'Invalid Rows detected',
					data: invalidRows
				} as AddProductError
			});
		}

		const { error } = await supabase.from('products').insert(validRows); // No .select()

		if (error) throw error;

		return {
			success: {
				message: `${validRows.length} products inserted.`
			}
		};
	}
} satisfies Actions;

const calculateLogisticsExpensesPerProduct = (
	logisticsTotal: number,
	batchValue: number,
	product_cost: number
) => {
	return parseFloat((logisticsTotal * ((product_cost * 1) / batchValue)).toFixed(2));
};
