import type { QrData } from '$lib/interfaces/qr.interface';

const validator = (
	input: string
): {
	error?: string;
	data?: QrData;
} => {
	try {
		const data: QrData = JSON.parse(input);

		if (data.type != 'products' && data.type != 'warehouse') {
			throw new Error();
		}

		return { data };
	} catch {
		return { error: 'this is not a valid babyDripQR' };
	}
};

export default validator;
