import type { Product } from '$lib/interfaces/product.interface';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return { product: JSON.parse(atob(params.encoded)) as Product };
};
