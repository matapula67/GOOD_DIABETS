import { AssessmentInput, AssessmentRecord, DoctorRequest, PredictionResult } from '../types';

const ASSESSMENTS_KEY = 'dra_assessments';
const REQUESTS_KEY = 'dra_doctor_requests';

function readAll<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function writeAll<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

export const storage = {
  saveAssessment(userId: string, input: AssessmentInput, result: PredictionResult): AssessmentRecord {
    const record: AssessmentRecord = {
      id: 'a_' + Date.now().toString(36),
      userId,
      date: new Date().toISOString(),
      input,
      result,
    };
    const all = readAll<AssessmentRecord>(ASSESSMENTS_KEY);
    all.unshift(record);
    writeAll(ASSESSMENTS_KEY, all);
    return record;
  },

  assessmentsForUser(userId: string): AssessmentRecord[] {
    return readAll<AssessmentRecord>(ASSESSMENTS_KEY).filter((a) => a.userId === userId);
  },

  getAssessment(id: string): AssessmentRecord | undefined {
    return readAll<AssessmentRecord>(ASSESSMENTS_KEY).find((a) => a.id === id);
  },

  saveDoctorRequest(req: Omit<DoctorRequest, 'id' | 'createdAt'>): DoctorRequest {
    const record: DoctorRequest = {
      ...req,
      id: 'r_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };
    const all = readAll<DoctorRequest>(REQUESTS_KEY);
    all.unshift(record);
    writeAll(REQUESTS_KEY, all);
    return record;
  },

  doctorRequestsForUser(userId: string): DoctorRequest[] {
    return readAll<DoctorRequest>(REQUESTS_KEY).filter((r) => r.userId === userId);
  },
};
