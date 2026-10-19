import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, ExternalLink, ChevronRight, ChevronLeft } from 'lucide-react';
import { useATS } from '../context/ATSContext';
import { PIPELINE_STAGES } from '../types';
import StageBadge from '../components/StageBadge';
import CandidateForm from '../components/CandidateForm';

export default function CandidateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useATS();
  const [showEdit, setShowEdit] = useState(false);

  const candidate = state.candidates.find((c) => c.id === id);

  if (!candidate) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Candidate not found.</p>
        <button onClick={() => navigate('/candidates')} className="mt-4 text-indigo-600 hover:underline">
          Back to Candidates
        </button>
      </div>
    );
  }

  const pipelineIdx = PIPELINE_STAGES.indexOf(candidate.stage as typeof PIPELINE_STAGES[number]);
  const isInPipeline = pipelineIdx !== -1;
  const isHired = candidate.stage === 'Hired';
  const isRejected = candidate.stage === 'Rejected';

  function moveStage(direction: 'next' | 'prev') {
    if (!isInPipeline) return;
    const newIdx = direction === 'next' ? pipelineIdx + 1 : pipelineIdx - 1;
    if (newIdx < 0 || newIdx >= PIPELINE_STAGES.length) return;
    dispatch({ type: 'MOVE_STAGE', payload: { id: candidate!.id, stage: PIPELINE_STAGES[newIdx] } });
  }

  function rejectCandidate() {
    dispatch({ type: 'MOVE_STAGE', payload: { id: candidate!.id, stage: 'Rejected' } });
  }

  function deleteCandidate() {
    const c = candidate;
    if (!c) return;
    if (window.confirm(`Delete ${c.name}?`)) {
      dispatch({ type: 'DELETE_CANDIDATE', payload: c.id });
      navigate('/candidates');
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/candidates')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Candidates
      </button>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl">
              {candidate.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{candidate.position}</p>
              <div className="mt-2">
                <StageBadge stage={candidate.stage} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowEdit(true)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 text-gray-600"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={deleteCandidate}
              className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-300 text-gray-600 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stage pipeline stepper */}
        {!isRejected && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Pipeline Progress</h3>
            <div className="flex items-center gap-0 overflow-x-auto pb-2">
              {PIPELINE_STAGES.map((stage, idx) => {
                const isActive = candidate.stage === stage;
                const isPast = isInPipeline && idx < pipelineIdx;
                return (
                  <React.Fragment key={stage}>
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          isActive
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : isPast
                            ? 'bg-indigo-200 border-indigo-200 text-indigo-700'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className={`mt-1 text-[10px] text-center w-16 ${
                        isActive ? 'text-indigo-600 font-semibold' : isPast ? 'text-indigo-400' : 'text-gray-400'
                      }`}>{stage}</span>
                    </div>
                    {idx < PIPELINE_STAGES.length - 1 && (
                      <div className={`h-0.5 w-6 flex-shrink-0 mx-0.5 ${ isPast || isActive ? 'bg-indigo-300' : 'bg-gray-200'}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
        {isRejected && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-600 font-medium">Candidate was rejected from this pipeline.</div>
        )}

        {/* Stage navigation */}
        {!isRejected && (
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => moveStage('prev')}
              disabled={pipelineIdx <= 0}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" /> Previous Stage
            </button>
            <button
              onClick={() => moveStage('next')}
              disabled={pipelineIdx >= PIPELINE_STAGES.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg disabled:opacity-40 hover:bg-indigo-700"
            >
              Next Stage <ChevronRight className="h-4 w-4" />
            </button>
            {!isHired && (
              <button
                onClick={rejectCandidate}
                className="ml-auto flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
              >
                Reject
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info grid */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Contact Information</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{candidate.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900">{candidate.phone || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Position</dt>
            <dd className="mt-1 text-sm text-gray-900">{candidate.position || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date Added</dt>
            <dd className="mt-1 text-sm text-gray-900">{new Date(candidate.createdAt).toLocaleDateString()}</dd>
          </div>
          {candidate.resumeUrl && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Resume</dt>
              <dd className="mt-1">
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline"
                >
                  View Resume <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Notes</h2>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{candidate.notes || 'No notes added.'}</p>
      </div>

      {showEdit && <CandidateForm candidate={candidate} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
