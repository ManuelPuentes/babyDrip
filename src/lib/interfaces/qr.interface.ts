export interface QrData extends Record<string, string> {
	type: QrType;
	id: string;
}

export type QrType = 'warehouse' | 'products';
