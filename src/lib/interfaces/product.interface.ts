export interface Product {
    id?: string
    created_at?: string
    sell_id?: string | null
    printed?: boolean

    cost?: number
    sold_price?: number
    size?: string
    description?: string
    stored_at?: string | null

}