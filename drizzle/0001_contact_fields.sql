ALTER TABLE records ADD COLUMN name TEXT;
ALTER TABLE records ADD COLUMN mobile TEXT;
ALTER TABLE records ADD COLUMN email TEXT;
ALTER TABLE records ADD COLUMN designation TEXT;
ALTER TABLE records ADD COLUMN id_no TEXT;
ALTER TABLE records ADD COLUMN other_details TEXT;
PRAGMA optimize;
