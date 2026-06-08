const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'passed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'blocked':
      case 'failed':
      case 'FAILED':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-slate-700/50 text-slate-400 border-slate-600';
    }
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full border ${getStatusStyles()}`}>
      {status || 'pending'}
    </span>
  );
};

export default StatusBadge;
