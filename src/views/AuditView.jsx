import React from 'react';
import { ShieldAlert, Terminal } from 'lucide-react';

export default function AuditView({ logs }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#13335a]">Logs de Auditoria</h2>
          <p className="text-slate-500 font-medium">Rastreabilidade completa de ações na plataforma (Nível Central).</p>
        </div>
      </div>

      {/* Caixa do Terminal de Logs - Fundo Azul Escuro */}
      <div className="bg-[#13335a] rounded-xl shadow-xl border border-[#13335a] overflow-hidden font-mono text-sm">
        
        {/* Cabeçalho do Terminal */}
        <div className="p-4 bg-black/20 border-b border-[#66b6e3]/30 flex items-center gap-3">
          <ShieldAlert className="text-[#66b6e3]" size={20}/>
          <span className="font-bold text-[#66b6e3] uppercase tracking-widest text-xs">Registro de Auditoria • Ativo</span>
          <div className="ml-auto flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff6666]/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
          </div>
        </div>
        
        {/* Área de rolagem dos Logs */}
        <div className="p-4 max-h-[600px] overflow-y-auto space-y-1 bg-[#13335a]">
          {logs.length === 0 ? (
            <div className="text-[#66b6e3]/50 italic flex items-center gap-2 p-4">
              <Terminal size={16} /> Aguardando novos registros de atividade...
            </div>
          ) : (
            logs.map(log => (
              <div 
                key={log.id} 
                className="flex flex-col sm:flex-row gap-1 sm:gap-4 border-b border-[#66b6e3]/10 pb-2 pt-2 hover:bg-white/5 transition-colors px-2 rounded-lg"
              >
                {/* Data e Hora (Cinza Azulado Mudo) */}
                <span className="text-[#66b6e3]/60 whitespace-nowrap text-xs sm:mt-0.5">
                  [{new Date(log.date).toLocaleString('pt-BR')}]
                </span>
                
                {/* Usuário (Azul Claro Forte) */}
                <span className="text-[#66b6e3] font-bold w-48 shrink-0">
                  {log.user}
                </span>
                
                {/* Ação Realizada (Branco/Cinza Claro) */}
                <span className="text-[#f0f4f8]">
                  {log.action}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}