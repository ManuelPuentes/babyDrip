import type { RequestHandler } from '@sveltejs/kit';
import * as QRCode from 'qrcode';
import { PDFDocument } from 'pdf-lib';

const QR_SIZE = 150;
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const QR_PER_PAGE = 15;

const positions = [
	{ x: 44, y: 658.89 },
	{ x: 208, y: 658.89 },
	{ x: 372, y: 658.89 },
	{ x: 44, y: 505.89 },
	{ x: 208, y: 505.89 },
	{ x: 372, y: 505.89 },
	{ x: 44, y: 352.89 },
	{ x: 208, y: 352.89 },
	{ x: 372, y: 352.89 },
	{ x: 44, y: 199.89 },
	{ x: 208, y: 199.89 },
	{ x: 372, y: 199.89 },
	{ x: 44, y: 46.889999999999986 },
	{ x: 208, y: 46.889999999999986 },
	{ x: 372, y: 46.889999999999986 }
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
	try {
		return await QRCode.toDataURL(content, {
			width: QR_SIZE * 2,
			// margin: 10,
			color: { dark: '#000000', light: '#ffffff' }
		});
	} catch (err) {
		console.error('Error generando QR:', err);
		return null;
	}
}

const drawPdf = async (data: Array<any>) => {
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
