export interface Product {
    id?: string
    created_at?: Date
    updated_at?: Date
    sell_id?: string | null
    printed?: boolean

    cost?: number
    sold_price?: number
    size?: string
    description?: string
    stored_at?: string
}