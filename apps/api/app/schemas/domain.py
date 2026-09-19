from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any, Dict
from datetime import datetime

# --- Location Schemas ---
class LocationCreate(BaseModel):
    state_name: str
    state_code: str
    branch_name: str
    branch_code: str
    area_name: str
    area_code: str

# --- Farmer & Farm Schemas ---
class ShedCreate(BaseModel):
    shed_number: str
    capacity: int
    area_sqft: Optional[float] = None

class ShedOut(BaseModel):
    id: str
    shed_number: str
    capacity: int
    area_sqft: Optional[float] = None
    status: str

    model_config = ConfigDict(from_attributes=True)

class FarmCreate(BaseModel):
    farm_name: str
    farmer_id: str
    area_id: Optional[str] = None
    supervisor_id: Optional[str] = None
    gps_latitude: Optional[float] = None
    gps_longitude: Optional[float] = None
    sheds: List[ShedCreate] = []

class FarmOut(BaseModel):
    id: str
    farm_code: str
    farm_name: str
    farmer_id: str
    total_capacity: int
    area_id: Optional[str] = None
    supervisor_id: Optional[str] = None
    gps_latitude: Optional[float] = None
    gps_longitude: Optional[float] = None
    status: str
    created_at: datetime
    sheds: List[ShedOut] = []

    model_config = ConfigDict(from_attributes=True)

class FarmerCreate(BaseModel):
    full_name: str
    mobile: str
    address: str
    state: str
    district: str
    mandal: Optional[str] = None
    village: Optional[str] = None
    branch_id: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_no: Optional[str] = None
    ifsc_code: Optional[str] = None

class FarmerOut(BaseModel):
    id: str
    farmer_code: str
    full_name: str
    mobile: str
    address: str
    state: str
    district: str
    mandal: Optional[str] = None
    village: Optional[str] = None
    branch_id: Optional[str] = None
    bank_name: Optional[str] = None
    bank_account_no: Optional[str] = None
    ifsc_code: Optional[str] = None
    status: str
    created_at: datetime
    farms: List[FarmOut] = []

    model_config = ConfigDict(from_attributes=True)

# --- Hatchery & Flock Placement Schemas ---
class HatcheryCreate(BaseModel):
    name: str
    contact_person: Optional[str] = None
    mobile: Optional[str] = None
    address: Optional[str] = None
    gst_number: Optional[str] = None

class HatcheryOut(HatcheryCreate):
    id: str
    status: str

    model_config = ConfigDict(from_attributes=True)

class FlockPlacementCreate(BaseModel):
    batch_number: str
    farm_id: str
    shed_id: Optional[str] = None
    hatchery_id: Optional[str] = None
    supervisor_id: Optional[str] = None
    placement_date: datetime
    breed: str = "Cobb 500"
    placed_quantity: int
    chick_cost_per_unit: float

class FlockOut(BaseModel):
    id: str
    flock_code: str
    batch_number: str
    farm_id: str
    shed_id: Optional[str] = None
    hatchery_id: Optional[str] = None
    supervisor_id: Optional[str] = None
    placement_date: datetime
    breed: str
    placed_quantity: int
    chick_cost_per_unit: float
    current_birds: int
    total_mortality: int
    total_culling: int
    total_lifted: int
    total_feed_consumed_kg: float
    avg_body_weight_kg: float
    current_fcr: float
    status: str

    model_config = ConfigDict(from_attributes=True)

# --- Daily Report Schemas ---
class DailyReportCreate(BaseModel):
    flock_id: str
    report_date: datetime
    mortality_count: int = 0
    culling_count: int = 0
    feed_consumed_bags: float = 0.0
    feed_type: Optional[str] = "Grower"
    water_consumption_liters: float = 0.0
    avg_body_weight_g: float = 0.0
    medicines_used: Optional[str] = None
    vaccination_done: Optional[str] = None
    remarks: Optional[str] = None

class DailyReportOut(BaseModel):
    id: str
    flock_id: str
    report_date: datetime
    day_age: int
    opening_birds: int
    mortality_count: int
    culling_count: int
    birds_lifted_count: int
    closing_birds: int
    feed_consumed_bags: float
    feed_consumed_kg: float
    feed_type: Optional[str]
    water_consumption_liters: float
    avg_body_weight_g: float
    fcr: float
    medicines_used: Optional[str]
    vaccination_done: Optional[str]
    remarks: Optional[str]

    model_config = ConfigDict(from_attributes=True)

# --- Inventory Schemas ---
class FeedTypeCreate(BaseModel):
    code: str
    name: str
    bag_weight_kg: float = 50.0
    cost_per_kg: float

class FeedTransferCreate(BaseModel):
    source_location_id: str
    destination_location_id: str
    feed_type_id: str
    quantity_bags: float
    flock_id: Optional[str] = None
    remarks: Optional[str] = None

# --- Sales & Lifting Schemas ---
class TraderCreate(BaseModel):
    trader_name: str
    mobile: str
    address: Optional[str] = None
    gst_number: Optional[str] = None
    credit_limit: float = 500000.0

class TraderOut(TraderCreate):
    id: str
    trader_code: str
    current_balance: float
    status: str

    model_config = ConfigDict(from_attributes=True)

class BirdLiftingCreate(BaseModel):
    trader_id: str
    farm_id: str
    flock_id: str
    vehicle_number: str
    gross_weight_kg: float
    tare_weight_kg: float
    birds_count: int
    rate_per_kg: float
    remarks: Optional[str] = None

class BirdLiftingOut(BaseModel):
    id: str
    lifting_number: str
    lifting_date: datetime
    trader_id: str
    farm_id: str
    flock_id: str
    vehicle_number: str
    gross_weight_kg: float
    tare_weight_kg: float
    net_weight_kg: float
    birds_count: int
    avg_bird_weight_kg: float
    rate_per_kg: float
    total_amount: float

    model_config = ConfigDict(from_attributes=True)

# --- Growing Charges Engine Schemas ---
class GrowingChargeRuleCreate(BaseModel):
    version: str
    description: Optional[str] = None
    base_gc_per_kg: float = 6.50
    std_fcr_target: float = 1.55
    fcr_bonus_rate_per_point: float = 0.10
    fcr_penalty_rate_per_point: float = 0.10
    std_mortality_target: float = 3.0
    mortality_penalty_rate: float = 0.05

class GrowingChargeCalculationOut(BaseModel):
    id: str
    flock_id: str
    rule_version: str
    calculation_date: datetime
    total_birds_placed: int
    total_birds_lifted: int
    total_weight_lifted_kg: float
    total_feed_consumed_kg: float
    actual_fcr: float
    mortality_percentage: float
    assigned_grade: str
    base_gc_amount: float
    fcr_adjustment: float
    mortality_adjustment: float
    weight_adjustment: float
    grade_bonus: float
    incentives_amount: float
    penalty_amount: float
    final_gc_amount: float
    breakdown_json: str
    status: str

    model_config = ConfigDict(from_attributes=True)

# --- Expense & Approval Schemas ---
class ExpenseCreate(BaseModel):
    category_id: str
    farm_id: Optional[str] = None
    flock_id: Optional[str] = None
    amount: float
    description: str

class ExpenseOut(BaseModel):
    id: str
    expense_number: str
    expense_date: datetime
    category_id: str
    farm_id: Optional[str]
    flock_id: Optional[str]
    submitted_by: str
    amount: float
    description: str
    status: str

    model_config = ConfigDict(from_attributes=True)

class ExpenseApprovalCreate(BaseModel):
    action: str # APPROVED, REJECTED
    rejection_reason: Optional[str] = None
