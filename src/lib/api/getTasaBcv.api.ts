import fetch from 'node-fetch';
import { Agent } from 'https';
import * as cheerio from 'cheerio';

const agent = new Agent({ rejectUnauthorized: false });

export async function getTasaBCV() {
	try {
		const response = await fetch('https://www.bcv.org.ve', { agent });

		if (!response.ok) {
			throw new Error(`Error HTTP: ${response.status}`);
		}

		const html = await response.text();
		const $ = cheerio.load(html);

		const tasa = $('#dolar strong').text().trim().replace(',', '.');

		return parseFloat(parseFloat(tasa).toFixed(2));
	} catch (error: any) {
		console.error('Error al consultar el BCV:', error.message);
		return null;
	}
}
