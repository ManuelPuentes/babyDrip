import * as QRCode from 'qrcode';

export const load = async ({ locals: { supabase } }) => {
	return { qr: await generateQR('EASTER EGG') };
};

async function generateQR(content: string) {
	try {
		return await QRCode.toDataURL(content, {
			width: 150 * 2,
			// margin: 10,
			color: { dark: '#000000', light: '#ffffff' }
		});
	} catch (err) {
		console.error('Error generando QR:', err);
		return null;
	}
}
