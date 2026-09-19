# Database Schema & Data Integrity

## Normalized Tables

- **Location**: `organizations`, `states`, `branches`, `areas`
- **Auth**: `users`, `user_assignments`
- **Farmers & Farms**: `farmers`, `farms`, `sheds`, `farmer_documents`
- **Flock Lifecycle**: `hatcheries`, `chick_purchases`, `chick_transfers`, `flocks`
- **Production**: `daily_reports`, `mortality_entries`, `culling_entries`
- **Inventory**: `feed_types`, `feed_locations`, `feed_transactions`, `medicines`, `medicine_batches`, `medicine_transactions`
- **Sales & Lifting**: `traders`, `trader_ledgers`, `bird_liftings`, `sales`
- **Finance**: `grades`, `incentives`, `growing_charge_rules`, `growing_charge_calculations`, `expense_categories`, `expenses`, `expense_approvals`, `payments`
- **Audit & System**: `audit_logs`, `system_settings`, `notifications`

## Data Integrity Rules
1. Non-negative bird counts (`Closing Birds = Opening Birds - Mortality - Culling - Lifted`).
2. Unique farmer code, farm code, flock code, invoice number, and lifting ticket number.
3. Immutable transaction logs for feed stock movements.
