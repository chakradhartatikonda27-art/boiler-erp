# API Specification

## Key REST Endpoints

### Auth
- `POST /api/auth/login`: Authenticate user and return JWT bearer token.
- `GET /api/auth/me`: Get current authenticated user profile.

### Dashboard
- `GET /api/dashboard`: Real-time operational KPI card counters and age-wise available bird breakdown.

### Farmers & Farms
- `GET /api/farmers`: List farmers.
- `POST /api/farmers`: Create farmer with auto-generated code (`AN-VIS-XXXXX`).
- `POST /api/farmers/{id}/farms`: Add farm & sheds for farmer.

### Flocks & Daily Reports
- `GET /api/flocks`: List active & closed flocks.
- `POST /api/flocks/place`: Place new chick flock.
- `POST /api/daily-reports`: Submit daily report (validates non-negative closing birds and updates FCR).

### Inventory & Feed
- `POST /api/inventory/feed/transfer`: Transfer feed between godown, mill, and farm.
- `GET /api/inventory/medicines/batches`: List medicine batches with expiry status.

### Sales & Lifting
- `GET /api/sales/birds/available`: List flocks eligible for lifting ($\ge 35$ days old).
- `POST /api/sales/lifting`: Record bird lifting, calculate net weight & rate amount, and post trader debit.

### Growing Charges Engine
- `POST /api/growing-charges/flock/{id}/calculate`: Calculate growing charge statement with line-item breakdown.
- `POST /api/growing-charges/{id}/approve`: Approve GC payment statement.

### Expenses & Reports
- `POST /api/finance/expenses`: Submit expense report.
- `POST /api/finance/expenses/{id}/approve`: Approve/reject expense.
- `GET /api/reports/production`: Export production report.
- `GET /api/reports/sales`: Export sales report.
- `GET /api/reports/finance`: Export finance report.
