import asyncio
from datetime import datetime, timedelta
import random

from app.database import AsyncSessionLocal, engine, Base
from app.dependencies import get_password_hash
from app.models import (
    Organization, State, Branch, Area, User, UserAssignment,
    Farmer, Farm, Shed, Hatchery, Flock, DailyReport, MortalityEntry,
    FeedType, FeedLocation, FeedTransaction, Medicine, MedicineBatch,
    Trader, TraderLedger, BirdLifting, Sale, ExpenseCategory, Expense,
    GrowingChargeRule, GrowingChargeCalculation, AuditLog, SystemSetting
)

async def seed_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        # Check if users already exist
        res = await db.execute(Base.metadata.tables["users"].select())
        if res.first() is not None:
            print("Database already contains data. Skipping seed.")
            return

        print("Seeding initial production-ready data...")

        # 1. Organization & Location Hierarchy
        org = Organization(name="PoultryCorp Integrators Ltd", code="PC-ORG-001", gst_number="37AAACP1234F1Z1")
        db.add(org)
        await db.flush()

        state = State(organization_id=org.id, name="Andhra Pradesh", code="AP")
        db.add(state)
        await db.flush()

        branch = Branch(state_id=state.id, name="Visakhapatnam Central", code="VSP-01")
        db.add(branch)
        await db.flush()

        area = Area(branch_id=branch.id, name="Anakapalle West", code="AKP-W")
        db.add(area)
        await db.flush()

        # 2. Users (Standard Demo Credentials)
        admin = User(
            email="admin@example.com",
            full_name="Rajesh Varma (Admin)",
            hashed_password=get_password_hash("admin123"),
            role="ADMIN",
            mobile="+91-9876543210"
        )
        manager = User(
            email="manager@example.com",
            full_name="Suresh Kumar (Manager)",
            hashed_password=get_password_hash("manager123"),
            role="MANAGER",
            mobile="+91-9876543211"
        )
        supervisor = User(
            email="supervisor@example.com",
            full_name="Venkatesh Rao (Supervisor)",
            hashed_password=get_password_hash("super123"),
            role="SUPERVISOR",
            mobile="+91-9876543212"
        )
        accountant = User(
            email="accountant@example.com",
            full_name="Anitha Sharma (Accountant)",
            hashed_password=get_password_hash("account123"),
            role="ACCOUNTANT",
            mobile="+91-9876543213"
        )
        db.add_all([admin, manager, supervisor, accountant])
        await db.flush()

        # 3. Farmers & Farms & Sheds
        f1 = Farmer(
            farmer_code="AP-VSP-00001",
            full_name="Rambabu Naidu",
            mobile="+91-9988776655",
            address="Plot 14, Main Road, Kasimkota",
            state="Andhra Pradesh",
            district="Visakhapatnam",
            mandal="Kasimkota",
            village="Tallapalem",
            branch_id=branch.id,
            bank_name="State Bank of India",
            bank_account_no="30918239102",
            ifsc_code="SBIN0001234"
        )
        f2 = Farmer(
            farmer_code="AP-VSP-00002",
            full_name="Koteswara Rao",
            mobile="+91-9988776644",
            address="Shed Road, Munagapaka",
            state="Andhra Pradesh",
            district="Visakhapatnam",
            mandal="Munagapaka",
            village="Vempadu",
            branch_id=branch.id,
            bank_name="HDFC Bank",
            bank_account_no="50100293810",
            ifsc_code="HDFC0000567"
        )
        db.add_all([f1, f2])
        await db.flush()

        farm1 = Farm(
            farm_code="FARM-AP-VSP-00001-01",
            farm_name="Sri Venkateswara Broiler Farm",
            farmer_id=f1.id,
            area_id=area.id,
            supervisor_id=supervisor.id,
            total_capacity=10000,
            gps_latitude=17.6868,
            gps_longitude=83.2185
        )
        farm2 = Farm(
            farm_code="FARM-AP-VSP-00002-01",
            farm_name="Laxmi Green Poultry Farm",
            farmer_id=f2.id,
            area_id=area.id,
            supervisor_id=supervisor.id,
            total_capacity=12000,
            gps_latitude=17.7011,
            gps_longitude=83.2500
        )
        db.add_all([farm1, farm2])
        await db.flush()

        shed1 = Shed(farm_id=farm1.id, shed_number="Shed-A", capacity=5000, area_sqft=6000.0)
        shed2 = Shed(farm_id=farm1.id, shed_number="Shed-B", capacity=5000, area_sqft=6000.0)
        db.add_all([shed1, shed2])
        await db.flush()

        # 4. Hatcheries & Feed & Medicines & Traders
        hatchery = Hatchery(
            name="Venkateshwara Hatcheries Pvt Ltd",
            contact_person="Ramesh Reddy",
            mobile="+91-9123456789",
            address="Ganjimutt Industrial Area",
            gst_number="29AAACV1234E1ZP"
        )
        db.add(hatchery)
        await db.flush()

        ft1 = FeedType(code="FT-PRE", name="Pre-Starter Feed", bag_weight_kg=50.0, cost_per_kg=38.5)
        ft2 = FeedType(code="FT-STR", name="Starter Feed", bag_weight_kg=50.0, cost_per_kg=36.0)
        ft3 = FeedType(code="FT-GRW", name="Grower Feed", bag_weight_kg=50.0, cost_per_kg=34.5)
        ft4 = FeedType(code="FT-FNS", name="Finisher Feed", bag_weight_kg=50.0, cost_per_kg=33.0)
        db.add_all([ft1, ft2, ft3, ft4])

        med1 = Medicine(name="Vimeral Multivitamin Syrup", category="Vitamin", unit="bottle", min_stock_alert=20)
        med2 = Medicine(name="Enrofloxacin 10% Solution", category="Antibiotic", unit="bottle", min_stock_alert=15)
        db.add_all([med1, med2])
        await db.flush()

        trader1 = Trader(
            trader_code="TRD-1001",
            trader_name="Anakapalle Chicken Traders",
            mobile="+91-9848022334",
            address="Market Yard, Anakapalle",
            gst_number="37ABCPT9876K1Z3",
            credit_limit=1000000.0,
            current_balance=250000.0
        )
        db.add(trader1)
        await db.flush()

        # 5. Active & Lifting-Ready Flocks
        now = datetime.utcnow()
        placement_37d = now - timedelta(days=37)
        placement_20d = now - timedelta(days=20)

        flock1 = Flock(
            flock_code="FLK-9001",
            batch_number="BATCH-2026-08A",
            farm_id=farm1.id,
            shed_id=shed1.id,
            hatchery_id=hatchery.id,
            supervisor_id=supervisor.id,
            placement_date=placement_37d,
            breed="Cobb 500",
            placed_quantity=5000,
            chick_cost_per_unit=32.0,
            current_birds=4820,
            total_mortality=180,
            total_culling=0,
            total_lifted=0,
            total_feed_consumed_kg=16500.0,
            avg_body_weight_kg=2.15,
            current_fcr=1.59,
            status="READY_FOR_LIFTING"
        )
        flock2 = Flock(
            flock_code="FLK-9002",
            batch_number="BATCH-2026-09B",
            farm_id=farm2.id,
            hatchery_id=hatchery.id,
            supervisor_id=supervisor.id,
            placement_date=placement_20d,
            breed="Ross 308",
            placed_quantity=6000,
            chick_cost_per_unit=31.5,
            current_birds=5890,
            total_mortality=110,
            total_culling=0,
            total_lifted=0,
            total_feed_consumed_kg=7800.0,
            avg_body_weight_kg=0.98,
            current_fcr=1.35,
            status="ACTIVE"
        )
        db.add_all([flock1, flock2])
        await db.flush()

        # 6. Growing Charge Rules & Categories & Audit Logs
        gc_rule = GrowingChargeRule(
            version="v1.0-STD",
            description="Standard 2026 Broiler Integration GC Formula",
            base_gc_per_kg=6.50,
            std_fcr_target=1.55,
            std_mortality_target=3.0,
            is_active="ACTIVE"
        )
        db.add(gc_rule)

        cat1 = ExpenseCategory(name="Feed & Logistics")
        cat2 = ExpenseCategory(name="Labour & Supervision")
        cat3 = ExpenseCategory(name="Electricity & Water")
        cat4 = ExpenseCategory(name="Medicines & Vaccines")
        db.add_all([cat1, cat2, cat3, cat4])
        await db.flush()

        exp1 = Expense(
            expense_number="EXP-88001",
            category_id=cat1.id,
            farm_id=farm1.id,
            flock_id=flock1.id,
            submitted_by=supervisor.id,
            amount=4500.0,
            description="Feed unloading charges for 100 bags at Sri Venkateswara Farm",
            status="SUBMITTED"
        )
        db.add(exp1)

        audit = AuditLog(
            user_email="admin@example.com",
            action="SYSTEM_INIT",
            module="SYSTEM",
            record_id="INIT",
            new_value_json='{"status": "SEED_SUCCESS"}'
        )
        db.add(audit)

        await db.commit()
        print("Seed data created successfully!")

if __name__ == "__main__":
    asyncio.run(seed_db())
