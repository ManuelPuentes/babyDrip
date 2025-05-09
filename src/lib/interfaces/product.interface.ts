export interface Product {
	id?: string;
	created_at?: string;
	updated_at?: string;
	purchase_order_id?: string | null;
	printed?: boolean;

	cost: number;
	sold_price: number;
	size: string;
	description: string;
	stored_at: string;
}
