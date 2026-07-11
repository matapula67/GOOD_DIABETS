import pandas as pd
import numpy as np

df = pd.read_csv('/home/claude/work/repo/data/diabetes_prediction_dataset.csv')
print("Raw shape:", df.shape)
print(df['gender'].value_counts())
print(df['smoking_history'].value_counts())

# Drop rare 'Other' gender rows to keep it binary male/female consistent with app schema
df = df[df['gender'].isin(['Male','Female'])].copy()

# Derive 3-class risk label using standard ADA clinical thresholds on real biomarker columns
# HbA1c: <5.7 normal, 5.7-6.4 prediabetes, >=6.5 diabetes
# Fasting glucose proxy (blood_glucose_level): <100 normal, 100-125 prediabetes, >=126 diabetes
# Combine with the original diagnosed 'diabetes' flag (clinical ground truth) as an override for 'high'
def risk_level(row):
    if row['diabetes'] == 1:
        return 2  # high (clinically diagnosed diabetes)
    hba1c_pre = 5.7 <= row['HbA1c_level'] < 6.5
    gluc_pre = 100 <= row['blood_glucose_level'] < 126
    if hba1c_pre or gluc_pre:
        return 1  # medium (prediabetes range)
    return 0  # low

df['risk_level'] = df.apply(risk_level, axis=1)
print(df['risk_level'].value_counts())

# Map smoking_history to boolean smoking flag matching app schema (yes if current/former/ever/not current)
df['smoking'] = df['smoking_history'].isin(['current','former','ever','not current']).astype(int)
df['gender_male'] = (df['gender'] == 'Male').astype(int)
df['hypertension'] = df['hypertension'].astype(int)
df['heart_disease'] = df['heart_disease'].astype(int)

features = ['age','gender_male','bmi','blood_glucose_level','hypertension','heart_disease','smoking']
X = df[features].copy()
y = df['risk_level'].copy()

X.to_csv('/home/claude/work/ml/X.csv', index=False)
y.to_csv('/home/claude/work/ml/y.csv', index=False)
print("Saved. Feature matrix shape:", X.shape)
print(X.describe())
