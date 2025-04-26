import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData) as {
			cost: string;
			sold_price: string;
			size: string;
			warehouse: string;
			description: string;
		};

		const { cost, sold_price, size, warehouse, description } = data;
		const errors: Record<string, string> = {};

		try {
			await supabase
				.from('products')
				.insert({
					cost: Number(cost),
					sold_price: Number(sold_price),
					size: String(size),
					stored_at: String(warehouse),
					description: String(description)
				})
				.throwOnError();
		} catch {
			errors.description = 'hubo un error al momento de procesar el registro del producto';
			return fail(400, { formData: data, errors });
		}

		return {
			success: true,
			message: 'Form submitted successfully!',
			formData: data
		};
	}
} satisfies Actions;
