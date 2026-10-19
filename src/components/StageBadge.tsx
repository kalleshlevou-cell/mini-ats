import { Stage } from '../types';

const stageColors: Record<Stage, string> = {
  Applied: 'bg-blue-100 text-blue-800',
  Screening: 'bg-yellow-100 text-yellow-800',
  Interview: 'bg-purple-100 text-purple-800',
  'Technical Assessment': 'bg-orange-100 text-orange-800',
  Offer: 'bg-teal-100 text-teal-800',
  Hired: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

export default function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageColors[stage]}`}>
      {stage}
    </span>
  );
}
