import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { useATS } from '../context/ATSContext';
import { Stage, STAGES } from '../types';
import StageBadge from '../components/StageBadge';

const stageBarColors: Record<Stage, string> = {
  Applied: 'bg-blue-500',
  Screening: 'bg-yellow-400',
  Interview: 'bg-purple-500',
  'Technical Assessment': 'bg-orange-400',
  Offer: 'bg-teal-400',
  Hired: 'bg-green-500',
  Rejected: 'bg-red-400',
};

export default function Dashboard() {
  const { state } = useATS();
  const navigate = useNavigate();
  const candidates = state.candidates;

  const total = candidates.length;
  const hired = candidates.filter((c) => c.stage === 'Hired').length;
  const rejected = candidates.filter((c) => c.stage === 'Rejected').length;
  const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0;

  // Stage counts
  const stageCounts: Partial<Record<Stage, number>> = {};
  for (const s of STAGES) {
    stageCounts[s] = candidates.filter((c) => c.stage === s).length;
  }

  // Recent activity: last 5 updated
  const recent = [...candidates]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const metricCards = [
    { label: 'Total Candidates', value: total, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Hired', value: hired, icon: UserCheck, color: 'bg-green-50 text-green-600' },
    { label: 'Rejected', value: rejected, icon: UserX, color: 'bg-red-50 text-red-600' },
    { label: 'Rejection Rate', value: `${rejectionRate}%`, icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Your hiring pipeline at a glance</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Stage Distribution</h2>
          <div className="space-y-3">
            {STAGES.map((stage) => {
              const count = stageCounts[stage] ?? 0;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={stage}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{stage}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${stageBarColors[stage]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-500">No candidates yet.</p>
          ) : (
            <ul className="space-y-3">
              {recent.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => navigate(`/candidates/${c.id}`)}
                >
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm flex-shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 truncate">{c.name}</p>
                    <p className="text-xs text-gray-500 truncate">{c.position}</p>
                  </div>
                  <StageBadge stage={c.stage} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
