import { PUBLIC_PAGE_SIZE } from '$env/static/public';
import { getProductsPaginatedData } from '$lib/api/getProductsPaginated.api';

export const load = async ({ locals: { supabase } }) => {
    const { count } = await getProductsPaginatedData(0, supabase);
    const maxPageNumber = count ? Math.ceil(count / Number(PUBLIC_PAGE_SIZE)) : 0;

    return {
        maxPageNumber,
        pageSize: Number(PUBLIC_PAGE_SIZE)
    } as {
        maxPageNumber: number;
        pageSize: number;
    };
};
