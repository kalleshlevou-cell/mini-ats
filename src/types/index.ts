export type Stage =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Technical Assessment'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export const STAGES: Stage[] = [
  'Applied',
  'Screening',
  'Interview',
  'Technical Assessment',
  'Offer',
  'Hired',
  'Rejected',
];

export const PIPELINE_STAGES: Stage[] = [
  'Applied',
  'Screening',
  'Interview',
  'Technical Assessment',
  'Offer',
  'Hired',
];

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  stage: Stage;
  notes: string;
  resumeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ATSState {
  candidates: Candidate[];
}

export type ATSAction =
  | { type: 'ADD_CANDIDATE'; payload: Candidate }
  | { type: 'UPDATE_CANDIDATE'; payload: Candidate }
  | { type: 'DELETE_CANDIDATE'; payload: string }
  | { type: 'MOVE_STAGE'; payload: { id: string; stage: Stage } };
