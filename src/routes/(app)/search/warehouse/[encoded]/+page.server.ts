import type { Warehouse } from "$lib/interfaces/warehouse.interface";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = (async ({ params }) => {

    return { warehouse: JSON.parse(atob(params.encoded)) as Warehouse}

 });
