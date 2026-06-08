import { ShieldCheck, ShieldAlert, Shield, Loader2 } from 'lucide-react';

const SecurityLogItem = ({ step, status, message, details }) => {
  const isError = status === 'error' || status === 'failed' || status === 'FAILED';
  const isSuccess = status === 'success';
  const isProcessing = status === 'processing';
  const isPending = status === 'pending';

  return (
    <div className={`p-4 rounded-xl border transition-all duration-500 ${
      isError ? 'bg-red-500/10 border-red-500/30' : 
      isSuccess ? 'bg-emerald-500/10 border-emerald-500/30' :
      isProcessing ? 'bg-blue-500/10 border-blue-500/30 animate-pulse' :
      'bg-slate-800/20 border-slate-700/30 opacity-50'
    }`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {isProcessing && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
          {isSuccess && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
          {isError && <ShieldAlert className="w-5 h-5 text-red-400" />}
          {isPending && <Shield className="w-5 h-5 text-slate-500" />}
        </div>
        <div className="flex-grow">
          <h4 className={`text-sm font-semibold ${
            isError ? 'text-red-400' : 
            isSuccess ? 'text-emerald-400' :
            isProcessing ? 'text-blue-400' : 
            'text-slate-400'
          }`}>
            Step {step}: {message}
          </h4>
          {details && (
            <p className="text-xs text-slate-400 mt-1 font-mono break-all line-clamp-2">
              {details}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityLogItem;
