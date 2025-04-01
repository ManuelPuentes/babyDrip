export interface QrData {
    type: QrType,
    id: string,
    payload?: any
}

export type QrType = 'warehouse' | 'product';
