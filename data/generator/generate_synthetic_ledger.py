import random
import datetime
import math
import os

NUM_USERS = 50
DAYS = 30
START_DATE = datetime.date(2026, 10, 1)

raw_records = []
feature_records = []

txn_id_counter = 10000

for u in range(1, NUM_USERS + 1):
    user_id = f"USR_{u:04d}"
    
    # 70% Salaried, 20% Gig-Worker, 10% High-Income
    user_type = random.choices(["salaried", "gig", "affluent"], weights=[0.7, 0.2, 0.1])[0]
    
    if user_type == "salaried":
        salary = random.choice([20000.0, 25000.0, 30000.0])
        income_entropy = round(random.uniform(0.1, 0.25), 2)
        cash_out_prop = random.uniform(0.5, 0.75)
    elif user_type == "gig":
        salary = random.choice([10000.0, 14000.0, 18000.0])
        income_entropy = round(random.uniform(0.5, 0.8), 2)
        cash_out_prop = random.uniform(0.4, 0.65)
    else:
        salary = random.choice([45000.0, 60000.0])
        income_entropy = round(random.uniform(0.02, 0.08), 2)
        cash_out_prop = random.uniform(0.1, 0.25)

    balance = random.uniform(200.0, 1000.0)
    
    # Track totals for features
    total_inflow = 0.0
    total_outflow = 0.0
    total_cashout = 0.0
    total_fee = 0.0
    total_fixed = 0.0
    total_discretionary = 0.0
    first_10d_spend = 0.0
    day15_balance = balance
    daily_spends = [0.0] * DAYS

    # Day 1: Salary or First Inflow
    txn_id_counter += 1
    total_inflow += salary
    bal_before = balance
    balance += salary
    raw_records.append((f"TXN_{txn_id_counter}", user_id, f"{START_DATE} 09:00:00", "INFLOW", "CASH_IN", salary, 0.0, "SALARY", "ONLINE_PGW", bal_before, balance))

    # Daily Events
    for d in range(DAYS):
        curr_date = START_DATE + datetime.timedelta(days=d)
        
        # Gig worker 2nd payment
        if user_type == "gig" and d == 14:
            txn_id_counter += 1
            gig_pay = random.uniform(4000, 7000)
            total_inflow += gig_pay
            bal_before = balance
            balance += gig_pay
            raw_records.append((f"TXN_{txn_id_counter}", user_id, f"{curr_date} 15:00:00", "INFLOW", "P2P_SEND", gig_pay, 0.0, "SALARY", "APP_QR", bal_before, balance))

        # Utilities in first 5 days
        if d == 3:
            util = random.uniform(1500, 2500)
            if balance > util:
                txn_id_counter += 1
                bal_before = balance
                balance -= util
                total_outflow += util
                total_fixed += util
                daily_spends[d] += util
                if d < 10: first_10d_spend += util
                raw_records.append((f"TXN_{txn_id_counter}", user_id, f"{curr_date} 11:30:00", "OUTFLOW", "BILL_PAY", util, 0.0, "UTILITY", "APP_QR", bal_before, balance))

        # Regular daily expenses
        if random.random() < 0.65 and balance > 300:
            txn_id_counter += 1
            is_cashout = random.random() < cash_out_prop
            
            if is_cashout:
                amt = random.choice([1000.0, 2000.0, 3000.0])
                if balance > (amt + amt * 0.0185):
                    fee = amt * 0.0185
                    bal_before = balance
                    balance -= (amt + fee)
                    total_outflow += amt
                    total_cashout += amt
                    total_fee += fee
                    total_discretionary += amt
                    daily_spends[d] += amt
                    if d < 10: first_10d_spend += amt
                    raw_records.append((f"TXN_{txn_id_counter}", user_id, f"{curr_date} 18:20:00", "OUTFLOW", "CASH_OUT", amt, fee, "DISCRETIONARY", "AGENT_POINT", bal_before, balance))
            else:
                amt = random.uniform(200, 1200)
                cat = random.choice(["GROCERY", "DINING_OUT", "TRANSPORT"])
                if balance > amt:
                    bal_before = balance
                    balance -= amt
                    total_outflow += amt
                    total_discretionary += amt
                    daily_spends[d] += amt
                    if d < 10: first_10d_spend += amt
                    raw_records.append((f"TXN_{txn_id_counter}", user_id, f"{curr_date} 20:00:00", "OUTFLOW", "MERCHANT_PAY", amt, 0.0, cat, "APP_QR", bal_before, balance))

        if d == 14:
            day15_balance = balance

    # Calculate Feature Aggregates
    burn_10d = round(first_10d_spend / (total_inflow if total_inflow > 0 else 1), 2)
    last7_spends = daily_spends[7:14]
    r_mean = round(sum(last7_spends) / 7.0, 2)
    variance = sum((x - r_mean) ** 2 for x in last7_spends) / 7.0
    r_std = round(math.sqrt(variance), 2)
    
    cashout_ratio = round(total_cashout / (total_outflow if total_outflow > 0 else 1), 2)
    fixed_ratio = round(total_fixed / (total_inflow if total_inflow > 0 else 1), 2)
    discretionary_ratio = round(total_discretionary / (total_outflow if total_outflow > 0 else 1), 2)
    velocity_acc = round(random.uniform(0.8, 1.7), 2)
    
    closing_balance = round(balance, 2)
    is_crunch = 1 if closing_balance < 500.0 else 0

    feature_records.append((
        user_id, salary, income_entropy, burn_10d, r_mean, r_std, velocity_acc,
        cashout_ratio, round(total_fee, 2), fixed_ratio, discretionary_ratio,
        round(day15_balance, 2), closing_balance, is_crunch
    ))

output_dir = "data/generator"
os.makedirs(output_dir, exist_ok=True)

# Write to CSV
with open(os.path.join(output_dir, "raw_transaction_ledger.csv"), "w") as f:
    f.write("transaction_id,user_id,timestamp,direction,transaction_type,amount,fee_amount,category,channel,balance_before,balance_after\n")
    for r in raw_records:
        f.write(f"{r[0]},{r[1]},{r[2]},{r[3]},{r[4]},{r[5]:.2f},{r[6]:.2f},{r[7]},{r[8]},{r[9]:.2f},{r[10]:.2f}\n")

with open(os.path.join(output_dir, "ml_feature_store.csv"), "w") as f:
    f.write("user_id,avg_monthly_inflow,income_entropy,burn_rate_first_10d,rolling_outflow_mean_7d,rolling_outflow_std_7d,velocity_acceleration,cash_out_dependency_ratio,avoidable_fee_leakage,fixed_obligation_ratio,discretionary_spend_ratio,current_balance_day15,target_closing_balance_day30,is_liquidity_crunch\n")
    for r in feature_records:
        f.write(f"{r[0]},{r[1]:.2f},{r[2]},{r[3]},{r[4]:.2f},{r[5]:.2f},{r[6]},{r[7]},{r[8]:.2f},{r[9]},{r[10]},{r[11]:.2f},{r[12]:.2f},{r[13]}\n")

print(f"Dataset generated: {len(raw_records)} transactions, {len(feature_records)} ML user records.")
