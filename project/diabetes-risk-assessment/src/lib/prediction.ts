import { AssessmentInput, PredictionResult, RiskLevel } from '../types';
import { predictProbabilities, getFeatureOrder } from './model/mlModel';
import featureImportance from './model/feature_importance.json';

/**
 * Utabiri wa hatari ya kisukari sasa unatumia modeli HALISI ya "machine
 * learning" (XGBoost) iliyofunzwa kwa Python juu ya data halisi ya wagonjwa
 * 100,000 (angalia src/lib/model/README.md kwa maelezo kamili — chanzo cha
 * data, usafishaji, ulinganisho wa Logistic Regression / Random Forest /
 * XGBoost, na vipimo vya utendaji: accuracy, precision, recall, F1-score, na
 * AUC-ROC), kama ilivyoainishwa kwenye Sura ya 3 ya andiko la utafiti.
 *
 * Muundo wa miti ya modeli iliyofunzwa umehamishwa (exported) kama JSON na
 * kuendeshwa moja kwa moja hapa (src/lib/model/mlModel.ts) — si tena
 * "weighted scoring" ya kubuni.
 */

const RECOMMENDATIONS: Record<RiskLevel, string[]> = {
  low: [
    'Endelea na mtindo wako wa maisha wenye afya — una hatari ndogo kwa sasa.',
    'Fanya uchunguzi wa sukari ya damu angalau mara moja kwa mwaka.',
    'Dumisha uzito unaofaa na ufanye mazoezi mara kwa mara.',
  ],
  medium: [
    'Panga miadi na daktari kwa uchunguzi zaidi wa kisukari ndani ya miezi 3.',
    'Punguza matumizi ya sukari na vyakula vyenye mafuta mengi.',
    'Ongeza dakika 30 za mazoezi ya mwili kwa siku, angalau mara 4 kwa wiki.',
    'Fuatilia shinikizo la damu na sukari ya damu kila baada ya miezi 3.',
  ],
  high: [
    'Wasiliana na daktari haraka iwezekanavyo kwa vipimo kamili vya kisukari.',
    'Anza mpango wa lishe unaosimamiwa na mtaalamu wa afya.',
    'Punguza uzito kwa hatua ndogo ndogo zenye kufuatiliwa na daktari.',
    'Acha uvutaji sigara na punguza unywaji wa pombe mara moja.',
    'Pima sukari ya damu na shinikizo la damu kwa ukaribu zaidi (kila wiki 2).',
  ],
};

const FEATURE_LABELS: Record<string, string> = {
  age: 'Umri',
  gender_male: 'Jinsia — Mwanaume',
  bmi: 'BMI',
  blood_glucose_level: 'Sukari ya damu (Glucose)',
  hypertension: 'Hypertension',
  heart_disease: 'Historia ya ugonjwa wa moyo',
  smoking: 'Uvutaji sigara',
};

/** Inaamua kama thamani ya kipengele fulani cha mtumiaji iko "hatarini" (clinically elevated). */
function isElevated(feature: string, input: AssessmentInput): boolean {
  switch (feature) {
    case 'age':
      return input.age >= 45;
    case 'bmi':
      return input.bmi >= 25;
    case 'blood_glucose_level':
      return input.glucose >= 100;
    case 'hypertension':
      return input.hypertension;
    case 'heart_disease':
      return input.heartDisease;
    case 'smoking':
      return input.smoking;
    case 'gender_male':
      return input.gender === 'male';
    default:
      return false;
  }
}

/** Hutengeneza vector ya features kwa mpangilio uleule wa mafunzo ya modeli. */
function toFeatureVector(input: AssessmentInput): number[] {
  const order = getFeatureOrder();
  const values: Record<string, number> = {
    age: input.age,
    gender_male: input.gender === 'male' ? 1 : 0,
    bmi: input.bmi,
    blood_glucose_level: input.glucose,
    hypertension: input.hypertension ? 1 : 0,
    heart_disease: input.heartDisease ? 1 : 0,
    smoking: input.smoking ? 1 : 0,
  };
  return order.map((f) => values[f]);
}

export function predictRisk(input: AssessmentInput): PredictionResult {
  const x = toFeatureVector(input);
  const { classes, probabilities } = predictProbabilities(x);

  // classes = ['low','medium','high'], zilizopangiliwa sawa na mafunzo ya modeli
  const probByClass: Record<string, number> = {};
  classes.forEach((c, i) => (probByClass[c] = probabilities[i]));

  let level: RiskLevel = 'low';
  let bestProb = -1;
  const levels: RiskLevel[] = ['low', 'medium', 'high'];
  for (const lvl of levels) {
    if (probByClass[lvl] > bestProb) {
      bestProb = probByClass[lvl];
      level = lvl;
    }
  }

  const confidence = Math.round(bestProb * 100);

  // Alama ya jumla (0-100): wastani wenye uzito wa uwezekano wa kila kiwango,
  // ili kutoa kipimo kimoja kinachoendelea (continuous) badala ya darasa peke yake.
  const weightedScore = probByClass.low * 0 + probByClass.medium * 50 + probByClass.high * 100;
  const score = Math.round(weightedScore);
  const maxScore = 100;

  // Sababu kuu: vipengele vilivyotumika kwenye modeli ambavyo ni "elevated"
  // kwa mtumiaji huyu, vikipangwa kwa umuhimu wao wa kimataifa (global
  // feature importance) kutoka kwa modeli iliyofunzwa.
  const importances = featureImportance as Record<string, number>;
  const modelFactors = Object.keys(importances)
    .filter((f) => isElevated(f, input) && f !== 'gender_male')
    .sort((a, b) => importances[b] - importances[a])
    .map((f) => FEATURE_LABELS[f]);

  // Taarifa za ziada za mtindo wa maisha ambazo fomu inakusanya lakini
  // hazikuwepo kwenye dataset ya mafunzo ya modeli (cholesterol, shinikizo la
  // damu, pombe, mazoezi, muda wa kulala) — zinaonyeshwa kama vidokezo vya
  // ziada vya kiafya, si sehemu ya alama ya modeli.
  const lifestyleNotes: string[] = [];
  if (input.cholesterol >= 200) lifestyleNotes.push('Cholesterol iliyozidi kiwango');
  if (input.bloodPressure >= 130) lifestyleNotes.push('Shinikizo la damu lililozidi kiwango');
  if (input.alcohol) lifestyleNotes.push('Matumizi ya pombe');
  if (input.activity === 'none' || input.activity === 'low') lifestyleNotes.push('Shughuli chache za mwili');
  if (input.sleepHours < 6 || input.sleepHours > 9) lifestyleNotes.push('Muda wa kulala usiofaa');

  const factors = [...modelFactors, ...lifestyleNotes];

  const recommendations = [...RECOMMENDATIONS[level]];
  if (input.smoking && level !== 'high') {
    recommendations.push('Fikiria kuacha uvutaji sigara ili kupunguza hatari zaidi.');
  }
  if ((input.activity === 'none' || input.activity === 'low') && level === 'low') {
    recommendations.push('Anzisha mazoezi mepesi kama kutembea dakika 20 kila siku.');
  }
  if (input.sleepHours < 6) {
    recommendations.push('Jaribu kulala angalau saa 7-8 kwa usiku ili kupunguza hatari za kiafya.');
  }

  return { score, maxScore, confidence, level, factors, recommendations };
}
