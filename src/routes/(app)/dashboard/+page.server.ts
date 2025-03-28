import { PUBLIC_PAGE_SIZE } from '$env/static/public'

export const load = async () => {
    return {
        env: {
            pageSize: Number(PUBLIC_PAGE_SIZE),
        }
    };
};