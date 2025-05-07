import type { RequestHandler } from '@sveltejs/kit';
import * as QRCode from 'qrcode';
import { PDFDocument } from 'pdf-lib';

const QR_SIZE = 85;
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const QR_PER_PAGE = 54;

const positions = [
	{ x: 32, y: 726.8506 },
	{ x: 119.0394, y: 726.8506 },
	{ x: 206.0788, y: 726.8506 },
	{ x: 293.1182, y: 726.8506 },
	{ x: 380.1576, y: 726.8506 },
	{ x: 467.197, y: 726.8506 },
	{ x: 32, y: 641.8112 },
	{ x: 119.0394, y: 641.8112 },
	{ x: 206.0788, y: 641.8112 },
	{ x: 293.1182, y: 641.8112 },
	{ x: 380.1576, y: 641.8112 },
	{ x: 467.197, y: 641.8112 },
	{ x: 32, y: 556.7718 },
	{ x: 119.0394, y: 556.7718 },
	{ x: 206.0788, y: 556.7718 },
	{ x: 293.1182, y: 556.7718 },
	{ x: 380.1576, y: 556.7718 },
	{ x: 467.197, y: 556.7718 },
	{ x: 32, y: 471.7324 },
	{ x: 119.0394, y: 471.7324 },
	{ x: 206.0788, y: 471.7324 },
	{ x: 293.1182, y: 471.7324 },
	{ x: 380.1576, y: 471.7324 },
	{ x: 467.197, y: 471.7324 },
	{ x: 32, y: 386.693 },
	{ x: 119.0394, y: 386.693 },
	{ x: 206.0788, y: 386.693 },
	{ x: 293.1182, y: 386.693 },
	{ x: 380.1576, y: 386.693 },
	{ x: 467.197, y: 386.693 },
	{ x: 32, y: 301.6536 },
	{ x: 119.0394, y: 301.6536 },
	{ x: 206.0788, y: 301.6536 },
	{ x: 293.1182, y: 301.6536 },
	{ x: 380.1576, y: 301.6536 },
	{ x: 467.197, y: 301.6536 },
	{ x: 32, y: 216.61419999999998 },
	{ x: 119.0394, y: 216.61419999999998 },
	{ x: 206.0788, y: 216.61419999999998 },
	{ x: 293.1182, y: 216.61419999999998 },
	{ x: 380.1576, y: 216.61419999999998 },
	{ x: 467.197, y: 216.61419999999998 },
	{ x: 32, y: 131.57479999999998 },
	{ x: 119.0394, y: 131.57479999999998 },
	{ x: 206.0788, y: 131.57479999999998 },
	{ x: 293.1182, y: 131.57479999999998 },
	{ x: 380.1576, y: 131.57479999999998 },
	{ x: 467.197, y: 131.57479999999998 },
	{ x: 32, y: 46.53539999999998 },
	{ x: 119.0394, y: 46.53539999999998 },
	{ x: 206.0788, y: 46.53539999999998 },
	{ x: 293.1182, y: 46.53539999999998 },
	{ x: 380.1576, y: 46.53539999999998 },
	{ x: 467.197, y: 46.53539999999998 }
];

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	try {
		const { qr_type } = (await request.json()) as {
			qr_type: 'products' | 'warehouse';
		};

		const { data, error: dbError } = await supabase
			.from(qr_type)
			.select('id')
			.eq('printed', false)
			.limit(50);

		if (dbError) throw new Error(dbError.message);

		const qrEntries = await Promise.all(
			data.map(async ({ id }) => {
				const qrUrl = await generateQR(JSON.stringify({ type: qr_type, id }));
				return { id, url: qrUrl };
			})
		);

		const pdfBytes = await drawPdf(qrEntries);

		return new Response(pdfBytes, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename="qr_codes.pdf"'
			}
		});
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};

async function generateQR(content: string) {
	return await QRCode.toDataURL(content, {
		width: QR_SIZE * 2,
		// margin: 10,
		color: { dark: '#000000', light: '#ffffff' }
	});
}

const drawPdf = async (
	data: Array<{
		id: string;
		url: string;
	}>
) => {
	const pdfDoc = await PDFDocument.create();

	let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

	for (let i = 0; i < data.length; i++) {
		const entry = data[i];

		if (i && i % QR_PER_PAGE == 0) {
			page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
		}

		const { x, y } = positions[i % QR_PER_PAGE];

		const qrImageBytes = Buffer.from(entry.url.split(',')[1], 'base64');
		const qrImage = await pdfDoc.embedPng(qrImageBytes);

		page.drawImage(qrImage, {
			x,
			y,
			width: QR_SIZE,
			height: QR_SIZE
		});
	}
	const pdfBytes = await pdfDoc.save();

	return pdfBytes;
};
