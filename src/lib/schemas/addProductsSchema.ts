import { z } from 'zod'; // or your preferred validation library

export const AddProductsSchema = z.object({
	file: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.type === 'text/csv', 'provided file is invalid'),

	stored_at: z.string().min(1),
	logistics: z
		.number()
		.gt(0)
		.transform((arg) => arg * 100),
	taxes: z
		.number()
		.gt(0)
		.transform((arg) => arg * 100)
});
