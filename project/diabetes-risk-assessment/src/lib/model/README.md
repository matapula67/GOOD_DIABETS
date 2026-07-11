# Modeli ya Utabiri wa Hatari ya Kisukari (Machine Learning)

Sehemu hii inaeleza jinsi tathmini ya hatari inavyokokotolewa sasa: kwa modeli
halisi ya "machine learning" iliyofunzwa kwa data halisi, kama ilivyoainishwa
kwenye Sura ya 3 na 4 ya andiko la utafiti (RESEARCH_PROPOSAL_Group17_DTS).

## 1. Chanzo cha Data

- **Dataset**: "Diabetes Prediction Dataset" (Kaggle, na Mustafa Tahsin) —
  rekodi 100,000 za wagonjwa halisi, zenye: `gender`, `age`, `hypertension`,
  `heart_disease`, `smoking_history`, `bmi`, `HbA1c_level`,
  `blood_glucose_level`, `diabetes` (0/1).
- Data hii ni ya umma (public), imeondolewa taarifa za utambulisho
  (de-identified), sawa na ilivyoainishwa kwenye Sehemu ya 3.5 (Data
  sources) ya andiko la utafiti.

## 2. Kutengeneza "Risk Level" (low / medium / high)

Dataset asilia ina lengo la 0/1 tu (ana kisukari au hapana). Ili kupata
madaraja matatu (low/medium/high) yanayolingana na fomu ya tathmini,
tulitumia vigezo vya kimatibabu vinavyokubalika kimataifa (ADA — American
Diabetes Association):

- **high** — mgonjwa aliyegundulika kuwa na kisukari (`diabetes == 1`)
- **medium** — HbA1c kati ya 5.7% na 6.4%, AU sukari ya damu (fasting) kati
  ya 100-125 mg/dL (kiwango cha "prediabetes")
- **low** — nje ya vigezo hivyo viwili

Hii si data ya kubuni — ni matumizi ya vigezo halisi vya kimatibabu juu ya
vipimo halisi vya HbA1c na glucose vilivyomo kwenye dataset.

## 3. Vipengele (Features) Vilivyotumika Kufunza Modeli

`age, gender, bmi, blood_glucose_level, hypertension, heart_disease, smoking`

**Kumbuka muhimu**: Fomu ya tathmini kwenye application ina fields 12 (ikiwa
na cholesterol, shinikizo la damu (numeric), pombe, kiwango cha mazoezi, na
muda wa kulala). Dataset halisi tuliyoipata haikuwa na baadhi ya vigezo hivi
(havikupimwa/havikuhifadhiwa kwenye utafiti husika wa BRFSS/Kaggle). Kwa
uwazi kamili wa kitaaluma:

- Modeli ya ML (XGBoost) inatumia vipengele 7 vilivyopo kwenye data halisi.
- Fields nyingine (cholesterol, blood pressure, alcohol, activity,
  sleepHours) bado zinakusanywa kwenye fomu na kutumika kwenye
  **mapendekezo ya kiafya (health recommendations)** kama vidokezo vya
  ziada — lakini si sehemu ya alama ya modeli, kwa kuwa hazikuwepo kwenye
  data ya mafunzo. Hii ni "limitation" halali ya kuandikwa kwenye Sura ya 5
  (Limitations) ya andiko la utafiti — jambo la kawaida sana kwenye
  miradi ya data science inapokutana na dataset za umma zenye vigezo
  tofauti na vile vilivyopangwa awali.

## 4. Algorithms Zilizolinganishwa (Logistic Regression, Random Forest, XGBoost)

Modeli tatu zilizoainishwa kwenye andiko (Sehemu 3.8) zilifunzwa na
kulinganishwa kwa: **accuracy, precision (macro), recall (macro), F1-score
(macro), na AUC-ROC (one-vs-rest)**, kwa kutumia train/test split ya 80/20
yenye stratification. Matokeo kamili (ikiwa na per-class precision/recall/F1)
yapo kwenye `training_results.json`.

| Modeli | Accuracy | Precision (macro) | Recall (macro) | F1 (macro) | AUC-ROC |
|---|---|---|---|---|---|
| Logistic Regression | 0.526 | 0.565 | 0.504 | 0.515 | 0.691 |
| Random Forest | 0.546 | 0.555 | 0.603 | 0.491 | 0.734 |
| **XGBoost (iliyochaguliwa)** | **0.600** | **0.799** | 0.544 | **0.536** | 0.734 |

**XGBoost** ilichaguliwa kwa deployment kwa sababu ilikuwa na accuracy na
F1-score bora zaidi kwa ujumla. Kama ilivyo kawaida kwenye matatizo ya
uainishaji wa madaraja matatu, darasa la "medium" (prediabetes) lina recall
ya chini zaidi (~0.17) kwa sababu ni "boundary class" iliyo kati ya low na
high — jambo hili linapaswa kutajwa kama "limitation" ya kimatibabu/kitakwimu
kwenye andiko.

Feature importance ya XGBoost (`feature_importance.json`) inaonyesha
`blood_glucose_level` (~60%) na `age` (~16%) kama vipengele muhimu zaidi —
jambo linalolingana na fasihi iliyotajwa kwenye Sura ya 2 ya andiko
(Talebi Moghaddam et al., 2024; Khokhar et al., 2025).

## 5. Jinsi Modeli Inavyoendeshwa Kwenye Application (Client-Side, Bila Backend)

Kwa kuwa application ni React/TypeScript (frontend pekee, bila backend
seva), modeli iliyofunzwa kwa Python (`xgboost`) ilihamishwa (exported) kama
muundo wa miti (trees) kwa JSON (`xgb_diabetes_model.json`), na injini ndogo
ya inference (`mlModel.ts`) inatembea kwenye miti hiyo hiyo halisi
iliyofunzwa — **si tena "weighted scoring" ya kubuni ya awali**. Hesabu
hii ilithibitishwa (verified) kuwa inatoa matokeo yanayolingana kabisa
(bit-for-bit) na `model.predict_proba()` ya Python.

Faili muhimu:
- `xgb_diabetes_model.json` — muundo wa miti ya modeli iliyofunzwa
- `mlModel.ts` — injini ya kuendesha miti hiyo (tree traversal + softmax)
- `feature_importance.json` — umuhimu wa kila kipengele (kwa maelezo ya
  "sababu kuu" kwa kila mtumiaji)
- `training_results.json` — vipimo kamili vya utendaji vya modeli zote tatu

## 6. Mapendekezo kwa Hatua Zijazo (Ikiwa Muda Utaruhusu)

- Kuongeza SHAP (au feature-contribution ya per-instance) badala ya
  global feature importance pekee, kwa maelezo ya kina zaidi kwa kila
  mgonjwa (Sehemu 4.2 ya andiko inataja hili).
- Kutafuta au kukusanya data yenye vigezo vyote 12 vya fomu (hasa
  cholesterol na blood pressure ya kipimo) ili kuboresha modeli zaidi.
- Kuongeza class balancing zaidi (k.m. SMOTE) kuboresha recall ya darasa
  la "medium" (prediabetes).
