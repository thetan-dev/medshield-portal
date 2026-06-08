import { useState } from 'react';
import { Shield, Brain, Activity, Lock, AlertTriangle, ShieldAlert, CheckCircle, Terminal, Send, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { redactPII, validateInput, sanitizeHTML, getSimulatedAIResponse } from './utils/securityUtils';
import SecurityLogItem from './components/SecurityLogItem';
import StatusBadge from './components/StatusBadge';

function App() {
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [redactedInput, setRedactedInput] = useState('');
  const [finalOutput, setFinalOutput] = useState('');
  const [errorPayload, setErrorPayload] = useState(null);
  const [isSystemCompromised, setIsSystemCompromised] = useState(false);
  
  const [logs, setLogs] = useState([
    { step: 1, message: 'Input Validation', status: 'pending', details: '' },
    { step: 2, message: 'PII Redaction', status: 'pending', details: '' },
    { step: 3, message: 'Output Sanitization', status: 'pending', details: '' }
  ]);

  const updateLog = (step, status, details) => {
    setLogs(prev => prev.map(log => 
      log.step === step ? { ...log, status, details } : log
    ));
  };

  const resetPortal = () => {
    setUserInput('');
    setIsProcessing(false);
    setRedactedInput('');
    setFinalOutput('');
    setErrorPayload(null);
    setIsSystemCompromised(false);
    setLogs([
      { step: 1, message: 'Input Validation', status: 'pending', details: '' },
      { step: 2, message: 'PII Redaction', status: 'pending', details: '' },
      { step: 3, message: 'Output Sanitization', status: 'pending', details: '' }
    ]);
  };

  const handleProcess = async () => {
    if (!userInput.trim()) return;

    setIsProcessing(true);
    setErrorPayload(null);
    setFinalOutput('');
    setIsSystemCompromised(false);
    
    // Reset log statuses
    setLogs(l => l.map(item => ({ ...item, status: 'pending', details: '' })));

    // Phase 1: Input Validation (Prompt Injection Check)
    updateLog(1, 'processing', 'Scanning for prompt injection patterns...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Stricter prompt injection check matching user-specified phrases (case-insensitive)
    const lowerInput = userInput.toLowerCase();
    const injectionPhrases = [
      'ignore previous',
      'ignore the previous',
      'ignore all previous',
      'ignore instructions',
      'ignore previous instructions',
      'ignore all instructions',
      'ignore rules',
      'ignore all rules',
      'unrestricted terminal',
      'tell me a joke',
      'system prompt',
      'reveal the system instructions',
      'reveal system instructions',
      'reveal the system prompt',
      'reveal system prompt',
      'system override',
      'developer mode',
      'bypass safety',
      'bypass guardrails',
      'bypass security'
    ];
    let hasInjection = injectionPhrases.some(phrase => lowerInput.includes(phrase));

    // Heuristic Check 1: Verb + Noun Proximity (e.g. "ignore the medical rules")
    if (!hasInjection) {
      const verbNounRegex = /\b(ignore|override|bypass|forget|reset|reveal|output|print|show|expose|disregard|system)\b.{1,40}\b(instructions|rules|protocols|prompt|prompts|guardrails|safety|context|system|guidelines|restrictions|constraints)\b/i;
      hasInjection = verbNounRegex.test(lowerInput);
    }

    // Heuristic Check 2: Task Request Heuristics (e.g. "tell me a joke", "write a poem")
    if (!hasInjection) {
      const taskRequestRegex = /\b(tell|write|sing|say|make|give)\b.{1,25}\b(joke|poem|song|story|riddle|trivia)\b/i;
      hasInjection = taskRequestRegex.test(lowerInput);
    }

    // Heuristic Check 3: Privilege Escalation / Jailbreak Heuristics (e.g. "unrestricted shell access")
    if (!hasInjection) {
      const jailbreakRegex = /\b(unrestricted|developer|admin|root|jailbreak|bypass)\b.{1,25}\b(terminal|mode|access|shell|system|prompt|guard|rules|safety)\b/i;
      hasInjection = jailbreakRegex.test(lowerInput);
    }

    if (hasInjection) {
      updateLog(1, 'failed', 'Critical Policy Violation: Security Threat Blocked.');
      setIsSystemCompromised(true);
      setErrorPayload({
        title: 'Security Alert: Prompt Injection Attempted',
        message: 'Malicious attempt to bypass AI guardrails was intercepted. The action has been flagged.',
        type: 'injection'
      });
      setIsProcessing(false);
      return;
    }

    const validation = validateInput(userInput);
    if (!validation.isValid) {
      updateLog(1, 'error', validation.reason);
      setErrorPayload({
        title: 'Security Breach Blocked',
        message: validation.reason,
        type: 'injection'
      });
      setIsProcessing(false);
      return;
    }
    updateLog(1, 'success', 'No prompt injection detected. Policy Check: PASSED.');

    // Phase 2: Data Redaction
    updateLog(2, 'processing', 'Scanning for PII (Names, DOB, Phone)...');
    await new Promise(resolve => setTimeout(resolve, 1200));

    const redacted = redactPII(userInput);
    setRedactedInput(redacted);
    
    const piiDetected = redacted !== userInput;
    updateLog(2, 'success', piiDetected 
      ? `PII Detected and Redacted. Preview: ${redacted.substring(0, 50)}...` 
      : 'No PII detected. Data transmission clean.'
    );

    // Phase 3: AI Simulation & Output Sanitization
    updateLog(3, 'processing', 'Generating AI Response and Sanitizing Output...');
    await new Promise(resolve => setTimeout(resolve, 1500));

    const rawAIResponse = getSimulatedAIResponse(redacted);
    const safeOutput = sanitizeHTML(rawAIResponse);
    
    setFinalOutput(safeOutput);
    updateLog(3, 'success', 'HTML Escaped. XSS Protection: ACTIVE.');

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-blue-500 border border-slate-700">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">MedShield Portal</h1>
            <p className="text-slate-400 text-xs">Clinical Data Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
          <div className={`w-2 h-2 rounded-full ${
            isSystemCompromised ? 'bg-red-500' : 'bg-emerald-500'
          }`} />
          <span className={`text-xs font-semibold ${
            isSystemCompromised ? 'text-red-400' : 'text-slate-300'
          }`}>
            {isSystemCompromised ? 'System Status: Threat Detected' : 'System Status: Secure'}
          </span>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input & Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700/60 rounded-xl p-6 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-200">Patient Case Details</h3>
              </div>
              <button 
                onClick={resetPortal}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400"
                title="Clear Portal"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            
            <textarea
              className="w-full p-4 bg-slate-900 border border-slate-700/65 rounded-lg outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500 min-h-[160px] resize-none text-slate-200"
              placeholder="Example: Patient Jane Doe, born 12/05/1990, has a severe fever..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isProcessing}
            />

            <div className="flex justify-end pt-2">
              <button 
                onClick={handleProcess}
                disabled={isProcessing || !userInput.trim()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Security...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Process Diagnosis
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Error Alert */}
          <AnimatePresence>
            {errorPayload && !isSystemCompromised && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 flex items-start gap-4"
              >
                <div className="p-2.5 bg-red-500 rounded-lg text-white">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-red-400 font-bold text-base">{errorPayload.title}</h4>
                  <p className="text-red-300/80 mt-1 text-sm">{errorPayload.message}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Output Section / Security Alert Banner */}
          <AnimatePresence>
            {isSystemCompromised && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-red-950/20 border border-red-500/35 rounded-xl overflow-hidden"
              >
                <div className="bg-red-500/10 p-4 border-b border-red-500/20 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <h3 className="font-semibold text-red-400 text-xs uppercase tracking-wider">Security Alert</h3>
                </div>
                <div className="p-6 flex flex-col md:flex-row items-start gap-4">
                  <div className="p-2.5 bg-red-500 rounded-lg text-white flex-shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-red-400 font-bold text-lg">System Prompt Injection Blocked</h4>
                    <p className="text-red-300/80 mt-1.5 text-sm leading-relaxed">
                      A malicious input matching prompt injection heuristics has been intercepted. The request has been blocked and flagged for administrator audit to ensure platform security compliance.
                    </p>
                    <div className="mt-3.5 flex items-center gap-2 text-[10px] text-red-400/60 font-semibold font-mono">
                      <span>POLICY VIOLATION: PROMPT_INJECTION_DEFENSE</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {finalOutput && !isSystemCompromised && (
              <div className="flex flex-col gap-6">
                {/* Sanitized Payload (Sent to AI) */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden"
                >
                  <div className="bg-slate-900/50 p-4 border-b border-slate-700/60 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <h3 className="font-semibold text-slate-200">Sanitized Payload (Sent to AI)</h3>
                  </div>
                  <div className="p-6">
                    <div className="bg-slate-900 rounded-lg p-5 border border-slate-700/55 font-mono text-xs text-blue-300 whitespace-pre-wrap">
                      {redactedInput}
                    </div>
                    <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-400">
                      <Lock className="w-4 h-4 text-emerald-500" />
                      <span>All PII (Names, DOBs, Contact Details) has been successfully redacted.</span>
                    </div>
                  </div>
                </motion.div>

                {/* Clinical Analysis Output */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden"
                >
                  <div className="bg-slate-900/50 p-4 border-b border-slate-700/60 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-slate-400" />
                    <h3 className="font-semibold text-slate-200">Clinical Analysis Output</h3>
                  </div>
                  <div className="p-6">
                    <div className="bg-slate-900 rounded-lg p-5 border border-slate-700/55">
                      <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                        {finalOutput}
                      </p>
                    </div>
                    <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Clinical data processing check complete. Output sanitized.</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Security Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800 border border-slate-700/60 rounded-xl p-6 flex flex-col gap-6 h-full"
          >
            <div className="flex items-center gap-2 border-b border-slate-700/50 pb-4">
              <Activity className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-200">Security Checks</h3>
            </div>

            <div className="flex flex-col gap-4">
              {logs.map((log) => (
                <SecurityLogItem 
                  key={log.step}
                  step={log.step}
                  message={log.message}
                  status={log.status}
                  details={log.details}
                />
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-slate-700/50 flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Data Redaction</span>
                <StatusBadge phase="redaction" status={logs[1].status === 'success' ? 'passed' : logs[1].status} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Injection Block</span>
                <StatusBadge 
                  phase="injection" 
                  status={
                    logs[0].status === 'success' 
                      ? 'passed' 
                      : (logs[0].status === 'error' || logs[0].status === 'failed' || logs[0].status === 'FAILED' 
                          ? 'failed' 
                          : logs[0].status)
                  } 
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">XSS Sanitization</span>
                <StatusBadge phase="xss" status={logs[2].status === 'success' ? 'passed' : logs[2].status} />
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// Simple Loader component
const Loader2 = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default App;
