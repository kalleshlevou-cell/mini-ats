import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ATSState, ATSAction, Candidate } from '../types';
import { seedCandidates } from '../data/seedData';

const STORAGE_KEY = 'mini-ats-candidates';

function loadFromStorage(): Candidate[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Candidate[];
  } catch {
    // ignore
  }
  return seedCandidates;
}

function reducer(state: ATSState, action: ATSAction): ATSState {
  switch (action.type) {
    case 'ADD_CANDIDATE':
      return { ...state, candidates: [action.payload, ...state.candidates] };
    case 'UPDATE_CANDIDATE':
      return {
        ...state,
        candidates: state.candidates.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CANDIDATE':
      return {
        ...state,
        candidates: state.candidates.filter((c) => c.id !== action.payload),
      };
    case 'MOVE_STAGE':
      return {
        ...state,
        candidates: state.candidates.map((c) =>
          c.id === action.payload.id
            ? { ...c, stage: action.payload.stage, updatedAt: new Date().toISOString() }
            : c
        ),
      };
    default:
      return state;
  }
}

interface ATSContextValue {
  state: ATSState;
  dispatch: React.Dispatch<ATSAction>;
}

const ATSContext = createContext<ATSContextValue | undefined>(undefined);

export function ATSProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { candidates: loadFromStorage() });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.candidates));
  }, [state.candidates]);

  return <ATSContext.Provider value={{state, dispatch}}>{children}</ATSContext.Provider>;
}

export function useATS() {
  const ctx = useContext(ATSContext);
  if (!ctx) throw new Error('useATS must be used inside ATSProvider');
  return ctx;
}
