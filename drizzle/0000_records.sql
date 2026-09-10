CREATE TABLE IF NOT EXISTS records (
  id TEXT PRIMARY KEY, date TEXT NOT NULL, fy TEXT NOT NULL, month TEXT NOT NULL, quarter TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('Active','Completed','Cancelled')), remarks TEXT NOT NULL, member TEXT,
  sponsorship REAL NOT NULL DEFAULT 0, expenditure REAL NOT NULL DEFAULT 0, pacc REAL NOT NULL DEFAULT 0,
  ad REAL NOT NULL DEFAULT 0, event TEXT, training TEXT, article TEXT, st INTEGER NOT NULL DEFAULT 0,
  ap INTEGER NOT NULL DEFAULT 0, project INTEGER NOT NULL DEFAULT 0, nominations INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_records_fy_status ON records(fy,status);
INSERT OR IGNORE INTO records (id,date,fy,month,quarter,status,remarks,member,sponsorship,expenditure,pacc,ad,event,training,article,st,ap,project,nominations) VALUES
('REC-0001','2025-04-10','FY 2025-26','Apr','Q1','Active','New individual member','Individual',0,0,0,0,NULL,NULL,NULL,0,0,0,0),
('REC-0002','2025-05-14','FY 2025-26','May','Q1','Active','Corporate membership + sponsorship','Corporate',50000,0,0,0,NULL,NULL,NULL,0,0,0,0),
('REC-0003','2025-06-03','FY 2025-26','Jun','Q1','Active','Institutional member','Institutional',0,0,0,0,NULL,NULL,NULL,0,0,0,0),
('REC-0004','2025-06-20','FY 2025-26','Jun','Q1','Completed','Jaipur chapter',NULL,0,0,0,0,'Fire Safety Awareness Seminar',NULL,NULL,0,0,0,0),
('REC-0005','2025-07-08','FY 2025-26','Jul','Q2','Completed','Fire extinguisher workshop',NULL,0,0,0,0,NULL,'Fire Extinguisher Handling Workshop',NULL,0,0,0,0),
('REC-0006','2025-08-15','FY 2025-26','Aug','Q2','Completed','FSAI Journal Aug issue','Corporate',0,0,0,0,NULL,NULL,'Advances in Fire Detection Systems',0,0,0,0),
('REC-0007','2025-09-05','FY 2025-26','Sep','Q2','Active','Quarterly sponsorship',NULL,75000,0,0,0,NULL,NULL,NULL,0,0,0,0),
('REC-0008','2025-09-25','FY 2025-26','Sep','Q2','Active','Venue + logistics expenditure',NULL,0,30000,0,0,NULL,NULL,NULL,0,0,0,0),
('REC-0009','2025-10-12','FY 2025-26','Oct','Q3','Completed','Suraksha Index training - Zone A',NULL,0,0,0,0,NULL,NULL,NULL,1,0,0,0),
('REC-0010','2025-10-29','FY 2025-26','Oct','Q3','Completed','Suraksha Index AP added',NULL,0,0,0,0,NULL,NULL,NULL,0,1,0,0),
('REC-0011','2025-11-18','FY 2025-26','Nov','Q3','Completed','New Suraksha Index project onboarded',NULL,0,0,0,0,NULL,NULL,NULL,0,0,1,0),
('REC-0012','2025-12-09','FY 2025-26','Dec','Q3','Completed','FIST Awards nominations submitted',NULL,0,0,0,0,NULL,NULL,NULL,0,0,0,2),
('REC-0013','2026-01-22','FY 2025-26','Jan','Q4','Active','PACC 2027 sponsorship contribution',NULL,0,0,100000,0,NULL,NULL,NULL,0,0,0,0),
('REC-0014','2026-02-06','FY 2025-26','Feb','Q4','Active','New individual member','Individual',0,0,0,0,NULL,NULL,NULL,0,0,0,0),
('REC-0015','2026-03-17','FY 2025-26','Mar','Q4','Completed','FY closing event',NULL,0,0,0,0,'Building Fire Safety Conference',NULL,NULL,0,0,0,0),
('REC-0016','2026-04-09','FY 2026-27','Apr','Q1','Active','New FY corporate sponsor','Corporate',60000,0,0,0,NULL,NULL,NULL,0,0,0,0),
('REC-0017','2026-05-11','FY 2026-27','May','Q1','Active','Institutional member','Institutional',0,0,0,0,NULL,NULL,NULL,0,0,0,0),
('REC-0018','2026-06-21','FY 2026-27','Jun','Q1','Completed','Suraksha Awareness Drive',NULL,0,0,0,0,'Suraksha Awareness Drive',NULL,NULL,0,0,0,0),
('REC-0019','2026-07-14','FY 2026-27','Jul','Q2','Completed','Electrical fire hazards',NULL,0,0,0,0,NULL,'Electrical Fire Hazards Training',NULL,0,0,0,0),
('REC-0020','2026-08-03','FY 2026-27','Aug','Q2','Active','Sponsorship + journal ad',NULL,40000,0,0,15000,NULL,NULL,NULL,0,0,0,0),
('REC-0021','2026-08-19','FY 2026-27','Aug','Q2','Active','Office running expenditure',NULL,0,15000,0,0,NULL,NULL,NULL,0,0,0,0),
('REC-0022','2026-07-02','FY 2026-27','Jul','Q2','Cancelled','Payment reversed','Corporate',20000,0,0,0,NULL,NULL,NULL,0,0,0,0);
PRAGMA optimize;
