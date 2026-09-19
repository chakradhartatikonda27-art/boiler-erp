# Business Rules Engine

## 1. Growing Charge (GC) Formula

$$\text{Final GC} = \text{Base GC Amount} + \text{FCR Adj} + \text{Mortality Adj} + \text{Grade Bonus} + \text{Incentives} - \text{Penalties}$$

### Components
1. **Base GC Amount**: $\text{Total Weight Lifted (kg)} \times \text{Base Rate (e.g. ₹6.50/kg)}$
2. **FCR Adjustment**: Difference between Standard FCR target (1.55) and actual FCR.
3. **Mortality Adjustment**: Bonus for mortality $<3.0\%$, penalty for higher mortality.
4. **Grade Bonus**: ₹500 flat bonus for Grade A / A+.
5. **Incentives**: Seasonal / performance bonus.

## 2. Inventory Transaction Accounting
- Stock is never manually overwritten.
- Stock movements generate immutable `TRANSFER_IN` / `TRANSFER_OUT` records.
