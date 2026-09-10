import {clean, row, type Input} from './logic';

export const runtime = 'nodejs';

type StoredRecord = {id: string} & ReturnType<typeof clean>;

declare global {
	// Keeps local development and warm Vercel instances from losing records between requests.
	var fsaiRecords: StoredRecord[] | undefined;
}

const records = () => (globalThis.fsaiRecords ??= []);
const publicRow = (record: StoredRecord) => row({
	...record,
	id_no: record.idNo,
	other_details: record.otherDetails,
});

export async function GET() {
	return Response.json(records().toSorted((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id)).map(publicRow));
}

export async function POST(request: Request) {
	try {
		const value = clean(await request.json() as Input);
		const record = {id: `REC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, ...value};
		records().push(record);
		return Response.json(publicRow(record), {status: 201});
	} catch (error) {
		return Response.json({error: error instanceof Error ? error.message : 'Invalid record'}, {status: 400});
	}
}

export async function PUT(request: Request) {
	try {
		const input = await request.json() as Input;
		if (!input.id) throw new Error('Record ID required');
		const index = records().findIndex(record => record.id === input.id);
		if (index < 0) return Response.json({error: 'Record not found'}, {status: 404});
		const record = {id: input.id, ...clean(input)};
		records()[index] = record;
		return Response.json(publicRow(record));
	} catch (error) {
		return Response.json({error: error instanceof Error ? error.message : 'Invalid record'}, {status: 400});
	}
}

export async function DELETE(request: Request) {
	const id = new URL(request.url).searchParams.get('id');
	if (!id) return Response.json({error: 'Record ID required'}, {status: 400});
	const index = records().findIndex(record => record.id === id);
	if (index < 0) return Response.json({error: 'Record not found'}, {status: 404});
	records().splice(index, 1);
	return Response.json({ok: true});
}
