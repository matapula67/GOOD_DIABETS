# Skripti za Kufunza Modeli (Python)

Hizi ni skripti zilizotumika kutengeneza modeli ya XGBoost inayotumika kwenye
application (src/lib/model/ ndani ya diabetes-risk-assessment).

1. `prepare_data.py` — inapakua/inasoma dataset, inatengeneza risk_level (0/1/2)
   kutoka HbA1c/glucose/diabetes flag, inahifadhi X.csv na y.csv
2. `train_final.py` — inafunza Logistic Regression, Random Forest, na XGBoost,
   inalinganisha accuracy/precision/recall/F1/AUC-ROC, inahifadhi matokeo

Dataset chanzo: "Diabetes Prediction Dataset" (Kaggle, Mustafa Tahsin),
rekodi 100,000. Kwa maelezo kamili soma
`src/lib/model/README.md` ndani ya mradi wa application.
