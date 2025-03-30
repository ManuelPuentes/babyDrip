import type { Client } from "./client.interface";
import type { Product } from "./product.interface";
import type { Seller } from "./seller.interface";

export interface Bill {
    client: Client;
    seller: Seller;
    details: Array<Product>
}