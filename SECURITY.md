# Security Architecture

1. **Authentication**: Secure password hashing using PBKDF2/SHA256 and JWT bearer token session security.
2. **RBAC**: Server-side role authorization (`ADMIN`, `MANAGER`, `SUPERVISOR`, `ACCOUNTANT`).
3. **Audit Logging**: Immutable action logging tracking user, IP, module, and state changes.
4. **Data Isolation**: Multi-level data hierarchy scoping.
