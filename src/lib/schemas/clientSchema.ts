import { z } from 'zod';

export const clientSchema = z
    .object({
        phone: z.string()
            .regex(/^\+[1-9]\d{1,3}\d{6,14}$/, {
                message: 'Formato internacional requerido: +[código país][número]'
            }),
        name: z.string().min(5).optional(),
        lastname: z.string().min(5).optional(),
    })
