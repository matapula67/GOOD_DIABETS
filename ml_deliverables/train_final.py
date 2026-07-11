import pandas as pd, numpy as np, json
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, precision_recall_fscore_support
from xgboost import XGBClassifier
import joblib

X = pd.read_csv('/home/claude/work/ml/X.csv')
y = pd.read_csv('/home/claude/work/ml/y.csv').values.ravel()
FEATURES = list(X.columns)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
X_test_s = scaler.transform(X_test)

def evaluate(name, y_true, pred, proba):
    p,r,f1,_ = precision_recall_fscore_support(y_true, pred, average='macro', zero_division=0)
    per_class_p, per_class_r, per_class_f1, support = precision_recall_fscore_support(y_true, pred, average=None, zero_division=0)
    return {
        'accuracy': float(accuracy_score(y_true, pred)),
        'precision_macro': float(p),
        'recall_macro': float(r),
        'f1_macro': float(f1),
        'auc_roc_ovr': float(roc_auc_score(y_true, proba, multi_class='ovr')),
        'per_class': {
            'low':    {'precision': float(per_class_p[0]), 'recall': float(per_class_r[0]), 'f1': float(per_class_f1[0]), 'support': int(support[0])},
            'medium': {'precision': float(per_class_p[1]), 'recall': float(per_class_r[1]), 'f1': float(per_class_f1[1]), 'support': int(support[1])},
            'high':   {'precision': float(per_class_p[2]), 'recall': float(per_class_r[2]), 'f1': float(per_class_f1[2]), 'support': int(support[2])},
        }
    }

results = {}

lr = LogisticRegression(max_iter=1000)
lr.fit(X_train_s, y_train)
results['logistic_regression'] = evaluate('lr', y_test, lr.predict(X_test_s), lr.predict_proba(X_test_s))

rf = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, class_weight='balanced', n_jobs=-1)
rf.fit(X_train, y_train)
results['random_forest'] = evaluate('rf', y_test, rf.predict(X_test), rf.predict_proba(X_test))

xgb = XGBClassifier(n_estimators=60, max_depth=4, learning_rate=0.15, random_state=42, eval_metric='mlogloss')
xgb.fit(X_train, y_train)
results['xgboost'] = evaluate('xgb', y_test, xgb.predict(X_test), xgb.predict_proba(X_test))

results['_selected_model'] = 'xgboost'
results['_features'] = FEATURES
results['_dataset'] = 'diabetes_prediction_dataset (Kaggle, Mustafa Tahsin) - 100,000 patient records, 3-class risk label engineered from HbA1c/glucose ADA thresholds + diagnosed diabetes flag'
results['_n_train'] = len(X_train)
results['_n_test'] = len(X_test)

print(json.dumps(results, indent=2))

with open('/home/claude/work/ml/results.json','w') as f:
    json.dump(results, f, indent=2)

joblib.dump(xgb, '/home/claude/work/ml/xgb_final.joblib')
joblib.dump(rf, '/home/claude/work/ml/rf_final.joblib')
joblib.dump(lr, '/home/claude/work/ml/lr_final.joblib')
joblib.dump(scaler, '/home/claude/work/ml/scaler_final.joblib')

# feature importance for the deployed model
fi = dict(zip(FEATURES, [float(v) for v in xgb.feature_importances_]))
with open('/home/claude/work/ml/feature_importance.json','w') as f:
    json.dump(fi, f, indent=2)
print("\nFeature importance (xgboost):", fi)
