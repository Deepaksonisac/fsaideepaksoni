import { describe, expect, it } from 'vitest';
import { clean, periods, row } from './logic';

describe('periods', () => {
  it('derives calendar month, fiscal quarter and fiscal year for a mid-year date', () => {
    expect(periods('2025-05-20')).toEqual({ month: 'May', quarter: 'Q1', fy: 'FY 2025-26' });
  });

  it('treats April as the first month of the fiscal year (Q1)', () => {
    expect(periods('2025-04-01')).toMatchObject({ month: 'Apr', quarter: 'Q1', fy: 'FY 2025-26' });
  });

  it('treats March as the last month of the fiscal year (Q4), rolling over from the prior calendar year', () => {
    expect(periods('2026-03-31')).toMatchObject({ month: 'Mar', quarter: 'Q4', fy: 'FY 2025-26' });
  });

  it('computes each fiscal quarter boundary correctly', () => {
    expect(periods('2025-06-30').quarter).toBe('Q1'); // Apr-Jun
    expect(periods('2025-07-01').quarter).toBe('Q2'); // Jul-Sep
    expect(periods('2025-09-30').quarter).toBe('Q2');
    expect(periods('2025-10-01').quarter).toBe('Q3'); // Oct-Dec
    expect(periods('2025-12-31').quarter).toBe('Q3');
    expect(periods('2026-01-01').quarter).toBe('Q4'); // Jan-Mar
  });

  it('honors an explicit fy override instead of deriving one', () => {
    expect(periods('2025-05-20', 'FY 2026-27').fy).toBe('FY 2026-27');
  });

  it('throws on an invalid date string', () => {
    expect(() => periods('not-a-date')).toThrow('Invalid date');
  });

  it('rejects impossible calendar dates', () => {
    expect(() => periods('2025-02-30')).toThrow('Invalid date');
  });
});

describe('clean', () => {
  const base = { date: '2025-05-20', remarks: '  New sponsor  ' };

  it('requires a date', () => {
    expect(() => clean({ remarks: 'x' })).toThrow('Date and remarks are required');
  });

  it('requires non-blank remarks', () => {
    expect(() => clean({ date: '2025-05-20', remarks: '   ' })).toThrow('Date and remarks are required');
  });

  it('rejects a malformed email', () => {
    expect(() => clean({ ...base, email: 'not-an-email' })).toThrow('Valid email required');
  });

  it('accepts a missing email (optional field)', () => {
    expect(clean(base).email).toBeNull();
  });

  it('lowercases and trims a valid email', () => {
    expect(clean({ ...base, email: '  Test@Example.COM  ' }).email).toBe('test@example.com');
  });

  it('trims remarks and derives fy/month/quarter from the date', () => {
    const result = clean(base);
    expect(result.remarks).toBe('New sponsor');
    expect(result).toMatchObject({ fy: 'FY 2025-26', month: 'May', quarter: 'Q1' });
  });

  it('defaults status to Active when omitted or invalid', () => {
    expect(clean(base).status).toBe('Active');
    expect(clean({ ...base, status: 'not-a-real-status' }).status).toBe('Active');
  });

  it('preserves an explicit valid status', () => {
    expect(clean({ ...base, status: 'Cancelled' }).status).toBe('Cancelled');
  });

  it('defaults numeric fields to 0 and clamps nominations at 0', () => {
    const result = clean(base);
    expect(result).toMatchObject({ sponsorship: 0, expenditure: 0, pacc: 0, ad: 0, nominations: 0 });
    expect(clean({ ...base, nominations: -5 }).nominations).toBe(0);
  });

  it('rejects invalid or negative amounts', () => {
    expect(() => clean({ ...base, sponsorship: -1 })).toThrow('Sponsorship must be a non-negative number');
    expect(() => clean({ ...base, expenditure: Number.NaN })).toThrow('Expenditure must be a non-negative number');
  });

  it('stores nominations as a whole number', () => {
    expect(clean({ ...base, nominations: 2.9 }).nominations).toBe(2);
  });

  it('converts boolean flags to 0/1 for storage', () => {
    const result = clean({ ...base, st: true, ap: false, project: true });
    expect(result).toMatchObject({ st: 1, ap: 0, project: 1 });
  });

  it('normalizes blank optional strings to null', () => {
    const result = clean({ ...base, name: '   ', mobile: '' });
    expect(result.name).toBeNull();
    expect(result.mobile).toBeNull();
  });
});

describe('row', () => {
  it('maps snake_case D1 columns to the camelCase frontend shape', () => {
    const dbRow = { id: 'REC-1', id_no: 'EMP-9', other_details: 'note', st: 1, ap: 0, project: 1 };
    expect(row(dbRow)).toEqual({ id: 'REC-1', idNo: 'EMP-9', otherDetails: 'note', st: true, ap: false, project: true });
  });

  it('treats missing flag columns as false', () => {
    const result = row({ id: 'REC-2', id_no: null, other_details: null });
    expect(result).toMatchObject({ st: false, ap: false, project: false });
  });
});
