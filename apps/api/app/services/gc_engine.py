import json
from datetime import datetime
from typing import Dict, Any
from app.models.flock import Flock
from app.models.finance import GrowingChargeRule, GrowingChargeCalculation

class GrowingChargeEngine:
    @staticmethod
    def calculate(
        flock: Flock,
        rule: GrowingChargeRule,
        assigned_grade: str = "A"
    ) -> Dict[str, Any]:
        """
        Calculates Growing Charges with full mathematical breakdown transparency.
        """
        placed_qty = flock.placed_quantity or 1
        lifted_qty = flock.total_lifted or 0
        total_mortality = flock.total_mortality or 0
        mortality_pct = round((total_mortality / placed_qty) * 100, 2)
        
        feed_consumed_kg = flock.total_feed_consumed_kg or 0.0
        # Estimate average weight from lifted birds or body weight
        total_weight_kg = (lifted_qty * (flock.avg_body_weight_kg or 2.1)) if lifted_qty > 0 else 0.0
        actual_fcr = round(feed_consumed_kg / total_weight_kg, 2) if total_weight_kg > 0 else (flock.current_fcr or 1.6)

        # 1. Base GC
        base_rate = rule.base_gc_per_kg or 6.50
        base_gc_amount = round(total_weight_kg * base_rate, 2)

        # 2. FCR Adjustment (Difference in FCR points)
        target_fcr = rule.std_fcr_target or 1.55
        fcr_diff = round(target_fcr - actual_fcr, 2)
        if fcr_diff > 0:
            # FCR better (lower) than standard target -> Bonus
            fcr_adj = round(fcr_diff * 100 * (rule.fcr_bonus_rate_per_point or 0.10) * total_weight_kg, 2)
        else:
            # FCR worse (higher) than target -> Penalty
            fcr_adj = round(fcr_diff * 100 * (rule.fcr_penalty_rate_per_point or 0.10) * total_weight_kg, 2)

        # 3. Mortality Adjustment
        target_mortality = rule.std_mortality_target or 3.0
        mort_diff = round(target_mortality - mortality_pct, 2)
        if mort_diff >= 0:
            mortality_adj = round(mort_diff * 50.0, 2) # Incentive bonus for low mortality
        else:
            mortality_adj = round(mort_diff * (rule.mortality_penalty_rate or 0.05) * total_weight_kg, 2)

        # 4. Grade & Incentive Adjustments
        grade_bonus = 500.0 if assigned_grade in ["A+", "A"] else 0.0
        incentives_amount = 300.0 # Standard seasonal bonus
        penalty_amount = 0.0

        final_gc = max(0.0, round(
            base_gc_amount + fcr_adj + mortality_adj + grade_bonus + incentives_amount - penalty_amount, 2
        ))

        breakdown = {
            "inputs": {
                "placed_quantity": placed_qty,
                "lifted_quantity": lifted_qty,
                "total_mortality": total_mortality,
                "mortality_percentage": mortality_pct,
                "total_weight_lifted_kg": total_weight_kg,
                "total_feed_consumed_kg": feed_consumed_kg,
                "actual_fcr": actual_fcr,
                "target_fcr": target_fcr,
                "assigned_grade": assigned_grade
            },
            "line_items": [
                {"name": f"Base Growing Charge ({base_rate} ₹/kg)", "amount": base_gc_amount},
                {"name": f"FCR Adjustment (Actual FCR {actual_fcr} vs Target {target_fcr})", "amount": fcr_adj},
                {"name": f"Mortality Adjustment (Actual {mortality_pct}% vs Target {target_mortality}%)", "amount": mortality_adj},
                {"name": f"Grade Bonus ({assigned_grade})", "amount": grade_bonus},
                {"name": "Seasonal & Performance Incentive", "amount": incentives_amount},
                {"name": "Deductions / Penalties", "amount": -penalty_amount}
            ],
            "final_gc_amount": final_gc,
            "calculated_at": datetime.utcnow().isoformat()
        }

        return {
            "rule_version": rule.version,
            "total_birds_placed": placed_qty,
            "total_birds_lifted": lifted_qty,
            "total_weight_lifted_kg": total_weight_kg,
            "total_feed_consumed_kg": feed_consumed_kg,
            "actual_fcr": actual_fcr,
            "mortality_percentage": mortality_pct,
            "assigned_grade": assigned_grade,
            "base_gc_amount": base_gc_amount,
            "fcr_adjustment": fcr_adj,
            "mortality_adjustment": mortality_adj,
            "weight_adjustment": 0.0,
            "grade_bonus": grade_bonus,
            "incentives_amount": incentives_amount,
            "penalty_amount": penalty_amount,
            "final_gc_amount": final_gc,
            "breakdown_json": json.dumps(breakdown)
        }
