import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function AuditView({ logs }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Logs de Auditoria (Sistema de Segurança)</h2>
          <p className="text-slate-500">Rastreabilidade completa de ações na plataforma.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden text-slate-300 font-mono text-sm">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
          <ShieldAlert className="text-emerald-500" size={18}/>
          <span className="font-semibold text-emerald-500">SME Secure Audit Trail - Ativo</span>
        </div>
        <div className="p-4 max-h-[600px] overflow-y-auto space-y-2">
          {logs.map(log => (
            <div key={log.id} className="flex gap-4 border-b border-slate-800/50 pb-2">
              <span className="text-slate-500 whitespace-nowrap">[{new Date(log.date).toLocaleString('pt-BR')}]</span>
              <span className="text-blue-400 font-semibold w-48 shrink-0">{log.user}</span>
              <span className="text-slate-300">{log.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}