import React, { useState, useEffect } from 'react';
import { debugService } from '../services/api';
import { Terminal, Database, Cpu, Brain, X, Trash2, ChevronDown, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

const ReasoningInspector = ({ tripId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [expandedLog, setExpandedLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [tripId]);

  const fetchLogs = async () => {
    try {
      const response = await debugService.getLogs(tripId);
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (window.confirm("Clear all debug logs for this trip?")) {
      await debugService.clearLogs(tripId);
      setLogs([]);
    }
  };

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'RAW': return <Database className="w-4 h-4" />;
      case 'NORMALIZED': return <Database className="w-4 h-4 text-blue-500" />;
      case 'FILTERED': return <Terminal className="w-4 h-4 text-green-500" />;
      case 'AI_CONTEXT': return <Cpu className="w-4 h-4 text-purple-500" />;
      case 'AI_RESPONSE': return <Brain className="w-4 h-4 text-pink-500" />;
      default: return <Terminal className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[600px] bg-slate-900 text-slate-300 shadow-2xl z-[100] flex flex-col font-mono text-sm border-l border-slate-800">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-green-500" />
          <span className="font-bold text-white tracking-tight">REASONING_INSPECTOR_V1.0</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleClear} className="hover:text-red-400 transition-colors p-1" title="Clear Logs">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-slate-500">Initializing Trace...</div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4">
            <Terminal className="w-12 h-12 opacity-20" />
            <p>No telemetry detected. Trigger an AI interaction to begin tracing.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/30">
              <div 
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
              >
                <div className="flex items-center gap-3">
                  {getStageIcon(log.stage)}
                  <span className="font-bold text-slate-100">{log.stage}</span>
                  <span className="text-[10px] text-slate-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                {expandedLog === log.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
              
              {expandedLog === log.id && (
                <div className="p-4 border-t border-slate-800 bg-black/50">
                  <pre className="whitespace-pre-wrap break-words text-[11px] leading-relaxed text-green-400/90">
                    {log.content}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-[10px]">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span>Schema Valid</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <AlertCircle className="w-3 h-3 text-orange-500" />
            <span>Pacing Heuristics Active</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-600 italic">Listening for events...</div>
      </div>
    </div>
  );
};

export default ReasoningInspector;
