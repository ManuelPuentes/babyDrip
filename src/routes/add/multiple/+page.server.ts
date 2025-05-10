import { type Actions, fail } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';

import { getWarehouses } from '$lib/api/getWarehouses.api';
import { productSchema } from '$lib/schemas/productSchema';
import { AddProductsSchema } from '$lib/schemas/addProductsSchema.js';
import Papa from 'papaparse';
import type { Product } from '$lib/interfaces/product.interface';
import { AddProductsErrorTypesEnum, type AddProductError } from './interfaces/interfaces.js';
import type { ZodIssue } from 'zod';
import { withFiles } from 'sveltekit-superforms';

export const load = async ({ locals: { supabase } }) => {
	const { data: warehouses } = await getWarehouses({
		supabase
	});

	const addProductsform = await superValidate(zod(AddProductsSchema));

	return { addProductsform, warehouses };
};

export const actions = {
	process_csv_file: async ({ request }) => {
		const addProductsform = await superValidate(request, zod(AddProductsSchema));

		if (!addProductsform.valid) {
			return fail(400, withFiles({ addProductsform }));
		}

		// se debera chequear que el warehouse exista

		const {
			file,
			stored_at,
			logistics,
			taxes
		}: {
			file: File;
			stored_at: string;
			logistics: number;
			taxes: number;
		} = addProductsform.data;

		let batchValue: number = 0;
		const validRows: Array<Product> = [];
		const invalidRows: Array<Product & { errors: Record<string, string>; row: number }> = [];
		const logisticsTotal = (taxes + logistics) * 100;

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
				const { description, size } = row;
				let { cost } = row;

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
					stored_at
				});

				if (success) {
					validRows.push(data);
				} else {
					const row_errors: Record<string, string> = {};

					_parseErrors.errors.map((e: ZodIssue) => {
						row_errors[String(e.path[0])] = String(e.message);
					});

					invalidRows.push({
						row: index + 1,
						cost: product_cost,
						sold_price: suggested_sold_price,
						description,
						stored_at,
						size,
						errors: row_errors
					});
				}
			});

			if (invalidRows.length) {
				return message(addProductsform, {
					text: 'invalid_row_founded',
					type: 'error',
					status: 403,
					data: invalidRows
				});
			}

			return message(addProductsform, {
				status: 200,
				type: 'success',
				text: 'product successfully updated',
				data: validRows
			});
		} catch {
			//aque falta un error general
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
				const row_errors: Record<string, string> = {};

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

		const { error } = await supabase.from('products').insert(validRows);

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
