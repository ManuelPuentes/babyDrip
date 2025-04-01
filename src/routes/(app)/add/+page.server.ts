import { fail, type Actions } from '@sveltejs/kit';

export const load = async () => {};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);
		const errors: Record<string, string> = {};

		// Validate email
		// if (!data.email) {
		//     errors.email = 'Email is required';
		// } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
		// }
		// errors.cost = 'cost';
		// errors.sold_price = 'sold_price';
		// errors.size = 'size';
		// errors.description = 'description';

		if (Object.keys(errors).length > 0) {
			return fail(400, { formData: data, errors });
		}

		return {
			success: true,
			message: 'Form submitted successfully!',
			formData: data
		};
	}
} satisfies Actions;
