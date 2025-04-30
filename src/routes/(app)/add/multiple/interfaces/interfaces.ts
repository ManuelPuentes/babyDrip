export enum AddProductsErrorTypesEnum {
    INVALID_REQUIRED_FIELD,
    CSV_PARSE_ERROR,
    CSV_INVALID_ROWS,
}

export interface AddProductError {
    type: AddProductsErrorTypesEnum,
    message: string,
    data?: unknown
}
