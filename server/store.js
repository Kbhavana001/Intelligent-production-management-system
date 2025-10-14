import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { promises as fs } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, 'db.json');

async function readDb() {
	try {
		const text = await fs.readFile(FILE, 'utf8');
		const data = JSON.parse(text || '{}');
		data.users ||= [];
		return data;
	} catch (e) {
		return { users: [] };
	}
}

async function writeDb(data) {
	await fs.writeFile(FILE, JSON.stringify(data, null, 2), 'utf8');
}

const db = { read: readDb, write: writeDb };

export default db;
