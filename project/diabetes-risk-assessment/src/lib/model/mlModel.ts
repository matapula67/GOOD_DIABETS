import modelData from './xgb_diabetes_model.json';

/**
 * Injini ndogo ya "gradient boosted trees" (XGBoost) inayoendesha modeli
 * halisi iliyofunzwa kwa Python (scikit-learn / xgboost) juu ya seti ya data
 * halisi ya wagonjwa (angalia src/lib/model/README.md kwa maelezo kamili ya
 * chanzo cha data, usafishaji, na tathmini ya modeli).
 *
 * Muundo wa miti (trees) umehamishwa moja kwa moja kutoka kwa booster
 * iliyofunzwa (booster.get_dump(dump_format='json')), kisha kubanwa
 * (compact flat map ya nodeid -> node) ili kupunguza ukubwa wa faili.
 * Hesabu hapa chini ni sawa kabisa (bit-for-bit logic) na jinsi XGBoost
 * inavyofanya inference upande wa Python — si makadirio (approximation).
 */

interface TreeNode {
  leaf?: number;
  f?: number; // feature index
  c?: number; // split condition (threshold)
  y?: number; // yes branch nodeid (value < threshold)
  n?: number; // no branch nodeid (value >= threshold)
  m?: number; // missing branch nodeid
}

type FlatTree = Record<string, TreeNode>;

interface ModelExport {
  feature_order: string[];
  base_score: number[];
  num_class: number;
  classes: string[];
  trees: FlatTree[];
}

const model = modelData as unknown as ModelExport;

function evalTree(tree: FlatTree, x: number[]): number {
  let node = tree['0'];
  // Safety cap to avoid any possibility of an infinite loop on malformed data.
  for (let guard = 0; guard < 64; guard++) {
    if (node.leaf !== undefined) return node.leaf;
    const val = x[node.f as number];
    let nextId: number;
    if (val === null || Number.isNaN(val)) {
      nextId = node.m as number;
    } else if (val < (node.c as number)) {
      nextId = node.y as number;
    } else {
      nextId = node.n as number;
    }
    node = tree[String(nextId)];
  }
  throw new Error('Tree evaluation exceeded max depth (malformed tree).');
}

function softmax(margins: number[]): number[] {
  const max = Math.max(...margins);
  const exps = margins.map((m) => Math.exp(m - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

/**
 * Vipengele (features) vinavyotarajiwa katika `x`, kwa mpangilio uleule
 * uliotumika wakati wa kufunza modeli: [age, gender_male, bmi,
 * blood_glucose_level, hypertension, heart_disease, smoking]
 */
export function predictProbabilities(x: number[]): { classes: string[]; probabilities: number[] } {
  const numClass = model.num_class;
  const margins = [...model.base_score];

  model.trees.forEach((tree, i) => {
    const cls = i % numClass;
    margins[cls] += evalTree(tree, x);
  });

  const probabilities = softmax(margins);
  return { classes: model.classes, probabilities };
}

export function getFeatureOrder(): string[] {
  return model.feature_order;
}
