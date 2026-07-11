export type Gender = 'male' | 'female';
export type YesNo = 'yes' | 'no';
export type ActivityLevel = 'none' | 'low' | 'moderate' | 'high';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  age: number;
  password: string; // demo-only, plain text local storage (not for production use)
  createdAt: string;
}

export interface AssessmentInput {
  age: number;
  gender: Gender;
  bmi: number;
  glucose: number;
  bloodPressure: number;
  cholesterol: number;
  heartDisease: boolean;
  hypertension: boolean;
  smoking: boolean;
  alcohol: boolean;
  activity: ActivityLevel;
  sleepHours: number;
}

export interface PredictionResult {
  score: number;
  maxScore: number;
  confidence: number; // 0-100
  level: RiskLevel;
  factors: string[];
  recommendations: string[];
}

export interface AssessmentRecord {
  id: string;
  userId: string;
  date: string;
  input: AssessmentInput;
  result: PredictionResult;
}

export interface DoctorRequest {
  id: string;
  userId: string;
  doctorName: string;
  message: string;
  attachedAssessmentId: string | null;
  createdAt: string;
}

export interface Doctor {
  name: string;
  specialty: string;
  phone: string;
  email: string;
}
