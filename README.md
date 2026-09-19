# Broiler Integration Management Platform — Production ERP

Production-ready enterprise poultry integration management platform digitizing the complete operational lifecycle of a broiler integration business.

## Key Operational Modules

1. **Dashboard & Real-Time Analytics**: Live KPIs for Birds Housed, Birds Sold, Birds Available, Feed Stock, Pending Expenses, and Growing Charges Payable.
2. **Farmer & Farm Management**: Contracted farmer registry, automated farmer code generation (`AN-VIS-XXXXX`), bank details, farms, and shed capacity management.
3. **Flock Placement & Daily Production**: Hatchery origin tracking, breed, placed quantity, daily mortality/culling entries with non-negative count safeguards, feed bags, water, average body weight, and live FCR calculations.
4. **Transaction-Based Inventory**: Immutable ledger accounting for Feed stock and Medicine batches with expiry warnings (`ACTIVE`, `EXPIRING_SOON`, `EXPIRED`).
5. **Procurement & Hatcheries**: Hatchery supplier records, chick purchases, vaccination/transport costs, total cost breakdown.
6. **Bird Availability Engine**: Age-wise bucketing ($35\text{d}, 36\text{d}, 37\text{d}, 38\text{d}, 39\text{d}, 40+\text{d}$) with lifting eligibility filters.
7. **Bird Lifting & Trader Ledgers**: Weighbridge gross/tare/net weight recording, rate validation, auto-sales invoice generation, and trader debit/credit running balances.
8. **Growing Charges (GC) Engine**: Versioned rule-based commercial calculation engine with line-item mathematical breakdown auditability ($\text{Base GC} \pm \text{FCR} \pm \text{Mortality} \pm \text{Weight} + \text{Incentives} - \text{Penalties}$).
9. **Expense Approvals & Payments**: Multi-step approval workflows with self-approval guards and bank payment provider abstractions.
10. **Reports & Audit**: Exportable CSV/Excel reports and immutable system audit logs.
11. **Mobile Supervisor Experience**: Quick-action mobile view optimized for field supervisors (`/mobile`).

---

## Standard Demo Credentials

| Role | Email | Password | Scope |
| --- | --- | --- | --- |
| **Admin** | `admin@example.com` | `admin123` | Full system access |
| **Manager** | `manager@example.com` | `manager123` | Assigned branch & supervisor oversight |
| **Supervisor** | `supervisor@example.com` | `super123` | Field daily reports & lifting |
| **Accountant** | `accountant@example.com` | `account123` | Expenses, payments & growing charges |

---

## Local Development Setup

### 1. Backend (Python FastAPI)
```bash
cd apps/api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
PYTHONPATH=. pytest tests/
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend (Next.js 15+)
```bash
cd apps/web
npm install
npm run build
npm run dev
```

### 3. Docker Compose
```bash
docker-compose up --build
```
