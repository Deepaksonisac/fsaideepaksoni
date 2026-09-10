// Pure, framework-free logic for the records API. Kept separate from
// route.ts (which imports 'cloudflare:workers' and can only run inside
// the Workers runtime) so this business logic can be unit tested with a
// plain test runner.

export type Input = {
  id?: string;
  date?: string;
  fy?: string;
  status?: string;
  remarks?: string;
  name?: string;
  mobile?: string;
  email?: string;
  designation?: string;
  idNo?: string;
  otherDetails?: string;
  member?: string;
  sponsorship?: number;
  expenditure?: number;
  pacc?: number;
  ad?: number;
  event?: string;
  training?: string;
  article?: string;
  st?: boolean;
  ap?: boolean;
  project?: boolean;
  nominations?: number;
};

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Derives the calendar month name, Indian-fiscal-year quarter (Apr–Mar), and fiscal-year label for a date. */
export function periods(date: string, selectedFy?: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Invalid date');
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== date) throw new Error('Invalid date');
  const month = months[d.getUTCMonth()];
  const fiscalIndex = (d.getUTCMonth() + 9) % 12;
  const start = d.getUTCMonth() >= 3 ? d.getUTCFullYear() : d.getUTCFullYear() - 1;
  return { month, quarter: `Q${Math.floor(fiscalIndex / 3) + 1}`, fy: selectedFy || `FY ${start}-${String(start + 1).slice(-2)}` };
}

function amount(value: unknown, label: string) {
  if (value === undefined || value === null || value === '') return 0;
  const result = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(result) || result < 0) throw new Error(`${label} must be a non-negative number`);
  return result;
}

function count(value: unknown, label: string) {
  if (value === undefined || value === null || value === '') return 0;
  const result = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(result)) throw new Error(`${label} must be a number`);
  return Math.floor(Math.max(0, result));
}

/** Validates and normalizes a record submission into the shape stored in D1. */
export function clean(v: Input) {
  if (!v.date || !v.remarks?.trim()) throw new Error('Date and remarks are required');
  if (v.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) throw new Error('Valid email required');
  const p = periods(v.date, v.fy);
  const status = ['Active', 'Completed', 'Cancelled'].includes(v.status || '') ? v.status! : 'Active';
  return {
    date: v.date,
    fy: p.fy,
    month: p.month,
    quarter: p.quarter,
    status,
    remarks: v.remarks.trim(),
    name: v.name?.trim() || null,
    mobile: v.mobile?.trim() || null,
    email: v.email?.trim().toLowerCase() || null,
    designation: v.designation?.trim() || null,
    idNo: v.idNo?.trim() || null,
    otherDetails: v.otherDetails?.trim() || null,
    member: v.member || null,
    sponsorship: amount(v.sponsorship, 'Sponsorship'),
    expenditure: amount(v.expenditure, 'Expenditure'),
    pacc: amount(v.pacc, 'PACC sponsorship'),
    ad: amount(v.ad, 'Ad contribution'),
    event: v.event?.trim() || null,
    training: v.training?.trim() || null,
    article: v.article?.trim() || null,
    st: v.st ? 1 : 0,
    ap: v.ap ? 1 : 0,
    project: v.project ? 1 : 0,
    nominations: count(v.nominations, 'Nominations'),
  };
}

/** Maps a raw D1 row (snake_case columns, 0/1 flags) to the camelCase/boolean shape the frontend expects. */
export function row(r: Record<string, unknown>) {
  const { id_no, other_details, ...rest } = r;
  return { ...rest, idNo: id_no, otherDetails: other_details, st: !!r.st, ap: !!r.ap, project: !!r.project };
}
