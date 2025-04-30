import { z } from 'zod'; // or your preferred validation library

export const productSchema = z.object({
	size: z.string().min(1),
	cost: z.number().gt(0),
	sold_price: z.number().gt(0),
	description: z.string().min(10),
	stored_at: z.string().min(10)
}).refine(data => data.sold_price >= data.cost, {
	message: "Sold price must be equal to or greater than cost",
	path: ["sold_price"] // This makes the error appear on the sold_price field
});
