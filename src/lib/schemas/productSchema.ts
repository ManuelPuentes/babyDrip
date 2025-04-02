import { z } from 'zod'; // or your preferred validation library

export const productSchema = z.object({
	size: z.string().min(1),
	cost: z.number().gt(0),
	sold_price: z.number().gt(0),
	description: z.string().min(1),
	stored_at: z.string().min(1)
});
